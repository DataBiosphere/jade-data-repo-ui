import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MultiSelect from 'react-select';
import styled from 'styled-components';
import { Control, Form, actions, Errors } from 'react-redux-form';
import { isEmail } from 'validator';
import { createDataset } from 'actions/index';
import xlsx from 'xlsx';
import Combinatorics from 'js-combinatorics';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import ManageUsers from './ManageUsersView';
import _ from 'lodash';



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

const studyOptions = [
  { value: 'Minimal', label: 'Minimal' },
  { value: 'study_b', label: 'Study B' },
  { value: 'study_c', label: 'Study C' },
  { value: 'study_d', label: 'Study D' },
  { value: 'study_e', label: 'Study E' },
  { value: 'study_f', label: 'Study F' },
  { value: 'study_g', label: 'Study G' },
];


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
  };

  handleSubmit(dataset) {
    const { dispatch } = this.props;
    const payload = {
      name: dataset.name,
      description: dataset.description,
      source: [
        {
          studyName: dataset.study,
          assetName: dataset.asset,
          fieldName: 'foo',
          values: dataset.ids,
        },
      ],
    };
    dispatch(createDataset(payload));
  }

  validateName(name) {
    return name && name.length > 0 && name.length < 64;
  }

  selectStudy(study) {
    const { dispatch } = this.props;
    dispatch(actions.change('dataset.study', study));
  };

  selectAsset(asset) {
    const { dispatch } = this.props;
    dispatch(actions.change('dataset.asset', asset));
  };

  addReader(newEmail) { // TODO what if the email already exists? let them 'add' it anyway and don't do anything?
    const { dispatch, readers } = this.props;
    _.includes(readers, newEmail); //TODO what if I add anyway and then use lodash _.uniq?
    const newReaders = _.concat(readers, newEmail);
    dispatch(actions.change('dataset.readers', newReaders));
  };

  removeReader(removeableEmail) {
    const {dispatch, readers} = this.props;
    let newReaders = _.clone(readers);
    _.remove(newReaders, (r) => r == removeableEmail);
    dispatch(actions.change('dataset.readers', newReaders));
  };

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
    const FormRow = styled.section`
      padding-bottom: 1em;
    `;
    const { asset, ids, readers, study } = this.props;

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
        <Form model="dataset" onSubmit={data => this.handleSubmit(data)}>
          <FormRow>
            <Control.text
              model="dataset.name"
              id="dataset.name"
              required
              validators={{ name: this.validateName }}
              component={(props) =>
                <TextField
                  {...props}
                  defaultValue={this.props.model}
                  placeholder="Dataset Name"
                  style={{width: '300px'}}
                  variant="outlined"
                />
              }
            />
          </FormRow>

          <FormRow>
            <Control.textarea
              model="dataset.description"
              id="dataset.description"
              required
              component={(props) =>
                <TextField
                  {...props}
                  defaultValue={this.props.model}
                  style={{width: '800px'}} //fullWidth
                  multiline
                  placeholder="Add Dataset Description"
                  rows="8"
                  rowsMax="100"
                  variant="outlined"
                />
              }
            />
          </FormRow>

          <FormRow>
            <Control.custom
              id="dataset.readers"
              model="dataset.readers"
              component={(props) =>
                <ManageUsers
                  {...props}
                  addReader={(newEmail) => this.addReader(newEmail)}
                  defaultValue="Custodian Email Address"
                  dispatch={this.props.dispatch}
                  addValue={this.props.dispatch}
                  removeReader={(removeableEmail) => this.removeReader(removeableEmail)}
                  removeValue={this.props.dispatch}
                  readers={readers}
                />
              }
           />
          </FormRow>
          <FormRow>
            <Control.select
              id="dataset.study"
              model="dataset.study"
              size="5"
              component={(props) =>
                <MultiSelect
                  {...props}
                  onChange={(e) => this.selectStudy(e.value)}
                  options={studyOptions}
                  placeholder="Search Studies"
                  value={studyOptions.filter(option => option.value == study)}
                />
              }
            />
          </FormRow>

          <FormRow>
            <Control.select
              id="dataset.asset"
              model="dataset.asset"
              size="5"
              component={(props) =>
                <MultiSelect
                  {...props}
                  onChange={(e) => this.selectAsset(e.value)}
                  options={assetOptions}
                  placeholder="Select Asset Type..."
                  value={assetOptions.filter(option => option.value == asset)}
                />
              }
            />
          </FormRow>

          <FormRow>
            <input type="file" id="dataset.upload" onChange={this.parseFile}  style={{display: 'none'}}/>
            <label htmlFor="dataset.upload">
              <Button
                variant="contained"
                component="span"
                color="primary">
                Import Ids
              </Button>
            </label>
          </FormRow>

          {ids && <FormRow>
            <Control.select multiple={true} disabled={true} id="dataset.ids" model="dataset.ids" >
              <option>Preview</option>
              {ids && ids.map(id => <option key={id}>{id}</option>)}
            </Control.select>
          </FormRow>}

          <Errors model="dataset" />

          <FormRow>
            <Button
              variant="contained"
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              >
              Preview Data
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
    study: state.dataset.study,
  };
}

export default connect(mapStateToProps)(DatasetCreateView);
