import axios from 'axios';
import _ from 'lodash';
import { SnapshotModel } from '../generated/tdr';

export const createSheet = async (sheetName: string, token: string) => {
  const url = '/googlesheets/v4/spreadsheets';

  const response = await axios.post(
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
    });
  return ({
    spreadsheetId: response.data.spreadsheetId,
    spreadsheetUrl: response.data.spreadsheetUrl,
  });
};

export type SheetInfo = {
  sheetId: string;
  title: string;
};

export const addBQSources: any = async (spreadsheetId: string, snapshot: SnapshotModel, token: string) => {
  const url = `/googlesheets/v4/spreadsheets/${spreadsheetId}:batchUpdate`;  
  let requests: object[] = [];
    let sheetInfo: Array<SheetInfo> = [];
    let index = 0;
    if (snapshot?.accessInformation?.bigQuery?.tables) {
      for (const table of snapshot.accessInformation.bigQuery.tables) {
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
        const batchUpdateRequest = {
          requests: requests,
          includeSpreadsheetInResponse: true,
        };
        //const result: SheetInfo = await sendRequest(spreadsheetId, batchUpdateRequest, token, table.name, index);
        const response = await axios
        .post(url, batchUpdateRequest, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        sheetInfo.push({
          sheetId: response.data.updatedSpreadsheet.sheets[index + 1]?.properties.sheetId,
          title: table.name,
        });
    }
    
  }
  return sheetInfo;
}

  // export const sendRequest: SheetInfo = async (spreadsheetId: string, batchUpdateRequest: object[], token: string, tableName: string, index: number) => {
  //   const url = `/googlesheets/v4/spreadsheets/${spreadsheetId}:batchUpdate`;

  //   const response = await axios
  //     .post(url, batchUpdateRequest, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   return ({
  //     sheetId: response.data.updatedSpreadsheet.sheets[index + 1]?.properties.sheetId,
  //     sheetName: tableName,
  //   });
  // };

//   // getSpreadsheetDetails = async (spreadsheetId, token) => {
//   //   const url = `/googlesheets/v4/spreadsheets/${spreadsheetId}`;
//   //   return axios
//   //     .get(url, {
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //     })
//   //     .then((response) => response);
//   // };

  // export const cleanupSheet = async (spreadsheetId: string, sheetInfo: SheetInfo[], token: string) => {
  //   //const spreadSheetDetails = await this.getSpreadsheetDetails(spreadsheetId, token);
  //   const url = `/googlesheets/v4/spreadsheets/${spreadsheetId}:batchUpdate`;

  //   let requests: object[] = [];
  //   sheetInfo.forEach((sheet) => {
  //     requests.push({
  //       updateSheetProperties: {
  //         properties: {
  //           sheetId: sheet.sheetId,
  //           title: sheet.title,
  //         },
  //         fields: 'title',
  //       },
  //     });
  //   });
  //   //TODO - delete sheet1
  //   const batchUpdateRequest = { requests: requests };
  //   axios
  //     .post(url, batchUpdateRequest, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => console.log('after batch update'));
  // };

