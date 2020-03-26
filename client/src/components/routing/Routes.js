import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Alert from '../layout/Alert';
import Login from '../auth/Login';

const Routes = () => {
  return (
    <div className="container">
      <Alert />
      <Switch>
        <Route path="/login" component={Login} />
      </Switch>
    </div>
  );
};

export default Routes;
