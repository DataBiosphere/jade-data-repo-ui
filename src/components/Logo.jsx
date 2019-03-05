import React from 'react';

import Icon from 'assets/media/images/white-jade.png';



const styles = theme => ({
  logoStyles: {
    alignItems: 'flex-start',
    display: 'inline-flex',
    height: '41px',
    width: '41px',
  },
  titleStyles: {
    bottom: '12px',
    color: '#fff',
    fontSize: '21px',
    fontWeight: '500',
    left: '4px',
    position: 'relative',
  },
});


export const logoStyles = {
  alignItems: 'flex-start',
  display: 'inline-flex',
  height: '41px',
  width: '41px',
};

const titleStyles = {
  bottom: '12px',
  color: '#fff',
  fontSize: '21px',
  fontWeight: '500',
  left: '4px',
  position: 'relative',
};

export default () => (
  <div>
    <img src={Icon} style={logoStyles} alt="logo" />
    <span style={titleStyles}>Jade Data Repository</span>
  </div>
);
