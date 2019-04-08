import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import MultiSelect from 'react-select';
import { Control, Form, actions, Errors } from 'react-redux-form';
import _ from 'lodash';
import xlsx from 'xlsx';
import Combinatorics from 'js-combinatorics';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { getStudies } from 'actions/index';
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

const assetOptions = [
  { value: 'participant', label: 'Participant' },
  { value: 'sample', label: 'Sample' },
];

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
    fontWeight: '600',
    paddingTop: '30px',
  },
  manageUsers: {
    width: '400px',
  },
  buttons: {
    float: 'right',
    marginLeft: '8px',
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
    dispatch: PropTypes.func.isRequired,
    ids: PropTypes.arrayOf(PropTypes.string),
    readers: PropTypes.arrayOf(PropTypes.string),
    studies: PropTypes.object.isRequired,
    study: PropTypes.string,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getStudies());
  }

  validateName(name) {
    return name && name.length > 0 && name.length < 64;
  }

  selectStudy(study) {
    const { dispatch } = this.props;
    dispatch(actions.change('dataset.study', study));
  }

  selectAsset(asset) {
    const { dispatch } = this.props;
    dispatch(actions.change('dataset.asset', asset));
  }

  getStudyOptions(studies) {
    const studiesList = [];
    studies.studies.map(study => studiesList.push({ value: study.id, label: study.name }));
    return studiesList;
  }

  addUser(newEmail) {
    const { dispatch, readers } = this.props;
    if (!_.includes(readers, newEmail)) {
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
      const reader = new FileReader();
      reader.addEventListener('load', e => {
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
      reader.readAsBinaryString(files[0]);
    } else {
      dispatch(actions.change('dataset.ids', []));
    }
  };

  render() {
    const FormRow = props => <div style={{ paddingBottom: '1em' }}>{props.children}</div>;
    const { asset, classes, ids, readers, studies, study } = this.props;
    const studyOptions = this.getStudyOptions(studies);

    return (
      <div className={classes.wrapper}>
        <div>
          <div className={classes.title}>Create Dataset</div>
          <p>Fill out the following fields to create a new dataset</p>
          <Form model="dataset">
            <FormRow>
              <Control.text
                model="dataset.name"
                id="dataset.name"
                required
                validators={{ name: this.validateName }}
                component={props => (
                  <TextField
                    {...props}
                    className={classes.test}
                    placeholder="Dataset Name"
                    style={{ width: '300px' }}
                    variant="outlined"
                  />
                )}
              />
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
                    onChange={e => this.selectStudy(e.label)}
                    options={studyOptions}
                    placeholder="Search Studies"
                    value={studyOptions.filter(option => option.label === study)}
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
                    onChange={e => this.selectAsset(e.value)}
                    options={assetOptions}
                    placeholder="Select Asset Type..."
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

            {ids && (
              <FormRow>
                <Control.select
                  multiple={true}
                  disabled={true}
                  id="dataset.ids"
                  model="dataset.ids"
                >
                  <option>Preview</option>
                  {ids && ids.map(id => <option key={id}>{id}</option>)}
                </Control.select>
              </FormRow>
            )}
            <Errors model="dataset" />
            <FormRow>
              <Button variant="contained" color="primary" className={classes.buttons}>
                <Link to="/datasets/preview" className={classes.linkCreate}>
                  Create Dataset
                </Link>
              </Button>
              <Button variant="contained" type="button" className={classes.buttons}>
                <Link to="/datasets" className={classes.linkCancel}>
                  Cancel
                </Link>
              </Button>
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
    ids: state.dataset.ids,
    readers: state.dataset.readers,
    studies: state.studies,
    study: state.dataset.study,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetCreateView));
