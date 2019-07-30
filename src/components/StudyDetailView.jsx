import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import {
  getStudyById,
  getStudyPolicy,
  addCustodianToStudy,
  removeCustodianFromStudy,
} from 'actions/index';
import ManageUsersModal from './ManageUsersModal';
import StudyTablePreview from './StudyTablePreview';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  width: {
    width: '70%',
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing(4),
  },
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  values: {
    paddingBottom: theme.spacing(3),
  },
});

export class StudyDetailView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object,
    study: PropTypes.object,
    studyPolicies: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const studyId = match.params.uuid;
    dispatch(getStudyById(studyId));
    dispatch(getStudyPolicy(studyId));
  }

  addUser(dispatch, studyId, newEmail) {
    dispatch(addCustodianToStudy(studyId, [newEmail]));
  }

  removeUser(dispatch, studyId, removeableEmail) {
    dispatch(removeCustodianFromStudy(studyId, removeableEmail));
  }

  render() {
    const { classes, dispatch, study, studyPolicies } = this.props;
    const studyCustodiansObj = studyPolicies.find(policy => policy.name === 'custodian');
    const studyCustodians = (studyCustodiansObj && studyCustodiansObj.members) || [];
    return (
      <div className={classes.wrapper}>
        <div className={classes.width}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item zeroMinWidth xs={9}>
              <Typography noWrap className={classes.title}>
                {study.name}
              </Typography>
              <Typography>{study.description}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Card className={classes.card}>
                {study && study.createdDate && (
                  <div>
                    <div className={classes.header}> Date Created: </div>
                    <div className={classes.values}> {moment(study.createdDate).fromNow()} </div>
                  </div>
                )}
                {studyCustodians.length > 0 ? (
                  <div>
                    <div className={classes.header}>Custodians: </div>
                    <div className={classes.values}>
                      {studyCustodians.map(custodian => (
                        <div key={custodian}>{custodian}</div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div />
                )}
                <div>
                  {study && study.id && (
                    <ManageUsersModal
                      addUser={_.partial(this.addUser, dispatch, study.id)}
                      dispatch={dispatch}
                      removeUser={_.partial(this.removeUser, dispatch, study.id)}
                      modalText="Manage Custodians"
                      readers={studyCustodians}
                    />
                  )}
                </div>
              </Card>
            </Grid>
          </Grid>
          {study && study.schema && <StudyTablePreview study={study} />}
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    study: state.studies.study,
    studyPolicies: state.studies.studyPolicies,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(StudyDetailView));
