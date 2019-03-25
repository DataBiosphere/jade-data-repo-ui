import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import JadeTable from './table/JadeTable';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { getStudies } from 'actions/index';

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
});

class StudyView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    studies: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getStudies());
  }

  render() {
    const { classes, studies } = this.props;
    const columns = [
      {
        label: 'Study Name',
        property: 'name',
        render: row => <Link to={`/studies/${row.id}`}>{row.name}</Link>,
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
        <div className={classes.title} >About Studies</div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.
          Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales
          pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci,
          sed rhoncus pronin sapien nunc accuan eget.
        </p>
        <div className={classes.header} >STUDIES</div>
        {studies && studies.studies && <JadeTable columns={columns} rows={studies.studies} />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    studies: state.studies,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(StudyView));

