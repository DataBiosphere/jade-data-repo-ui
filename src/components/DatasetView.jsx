import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { getDatasets } from 'actions/index';
import JadeTable from './table/JadeTable';
import AddSVG from '../../assets/media/icons/plus-circle-solid.svg';

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
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '18px',
    fontWeight: '600',
    paddingTop: '30px',
  },
  plusButton: {
    height: '30px',
    fill: theme.palette.primary.main,
    marginLeft: '10px',
    width: '30px',
  },
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
      <div id="datasets" className={classes.wrapper}>
        <div className={classes.title}>Datasets</div>
        <p> Datasets make access control simple </p>
        <div className={classes.header}>
          DATASETS
          <NavLink to="/datasets/create">
            <AddSVG className={classes.plusButton} />
          </NavLink>
        </div>
        <div>
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
