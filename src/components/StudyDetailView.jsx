import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import { getStudyById } from 'actions/index';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 4,
  },
  width: {
    width: '70%',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 8,
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing.unit * 4,
    width: '200px',
  },
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  values: {
    paddingBottom: theme.spacing.unit * 3,
  },
});

export class StudyDetailView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object,
    study: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const studyId = match.params.uuid;
    dispatch(getStudyById(studyId));
  }

  render() {
    const { classes, study } = this.props;
    return (
      <div className={classes.wrapper}>
        <div className={classes.width}>
          <div className={classes.container}>
            <div>
              <div className={classes.title}>{study.name}</div>
              <div>{study.description}</div>
            </div>
            <Card className={classes.card}>
              <div className={classes.header}> Created by: </div>
              {/* TODO hook this up to SAM?!?!?*/}
              <div className={classes.values}> {study.readers} </div>
              <div className={classes.header}> Date Created: </div>
              <div className={classes.values}> {moment(study.createdDate).fromNow()} </div>
              <div className={classes.header}> Last Modified: </div>
              {/* where is this stored? */}
              <div className={classes.values}> {moment(study.createdDate).fromNow()} </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    study: state.studies.study,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(StudyDetailView));
