import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { Box } from '@mui/material';
import { getJobs } from 'actions/index';
import { JobModel } from 'generated/tdr';
import { TdrState } from 'reducers';
import { OrderDirectionOptions } from 'reducers/query';
import JobTable from './table/JobTable';
import Container from './common/Container';

interface IProps {
  jobs: Array<JobModel>;
  dispatch: Dispatch<Action>;
  loading: boolean;
  searchString: string;
  refreshCnt: number;
}

function JobView({ jobs, dispatch, loading, searchString, refreshCnt }: IProps) {
  const handleFilterJobs = (
    limit: number,
    offset: number,
    sort: string,
    sortDirection: OrderDirectionOptions,
    search: string,
  ) => {
    dispatch(
      getJobs({
        limit,
        offset,
        sort,
        direction: sortDirection,
        search,
        errMessage: 'An error occured loading jobs. Please reload the page to try again.',
      }),
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: '1em',
      }}
    >
      <Container>
        <Box>
          {jobs && (
            <JobTable
              jobs={jobs}
              handleFilterJobs={handleFilterJobs}
              searchString={searchString}
              loading={loading}
              refreshCnt={refreshCnt}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    jobs: state.jobs.jobs,
    loading: state.jobs.loading,
    refreshCnt: state.jobs.refreshCnt,
  };
}

export default connect(mapStateToProps)(JobView);
