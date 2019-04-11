import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import LinearProgress from '@material-ui/core/LinearProgress';

import { createDataset } from 'actions/index';
import DatasetDirectionalModal from './DatasetDirectionalModal';

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
    paddingTop: theme.spacing.unit * 4,
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 8,
  },
  info: {
    display: 'inline-block',
    paddingTop: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 2,
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing.unit * 4,
    overflow: 'inherit',
  },
  header: {
    fontSize: theme.spacing.unit * 2,
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
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    margin: 0,
    padding: theme.spacing.unit * 3,
  },
  dialogContent: {
    paddingBottom: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 4,
    fontFamily: [
      'Montserrat',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: '20px',
    fontWeight: '500',
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    width: '600px',
  },
  actionButtons: {
    textDecoration: 'none',
    color: theme.palette.primary.contrastText,
  },
  closetitle: {
    display: 'inline-block',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit * 1.5,
    top: theme.spacing.unit * 2,
  },
});

export class DatasetPreviewView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    createdDataset: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    userEmail: PropTypes.string,
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
    const { classes, createdDataset, dataset, userEmail } = this.props;
    console.log(dataset.readers);
    return (
      <div id="dataset-preview" className={classes.wrapper}>
        <div className={classes.width}>
          {createdDataset.id && createdDataset.name === dataset.name ? (
            <div>
              <div className={classes.title}>Created Dataset</div>
              <p>Your new dataset has been created!</p>
              <DatasetDirectionalModal createdDataset={createdDataset} success={true} />
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
            <div className={classes.info}>
              <div className={classes.header}> Dataset Name: </div>
              {createdDataset.id && createdDataset.name === dataset.name ? (
                <div className={classes.values}>
                  <Link to={`/datasets/details/${createdDataset.id}`}>{dataset.name}</Link>
                </div>
              ) : (
                <div className={classes.values}>{dataset.name}</div>
              )}
              <div className={classes.header}> Description: </div>
              <div className={classes.values}> {dataset.description} </div>
            </div>
            <Card className={classes.card}>
              <div className={classes.header}> Custodian(s): </div>
              <div className={classes.values}> {userEmail} </div>
              <div className={classes.header}> Access: </div>
              <div className={classes.values}>
                {dataset.readers.map(reader => (
                  <div> {reader} </div>
                ))}
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
    createdDataset: state.datasets.createdDataset,
    dataset: state.dataset,
    userEmail: state.user.email,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetPreviewView));
