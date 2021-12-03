import _ from 'lodash/fp';
import * as qs from 'qs';
import { createBrowserHistory } from 'history';
import React, { useEffect, useState } from 'react';
import { lastActiveTimeStore } from 'libs/state'; // stub
import * as Utils from 'libs/utils';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  withStyles,
} from '@material-ui/core';

// Styles
const styles = (theme) => ({
  buttonBar: {
    marginTop: '1rem',
    display: 'flex',
    alignItem: 'baseline',
    justifyContent: 'flex-end',
  },
  timer: {
    color: theme?.palette.primary.dark,
    whiteSpace: 'pre',
    textAlign: 'center',
    fontSize: '4rem',
  },
});

// Helpers
const navHistory = createBrowserHistory();

const displayRemainingTime = (remainingSeconds) =>
  _.join(':', [
    `${Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, '0')}`,
    `${Math.floor(remainingSeconds % 60)
      .toString()
      .padStart(2, '0')}`,
  ]);

const setLastActive = (userId, lastActive) => lastActiveTimeStore.update(_.set(userId, lastActive));
const getIdleData = ({ currentTime, lastRecordedActivity, timeout, countdownStart }) => {
  const lastActiveTime = Utils.cond([!lastRecordedActivity, () => currentTime], () =>
    parseInt(lastRecordedActivity, 10),
  );
  const timeoutTime = lastActiveTime + timeout;

  return {
    timedOut: currentTime > timeoutTime,
    showCountdown: currentTime > timeoutTime - countdownStart,
    countdown: Math.max(0, timeoutTime - currentTime),
  };
};

const useHistory = () => {
  const [historyState, setHistoryState] = useState({});
  useEffect(
    () =>
      // The history listener returns a function that will stop listening
      // React will invoke the returned listener when cleaning up an effect - in this case on unmount
      navHistory.listen(({ action, location }) => {
        setHistoryState({ action, location });
      }),
    [],
  );
  return historyState;
};

// Components
const SessionExpiredModal = withStyles(styles)(({ query, classes }) => (
  <Dialog title="Session Expired" open={true}>
    <DialogTitle>Session Expired</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Your session has expired to maintain security and protect clinical data
      </DialogContentText>
      <div className={classes.buttonBar}>
        <Button
          onClick={() => {
            navHistory.replace({
              search: qs.stringify(_.unset(['sessionExpired'], true, qs.parse(query))),
            });
          }}
        >
          Ok
        </Button>
      </div>
    </DialogContent>
  </Dialog>
));

const CountdownModal = withStyles(styles)(({ classes, onSignOut, countdown }) => (
  <Dialog open={true}>
    <DialogTitle>Your session is about to expire!</DialogTitle>
    <DialogContent>
      <DialogContentText>
        To maintain security and protect clinical data, you will be logged out in
      </DialogContentText>
      <div className={classes.timer}>{displayRemainingTime(countdown / 1000)}</div>
      <DialogContentText>You can extend your session to continue working</DialogContentText>
      <div className={classes.buttonBar}>
        <Button>Extend Session</Button>
        <Button onMouseDown={onSignOut}>Log Out</Button>
      </div>
    </DialogContent>
  </Dialog>
));

CountdownModal.propTypes = {
  countdown: PropTypes.number,
  onSignOut: PropTypes.func,
};

const InactivityTimer = ({ id, timeout, countdownStart, doSignOut }) => {
  const { [id]: lastRecordedActivity } = Utils.useStore(lastActiveTimeStore) || {};
  const [currentTime, setDelay] = Utils.useCurrentTime();
  const { timedOut, showCountdown, countdown } = getIdleData({
    currentTime,
    lastRecordedActivity,
    timeout,
    countdownStart,
  });

  setDelay(showCountdown ? 1000 : Math.max(250, countdown - countdownStart));

  Utils.useOnMount(() => {
    const targetEvents = ['click', 'keydown'];
    const updateLastActive = () => setLastActive(id, Date.now());

    if (!lastRecordedActivity) {
      setLastActive(id, Date.now());
    }

    // Listen on the capture phase of the event, otherwise the order of events in a deliberate log out will be incorrect
    _.forEach((event) => document.addEventListener(event, updateLastActive, true), targetEvents);

    return () => {
      _.forEach(
        (event) => document.removeEventListener(event, updateLastActive, true),
        targetEvents,
      );
    };
  });

  useEffect(() => {
    if (timedOut) {
      doSignOut();
    }
  }, [doSignOut, timedOut]);

  return showCountdown && <CountdownModal onSignOut={doSignOut} countdown={countdown} />;
};

InactivityTimer.propTypes = {
  countdownStart: PropTypes.number,
  doSignOut: PropTypes.func,
  id: PropTypes.string,
  timeout: PropTypes.number,
};

const IdleStatusMonitor = ({
  timeout = Utils.durationToMillis({ minutes: 0, seconds: 10 }),
  countdownStart = Utils.durationToMillis({ minutes: 15, seconds: 6 }),
  user = {},
  signOut,
}) => {
  // State
  const [signOutRequired, setSignOutRequired] = useState(false);
  const { location } = useHistory();

  const {
    isAuthenticated,
    // isTimeoutEnabled = true, // user.isTimeoutEnabled,
    id,
  } = user;

  const query = location?.search;
  const isTimeoutEnabled = true;
  // Helpers
  const reloadSoon = () =>
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  // Render
  return Utils.cond(
    [
      id && isAuthenticated && isTimeoutEnabled,
      () => (
        <InactivityTimer
          id={id}
          timeout={timeout}
          countdownStart={countdownStart}
          doSignOut={() => {
            setLastActive(id);
            signOut();
            navHistory.replace({
              search: qs.stringify(_.set(['sessionExpired'], true, qs.parse(query))),
            });
            setSignOutRequired(true);
          }}
        />
      ),
    ],
    [
      signOutRequired,
      () => (
        <iframe
          title="logout"
          // onLoad={reloadSoon}
          style={{ display: 'none' }}
          src="https://www.google.com/accounts/Logout"
        />
      ),
    ],
    [query?.sessionExpired && !isAuthenticated, () => <SessionExpiredModal query={query} />],
    () => null,
  );
};

export default IdleStatusMonitor;
