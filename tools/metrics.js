const logging = require('@google-cloud/logging');
const { argv } = require('yargs').command(
  'copy',
  'copy metrics from one project into another project',
  args =>
    args
      .option('sourceProject', {
        desc: 'project to copy metrics from',
        default: 'broad-jade-integration-data',
        type: 'string',
        demandOption: true,
      })
      .option('targetProject', {
        desc: 'project to copy metrics to',
        type: 'string',
        demandOption: true,
      }),
);

const client = new logging.v2.MetricsServiceV2Client({});

// Iterate over all elements.
const sourceParent = client.projectPath(argv.sourceProject);
const targetParent = client.projectPath(argv.targetProject);

function addMetric(metric) {
  const request = {
    parent: targetParent,
    metric,
  };
  client
    .createLogMetric(request)
    .then(responses => {
      const response = responses[0];
      console.log(response);
    })
    .catch(err => {
      console.error(err);
    });
}

client
  .listLogMetrics({ parent: sourceParent })
  .then(responses => {
    const resources = responses[0];
    for (const resource of resources) {
      addMetric(resource);
    }
  })
  .catch(err => {
    console.error(err);
  });
