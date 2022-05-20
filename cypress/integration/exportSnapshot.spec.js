describe('test export snapshot', () => {
  beforeEach(() => {
    cy.server();

    cy.route('GET', 'api/repository/v1/snapshots/**').as('getSnapshot');

    cy.visit('/login/e2e');
    cy.get('#tokenInput').type(Cypress.env('GOOGLE_TOKEN'), {
      log: false,
      delay: 0,
    });
    cy.get('#e2eLoginButton').click();
    cy.get('a[href*="/snapshots"]').click();

    cy.get('[placeholder="Search keyword or description"]').type(
      'V2FGWASSummaryStatisticsSnapshot1',
    );
    cy.contains(/V2FGWASSummaryStatisticsSnapshot1/g).should('be.visible');
    cy.contains(/V2FGWASSummaryStatisticsSnapshot1/g).click();
  });

  it('exports to google sheets', () => {
    cy.contains(/Export Snapshot/g).click();
    cy.route({
      method: 'POST',
      url: 'drive/v3/files',
      status: 200,
      response: {
        kind: "drive#file",
        id: "1dn_K-ehwE3SoVl-HzcUO0GuN3sYXAlKTfv5JF7RuTTU",
        name: "V2FGWASSummaryStatisticsSnapshot1",
        mimeType: "application/vnd.google-apps.spreadsheet"
       },
    }).as('createSpreadsheet');
    cy.route({
      method: 'POST',
      url: 'googlesheets/v4/spreadsheets/**:batchUpdate',
      status: 200,
      response:  {
        spreadsheetId: "1dn_K-ehwE3SoVl-HzcUO0GuN3sYXAlKTfv5JF7RuTTU",
        replies: [
          {
            "addDataSource": {
              "dataSource": {
                "dataSourceId": "1037464130",
                "spec": {
                  "bigQuery": {
                    "projectId": "datarepo-dev-3654df96",
                    "querySpec": {
                      "rawQuery": "select * from `datarepo-dev-3654df96.V2FGWASSummaryStatisticsSnapshot1.ancestry_specific_meta_analysis`"
                    }
                  }
                }
              },
              "dataExecutionStatus": {
                "state": "RUNNING"
              }
            }
          }
        ],
        updatedSpreadsheet: {
          "spreadsheetId": "1dn_K-ehwE3SoVl-HzcUO0GuN3sYXAlKTfv5JF7RuTTU",
          "properties": {
            "title": "V2FGWASSummaryStatisticsSnapshot1",
          },
          "sheets": [
            {
              "properties": {
                "sheetId": 0,
                "title": "Sheet1",
                "index": 0,
                "sheetType": "GRID",
                "gridProperties": {
                  "rowCount": 1000,
                  "columnCount": 26
                }
              }
            },
            {
              "properties": {
                "sheetId": 789616320,
                "title": "Connected Sheet 1",
                "index": 1,
                "sheetType": "DATA_SOURCE",
                "gridProperties": {
                  "rowCount": 1,
                  "columnCount": 1
                },
                "dataSourceSheetProperties": {
                  "dataSourceId": "1037464130",
                  "dataExecutionStatus": {
                    "state": "RUNNING"
                  }
                }
              }
            }
          ],
          "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/1dn_K-ehwE3SoVl-HzcUO0GuN3sYXAlKTfv5JF7RuTTU/edit?ouid=116750588729799936913",
          "dataSources": [
            {
              "dataSourceId": "1037464130",
              "spec": {
                "bigQuery": {
                  "projectId": "datarepo-dev-3654df96",
                  "querySpec": {
                    "rawQuery": "select * from `datarepo-dev-3654df96.V2FGWASSummaryStatisticsSnapshot1.ancestry_specific_meta_analysis`"
                  }
                }
              }
            }
          ],
        },
      },
    }).as('addBQSources');

    cy.contains('Export Snapshot to Google Sheets').should('be.visible');
    cy.contains('Export Snapshot to Google Sheets').click();
    cy.wait('@createSpreadsheet');
    cy.wait('@addBQSources').wait('@addBQSources').wait('@addBQSources').wait('@addBQSources').wait('@addBQSources').wait('@addBQSources').wait('@addBQSources').wait('@addBQSources');
    cy.contains('Google Sheet ready - continue').should('be.visible');
  });
});
