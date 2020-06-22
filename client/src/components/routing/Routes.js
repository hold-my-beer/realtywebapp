import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import Alert from '../layout/Alert';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Profile from '../profile/Profile';
import EditProfile from '../profile/EditProfile';
import CreateProposal from '../proposal-forms/CreateProposal';
import EditProposal from '../proposal-forms/EditProposal';
import Proposal from '../proposal/Proposal';
import MyProposals from '../proposals/MyProposals';
import Proposals from '../proposals/Proposals';
import MyFavorites from '../proposals/MyFavorites';
import CreateSearch from '../search-forms/CreateSearch';
import MySearches from '../search/MySearches';
import Search from '../search/Search';
import EditSearch from '../search-forms/EditSearch';
import SellerProfile from '../profile/SellerProfile';

const Routes = () => {
  return (
    <div className="container">
      <Alert />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/proposals/:id" component={Proposal} />
        <Route exact path="/proposals" component={Proposals} />
        <Route exact path="/create-search" component={CreateSearch} />
        <Route exact path="/profile/:userId" component={SellerProfile} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        <PrivateRoute
          exact
          path="/create-proposal"
          component={CreateProposal}
        />
        <PrivateRoute
          exact
          path="/edit-proposal/:id"
          component={EditProposal}
        />
        <PrivateRoute exact path="/my-proposals" component={MyProposals} />
        <PrivateRoute exact path="/my-favorites" component={MyFavorites} />
        <PrivateRoute exact path="/my-searches" component={MySearches} />
        <PrivateRoute exact path="/searches/:id" component={Search} />
        <PrivateRoute exact path="/edit-search/:id" component={EditSearch} />
      </Switch>
    </div>
  );
};

export default Routes;
