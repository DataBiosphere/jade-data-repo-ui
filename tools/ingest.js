#!/usr/bin/env node

const https = require('https');
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
        desc: 'google project for target environment',
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
  return new Promise((resolve, reject) => {
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
      .get(host + apiPath, { httpsAgent: agent, headers })
      .then((enumerateResponse) => {
        const dataset = enumerateResponse.data.items.find((d) => d.name === name);
        axios
          .get(`${host + apiPath}/${dataset.id}`, { httpsAgent: agent, headers })
          .then((datasetResponse) => resolve(datasetResponse.data));
      })
      .catch(reject);
  });
}

// unpack positional arguments
const [command, datasetName] = argv._;
// unpack others
const { jc, targetEnv, targetName, targetUrl } = argv;

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
        name: 'devAccount',
        message: 'pick your dev account',
        choices: logins,
      },
      {
        type: 'list',
        name: 'prodAccount',
        message: 'pick your production account',
        choices: logins,
      },
    ]);
    const devToken = await switchAccount(answers.devAccount);
    const prodToken = await switchAccount(answers.prodAccount);

    const srcDataset = await findDatasetByName(devToken, datasetName, argv.sourceUrl);
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

    await call(`${jc} session set basepath ${targetUrl}`);
    await call(`${jc} session set projectid ${targetEnv}`);
    console.log(await call(`${jc} session show`));
    const profileName = `${targetName}-profile`;

    await call(`${jc} profile create --name ${profileName} --account ${CORE_BILLING_ACCOUNT_ID}`);
    const datasetModel = await call(
      `${jc} dataset create --input-json ./temp.json --profile ${profileName}`,
    );
    console.log(datasetModel);

    let i = 0;
    for (i = 0; i < tableNames.length; i++) {
      const table = tableNames[i];
      // eslint-disable-next-line no-await-in-loop
      const response = await call(
        `${jc} dataset table load --table ${table} --input-gspath gs://jade-testdata/v2f/${table}.json --input-format json ${targetName}`,
      );
      console.log(response);
    }
  } catch (e) {
    console.error(e);
  }
})();
