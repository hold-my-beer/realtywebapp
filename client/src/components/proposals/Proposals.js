import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';
import ProposalItem from './ProposalItem';

const Proposals = ({ proposal: { proposals, loading }, history }) => {
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <button className="btn btn-light" onClick={history.goBack}>
            Назад
          </button>
          <h1 className="text-primary my-1">Предложения по вашему запросу</h1>
          {proposals.length === 0 ? (
            <p className="lead">
              Нет предложений, удовлетворяющих заданным вами параметрам
            </p>
          ) : (
            <Fragment>
              <p className="lead">
                Предложения, удовлетворяющие заданным вами параметрам
              </p>
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

Proposals.propTypes = {
  proposal: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  proposal: state.proposal
});

export default connect(mapStateToProps)(withRouter(Proposals));
