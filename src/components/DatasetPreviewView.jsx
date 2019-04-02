import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import LinearProgress from '@material-ui/core/LinearProgress';

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
  },
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  values: {
    paddingBottom: theme.spacing.unit * 3,
  },
  query: {
    flexGrow: 1,
    paddingBottom: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 8,
  },
});

export class DatasetPreviewView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    createdDataset: PropTypes.object,
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
    const { classes, createdDataset, dataset } = this.props;
    // TODO when the job is completed -- what happens?
    // what happens if you got to this page and we havent loaded data properly?
    // what if it fails vs succeeds
    return (
      <div>
        {createdDataset.id && createdDataset.name === dataset.name ? (
          <div>
            <div className={classes.title}>Created Dataset</div>
            <p>Your new dataset has been created!</p>
            <div className={classes.query}>
              <LinearProgress variant="determinate" value={100} />
            </div>
          </div>
        ) : (
          <div>
            <div className={classes.title}>Create Dataset</div>
            <p>Your new dataset is being created.</p>
            <div className={classes.query}>
              <LinearProgress variant="query" />
            </div>
          </div>
        )}
        <div className={classes.container}>
          <div className={classes.card}>
            <div className={classes.header}> Dataset Name: </div>
            {createdDataset.id && createdDataset.name === dataset.name ? (
              <div className={classes.values}>
                <Link to={`/dataset/${createdDataset.id}`}>{dataset.name}</Link>
              </div>
            ) : (
              <div className={classes.values}>{dataset.name}</div>
            )}
            <div className={classes.header}> Description: </div>
            <div className={classes.values}> {dataset.description} </div>
          </div>
          <Card className={classes.card}>
            <div className={classes.header}> Custodian(s): </div>
            <div className={classes.values}> {dataset.readers} </div>
            <div className={classes.header}> Access: </div>
            <div className={classes.values}> {dataset.readers} </div>
          </Card>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    createdDataset: state.datasets.createdDataset,
    dataset: state.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetPreviewView));
