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

import { createDataset, getStudies, getStudyById } from 'actions/index';
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
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 4,
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 2,
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '18px',
    fontWeight: 600,
    paddingTop: 30,
  },
  nameDataset: {
    width: 400,
    ' && input': {
      padding: `12px 14px`,
      width: 272,
    },
  },
  manageUsers: {
    width: 400,
    ' && input': {
      padding: `12px 14px`,
      width: 300,
    },
  },
  buttons: {
    float: 'right',
    marginLeft: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  linkCreate: {
    color: theme.palette.primary.contrastText,
    textDecoration: 'none',
  },
  linkCancel: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
});

export class DatasetCreateView extends React.PureComponent {
  static propTypes = {
    asset: PropTypes.string,
    classes: PropTypes.object.isRequired,
    createdDataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    ids: PropTypes.arrayOf(PropTypes.string),
    jobId: PropTypes.string,
    match: PropTypes.object.isRequired,
    readers: PropTypes.arrayOf(PropTypes.string),
    studies: PropTypes.object.isRequired,
    study: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getStudies(0));
  }

  createDatasetJob() {
    const { dispatch } = this.props;
    dispatch(createDataset());
  }

  validateName(name) {
    return name && name.length > 0 && name.length < 64;
  }

  selectStudy(studyName, studyId) {
    const { dispatch } = this.props;
    dispatch(actions.change('dataset.study', studyName));
    dispatch(getStudyById(studyId));
  }

  selectAsset(asset) {
    const { dispatch } = this.props;
    dispatch(actions.change('dataset.asset', asset));
  }

  getStudyOptions(studies) {
    const studyOptions =
      studies.studies && studies.studies.map(study => ({ value: study.id, label: study.name }));
    return studyOptions;
  }

  getAssetOptions(study) {
    let assetOptions = [];
    if (study && study.schema && study.schema.assets) {
      assetOptions = study.schema.assets.map(asset => ({ value: asset.name, label: asset.name }));
    }
    return assetOptions;
  }

  addUser(newEmail) {
    const { dispatch, readers } = this.props;
    if (!readers) {
      dispatch(actions.change('dataset.readers', [newEmail]));
    } else if (!_.includes(readers, newEmail)) {
      dispatch(actions.change('dataset.readers', _.concat(readers, newEmail)));
    }
  }

  removeUser(removeableEmail) {
    const { dispatch, readers } = this.props;
    const newUsers = _.clone(readers);
    _.remove(newUsers, r => r === removeableEmail);
    dispatch(actions.change('dataset.readers', newUsers));
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
        dispatch(actions.change('dataset.ids', values));
      });
      fileReader.readAsBinaryString(files[0]);
    } else {
      dispatch(actions.change('dataset.ids', []));
    }
  };

  render() {
    const FormRow = props => <div style={{ paddingBottom: '1em' }}>{props.children}</div>;
    const { asset, classes, createdDataset, jobId, ids, readers, studies, study } = this.props;
    const studyOptions = this.getStudyOptions(studies);
    const assetOptions = this.getAssetOptions(study);
    const createDisabled = !study || !ids;

    return (
      <div className={classes.wrapper}>
        <div>
          <div className={classes.title}>Create Dataset</div>
          <p>Fill out the following fields to create a new dataset</p>
          <Form model="dataset">
            <FormRow>
              <div className={classes.nameDataset}>
                <Control.text
                  model="dataset.name"
                  id="dataset.name"
                  required
                  validators={{ name: this.validateName }}
                  component={props => (
                    <TextField {...props} placeholder="Dataset Name" variant="outlined" />
                  )}
                />
              </div>
            </FormRow>

            <FormRow>
              <Control.textarea
                model="dataset.description"
                id="dataset.description"
                required
                component={props => (
                  <TextField
                    {...props}
                    style={{ width: '800px' }} // fullWidth
                    multiline
                    placeholder="Add Dataset Description"
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
                  id="dataset.readers"
                  model="dataset.readers"
                  component={props => (
                    <ManageUsers
                      {...props}
                      addUser={newEmail => this.addUser(newEmail)}
                      defaultValue="Add viewer email address"
                      removeUser={removeableEmail => this.removeUser(removeableEmail)}
                      readers={readers}
                    />
                  )}
                />
              </div>
            </FormRow>
            <FormRow>
              <Control.select
                id="dataset.study"
                model="dataset.study"
                size="5"
                component={props => (
                  <MultiSelect
                    {...props}
                    onChange={e => this.selectStudy(e.label, e.value)}
                    options={studyOptions}
                    placeholder="Search Studies"
                    value={studyOptions.filter(option => option.value === study.id)}
                  />
                )}
              />
            </FormRow>

            <FormRow>
              <Control.select
                id="dataset.asset"
                model="dataset.asset"
                size="5"
                component={props => (
                  <MultiSelect
                    {...props}
                    isDisabled={!study.name}
                    onChange={e => this.selectAsset(e.value)}
                    options={assetOptions}
                    placeholder={
                      study.name ? 'Select Asset Type...' : 'Select Study to Select Asset Type...'
                    }
                    value={assetOptions.filter(option => option.value === asset)}
                  />
                )}
              />
            </FormRow>

            <FormRow>
              <input
                type="file"
                id="dataset.upload"
                onChange={this.parseFile}
                style={{ display: 'none' }}
              />
              <label htmlFor="dataset.upload">
                <Button variant="contained" component="span" color="primary">
                  Import Ids
                </Button>
              </label>
            </FormRow>

            <Errors model="dataset" />

            <FormRow>
              {createdDataset ? (
                <Redirect push to={`/datasets/requests/${jobId}`} />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttons}
                  disabled={createDisabled}
                  onClick={() => this.createDatasetJob()}
                >
                  Create Dataset
                </Button>
              )}
              <Link to="/datasets" className={classes.linkCancel}>
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
    asset: state.dataset.asset,
    createdDataset: state.datasets.createdDatasets.find(
      datasetJob => datasetJob.jobId === state.jobs.jobId,
    ),
    jobId: state.jobs.jobId,
    createdDatasets: state.datasets.createdDatasets,
    ids: state.dataset.ids,
    readers: state.dataset.readers,
    studies: state.studies,
    study: state.studies.study,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetCreateView));
