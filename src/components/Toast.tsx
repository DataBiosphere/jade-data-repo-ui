import React from 'react';
import { WithStyles, withStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CustomTheme } from '@mui/material';

import { Error } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const styles = (theme: CustomTheme) => ({
  card: {
    borderRadius: 5,
    backgroundColor: theme.palette.error.main,
    boxShadow: `-${theme.spacing(1)} 0 0 0 ${theme.palette.error.dark}`,
    color: theme.palette.primary.contrastText,
    width: '100%',
  },
  content: {
    display: 'flex',
  },
  cardBody: {
    display: 'flex',
  },
  text: {
    alignSelf: 'center',
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: 600,
    padding: `0 0 0 ${theme.spacing(2)}`,
  },
  icon: {
    fill: theme.palette.primary.contrastText,
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
  jobLinkContainer: {
    backgroundColor: theme.palette.primary.light,
    color: theme.typography.color,
    padding: '0 24px !important',
    border: `1px solid ${theme.palette.error.main}`,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
});

interface IProps extends WithStyles<typeof styles> {
  errorMsg?: string;
  status?: string;
  jobId?: string;
}

const Toast = withStyles(styles)(({ classes, errorMsg, status, jobId }: IProps) => {
  let errString;
  if (status && errorMsg) {
    errString = `Error ${status}: ${errorMsg}`;
  } else if (errorMsg) {
    errString = errorMsg;
  } else {
    errString = 'An error occurred, please try again or submit a bug report';
  }

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <div className={classes.cardBody}>
          <Error className={classes.icon} />
          <div className={classes.text}>{errString}</div>
        </div>
      </CardContent>
      {jobId && (
        <CardContent className={classes.jobLinkContainer}>
          <Link to={`/activity?expandedJob=${jobId}`}>Click to view details</Link>
        </CardContent>
      )}
    </Card>
  );
});

export default Toast;
