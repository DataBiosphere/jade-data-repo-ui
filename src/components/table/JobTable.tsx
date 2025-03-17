import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { JobModel, JobModelJobStatusEnum } from 'generated/tdr';
import { OrderDirectionOptions, TableColumnType } from 'reducers/query';
import { CustomTheme, styled } from '@mui/material/styles';
import { TdrState } from 'reducers';
import { RouterRootState } from 'connected-react-router';
import { connect } from 'react-redux';
import { push } from 'modules/hist';
import { urlEncodeParams } from 'libs/utilsTs';
import { Box } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { StatusIconWithLabel } from 'components/table/StatusMapTypes';
import CopyTextButton from '../common/CopyTextButton';
import LightTable from './LightTable';

const SeeMoreLink = styled('button')(({ theme }) => {
  const customTheme = theme as CustomTheme;
  return {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    width: '80%',
    ...customTheme.mixins.ellipsis,
    '&:hover': {
      color: customTheme.palette.primary.hover,
    },
    '& span': {
      ...customTheme.mixins.ellipsis,
    },
  };
});

const generateStatusMapItem = (jobStatus: JobModelJobStatusEnum): StatusIconWithLabel => {
  switch (jobStatus) {
    case JobModelJobStatusEnum.Succeeded:
      return {
        icon: (props) => (
          <CheckCircle sx={{ ...props.sx, color: (theme) => theme.palette.success.light }} />
        ),
        label: 'Completed',
      };
    case JobModelJobStatusEnum.Running:
      return {
        icon: (props) => (
          <Box {...props}>
            <LoadingSpinner wrapperStyles={{ height: '1.2rem', width: '1.2rem' }} size="1.1rem" />
          </Box>
        ),
        label: 'In Progress',
      };
    default:
      return {
        icon: (props) => (
          <Error sx={{ ...props.sx, color: (theme) => theme.palette.error.light }} />
        ),
        label: 'Failed',
      };
  }
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

  const columns: Array<TableColumnType> = [
    {
      label: 'Job ID',
      name: 'id',
      allowSort: false,
      width: '20%',
      render: (row: any) => (
        <div>
          <SeeMoreLink onClick={() => handleSeeMoreOpen(row.id)}>
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
      render: (row: any) => <span title={row.description}>{row.description}</span>,
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
        const statusMapItem = generateStatusMapItem(row.job_status);
        return (
          <Box
            sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
            title={statusMapItem.label}
          >
            {statusMapItem.icon({ sx: { fontSize: '1.2rem', marginRight: '10px' } })}
            <span>{statusMapItem.label}</span>
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
