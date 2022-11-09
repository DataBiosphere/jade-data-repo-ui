import React from 'react';
import clsx from 'clsx';
import { WithStyles, withStyles } from '@mui/styles';
import moment from 'moment';
import _ from 'lodash';
import { JournalEntryModel } from 'generated/tdr';
import { TableColumnType } from 'reducers/query';
import { CustomTheme } from '@mui/material/styles';

import LightTable from './LightTable';

const styles = (theme: CustomTheme) => ({
  textWrapper: {
    ...theme.mixins.ellipsis,
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: '1rem',
    marginRight: 10,
  },
  statusIconSuccess: {
    color: theme.palette.success.light,
  },
  statusIconFailed: {
    color: theme.palette.error.light,
  },
});

interface IProps extends WithStyles<typeof styles> {
  journalEntries: Array<JournalEntryModel>;
  journalEntriesCount?: number;
  filteredJournalEntriesCount?: number;
  handleFilterJournalEntries?: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    searchString: string,
  ) => void;
  loading: boolean;
  refreshCnt: number;
}

const JournalEntryTable = withStyles(styles)(
  ({ classes, journalEntries, handleFilterJournalEntries, loading, refreshCnt }: IProps) => {
    const statusMap: any = {
      CREATE: { icon: `fa fa-circle-check ${classes.statusIconSuccess}`, label: 'Created' },
      UPDATE: { icon: `fa fa-circle-check ${classes.statusIconSuccess}`, label: 'Updated' },
    };

    const getStatusLabel = (row: JournalEntryModel) => {
      if (row.entryType === 'CREATE') {
        return 'Created';
      }
      if (row.entryType === 'UPDATE' && row.methodName === 'lambda$addPolicyMember$15') {
        return 'Shared';
      }
      if (row.entryType === 'UPDATE' && row.note?.includes('Ingested')) {
        return 'Ingested';
      }
      return row.entryType;
    };

    const columns: Array<TableColumnType> = [
      {
        label: 'Initiator',
        name: 'user',
        allowSort: false,
        width: '20%',
        cellStyles: {
          whiteSpace: 'normal',
        },
      },
      {
        label: 'Action',
        name: 'note',
        allowSort: false,
        width: '20%',
        cellStyles: {
          whiteSpace: 'normal',
        },
      },
      {
        label: 'Date',
        name: 'when',
        allowSort: false,
        render: (row: any) => moment(row.when).fromNow(),
        width: '10%',
      },
      {
        label: 'Status',
        name: 'entryType',
        allowSort: false,
        width: '10%',
        render: (row: any) => (
          <span className={classes.statusContainer}>
            <i className={clsx(classes.statusIcon, statusMap[row.entryType].icon)} />
            {getStatusLabel(row)}
          </span>
        ),
      },
    ];
    return (
      <LightTable
        columns={columns}
        handleEnumeration={handleFilterJournalEntries}
        noRowsMessage="No journal entries found"
        infinitePaging={true}
        filteredCount={Number.MAX_SAFE_INTEGER}
        rows={journalEntries}
        searchString=""
        loading={loading}
        refreshCnt={refreshCnt}
        rowKey="id"
      />
    );
  },
);

export default JournalEntryTable;
