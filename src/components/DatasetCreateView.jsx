import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
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

export class DatasetCreateView extends React.PureComponent {
  static propTypes = {
    asset: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    ids: PropTypes.arrayOf(PropTypes.string),
    readers: PropTypes.arrayOf(PropTypes.string),
    study: PropTypes.string,
    studies: PropTypes.arrayOf(PropTypes.string),
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
    let studiesList = [];
    studies.studies && studies.studies.map( study => {
      studiesList.push({ value: study.id, label: study.name });
    });
    return studiesList;
  }

  addReader(newEmail) {
    const { dispatch, readers } = this.props;
    if (!_.includes(readers, newEmail)) {
      dispatch(actions.change('dataset.readers', _.concat(readers, newEmail)));
    }
  }

  removeReader(removeableEmail) {
    const { dispatch, readers } = this.props;
    const newReaders = _.clone(readers);
    _.remove(newReaders, r => r === removeableEmail);
    dispatch(actions.change('dataset.readers', newReaders));
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
    const { asset, ids, readers, studies, study } = this.props;
    const studyOptions = this.getStudyOptions(studies);

    return (
      <div>
        <h2>Create Dataset</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.
          Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales
          pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci,
          sed rhoncus pronin sapien nunc accuan eget.
        </p>
        <Form model="dataset" >
          <FormRow>
            <Control.text
              model="dataset.name"
              id="dataset.name"
              required
              validators={{ name: this.validateName }}
              component={props => (
                <TextField
                  {...props}
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
                  rows="8"
                  rowsMax="100"
                  variant="outlined"
                />
              )}
            />
          </FormRow>
          <FormRow>
            <Control.custom
              id="dataset.readers"
              model="dataset.readers"
              component={props => (
                <ManageUsers
                  {...props}
                  addReader={newEmail => this.addReader(newEmail)}
                  defaultValue="Custodian Email Address"
                  removeReader={removeableEmail => this.removeReader(removeableEmail)}
                  readers={readers}
                />
              )}
            />
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
              <Control.select multiple={true} disabled={true} id="dataset.ids" model="dataset.ids">
                <option>Preview</option>
                {ids && ids.map(id => <option key={id}>{id}</option>)}
              </Control.select>
            </FormRow>
          )}

          <Errors model="dataset" />

          <FormRow>
            <Button variant="contained" type="button">
              <Link to="/datasets">
                Cancel
              </Link>
            </Button>
            <Button
              variant="contained"
              color="primary"
            >
              <Link to="/datasets/preview">
                Preview Data
              </Link>
            </Button>
          </FormRow>
        </Form>
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

export default connect(mapStateToProps)(DatasetCreateView);
