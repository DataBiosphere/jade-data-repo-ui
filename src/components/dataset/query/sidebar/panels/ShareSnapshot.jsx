import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid, Select, TextField, MenuItem, Button, Divider } from '@material-ui/core';

const styles = theme => ({
  root: {
    padding: theme.spacing(2),
  },
  section: {
    margin: `${theme.spacing(1)}px 0px`,
  },
  input: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.spacing(0.5),
  },
  inviteButton: {
    backgroundColor: theme.palette.common.link,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.link,
    },
  },
});

const permissions = ['can read', 'can discover'];

export class ShareSnapshot extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h6" className={classes.section}>
          Share Snapshot
        </Typography>
        <Grid container spacing={2} className={classes.section}>
          <Grid item xs={7}>
            <Typography variant="subtitle2">People</Typography>
            <TextField
              variant="outlined"
              fullWidth={true}
              className={classes.input}
              placeholder="enter email address"
            ></TextField>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Permissions</Typography>
            <Select
              value={permissions[0]}
              variant="outlined"
              className={classes.input}
              fullWidth={true}
            >
              {permissions.map((permission, i) => (
                <MenuItem key={i} value={permission}>
                  {permission}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs>
            <Button variant="contained" disableElevation={true} className={classes.inviteButton}>
              Invite
            </Button>
          </Grid>
        </Grid>
        <Divider />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(withStyles(styles)(ShareSnapshot));
