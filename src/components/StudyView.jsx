import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { getStudies } from 'actions/index';
import StudyTable from './table/StudyTable';
import DatasetTable from './table/DatasetTable';

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
    return (
      <div className={classes.wrapper}>
        <div className={classes.title}>Studies</div>
        <div className={classes.header}>STUDIES</div>
        <div> {studies && studies.studies && <StudyTable rows={studies.studies} />} </div>
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
