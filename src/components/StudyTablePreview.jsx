import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';

import { getStudyTablePreview } from 'actions/index';

const styles = theme => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
});

export class StudyTablePreview extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTable: props.study.schema.tables[0].name,
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    study: PropTypes.object,
  };

  componentDidMount() {
    this.loadPreview();
  }

  loadPreview() {
    const { dispatch, study } = this.props;
    const { currentTable } = this.state;
    dispatch(getStudyTablePreview(study, currentTable));
  }

  render() {
    const { classes, study } = this.props;
    return <div className={classes.title}>Hello {study.name}</div>;
  }
}

function mapStateToProps(state) {
  return {
    study: state.studies.study,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(StudyTablePreview));
