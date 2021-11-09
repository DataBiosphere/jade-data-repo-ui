import React from 'react';
import Toast from 'components/Toast';
import { store } from 'react-notifications-component';
import _ from 'lodash';

export function showNotification(err) {
  let message;
  let status;
  if (err.response) {
    const errDetail = _.get(err.response, 'data.errorDetail');
    status = String(err.response.status);
    if (_.isEmpty(errDetail)) {
      message = _.get(err.response, 'data.message');
    } else {
      message = String(errDetail);
    }
  }

  store.addNotification({
    content: <Toast errorMsg={message} status={status} />,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__slideInRight'],
    animationOut: ['animate__animated', 'animate__slideOutRight'],
    dismiss: {
      duration: 5000,
      touch: false,
      pauseOnHover: true,
    },
  });
}
