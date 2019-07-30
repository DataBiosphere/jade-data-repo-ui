import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  getStudyById,
  getStudyPolicy,
  addCustodianToStudy,
  removeCustodianFromStudy,
} from 'actions/index';
import DetailViewHeader from './DetailViewHeader';
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

  addUser = newEmail => {
    const { dispatch, study } = this.props;
    dispatch(addCustodianToStudy(study.id, [newEmail]));
  };

  removeUser = removeableEmail => {
    const { dispatch, study } = this.props;
    dispatch(removeCustodianFromStudy(study.id, removeableEmail));
  };

  render() {
    const { classes, study, studyPolicies } = this.props;
    const studyCustodiansObj = studyPolicies.find(policy => policy.name === 'custodian');
    const studyCustodians = (studyCustodiansObj && studyCustodiansObj.members) || [];
    return (
      <div className={classes.wrapper}>
        <div className={classes.width}>
          <DetailViewHeader
            of={study}
            custodians={studyCustodians}
            addUser={this.addUser}
            removeUser={this.removeUser}
          />
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
