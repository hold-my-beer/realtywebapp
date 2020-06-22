import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getFavorites } from '../../actions/proposal';

import Spinner from '../layout/Spinner';
import ProposalItem from './ProposalItem';

const MyFavorites = ({
  getFavorites,
  proposal: { proposals, loading },
  history
}) => {
  useEffect(() => {
    getFavorites();
  }, [getFavorites]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <button className="btn btn-light" onClick={history.goBack}>
            Назад
          </button>
          <h1 className="text-primary my-1">Мое избранное</h1>
          {proposals.length === 0 ? (
            <p className="lead">У вас нет избранных предложений</p>
          ) : (
            <Fragment>
              <p className="lead">Ваши избранные предложения</p>
              <div className="proposal-cards">
                {proposals.map(proposal => (
                  <ProposalItem key={proposal._id} proposal={proposal} />
                ))}
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

MyFavorites.propTypes = {
  getFavorites: PropTypes.func.isRequired,
  proposal: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  proposal: state.proposal
});

export default connect(mapStateToProps, { getFavorites })(
  withRouter(MyFavorites)
);
