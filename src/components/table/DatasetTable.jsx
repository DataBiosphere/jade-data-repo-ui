import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import JadeTable from './JadeTable';

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
        render: row => <Link to={`/datasets/${row.id}`}>{row.name}</Link>,
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
        <JadeTable columns={columns} rows={rows} />
      </div>
    );
  }
}

export default withStyles(styles)(DatasetTable);
