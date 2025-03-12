import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { JournalEntryModel, JournalEntryModelEntryTypeEnum } from 'generated/tdr';
import { TableColumnType } from 'reducers/query';
import { CustomTheme } from '@mui/material/styles';

import { StatusMapItem } from 'components/table/StatusMapTypes';
import { CheckCircle } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import LightTable from './LightTable';

interface StatusMap {
  CREATE: StatusMapItem;
  UPDATE: StatusMapItem;
  DELETE: StatusMapItem;
}

const statusMap: StatusMap = {
  CREATE: {
    icon: (props, theme) => (
      <CheckCircle sx={{ ...props.sx, color: theme.palette.success.light }} />
    ),
    label: 'Created',
  },
  UPDATE: {
    icon: (props, theme) => (
      <CheckCircle sx={{ ...props.sx, color: theme.palette.success.light }} />
    ),
    label: 'Updated',
  },
  DELETE: {
    icon: (_props, _theme) => <Box>Unsupported</Box>,
    label: 'Deleted',
  },
};

interface IProps {
  journalEntries: Array<JournalEntryModel>;
  journalEntriesCount?: number;
  filteredJournalEntriesCount?: number;
  handleFilterJournalEntries?: (rowsPerPage: number, rowsForCurrentPage: number) => void;
  loading: boolean;
  refreshCnt: number;
}

function JournalEntryTable({
  journalEntries,
  handleFilterJournalEntries,
  loading,
  refreshCnt,
}: IProps) {
  const theme = useTheme() as CustomTheme;
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
    return _.startCase(row.entryType.toLowerCase());
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
      render: (row: any) => {
        const request = _.get(row, ['mutation', 'request.json'], '{}');
        const parsedReq = JSON.parse(request);

        let { note } = row;

        const description = _.get(parsedReq, '1.description') || _.get(row, 'mutation.description');

        const details = [];
        if (row.entryType === JournalEntryModelEntryTypeEnum.Create) {
          note = description;
        } else if (parsedReq?.[0] === 'bio.terra.model.IngestRequestModel') {
          const strategy = parsedReq?.[1]?.updateStrategy || '';
          const casedStrategy = `${strategy[0].toUpperCase()}${strategy.substring(1)}`;
          details.push(`${casedStrategy} with ${parsedReq[1].path}`);
        } else if (description && description !== note) {
          details.push(description);
        }

        return (
          <>
            <div>{note}</div>
            {details.map((detail, i) => (
              <Box key={`${row.id}-${i}`} sx={{ marginTop: '15px' }}>
                {detail}
              </Box>
            ))}
          </>
        );
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
      render: (row: any) => {
        const journalEntry = row as JournalEntryModel;
        return (
          <Box
            sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
            title={statusMap[journalEntry.entryType]?.label}
          >
            {statusMap[journalEntry.entryType]?.icon(
              { sx: { fontSize: '1.2rem', marginRight: '10px' } },
              theme,
            )}
            {getStatusLabel(journalEntry)}
          </Box>
        );
      },
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
      loading={loading}
      refreshCnt={refreshCnt}
      rowKey="id"
    />
  );
}

export default JournalEntryTable;
