import React from 'react';
import _ from 'lodash';
import { WithStyles, withStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CustomTheme, IconButton } from '@mui/material';
import { Close, Error } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { urlEncodeParams } from 'libs/utilsTs';
import { connect } from 'react-redux';
import { TdrState } from 'reducers';
import { RouterLocation, RouterRootState } from 'connected-react-router';
import { LocationState } from 'history';
import { Property } from 'csstype';

const styles = (theme: CustomTheme) => ({
  card: {
    borderRadius: 5,
    backgroundColor: '#fbebe8' /* calculated from rgba(219,50,20,0.1) over a white background */,
    width: '100%',
    cursor: 'default',
  },
  content: {
    display: 'flex',
  },
  cardBody: {
    display: 'flex',
    width: '100%',
  },
  textContainer: {
    position: 'relative' as Property.Position,
    flex: 1,
  },
  text: {
    alignSelf: 'center',
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: 600,
    padding: `0 40px 0 ${theme.spacing(2)}`,
    overflowY: 'auto' as Property.OverflowY,
    maxHeight: 300,
  },
  icon: {
    fill: theme.palette.error.main,
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
  closeButton: {
    position: 'absolute' as Property.Position,
    top: 0,
    right: 12,
    ...theme.mixins.jadeLink,
    width: 24,
    height: 24,
    marginLeft: theme.spacing(2),
  },
  jobLinkContainer: {
    backgroundColor: theme.palette.primary.light,
    color: theme.typography.color,
    padding: '0 24px !important',
    border: `1px solid ${theme.palette.error.main}`,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  detailLink: {
    paddingTop: theme.spacing(2),
  },
  jadeLink: {
    ...theme.mixins.jadeLink,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'underline',
  },
});

interface IProps extends WithStyles<typeof styles> {
  errorMsg?: string;
  status?: string;
  jobId?: string;
  onDismiss: () => void;
  location: RouterLocation<LocationState>;
}

const Toast = withStyles(styles)(
  ({ classes, errorMsg, status, jobId, onDismiss, location }: IProps) => {
    let errString;
    if (status && errorMsg) {
      errString = `Error ${status}: ${errorMsg}`;
    } else if (errorMsg) {
      errString = errorMsg;
    } else {
      errString = 'An error occurred, please try again or submit a bug report';
    }

    let jobInfoUrl = '';
    if (jobId) {
      const params = _.clone(location.query || {});
      params.expandedJob = jobId;
      jobInfoUrl = `?${urlEncodeParams({ expandedJob: jobId })}`;
    }

    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <div className={classes.cardBody}>
            <Error className={classes.icon} />
            <div className={classes.textContainer}>
              <div className={classes.text}>
                {errString}
                {jobId && (
                  <div className={classes.detailLink}>
                    <Link to={jobInfoUrl} onClick={onDismiss}>
                      <span className={classes.jadeLink}>View details</span>
                    </Link>
                  </div>
                )}
              </div>
              <IconButton aria-label="Close" className={classes.closeButton} onClick={onDismiss}>
                <Close fontSize="small" />
              </IconButton>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

function mapStateToProps(state: TdrState & RouterRootState) {
  return {
    location: state.router.location,
  };
}

export default connect(mapStateToProps)(Toast);
