import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, Paper, Typography, DialogContentText, Button, Grid, ListItem } from '@material-ui/core';
import { CameraAlt, Edit, PeopleAlt, OpenInNew, Today } from '@material-ui/icons';

const styles = theme => ({
  snapshotName: {
    backgroundColor: '#F1F4F7',
    borderRadius: '4px 4px 0px 0px',
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  snapshotDetails: {
    padding: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  actions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
  },
  listItem: {
    listStyleType: 'none',
    marginBottom: theme.spacing(1),
  },
  bodyText: {
    paddingBottom: theme.spacing(2),
  },
  date: {
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(0, 0, 0, 0.54)',
    textTransform: 'uppercase',
  },
});

export class SnapshotPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    filterData: PropTypes.object,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, dataset, filterData } = this.props;
    const { open } = this.state;

    // const listFilters = _.keys(filterData).map(filter => {
    //   const data = _.get(filterData, filter);
    //   let dataString = data.value;
    //   if (data.type === 'range') {
    //     dataString = _.join(data.value, ' \u2013 ');
    //   } else {
    //     if (_.isPlainObject(data.value)) {
    //       dataString = _.keys(data.value);
    //     }
    //     dataString = _.join(dataString, ', ');
    //   }

    //   return (
    //     <Typography variant='body'><strong>{filter}:</strong> {dataString}</Typography>
    //   );
    // });

    return (
      <div>
        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle>
            <Typography variant='h5'>Your data snapshot has been created</Typography>
          </DialogTitle>
          <DialogContent>
            <Paper variant='outlined'>
              <div className={classes.snapshotName}>
                <CameraAlt className={classes.icon} />
                <Typography variant='h6'>V2F Snapshot</Typography>
              </div>
              <div className={classes.snapshotDetails}>
              <Typography variant='subtitle1' color='primary'>Properties</Typography>
              <div className={classes.bodyText}>
                <li className={classes.listItem}><strong>ancestry: </strong>AA, EU, Mixed</li>
                <li className={classes.listItem}><strong>phenotype: </strong>CHOL, K</li>
                <li className={classes.listItem}><strong>p value: </strong>0.49 {'\u2013'} 0.68</li>
              </div>
              <Typography variant='subtitle1' color='primary'>Sources</Typography>
              <div className={classes.bodyText}>
                <li className={classes.listItem}>V2F GWAS Summary Stats</li>
              </div>
              <div className={classes.date}>
                <Today className={classes.icon} />Jan 15, 2020
              </div>
              </div>
            </Paper>
            <div className={classes.actions}>
              <Button className={classes.icon} color='primary'><Edit className={classes.icon} />Edit</Button>
              <Button className={classes.icon} color='primary'><PeopleAlt className={classes.icon} />Share</Button>
              <Button className={classes.icon} color='primary'><OpenInNew className={classes.icon} />Export</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    filterData: state.query.filterData,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotPopup));
