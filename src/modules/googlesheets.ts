import axios from 'axios';
import _ from 'lodash';
import { SnapshotModel } from '../generated/tdr';

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
    },
  );
  const info: SpreadsheetInfo = {
    spreadsheetId: response.data.spreadsheetId,
    spreadsheetUrl: response.data.spreadsheetUrl,
  };
  return info;
};

// Adding data sources for each table one by one
// In theory, could do a batch request for all data sources
// I was running into errors around concurrent requests from the sheets api
export const addBQSources: any = async (
  spreadsheetId: string,
  snapshot: SnapshotModel,
  token: string,
) => {
  const url = `/googlesheets/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
  const sheetInfo: Array<SheetInfo> = [];
  let index = 0;
  if (snapshot?.accessInformation?.bigQuery?.tables) {
    for (const table of snapshot.accessInformation.bigQuery.tables) {
      const requests: object[] = [
        {
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
        },
      ];
      const batchUpdateRequest = {
        requests: requests,
        includeSpreadsheetInResponse: true,
      };
      /* eslint-disable no-await-in-loop */
      const response = await axios.post(url, batchUpdateRequest, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      sheetInfo.push({
        sheetId: response.data.updatedSpreadsheet.sheets[index + 1]?.properties.sheetId,
        title: table.name,
      });
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
  if (sheetInfo.length > 0) {
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
    axios.post(url, batchUpdateRequest, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
};
