import React from 'react';
import AddSVG from '../../../assets/media/icons/plus-circle-solid.svg';

export default React.forwardRef((props, ref) => (
  <span ref={ref}>
    <AddSVG {...props} />
  </span>
));
