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

    cy.get('[placeholder="Search keyword or description"]').type('SnapshotSimpleWMS2');
    cy.contains(/SnapshotSimpleWMS2/g).should('be.visible');
    cy.contains(/SnapshotSimpleWMS2/g).click();
  });

  it('exports to google sheets', () => {
    cy.contains(/Export Snapshot/g).click();
    cy.route({
      method: 'POST',
      url: 'googlesheets/v4/spreadsheets',
      status: 200,
      response: {
        spreadsheetId: '1ygRuVn-r8wJAqvLFt6Bu3AAwNJtHgIcq1pdYwhKg8Lg',
        properties: {
          title: 'SnapshotSimpleWMS2',
          locale: 'en_US',
          autoRecalc: 'ON_CHANGE',
          timeZone: 'Etc/GMT',
          defaultFormat: {},
          spreadsheetTheme: {},
        },
        sheets: [
          {
            properties: {
              sheetId: 0,
              title: 'Sheet1',
              index: 0,
              sheetType: 'GRID',
              gridProperties: {
                rowCount: 1000,
                columnCount: 26,
              },
            },
          },
        ],
        spreadsheetUrl:
          'https://docs.google.com/spreadsheets/d/1ygRuVn-r8wJAqvLFt6Bu3AAwNJtHgIcq1pdYwhKg8Lg/edit?ouid=116750588729799936913',
      },
    }).as('createSpreadsheet');
    cy.route({
      method: 'POST',
      url: 'googlesheets/v4/spreadsheets/**:batchUpdate',
      status: 200,
      response: {
        spreadsheetId: '1ygRuVn-r8wJAqvLFt6Bu3AAwNJtHgIcq1pdYwhKg8Lg',
        replies: [
          {
            addDataSource: {
              dataSource: {
                dataSourceId: '1506402027',
                spec: {
                  bigQuery: {
                    projectId: 'broad-jade-int-4-data',
                    querySpec: {
                      rawQuery: 'select * from `broad-jade-int-4-data.SnapshotSimpleWMS2.vcf_file`',
                    },
                  },
                },
              },
              dataExecutionStatus: {
                state: 'RUNNING',
              },
            },
          },
        ],
        updatedSpreadsheet: {
          spreadsheetId: '1ygRuVn-r8wJAqvLFt6Bu3AAwNJtHgIcq1pdYwhKg8Lg',
          properties: {
            title: 'SnapshotSimpleWMS2',
            locale: 'en_US',
            autoRecalc: 'ON_CHANGE',
            timeZone: 'Etc/GMT',
            defaultFormat: {},
            spreadsheetTheme: {},
          },
          sheets: [
            {
              properties: {
                sheetId: 0,
                title: 'Sheet1',
                index: 0,
                sheetType: 'GRID',
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 26,
                },
              },
            },
            {
              properties: {
                sheetId: 437309300,
                title: 'Connected Sheet 1',
                index: 1,
                sheetType: 'DATA_SOURCE',
                gridProperties: {
                  rowCount: 1,
                  columnCount: 1,
                },
                dataSourceSheetProperties: {
                  dataSourceId: '1506402027',
                  dataExecutionStatus: {
                    state: 'NOT_STARTED',
                  },
                },
              },
            },
          ],
          spreadsheetUrl:
            'https://docs.google.com/spreadsheets/d/1ygRuVn-r8wJAqvLFt6Bu3AAwNJtHgIcq1pdYwhKg8Lg/edit?ouid=116750588729799936913',
          dataSources: [
            {
              dataSourceId: '1506402027',
              spec: {
                bigQuery: {
                  projectId: 'broad-jade-int-4-data',
                  querySpec: {
                    rawQuery: 'select * from `broad-jade-int-4-data.SnapshotSimpleWMS2.vcf_file`',
                  },
                },
              },
            },
          ],
        },
      },
    }).as('addBQSources');

    cy.contains('Export Snapshot to Google Sheets').should('be.visible');
    cy.contains('Export Snapshot to Google Sheets').click();
    cy.wait(['@createSpreadsheet', '@addBQSources']);
    cy.contains('Google Sheet ready - continue').should('be.visible');
  });
});
