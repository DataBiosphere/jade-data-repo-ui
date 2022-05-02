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
      .then((response) => ({
        spreadsheetId: response.data.spreadsheetId,
        spreadsheetUrl: response.data.spreadsheetUrl,
      }));
  };

  addBQSources = (spreadsheetId, snapshot, token) => {
    const url = `/googlesheets/v4/spreadsheets/${spreadsheetId}:batchUpdate`;

    let requests = [];
    snapshot.accessInformation.bigQuery.tables.forEach((table) => {
      requests.push({
        addDataSource: {
          dataSource: {
            spec: {
              bigQuery: {
                projectId: snapshot.accessInformation.bigQuery.projectId,
                querySpec: {
                  rawQuery: table.sampleQuery, // Need to build own query so not limited to 1k rows
                },
              },
            },
          },
        },
      });
    });

    const batchUpdateRequest = { requests: requests };
    axios
      .post(url, batchUpdateRequest, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => console.log('after batch update'));
  };
}
