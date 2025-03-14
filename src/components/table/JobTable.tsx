import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { JobModel } from 'generated/tdr';
import { OrderDirectionOptions, TableColumnType } from 'reducers/query';
import { CustomTheme, styled } from '@mui/material/styles';
import { TdrState } from 'reducers';
import { RouterRootState } from 'connected-react-router';
import { connect } from 'react-redux';
import { push } from 'modules/hist';
import { urlEncodeParams } from 'libs/utilsTs';
import { Box, useTheme } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { StatusMapItem } from 'components/table/StatusMapTypes';
import CopyTextButton from '../common/CopyTextButton';
import LightTable from './LightTable';

const SeeMoreLink = styled('button')(({ theme }: { theme: CustomTheme }) => ({
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  width: '80%',
  ...theme.mixins.ellipsis,
  '&:hover': {
    color: theme.palette.primary.hover,
  },
  '& span': {
    ...theme.mixins.ellipsis,
  },
}));

interface StatusMap {
  succeeded: StatusMapItem;
  running: StatusMapItem;
  failed: StatusMapItem;
}

const statusMap: StatusMap = {
  succeeded: {
    icon: (props, theme) => (
      <CheckCircle sx={{ ...props.sx, color: theme.palette.success.light }} />
    ),
    label: 'Completed',
  },
  running: {
    icon: (props, _theme) => (
      <Box {...props}>
        <LoadingSpinner wrapperStyles={{ height: '1.2rem', width: '1.2rem' }} size="1.1rem" />
      </Box>
    ),
    label: 'In Progress',
  },
  failed: {
    icon: (props, theme) => <Error sx={{ ...props.sx, color: theme.palette.error.light }} />,
    label: 'Failed',
  },
};

interface IProps {
  readonly jobs: Array<JobModel>;
  readonly handleFilterJobs?: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    orderProperty: string,
    orderDirection: OrderDirectionOptions,
    searchString: string,
    refreshCnt: number,
  ) => void;
  readonly loading: boolean;
  readonly searchString: string;
  readonly query?: Record<string, string>;
  readonly refreshCnt: number;
}

function JobTable({ jobs, handleFilterJobs, loading, searchString, query, refreshCnt }: IProps) {
  const handleSeeMoreOpen = (jobId: string) => {
    const params = _.clone(query || {});
    params.expandedJob = jobId;
    push(`${location.pathname}?${urlEncodeParams(params)}`);
  };
  const theme = useTheme() as CustomTheme;

  const columns: Array<TableColumnType> = [
    {
      label: 'Job ID',
      name: 'id',
      allowSort: false,
      width: '20%',
      render: (row: any) => (
        <div>
          <SeeMoreLink onClick={() => handleSeeMoreOpen(row.id)} theme={theme}>
            <span>{`${row.id || 'See More'}`}</span>
          </SeeMoreLink>
          <CopyTextButton valueToCopy={row.id} nameOfValue="Job ID" />
        </div>
      ),
    },
    {
      label: 'Class',
      name: 'class_name',
      allowSort: false,
      width: '15%',
      render: (row: any) => (
        <span title={row.class_name}>{_.last(row.class_name?.split('.'))}</span>
      ),
    },
    {
      label: 'Description',
      name: 'description',
      allowSort: false,
      width: '45%',
    },
    {
      label: 'Date',
      name: 'submitted',
      allowSort: true,
      render: (row: any) => <span title={row?.submitted}>{moment(row?.submitted).fromNow()}</span>,
      width: '10%',
    },
    {
      label: 'Status',
      name: 'job_status',
      allowSort: false,
      width: '10%',
      render: (row: any) => {
        const job = row as JobModel;
        return (
          <Box
            sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
            title={statusMap[job.job_status]?.label}
          >
            {statusMap[job.job_status]?.icon(
              { sx: { fontSize: '1.2rem', marginRight: '10px' } },
              theme,
            )}
            <span>{statusMap[job.job_status]?.label}</span>
          </Box>
        );
      },
    },
    {
      label: 'Duration',
      name: 'job_duration',
      allowSort: false,
      width: '10%',
      render: (row: any) => {
        if (row.submitted && row.completed) {
          const duration = moment(row.completed).diff(moment(row.submitted), 'seconds');
          const durationStr = moment
            .duration(duration, 'seconds')
            .format('h [hrs] m [min] s [sec]');
          return <span title={durationStr}>{durationStr}</span>;
        }
        return '--';
      },
    },
  ];
  return (
    <LightTable
      columns={columns}
      handleEnumeration={handleFilterJobs}
      noRowsMessage="No jobs have been created yet"
      infinitePaging={true}
      filteredCount={Number.MAX_SAFE_INTEGER}
      rows={jobs}
      searchString={searchString}
      loading={loading}
      refreshCnt={refreshCnt}
      rowKey="id"
    />
  );
}

function mapStateToProps(state: TdrState & RouterRootState) {
  return {
    query: state.router.location?.query,
  };
}

export default connect(mapStateToProps)(JobTable);
