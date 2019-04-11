import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

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
});

class DatasetTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    rows: PropTypes.array,
  };

  render() {
    const { classes, rows } = this.props;
    const columns = [
      {
        label: 'Dataset Name',
        property: 'name',
        render: row => <Link to={`/datasets/details/${row.id}`}>{row.name}</Link>,
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
        <JadeTable columns={columns} rows={rows} />
      </div>
    );
  }
}

export default withStyles(styles)(DatasetTable);
