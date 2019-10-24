import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Link, Redirect } from 'react-router-dom';
import MultiSelect from 'react-select';
import { Control, Form, actions, Errors } from 'react-redux-form';
import _ from 'lodash';
import xlsx from 'xlsx';
import Combinatorics from 'js-combinatorics';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { createSnapshot, getDatasets, getDatasetById } from 'actions/index';
import ManageUsers from './ManageUsersView';

function* colNameIter() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 3; i++) {
    const args = [];
    for (let j = 0; j <= i; j++) {
      args.push(alphabet);
    }
    const product = Combinatorics.cartesianProduct.apply(null, args);
    let item = product.next();
    while (item) {
      yield item.join('');
      item = product.next();
    }
  }
}

function getColumnForField(sheet, assetField) {
  // go through column headers A1, B1, C1, ..., see if they match the asset root column
  for (const column of colNameIter(sheet)) {
    if (sheet[column + 1]) {
      if (assetField === sheet[column + 1].v) {
        return column;
      }
    } else {
      break;
    }
  }
  return 'A';
}

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(2),
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '18px',
    fontWeight: 600,
    paddingTop: 30,
  },
  nameSnapshot: {
    width: 400,
    ' && input': {
      padding: '12px 14px',
      width: 272,
    },
  },
  manageUsers: {
    width: 400,
    ' && input': {
      padding: '12px 14px',
      width: 300,
    },
  },
  buttons: {
    float: 'right',
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
  },
  linkCreate: {
    color: theme.palette.primary.contrastText,
    textDecoration: 'none',
  },
  linkCancel: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
  selector: {
    width: '380px',
  },
});

export class SnapshotCreateView extends React.PureComponent {
  static propTypes = {
    asset: PropTypes.string,
    classes: PropTypes.object.isRequired,
    createdSnapshot: PropTypes.object,
    dataset: PropTypes.object,
    datasets: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    ids: PropTypes.arrayOf(PropTypes.string),
    jobId: PropTypes.string,
    match: PropTypes.object.isRequired,
    readers: PropTypes.arrayOf(PropTypes.string),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getDatasets(0));
  }

  createSnapshotJob() {
    const { dispatch } = this.props;
    dispatch(createSnapshot());
  }

  validateName(name) {
    return name && name.length > 0 && name.length < 64;
  }

  selectDataset(datasetName, datasetId) {
    const { dispatch } = this.props;
    dispatch(actions.change('snapshot.dataset', datasetName));
    dispatch(getDatasetById(datasetId));
  }

  selectAsset(asset) {
    const { dispatch } = this.props;
    dispatch(actions.change('snapshot.asset', asset));
  }

  getDatasetOptions(datasets) {
    const datasetOptions =
      datasets.datasets &&
      datasets.datasets.map(dataset => ({ value: dataset.id, label: dataset.name }));
    return datasetOptions;
  }

  getAssetOptions(dataset) {
    let assetOptions = [];
    if (dataset && dataset.schema && dataset.schema.assets) {
      assetOptions = dataset.schema.assets.map(asset => ({ value: asset.name, label: asset.name }));
    }
    return assetOptions;
  }

  addUser(newEmail) {
    const { dispatch, readers } = this.props;
    if (!readers) {
      dispatch(actions.change('snapshot.readers', [newEmail]));
    } else if (!_.includes(readers, newEmail)) {
      dispatch(actions.change('snapshot.readers', _.concat(readers, newEmail)));
    }
  }

  removeUser(removeableEmail) {
    const { dispatch, readers } = this.props;
    const newUsers = _.clone(readers);
    _.remove(newUsers, r => r === removeableEmail);
    dispatch(actions.change('snapshot.readers', newUsers));
  }

  parseFile = event => {
    const { dispatch } = this.props;
    const { files } = event.target;
    const assetField = 'Epic';
    if (files.length > 0) {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', e => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: 'binary' });
        const values = [];
        // assuming the upload has one spreadsheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const col = getColumnForField(sheet, assetField);
        for (let i = 1; ; i++) {
          const cell = sheet[col + i];
          if (cell) {
            values.push(cell.v);
          } else {
            break;
          }
        }
        dispatch(actions.change('snapshot.ids', values));
      });
      fileReader.readAsBinaryString(files[0]);
    } else {
      dispatch(actions.change('snapshot.ids', []));
    }
  };

  render() {
    const FormRow = props => <div style={{ paddingBottom: '1em' }}>{props.children}</div>;
    const { asset, classes, createdSnapshot, jobId, ids, readers, datasets, dataset } = this.props;
    const datasetOptions = this.getDatasetOptions(datasets);
    const assetOptions = this.getAssetOptions(dataset);
    const createDisabled = !dataset || !ids;

    return (
      <div className={classes.wrapper}>
        <div>
          <div className={classes.title}>Create Snapshot</div>
          <p>Fill out the following fields to create a new snapshot</p>
          <Form model="snapshot">
            <FormRow>
              <div className={classes.nameSnapshot}>
                <Control.text
                  model="snapshot.name"
                  id="snapshot.name"
                  required
                  validators={{ name: this.validateName }}
                  component={props => (
                    <TextField {...props} placeholder="Snapshot Name" variant="outlined" />
                  )}
                />
              </div>
            </FormRow>

            <FormRow>
              <Control.textarea
                model="snapshot.description"
                id="snapshot.description"
                required
                component={props => (
                  <TextField
                    {...props}
                    style={{ width: '800px' }} // fullWidth
                    multiline
                    placeholder="Add Snapshot Description"
                    rows="4"
                    rowsMax="100"
                    variant="outlined"
                  />
                )}
              />
            </FormRow>
            <FormRow>
              <div className={classes.manageUsers}>
                <Control.custom
                  id="snapshot.readers"
                  model="snapshot.readers"
                  component={props => (
                    <ManageUsers
                      {...props}
                      addUser={newEmail => this.addUser(newEmail)}
                      defaultValue="Add viewer email address"
                      removeUser={removeableEmail => this.removeUser(removeableEmail)}
                      users={readers}
                    />
                  )}
                />
              </div>
            </FormRow>
            <FormRow>
              <Control.select
                id="snapshot.dataset"
                model="snapshot.dataset"
                className={classes.selector}
                component={props => (
                  <MultiSelect
                    {...props}
                    onChange={e => this.selectDataset(e.label, e.value)}
                    options={datasetOptions}
                    placeholder="Search Datasets"
                    value={datasetOptions.filter(option => option.value === dataset.id)}
                  />
                )}
              />
            </FormRow>

            <FormRow>
              <Control.select
                id="snapshot.asset"
                model="snapshot.asset"
                className={classes.selector}
                component={props => (
                  <MultiSelect
                    {...props}
                    isDisabled={!dataset.name}
                    onChange={e => this.selectAsset(e.value)}
                    options={assetOptions}
                    placeholder={
                      dataset.name
                        ? 'Select Asset Type...'
                        : 'Select Dataset to Select Asset Type...'
                    }
                    value={assetOptions.filter(option => option.value === asset)}
                  />
                )}
              />
            </FormRow>

            <FormRow>
              <input
                type="file"
                id="snapshot.upload"
                onChange={this.parseFile}
                style={{ display: 'none' }}
              />
              <label htmlFor="snapshot.upload">
                <Button variant="contained" component="span" color="primary">
                  Import Ids
                </Button>
              </label>
            </FormRow>

            <Errors model="snapshot" />

            <FormRow>
              {createdSnapshot ? (
                <Redirect push to={`/snapshots/requests/${jobId}`} />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttons}
                  disabled={createDisabled}
                  onClick={() => this.createSnapshotJob()}
                >
                  Create Snapshot
                </Button>
              )}
              <Link to="/snapshots" className={classes.linkCancel}>
                <Button variant="contained" type="button" className={classes.buttons}>
                  Cancel
                </Button>
              </Link>
            </FormRow>
          </Form>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    asset: state.snapshot.asset,
    createdSnapshot: state.snapshots.createdSnapshots.find(
      snapshotJob => snapshotJob.jobId === state.jobs.jobId,
    ),
    jobId: state.jobs.jobId,
    createdSnapshots: state.snapshots.createdSnapshots,
    ids: state.snapshot.ids,
    readers: state.snapshot.readers,
    datasets: state.datasets,
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotCreateView));
