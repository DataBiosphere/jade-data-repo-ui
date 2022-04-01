#!/usr/bin/env node

/**
 * How to use this script:
 *
 * Example: ingesting hca_mvp from dev to int-5
 * npm run ingest hca_mvp -- --source-url=https://jade.datarepo-dev.broadinstitute.org --target-url=https://jade-5.datarepo-integration.broadinstitute.org --jc-path=~/broad/jade-data-repo-cli/./build/install/jadecli/bin/jadecli --target-env=broad-jade-int-5-data --target-name=hca_mvp --src-env=broad-jade-dev-data --bucket-name=hca_mvp
 *
 * make sure that you have the correct path to your jadecli install, if you have it aliased in your bashrc it should be the same path as there.
 * also, make sure the source and target environments are the names of the DATA projects!!
 *
 * you may need to give yourself permissions to upload to the jade-testdata bucket as well
 */

/* eslint-disable no-console, @typescript-eslint/no-var-requires */
const https = require('https');
const _ = require('lodash');
const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');
const inquirer = require('inquirer');
const { argv } = require('yargs').command(
  'ingest',
  'copy a subset of production data into another environment',
  (args) =>
    args
      .positional('datasetName', {
        describe: 'name of the dataset to rolldown',
        type: 'string',
      })
      .option('source-url', {
        alias: 'sourceUrl',
        desc: 'url for source environment',
        default: 'broad-jade-dev-data',
        type: 'string',
      })
      .option('target-url', {
        alias: 'targetUrl',
        desc: 'url for target environment',
        default: 'broad-jade-dev-data',
        type: 'string',
      })
      .option('target-env', {
        alias: 'targetEnv',
        desc: 'google (data) project for target environment',
        default: 'dev',
        type: 'string',
      })
      .option('src-env', {
        alias: 'srcEnv',
        desc: 'google (data) project for source environment',
        default: 'dev',
        type: 'string',
      })
      .option('target-name', {
        alias: 'targetName',
        desc: 'target dataset name',
        default: 'datasetName',
        type: 'string',
      })
      .option('jc-path', {
        alias: 'jc',
        desc: 'path to run jadecli',
        default: '',
        type: 'string',
      })
      .option('bucket-name', {
        alias: 'bucketName',
        desc: 'name of the bucket to place in jade-testdata',
        default: '',
        type: 'string',
      })
      .option('verbose', {
        alias: 'v',
        desc: 'print extra information',
        default: false,
        type: 'boolean',
      }),
);

const CORE_BILLING_ACCOUNT_ID = '00708C-45D19D-27AAFA';

if (argv.verbose) {
  axios.interceptors.request.use((request) => {
    console.log('Starting Request', request);
    return request;
  });
}

const agent = new https.Agent({
  // rejectUnauthorized: false,
});

function call(shell) {
  console.info(`running ${shell}:`);
  return new Promise((resolve) => {
    exec(shell, (err, data, stderr) => {
      if (err) {
        console.error(err);
      }
      if (stderr) {
        console.error(stderr);
      }
      resolve(data);
    });
  });
}

function switchAccount(email) {
  return new Promise((resolve) => {
    call(`gcloud config set account ${email} && gcloud auth print-access-token`).then((data) => {
      resolve(data.trim());
    });
  });
}

function findDatasetByName(token, name, host) {
  const apiPath = '/api/repository/v1/datasets';
  const headers = { Authorization: `Bearer ${token}` };
  return new Promise((resolve, reject) => {
    axios
      .get(`${host + apiPath}?filter=${name}`, { httpsAgent: agent, headers })
      .then((enumerateResponse) => {
        const dataset = enumerateResponse.data.items.find((d) => d.name === name);
        axios
          .get(`${host + apiPath}/${dataset.id}`, { httpsAgent: agent, headers })
          .then((datasetResponse) => {
            resolve(datasetResponse.data);
          });
      })
      .catch(reject);
  });
}

// unpack positional arguments
//eslint-disable-next-line @typescript-eslint/no-unused-vars
const [command, datasetName] = argv._;
// unpack others
const { bucketName, jc, targetEnv, targetName, targetUrl, srcEnv } = argv;

(async () => {
  try {
    const loginsStdin = await call('gcloud auth list');
    const logins = loginsStdin
      .split('\n')
      .filter((line, index) => index > 1)
      .map((line) => line.replace(/^[* ]+/, ''));
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'srcAccount',
        message: 'pick the account to access the src project',
        choices: logins,
      },
      {
        type: 'list',
        name: 'destAccount',
        message: 'pick the account to access destination project',
        choices: logins,
      },
    ]);

    const srcToken = await switchAccount(answers.srcAccount);
    const srcDataset = await findDatasetByName(srcToken, datasetName, argv.sourceUrl);
    console.log(srcDataset);
    const newSchema = srcDataset.schema;
    newSchema.tables.forEach((table) => delete table.rowCount);
    const createDataset = {
      name: targetName,
      description: srcDataset.description,
      schema: newSchema,
    };
    console.log(createDataset);
    fs.writeFileSync('./temp.json', JSON.stringify(createDataset));

    const tableNames = srcDataset.schema.tables.map((table) => table.name);
    console.log(tableNames);

    await switchAccount(answers.destAccount);
    await call(`${jc} session set basepath ${targetUrl}`);
    await call(`${jc} session set projectid ${targetEnv}`);
    console.log(await call(`${jc} session show`));
    const profileName = `${targetName}-profile`;

    await call(`${jc} profile create --name ${profileName} --account ${CORE_BILLING_ACCOUNT_ID}`);
    const datasetModel = await call(
      `${jc} dataset create --input-json ./temp.json --profile ${profileName}`,
    );
    console.log(datasetModel);

    const alreadyInBucket = await inquirer.prompt({
      name: 'confirm',
      type: 'confirm',
      message: 'Is this data already in the jade-testdata bucket?',
      default: false,
    });

    if (!alreadyInBucket.confirm) {
      const allTables = JSON.parse(
        await call(`bq ls --format=json ${srcEnv}:datarepo_${datasetName}`),
      );
      const rawTables = _.filter(allTables, (table) =>
        table.tableReference.tableId.includes('datarepo_raw'),
      ).map((table) => table.tableReference.tableId);

      const rawTablesToNames = {};
      rawTables.forEach((rawTable) => {
        tableNames.forEach((table) => {
          if (rawTable.includes(table)) {
            rawTablesToNames[table] = rawTable;
          }
        });
      });

      let i = 0;
      for (i = 0; i < tableNames.length; i++) {
        const table = tableNames[i];
        const rawTableName = _.isEmpty(rawTablesToNames) ? table : rawTablesToNames[table];
        // eslint-disable-next-line no-await-in-loop
        const response = await call(
          `bq extract --destination_format NEWLINE_DELIMITED_JSON '${srcEnv}:datarepo_${datasetName}.${rawTableName}' gs://jade-testdata/${bucketName}/${table}.json`,
        );
        console.log(response);
      }
    }

    let i = 0;
    for (i = 0; i < tableNames.length; i++) {
      const table = tableNames[i];
      // eslint-disable-next-line no-await-in-loop
      const response = await call(
        `${jc} dataset table load --table ${table} --input-gspath gs://jade-testdata/${bucketName}/${table}.json --input-format json ${targetName}`,
      );
      console.log(response);
    }
  } catch (e) {
    console.error(e);
  }
})();
/* eslint-enable no-console, @typescript-eslint/no-var-requires*/
