import axios from 'axios';
import _ from 'lodash';
import { SnapshotModel } from '../generated/tdr';
import { showNotification } from './notifications';

export type SpreadsheetInfo = {
  spreadsheetId: string;
  spreadsheetUrl: string;
};

export type SheetInfo = {
  sheetId: string;
  title: string;
};

export const createSheet: any = async (sheetName: string, token: string) => {
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
    }))
    .catch((err) => {
      showNotification(err);
    });
};

// Adding data sources for each table one by one
// In theory, could do a batch request for all data sources
// But ran into errors around concurrent requests from the sheets api
export const addBQSources: any = async (
  spreadsheetId: string,
  snapshot: SnapshotModel,
  token: string,
) => {
  const url = `/googlesheets/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
  const sheetInfo: Array<SheetInfo> = [];
  let index = 0;
  if (snapshot?.accessInformation?.bigQuery?.tables) {
    const bigQueryDetails = snapshot.accessInformation.bigQuery;
    for (const table of bigQueryDetails.tables) {
      const requests: object[] = [
        {
          addDataSource: {
            dataSource: {
              spec: {
                bigQuery: {
                  projectId: bigQueryDetails.projectId,
                  querySpec: {
                    rawQuery: `select * from \`${bigQueryDetails.projectId}.${bigQueryDetails.datasetName}.${table.name}\``,
                  },
                },
              },
            },
          },
        },
      ];
      const batchUpdateRequest = {
        requests: requests,
        includeSpreadsheetInResponse: true,
      };
      /* eslint-disable no-await-in-loop */
      const response = await axios
        .post(url, batchUpdateRequest, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((err) => {
          showNotification(err);
        });
      if (response) {
        sheetInfo.push({
          sheetId: response.data.updatedSpreadsheet.sheets[index + 1]?.properties.sheetId,
          title: table.name,
        });
      } else {
        return [];
      }
      index++;
    }
  }
  return sheetInfo;
};

// Rename google sheet tabs to match dataset table
// Delete default sheet added on create now that we've added the other data sources
export const cleanupSheet = async (
  spreadsheetId: string,
  sheetInfo: SheetInfo[],
  token: string,
) => {
  const url = `/googlesheets/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
  const requests: object[] = [];
  sheetInfo.forEach((sheet) => {
    requests.push({
      updateSheetProperties: {
        properties: {
          sheetId: sheet.sheetId,
          title: sheet.title,
        },
        fields: 'title',
      },
    });
  });
  requests.push({
    deleteSheet: {
      sheetId: 0,
    },
  });
  const batchUpdateRequest = {
    requests: requests,
    includeSpreadsheetInResponse: true,
  };
  axios
    .post(url, batchUpdateRequest, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((err) => {
      showNotification(err);
    });
};

// export const deleteSpreadsheetOnFailure = (spreadsheetId: string, token: string) => {
//   const url = `/drive/v3/files/${spreadsheetId}`;
//   axios
//     .delete(url, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .catch((err) => {
//       showNotification(err);
//     });
// };
