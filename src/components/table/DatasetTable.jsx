import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { getDatasets } from 'actions/index';
import JadeTable from './JadeTable';
import AddSVG from '../../../assets/media/icons/plus-circle-solid.svg';

const styles = theme => ({
  wrapper: {
    paddingTop: theme.spacing.unit * 4,
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '18px',
    fontWeight: '600',
    paddingTop: '30px',
  },
  plusButton: {
    height: '20px',
    fill: theme.palette.primary.main,
    marginLeft: '10px',
    width: '20px',
  },
  jadeLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

class DatasetTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    datasets: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getDatasets());
  }

  handleChangePage = (limit, offset) => {
    const { dispatch } = this.props;
    dispatch(getDatasets(limit, offset));
  };

  render() {
    const { classes, datasets } = this.props;
    const columns = [
      {
        label: 'Dataset Name',
        property: 'name',
        render: row => (
          <Link to={`/datasets/details/${row.id}`} className={classes.jadeLink}>
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
        property: 'modifiedDate',
        render: row => moment(row.createdDate).fromNow(),
      },
      {
        label: 'Date created',
        property: 'createdDate',
        render: row => moment(row.createdDate).fromNow(),
      },
    ];
    return (
      <div className={classes.wrapper}>
        <div className={classes.header}>
          DATASETS
          <NavLink to="/datasets/create">
            <AddSVG className={classes.plusButton} />
          </NavLink>
        </div>
        <JadeTable
          columns={columns}
          handleChangePage={this.handleChangePage}
          rows={datasets.datasets}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    datasets: state.datasets,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetTable));
