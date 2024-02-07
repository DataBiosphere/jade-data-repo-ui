import React from 'react';
import clsx from 'clsx';
import { WithStyles, withStyles } from '@mui/styles';
import moment from 'moment';
import _ from 'lodash';
import { JobModel } from 'generated/tdr';
import { OrderDirectionOptions, TableColumnType } from 'reducers/query';
import { CustomTheme } from '@mui/material/styles';
import { TdrState } from 'reducers';
import { RouterRootState } from 'connected-react-router';
import { connect } from 'react-redux';
import { push } from 'modules/hist';
import { urlEncodeParams } from 'libs/utilsTs';
import LightTable from './LightTable';

const styles = (theme: CustomTheme) => ({
  textWrapper: {
    ...theme.mixins.ellipsis,
  },
  statusContainer: {
    width: '100%',
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
  seeMoreLink: {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    width: '100%',
    ...theme.mixins.ellipsis,
    '&:hover': {
      color: theme.palette.primary.hover,
    },
    '& span': {
      ...theme.mixins.ellipsis,
    },
  },
});

interface IProps extends WithStyles<typeof styles> {
  jobs: Array<JobModel>;
  jobsCount?: number;
  filteredJobsCount?: number;
  handleFilterJobs?: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    orderProperty: string,
    orderDirection: OrderDirectionOptions,
    searchString: string,
    refreshCnt: number,
  ) => void;
  handleMakeSteward?: (jobId: string) => void;
  loading: boolean;
  searchString: string;
  query?: Record<string, string>;
  refreshCnt: number;
}

const JobTable = withStyles(styles)(
  ({ classes, jobs, handleFilterJobs, loading, searchString, query, refreshCnt }: IProps) => {
    const statusMap: any = {
      succeeded: { icon: `fa fa-circle-check ${classes.statusIconSuccess}`, label: 'Completed' },
      running: { icon: `fa fa-rotate fa-spin ${classes.statusIconSuccess}`, label: 'In Progress' },
      failed: { icon: `fa fa-circle-xmark ${classes.statusIconFailed}`, label: 'Failed' },
    };

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
          <button
            type="button"
            onClick={() => handleSeeMoreOpen(row.id)}
            className={classes.seeMoreLink}
          >
            <span>{`${row.id || 'See More'}`}</span>
          </button>
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
        render: (row: any) => (
          <span title={row?.submitted}>{moment(row?.submitted).fromNow()}</span>
        ),
        width: '10%',
      },
      {
        label: 'Status',
        name: 'job_status',
        allowSort: false,
        width: '10%',
        render: (row: any) => (
          <span className={classes.statusContainer} title={statusMap[row.job_status].label}>
            <i className={clsx(classes.statusIcon, statusMap[row.job_status].icon)} />
            <span>{statusMap[row.job_status].label}</span>
          </span>
        ),
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
  },
);

function mapStateToProps(state: TdrState & RouterRootState) {
  return {
    query: state.router.location?.query,
  };
}

export default connect(mapStateToProps)(JobTable);
