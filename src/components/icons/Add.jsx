import React from 'react';
import { ReactComponent as AddSVG } from '../../media/icons/plus-circle-solid.svg';

export default React.forwardRef((props, ref) => (
  <span ref={ref}>
    <AddSVG {...props} />
  </span>
));
