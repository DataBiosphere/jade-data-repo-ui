import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { getDatasets } from 'actions/index';
import JadeTable from './table/JadeTable';
import Hex from '../../assets/media/icons/hex-button.svg';

const styles = theme => ({
  wrapper: {
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 4,
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 8,
  },
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  hexBotton: {
    position: 'fixed',
    zIndex:1,
    top:100,
    left:100,
    height:'40px',
    width:'40px',
  },
  plusButtonContainer: {
    margin:0,
    padding:0,
    overflow: 'hidden',
  },
  plusButton: {
    position: 'fixed',
    zIndex:2,
    top:100,
    left:100,
    marginTop: '10px',
    marginLeft: '10px',
  }
});

class DatasetView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    datasets: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getDatasets());
  }

  render() {
    const { classes, datasets } = this.props;
    const columns = [
      {
        label: 'Dataset Name',
        property: 'name',
        render: row => <Link to={`/dataset/${row.id}`}>{row.name}</Link>,
      },
      {
        label: 'Description',
        property: 'description',
      },
      {
        label: 'Last changed',
        property: 'modifiedDate',
        render: row => moment(row.modifiedDate).fromNow(),
      },
      {
        label: 'Date created',
        property: 'createdDate',
        render: row => moment(row.createdDate).fromNow(),
      },
    ];
    return (
      <div className={classes.wrapper}>
        <div className={classes.title}>About Datasets</div>
        <div className={classes.header}>
          DATASETS
          <NavLink to="/datasets/create">
          <div className={classes.plusButtonContainer}>
            <div className={classes.plusButton}>+</div>
            <Hex
              className={classes.hexBotton}
            />
          </div>
          </NavLink>
          {datasets && datasets.datasets && (
            <JadeTable columns={columns} rows={datasets.datasets} />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { datasets: state.datasets };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetView));
