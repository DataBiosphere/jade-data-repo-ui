import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import OopsISpilledMyTerra from 'media/images/terra404_mug.svg';
import { withStyles, ClassNameMap } from '@mui/styles';
import { Button, Grid, Typography } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';

const styles = (theme: CustomTheme) => ({
  pageRoot: {
    padding: '16px 24px',
    height: '75%',
  },
  h1: {
    ...theme.typography.h1,
    color: theme.typography.color,
    fontSize: '10rem',
    lineHeight: '1',
  },
  h2: {
    ...theme.typography.h1,
    color: theme.typography.color,
  },
  text: {
    ...theme.typography.body1,
    fontSize: '1.25rem',
    color: theme.typography.color,
  },
  button: {
    marginTop: '1em',
  },
  buttonText: {
    color: theme.palette.common.white,
  },
});

function NotFound(props: { classes: ClassNameMap }) {
  const { classes } = props;
  return (
    <Grid
      className={classes.pageRoot}
      container
      spacing={1}
      alignContent="center"
      alignItems="center"
    >
      <Grid style={{ textAlign: 'center' }} item xs={6}>
        <Typography className={classes.h1} variant="h1">
          404
        </Typography>
        <Typography className={classes.h2} variant="h2">
          Page Not Found
        </Typography>
        <Typography className={classes.text}>
          We're sorry, the page you requested could not be found{' '}
        </Typography>
        <Button
          className={classes.button}
          component={RouterLink}
          disableElevation
          color="primary"
          variant="contained"
          size="large"
          to="/"
        >
          <span className={classes.buttonText}>Return to Dashboard</span>
        </Button>
      </Grid>
      <Grid item xs={6}>
        <img alt="404NotFound" src={OopsISpilledMyTerra} />
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(NotFound);
