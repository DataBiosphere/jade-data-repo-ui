import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import moment from 'moment';

import JadeTable from './JadeTable';

const styles = theme => ({
  wrapper: {
    paddingTop: theme.spacing.unit * 4,
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

class StudyTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    rows: PropTypes.array,
    studyListName: PropTypes.string,
  };

  render() {
    const { classes, rows, studyListName } = this.props;
    const columns = [
      {
        label: 'Study Name',
        property: 'name',
        render: row => <Link to={`/studies/details/${row.id}`}>{row.name}</Link>,
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
        <div className={classes.header}>{studyListName || 'STUDIES'}</div>
        <JadeTable columns={columns} rows={rows} />
      </div>
    );
  }
}

export default withStyles(styles)(StudyTable);
