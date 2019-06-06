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
    color: theme.palette.common.link,
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
    studiesCount: PropTypes.number,
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
    const { classes, summary, studiesCount, studies } = this.props;
    // TODO add back modified_date column
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
        label: 'Date created',
        property: 'created_date',
        render: row => moment(row.createdDate).fromNow(),
      },
    ];
    return (
      <JadeTable
        columns={columns}
        rows={studies}
        handleFilter={this.handleFilterStudies}
        summary={summary}
        totalCount={studiesCount}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    studiesTest: state.studies,
    studies: state.studies.studies,
    studiesCount: state.studies.studiesCount,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(StudyTable));
