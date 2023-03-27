import React from 'react';
import Toast from 'components/Toast';
import { Store } from 'react-notifications-component';
import _ from 'lodash';

// Even though we join this type with any, I'm leaving it here to describe what this method can expect
export interface NotificationError {
  response?: {
    status: number;
    data?: {
      error?: {
        errDetail?: unknown;
        message?: string;
      };
      message?: string;
    };
  };
}

/**
 * Calculate an id using the content of a notification (base64 encoded the values).
 * This makes sure that notifications with duplicated all values don't display
 * (e.g. only a single one is shown)
 */
const makeNotificationId = (errorMessage?: string, status?: string, jobId?: string) =>
  `${errorMessage}#${status}#${jobId}`;

export function showNotification(err: any | NotificationError, jobId?: string) {
  let message;
  let status;
  if (err.response) {
    const errDetail = _.get(err.response, 'data.errorDetail');
    status = String(err.response.status);
    if (_.isEmpty(errDetail)) {
      message = _.get(err.response, 'data.message') ?? _.get(err.response, 'data.error.message');
    } else if (_.isArray(errDetail)) {
      message = errDetail.join(' ');
    } else {
      message = String(errDetail);
    }
  }

  const notificationId = Store.addNotification({
    id: makeNotificationId(message, status, jobId),
    content: (
      <Toast
        errorMsg={message}
        status={status}
        jobId={jobId}
        onDismiss={() => Store.removeNotification(notificationId)}
      />
    ),
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__slideInRight'],
    animationOut: ['animate__animated', 'animate__slideOutRight'],
    width: 500,
    dismiss: {
      duration: 0,
      click: false,
      touch: false,
    },
  });
}
