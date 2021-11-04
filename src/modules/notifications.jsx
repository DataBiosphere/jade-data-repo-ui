import React from 'react';
import Toast from 'components/Toast';
import { store } from 'react-notifications-component';
import _ from 'lodash';

export function showNotification(err) {
  let message;
  const errDetail = _.get(err, 'data.errorDetail');
  if (_.isUndefined(errDetail) || _.isEmpty(errDetail)) {
    message = _.get(err, 'data.message');
  } else {
    message = errDetail;
  }

  store.addNotification({
    content: <Toast errorMsg={message} status={err.status} />,
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
