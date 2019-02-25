import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Control, Form, actions, Errors } from 'react-redux-form';
import { isEmail } from 'validator';
import { createDataset } from 'actions/index';
import xlsx from 'xlsx';
import Combinatorics from 'js-combinatorics';

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

export class DatasetCreateView extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    ids: PropTypes.arrayOf(PropTypes.string),
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
      padding-bottom: 5px;
    `;
    const { ids } = this.props;

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
            <label htmlFor="dataset.name">Dataset name:</label>
            <Control.text
              model="dataset.name"
              id="dataset.name"
              required
              validators={{ name: this.validateName }}
            />
            <Control.text
              model="dataset.otherName"
              id="dataset.otherName"
              required
              validators={{ name: this.validateName }}
            />
            <span> (this is the other name)</span>
          </FormRow>

          <FormRow>
            <label htmlFor="dataset.description">Dataset description:</label>
            <Control.textarea model="dataset.description" id="dataset.description" required />
          </FormRow>

          <FormRow>
            <label htmlFor="dataset.readers">Access:</label>
            <Control.text id="dataset.readers" model="dataset.readers" validators={{ isEmail }} />
          </FormRow>

          <FormRow>
            <label htmlFor="dataset.study">Select study: </label>
            <Control.text model="dataset.study" id="dataset.study" />
          </FormRow>
          <FormRow>
            <Control.select model="dataset.study" size="5">
              <option>Study_A</option>
              <option>Another_B</option>
              <option>Study_C</option>
              <option>Study_D</option>
              <option>Study_E</option>
            </Control.select>
          </FormRow>

          <FormRow>
            <label htmlFor="dataset.asset">Select an asset: </label>
            <Control.select model="dataset.asset">
              <option>Select Asset Type</option>
              <option>Participant</option>
              <option>Sample</option>
            </Control.select>
          </FormRow>

          <FormRow>
            <label htmlFor="dataset.upload">Import IDs: </label>
            <input type="file" id="dataset.upload" onChange={this.parseFile} />
          </FormRow>

          <FormRow>
            <label htmlFor="dataset.ids">ID Preview: </label>
            <Control.select multiple={true} disabled={true} id="dataset.ids" model="dataset.ids">
              <option>Upload a spreadsheet</option>
              {ids && ids.map(id => <option key={id}>{id}</option>)}
            </Control.select>
          </FormRow>

          <Errors model="dataset" />

          <FormRow>
            <button type="submit">Preview Data</button>
            <button type="button">Cancel</button>
          </FormRow>
        </Form>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    ids: state.dataset.ids,
  };
}

export default connect(mapStateToProps)(DatasetCreateView);
