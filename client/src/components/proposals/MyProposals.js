import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentUserProposals } from '../../actions/proposal';

import Spinner from '../layout/Spinner';
import ProposalItem from './ProposalItem';

const MyProposals = ({
  getCurrentUserProposals,
  proposal: { proposals, loading }
}) => {
  useEffect(() => {
    getCurrentUserProposals();
  }, [getCurrentUserProposals]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="text-primary my-1">Мои предложения</h1>
          {proposals.length === 0 ? (
            <p className="lead">У вас нет созданных предложений</p>
          ) : (
            <Fragment>
              <p className="lead">Предложения, размещенные вами</p>
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

MyProposals.propTypes = {
  getCurrentUserProposals: PropTypes.func.isRequired,
  proposal: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  proposal: state.proposal
});

export default connect(mapStateToProps, { getCurrentUserProposals })(
  MyProposals
);
