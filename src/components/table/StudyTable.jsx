import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { getStudies } from 'actions/index';
import JadeTable from './JadeTable';

const styles = theme => ({
  jadeLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

class StudyTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    studies: PropTypes.array.isRequired,
    summary: PropTypes.bool,
    studyCount: PropTypes.number,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getStudies());
  }

  handleFilterStudies = (limit, offset, sort, sortDirection, searchString) => {
    const { dispatch } = this.props;
    dispatch(getStudies(limit, offset, sort, sortDirection, searchString));
  };

  render() {
    const { classes, summary, studyCount, studies } = this.props;
    const columns = [
      {
        label: 'Study Name',
        property: 'name',
        render: row => (
          <Link to={`/studies/details/${row.id}`} className={classes.jadeLink}>
            {row.name}
          </Link>
        ),
      },
      {
        label: 'Description',
        property: 'description',
      },
      {
        label: 'Last changed',
        property: 'modified_date',
        render: row => moment(row.createdDate).fromNow(),
      },
      {
        label: 'Date created',
        property: 'created_date',
        render: row => moment(row.createdDate).fromNow(),
      },
    ];
    return (
      <div>
        <JadeTable
          columns={columns}
          rows={studies}
          handleEnumeration={this.handleFilterStudies}
          summary={summary}
          totalCount={studyCount}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    studies: state.studies.studies,
    studyCount: state.studies.studyCount,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(StudyTable));
