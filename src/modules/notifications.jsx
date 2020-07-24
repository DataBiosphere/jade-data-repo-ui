import React from 'react';
import Toast from 'components/Toast';
import { store } from 'react-notifications-component';

export function showNotification(err) {
  store.addNotification({
    content: <Toast errorMsg={err && err.toString()} />,
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
