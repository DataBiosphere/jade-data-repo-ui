import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { createDataset } from 'actions/index';

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
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing.unit * 4,
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
  state = {
    open: false,
  };

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

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, createdDataset, dataset } = this.props;
    const { open } = this.state;
    return (
      <div id="dataset-preview" className={classes.wrapper}>
        <div className={classes.width}>
          {createdDataset.id && createdDataset.name === dataset.name ? (
            <div>
              <div className={classes.title}>Created Dataset</div>
              <p>Your new dataset has been created!</p>

              <Dialog
                onClose={this.handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth={false}
              >
                <DialogTitle className={classes.dialogTitle} id="customized-dialog-title">
                  <div className={classes.closetitle}>Where to Next?</div>
                  <div>
                    <IconButton
                      aria-label="Close"
                      onClick={this.handleClose}
                      className={classes.closeButton}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </DialogTitle>
                <DialogContent>
                  <div className={classes.dialogContent}>
                    The new dataset {createdDataset.name} has been created. What would you like to
                    do next?
                  </div>
                  <div className={classes.dialogActions}>
                    <Button color="primary" variant="contained">
                      <Link to={`/datasets/${createdDataset.id}`} className={classes.actionButtons}>
                        View new dataset
                      </Link>
                    </Button>
                    <Button color="primary" variant="contained">
                      <Link to="/datasets" className={classes.actionButtons}>
                        View all datasets
                      </Link>
                    </Button>
                    <Button color="primary" variant="contained">
                      <Link to="/datasets/create" className={classes.actionButtons}>
                        Create another dataset
                      </Link>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

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
                  <Link to={`/datasets/${createdDataset.id}`}>{dataset.name}</Link>
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
