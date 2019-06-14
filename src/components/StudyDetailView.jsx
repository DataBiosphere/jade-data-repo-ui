import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import {
  getStudyById,
  getStudyPolicy,
  addCustodianToStudy,
  removeCustodianFromStudy,
} from 'actions/index';
import ManageUsersModal from './ManageUsersModal';

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
          <div className={classes.container}>
            <div>
              <div className={classes.title}>{study.name}</div>
              <div>{study.description}</div>
            </div>
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
    studyPolicies: state.studies.studyPolicies,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(StudyDetailView));
