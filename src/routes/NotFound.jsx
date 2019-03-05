import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div key="404">
    <h1>404</h1>
    <Link to="/">
      <h2>go home</h2>
    </Link>
  </div>
);

export default NotFound;
