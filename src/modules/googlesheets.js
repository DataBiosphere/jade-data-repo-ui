import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { ColumnModes, DbColumns } from '../constants';

export default class GoogleSheets {
  constructor() {
    this.pageTokenMap = {};
  }

  createSheet = (sheetName, token) => {
    const url = '/googlesheets/v4/spreadsheets';

    return axios
      .post(
        url,
        {
          properties: {
            title: sheetName,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => response.result.spreadsheetUrl);
  };
}
