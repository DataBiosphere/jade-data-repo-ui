import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 8,
  }
});

class StudyView extends React.PureComponent {  static propTypes = {
  classes: PropTypes.object.isRequired,
};

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.title} >About Studies</div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.
          Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales
          pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci,
          sed rhoncus pronin sapien nunc accuan eget.
        </p>
        <div>
          STUDIES
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(withStyles(styles)(StudyView));

