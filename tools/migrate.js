#!/usr/bin/env node

/**
 * This script will copy a subset of production dataset into another environment
 *
 * npm run rolldown V2F_GWAS_Summary_Stats -- --env=dev --suffix=my --cutoff=100000000
 *
 * (note the required -- to separate npm flags from script flags)
 */

const https = require('https');
const axios = require('axios');
const cmd = require('node-cmd');
const inquirer = require('inquirer');
const { argv } = require('yargs').command(
  'rolldown',
  'copy a subset of production data into another environment',
  (args) =>
    args
      .positional('datasetName', {
        describe: 'name of the dataset to rolldown',
        type: 'string',
      })
      .option('env', {
        alias: 'e',
        desc: 'target environment',
        default: 'dev',
        type: 'string',
      })
      .option('suffix', {
        alias: 's',
        desc: 'target suffix',
        type: 'string',
      })
      .option('cutoff', {
        alias: 'c',
        desc: 'max number of rows to include',
        default: 1000,
        type: 'int',
      })
      .option('verbose', {
        alias: 'v',
        desc: 'print extra information',
        default: false,
        type: 'boolean',
      }),
);

const CORE_BILLING_ACCOUNT_ID = '00708C-45D19D-27AAFA';
const prodHost = 'https://jade-terra.datarepo-prod.broadinstitute.org';
const subdomainSuffix = argv.suffix ? `-${argv.suffix}` : '';
const targetHost =
  argv.env === 'local'
    ? 'http://localhost:8080'
    : `https://jade${subdomainSuffix}.datarepo-${argv.env}.broadinstitute.org`;

if (argv.verbose) {
  axios.interceptors.request.use((request) => {
    console.log('Starting Request', request);
    return request;
  });
}

// there is an issue with the intermediate certificate on production, we'll need a special agent to handle this
const agent = new https.Agent({
  // rejectUnauthorized: false,
});

function findDatasetByName(token, name) {
  const apiPath = '/api/repository/v1/datasets';
  const headers = { Authorization: `Bearer ${token}` };
  return new Promise((resolve, reject) => {
    axios
      .get(prodHost + apiPath, { httpsAgent: agent, headers })
      .then((enumerateResponse) => {
        const dataset = enumerateResponse.data.items.find((d) => d.name === name);
        axios
          .get(`${prodHost + apiPath}/${dataset.id}`, { httpsAgent: agent, headers })
          .then((datasetResponse) => resolve(datasetResponse.data));
      })
      .catch(reject);
  });
}

function createDataset(token, dataset) {
  const apiPath = '/api/repository/v1/datasets';
  const headers = { Authorization: `Bearer ${token}` };
  return new Promise((resolve, reject) => {
    axios
      .post(targetHost + apiPath, dataset, { httpsAgent: agent, headers })
      .then((summary) => resolve(summary.data))
      .catch(reject);
  });
}

function call(shell, fn) {
  cmd.get(shell, (err, data, stderr) => {
    if (err) {
      console.error('err: ', err);
    }
    if (stderr) {
      console.error('stderr: ', stderr);
    }
    fn(data);
  });
}

function switchAccount(email) {
  return new Promise((resolve) => {
    call(`gcloud config set account ${email} && gcloud auth print-access-token`, (data) => {
      resolve(data.trim());
    });
  });
}

function createProfile(token) {
  // TODO: figure how to pull things from constants/package.json
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const apiPath = '/api/resources/v1/profiles';
    const profile = {
      biller: 'direct',
      profileName: 'default',
      billingAccountId: CORE_BILLING_ACCOUNT_ID,
    };
    axios
      .post(targetHost + apiPath, profile, { httpsAgent: agent, headers })
      .then((response) => resolve(response.data))
      .catch(reject);
  });
}

function pickOrCreateProfile(token) {
  return new Promise((resolve, reject) => {
    const headers = { Authorization: `Bearer ${token}` };
    const apiPath = '/api/resources/v1/profiles';
    axios.get(targetHost + apiPath, { httpsAgent: agent, headers }).then((profilesResponse) => {
      if (profilesResponse.data.items.length === 0) {
        createProfile(token)
          .then((profile) => resolve(profile.id))
          .catch(reject);
      } else {
        const nameToId = {};
        profilesResponse.data.items.forEach((profile) => {
          nameToId[profile.profileName] = profile.id;
        });
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'devProfile',
              message: 'pick your dev profile',
              choices: Object.keys(nameToId),
            },
          ])
          .then((answers) => resolve(nameToId[answers.devProfile]));
      }
    });
  });
}

function getDataset(token, datasetId) {
  return new Promise((resolve, reject) => {
    const headers = { Authorization: `Bearer ${token}` };
    const apiPath = `/api/repository/v1/datasets/${datasetId}`;
    axios
      .get(targetHost + apiPath, { httpsAgent: agent, headers })
      .then((response) => resolve(response.data))
      .catch(reject);
  });
}

function copyDataset(token, dataset) {
  const datasetReq = { ...dataset };
  [
    'id',
    'defaultProfileId',
    'dataProject',
    'additionalProfileIds',
    'defaultSnapshotId',
    'createdDate',
  ].forEach((p) => delete datasetReq[p]);
  return new Promise((resolve, reject) => {
    pickOrCreateProfile(token).then((profileId) => {
      datasetReq.defaultProfileId = profileId;
      // TEMP
      datasetReq.schema.assets[0].rootTable = 'variant';
      datasetReq.schema.assets[0].rootColumn = 'id';
      createDataset(token, datasetReq)
        .then((summary) => getDataset(token, summary.id))
        .then(resolve)
        .catch(reject);
    });
  });
}

// unpack the positional arguments
const [command, datasetName] = argv._;
console.log(`running ${command} for ${datasetName}`);

call('gcloud auth list', (loginsStdin) => {
  const logins = loginsStdin
    .split('\n')
    .filter((line, index) => index > 1)
    .map((line) => line.replace(/^[* ]+/, ''));
  inquirer
    .prompt([
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
    ])
    .then((answers) => {
      switchAccount(answers.devAccount).then((devToken) => {
        switchAccount(answers.prodAccount).then((prodToken) => {
          findDatasetByName(prodToken, datasetName)
            .then((prodDataset) => {
              copyDataset(devToken, prodDataset).then((targetDataset) => {
                const prodProject = prodDataset.dataProject;
                const targetProject = targetDataset.dataProject;
                const bqDatasetId = `datarepo_${prodDataset.name}`;
                const bqUrl = `https://www.googleapis.com/bigquery/v2/projects/${targetProject}/jobs`;
                const headers = { Authorization: `Bearer ${prodToken}` };
                targetDataset.schema.tables.forEach((table) => {
                  const config = {
                    configuration: {
                      query: {
                        useLegacySql: false,
                        query: `SELECT * FROM \`${prodProject}.${bqDatasetId}.${table.name}\` LIMIT ${argv.cutoff}`,
                        destinationTable: {
                          projectId: targetProject,
                          datasetId: bqDatasetId,
                          tableId: table.name,
                        },
                      },
                    },
                  };
                  axios
                    .post(bqUrl, config, { httpsAgent: agent, headers })
                    .then(console.log)
                    .catch(console.error);
                });
              });
            })
            .catch((e) => console.error('something bad happened', e));
        });
      });
    });
});
