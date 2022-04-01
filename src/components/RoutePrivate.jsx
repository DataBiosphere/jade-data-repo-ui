import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

function RoutePrivate({ component: Component, features, isAuthenticated, to, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} features={features} />
        ) : (
          <Redirect
            to={{
              pathname: to,
              state: { redirect: props.location.pathname, isAuthenticated },
            }}
          />
        )
      }
    />
  );
}

RoutePrivate.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  features: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  location: PropTypes.object,
  to: PropTypes.string,
};

RoutePrivate.defaultProps = {
  to: '/login',
};

export default RoutePrivate;
