import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { WithStyles, withStyles } from '@mui/styles';
import { getJobs } from 'actions/index';
import { JobModel } from 'generated/tdr';
import { CustomTheme } from '@mui/material';
import { TdrState } from 'reducers';
import { OrderDirectionOptions } from 'reducers/query';
import JobTable from './table/JobTable';

const styles = (theme: CustomTheme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1em',
  },
  width: {
    ...theme.mixins.containerWidth,
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
});

interface IProps extends WithStyles<typeof styles> {
  jobs: Array<JobModel>;
  jobRoleMaps: { [key: string]: Array<string> };
  jobsCount: number;
  dispatch: Dispatch<Action>;
  filteredJobsCount: number;
  loading: boolean;
  searchString: string;
  refreshCnt: number;
  userEmail: string;
}

const JobView = withStyles(styles)(
  ({
    classes,
    jobs,
    jobRoleMaps,
    jobsCount,
    dispatch,
    filteredJobsCount,
    loading,
    searchString,
    refreshCnt,
  }: IProps) => {
    const handleFilterJobs = (
      limit: number,
      offset: number,
      sort: string,
      sortDirection: OrderDirectionOptions,
      search: string,
    ) => {
      dispatch(getJobs(limit, offset, sort, sortDirection, search));
    };

    return (
      <div className={classes.wrapper}>
        <div className={classes.width}>
          <div>
            {jobs && (
              <JobTable
                jobs={jobs}
                jobRoleMaps={jobRoleMaps}
                jobsCount={jobsCount}
                handleFilterJobs={handleFilterJobs}
                filteredJobsCount={filteredJobsCount}
                searchString={searchString}
                loading={loading}
                refreshCnt={refreshCnt}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);

function mapStateToProps(state: TdrState) {
  return {
    jobs: state.jobs.jobs,
    jobsCount: state.jobs.jobsCount,
    filteredJobsCount: state.jobs.filteredJobsCount,
    loading: state.jobs.loading,
    userEmail: state.user.email,
    refreshCnt: state.jobs.refreshCnt,
  };
}

export default connect(mapStateToProps)(JobView);
