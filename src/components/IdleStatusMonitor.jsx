import _ from 'lodash/fp';
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
const displayRemainingTime = (remainingSeconds) =>
  _.join(':', [
    `${Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, '0')}`,
    `${Math.floor(remainingSeconds % 60)
      .toString()
      .padStart(2, '0')}`,
  ]);

// The lastActiveTimeStore syncs with localstorage and stores the time of the last known activity
const setLastActive = (userId, lastActive) => lastActiveTimeStore.update(_.set(userId, lastActive));

// Computes the countdown, expiry and whether the countdown needs to be shown
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

// Components
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
        {/* For this specific dialog, we need to use a mousedown to handle the log out before the timeout is reset */}
        <Button onMouseDown={onSignOut}>Log Out</Button>
      </div>
    </DialogContent>
  </Dialog>
));

CountdownModal.propTypes = {
  countdown: PropTypes.number,
  onSignOut: PropTypes.func,
};

const InactivityTimer = ({ id, timeout, countdownStart, onSignOut }) => {
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

    // Listen on the capture phase of the event, otherwise the order of events in a deliberate log out will be incorrect.
    // Without capture, if the user manually logs out, the last updated time will be recorded after the click to logout
    // resulting in a last active time getting set in local storage.
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
      onSignOut();
    }
  }, [onSignOut, timedOut]);

  return showCountdown && <CountdownModal onSignOut={onSignOut} countdown={countdown} />;
};

InactivityTimer.propTypes = {
  countdownStart: PropTypes.number,
  id: PropTypes.string,
  onSignOut: PropTypes.func,
  timeout: PropTypes.number,
};

export const LogoutIframe = ({ id, dismissLogout }) => (
  <iframe
    title="logout"
    style={{ display: 'none' }}
    src="https://www.google.com/accounts/Logout"
    onLoad={() => {
      setLastActive(id);
      dismissLogout();
    }}
  />
);

LogoutIframe.propTypes = {
  dismissLogout: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export const IdleStatusMonitor = ({
  timeout = Utils.durationToMillis({ minutes: 15 }),
  countdownStart = Utils.durationToMillis({ minutes: 3 }),
  user = {},
  signOut,
}) => {
  // State
  const [signOutRequired, setSignOutRequired] = useState(false);

  const { isAuthenticated, isTimeoutEnabled, id } = user;

  // Render
  return Utils.cond(
    [
      id && isAuthenticated && isTimeoutEnabled,
      () => (
        <InactivityTimer
          id={id}
          timeout={timeout}
          countdownStart={countdownStart}
          onSignOut={() => {
            setLastActive(id);
            signOut();
            setSignOutRequired(true);
          }}
        />
      ),
    ],
    [
      signOutRequired,
      () => <LogoutIframe id={id} dismissLogout={() => setSignOutRequired(false)} />,
    ],
    () => null,
  );
};
