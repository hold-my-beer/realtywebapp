import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Alert from '../layout/Alert';
import Login from '../auth/Login';
import Register from '../auth/Register';

const Routes = () => {
  return (
    <div className="container">
      <Alert />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </div>
  );
};

export default Routes;
