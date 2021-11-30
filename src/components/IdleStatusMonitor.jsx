import _ from 'lodash/fp';
// import * as qs from 'qs';
import React, { useEffect, useState } from 'react';
// import ButtonBar from 'src/components/ButtonBar'; // stub
// import Modal from 'src/components/Modal'; // stub
// import { getUser } from 'src/libs/auth'; // stub
// import colors from 'src/libs/colors'; // stub
// import * as Nav from 'src/libs/nav';
import { authStore, lastActiveTimeStore } from 'libs/state'; // stub
import * as Utils from 'libs/utils';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const displayRemainingTime = (remainingSeconds) =>
  _.join(':', [
    `${Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, '0')}`,
    `${Math.floor(remainingSeconds % 60)
      .toString()
      .padStart(2, '0')}`,
  ]);

const getUser = () => ({});
const setLastActive = (lastActive) => lastActiveTimeStore.update(_.set(getUser().id, lastActive));
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

const Modal = ({ children }) => <div>{children}</div>;
Modal.propTypes = {
  children: PropTypes.any,
};

const ButtonBar = () => <div>'Buttons'</div>;

const IdleStatusMonitor = ({
  timeout = Utils.durationToMillis({ minutes: 15 }),
  countdownStart = Utils.durationToMillis({ minutes: 14, seconds: 55 }),
  user = {},
}) => {
  // State
  const [signOutRequired, setSignOutRequired] = useState(false);

  const {
    isAuthenticated = user.isAuthenticated,
    isTimeoutEnabled = user.isTimeoutEnabled,
    user: { id },
  } = Utils.useStore(authStore);
  // const { query } = Nav.useRoute();
  const query = {};

  // Helpers
  const doSignOut = () => {
    setLastActive();
    // Nav.history.replace({ search: qs.stringify(_.set(['sessionExpired'], true, qs.parse(query))) });
    window.gapi.auth2.getAuthInstance().disconnect();
    setSignOutRequired(true);
  };

  const reloadSoon = () =>
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  // Render
  return Utils.cond(
    [
      isAuthenticated && isTimeoutEnabled,
      () => (
        <InactivityTimer
          id={id}
          timeout={timeout}
          countdownStart={countdownStart}
          doSignOut={doSignOut}
        />
      ),
    ],
    // [
    //   signOutRequired,
    //   () => (
    //     <iframe
    //       title="logout"
    //       onLoad={reloadSoon}
    //       style={{ display: 'none' }}
    //       src="https://www.google.com/accounts/Logout"
    //     />
    //   ),
    // ],
    [
      query?.sessionExpired && !isAuthenticated,
      // Navigate onDismiss
      // onDismiss={() => Nav.history.replace({ search: qs.stringify(_.unset(['sessionExpired'], qs.parse(query))), })>
      () => (
        <Modal title="Session Expired" showCancel={false}>
          'Your session has expired to maintain security and protect clinical data']
        </Modal>
      ),
    ],
    () => null,
  );
};

const CountdownModal = ({ onCancel, countdown }) => (
  <Dialog onDismiss={() => null} showButtons={false} open={true}>
    <DialogTitle>
      "Your session is about to expire!"
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        To maintain security and protect clinical data, you will be logged out in
      </DialogContentText>
      <div
        style={{
          transform: 'translateY(5rem)',
          whiteSpace: 'pre',
          textAlign: 'center',
          color: 'black', // style
          fontSize: '4rem',
        }}
      >
        {displayRemainingTime(countdown / 1000)}
      </div>
      <DialogContentText>
        You can extend your session to continue working
      </DialogContentText>
      <ButtonBar
        style={{
          marginTop: '1rem',
          display: 'flex',
          alignItem: 'baseline',
          justifyContent: 'flex-end',
        }}
        okText="Extend Session"
        cancelText="Log Out"
        onCancel={onCancel}
      />
    </DialogContent>
  </Dialog>
);

CountdownModal.propTypes = {
  countdown: PropTypes.number,
  onCancel: PropTypes.func,
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
    const updateLastActive = () => setLastActive(Date.now());

    if (!lastRecordedActivity) {
      setLastActive(Date.now());
    }

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

  return showCountdown && <CountdownModal onCancel={doSignOut} countdown={countdown} />;
};

InactivityTimer.propTypes = {
  countdownStart: PropTypes.number,
  doSignOut: PropTypes.func,
  id: PropTypes.string,
  timeout: PropTypes.number,
};

export default IdleStatusMonitor;
