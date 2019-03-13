import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import { createDataset } from 'actions/index';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 4,
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

export class DatasetPreviewView extends React.PureComponent {
  static propTypes = {
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dataset, dispatch } = this.props;
    const payload = {
      name: dataset.name,
      description: dataset.description,
      contents: [
        {
          source: {
            studyName: dataset.study,
            assetName: dataset.asset,
          },
          rootValues: dataset.ids,
        },
      ],
    };
    dispatch(createDataset(payload));
  }

  render() {
    const { classes, dataset } = this.props;
    // TODO when the job is completed -- what happens?
    // what happens if you got to this page and we havent loaded data properly?
    // what if it fails vs succeeds

    return (
      <div>
        <div className={classes.title} >Preview Dataset</div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.
          Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales
          pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci,
          sed rhoncus pronin sapien nunc accuan eget.
        </p>
        <div className={classes.container} >
          <div className={classes.card}>
            <div className={classes.header} >Dataset Name: </div>
            <div className={classes.values} > { dataset.name } </div>
            <div className={classes.header} >Description: </div>
            <div className={classes.values} > { dataset.description } </div>
          </div>
          <Card className={classes.card}>
            <div className={classes.header} > Custodian(s): </div>
            <div className={classes.values} > { dataset.readers } </div>
            <div className={classes.header} > Access: </div>
            <div className={classes.values} > { dataset.readers } </div>
          </Card>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    dataset: state.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetPreviewView));
