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
    let sheetInfo = [];
    snapshot.accessInformation.bigQuery.tables.forEach((table, index) => {
      sheetInfo.push({
        sheetIndex: index + 1,
        sheetName: table.name,
      });
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
    return sheetInfo;
  };

  getSpreadsheetDetails = async (spreadsheetId, token) => {
    const url = `/googlesheets/v4/spreadsheets/${spreadsheetId}`;
    return axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response);
  };

  cleanupSheet = async (spreadsheetId, sheetInfo, token) => {
    const spreadSheetDetails = await this.getSpreadsheetDetails(spreadsheetId, token);
    const url = `/googlesheets/v4/spreadsheets/${spreadsheetId}:batchUpdate`;

    let requests = [];
    sheetInfo.forEach((sheet) => {
      const sheetId = spreadSheetDetails.data.sheets[sheet.sheetIndex].properties.sheetId;
      requests.push({
        updateSheetProperties: {
          properties: {
            sheetId: sheetId,
            title: sheet.sheetName,
          },
          fields: 'title',
        },
      });
    });
    //TODO - delete sheet1
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
