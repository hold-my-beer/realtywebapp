import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Showcase from './components/layout/Showcase';
import Login from './components/auth/Login';

import { loadUser } from './actions/auth';

import './App.css';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/showcase" component={Showcase} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
