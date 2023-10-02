import React from 'react';
import { Route } from 'react-router-dom';
import WelcomeView from './WelcomeView';

interface IProps {
  component: React.ComponentType<any>;
  features: Array<string> | undefined;
  isAuthenticated: boolean;
  to: React.ComponentType<any>;
}

function RoutePrivate({
  component: Component,
  features,
  isAuthenticated,
  to: UnauthedComponent = WelcomeView,
  ...rest
}: IProps) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} features={features} />
        ) : (
          <UnauthedComponent {...props} />
        )
      }
    />
  );
}

export default RoutePrivate;
