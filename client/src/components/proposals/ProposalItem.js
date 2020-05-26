import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import NumberFormat from 'react-number-format';
import defaultHouse from '../../img/defaultHouse.png';

const ProposalItem = ({
  proposal: {
    _id,
    roomsNumber,
    address: { shortAddressLine },
    proposalPhotos,
    price
  }
}) => {
  return (
    <div className="proposal-card">
      <div className="proposal-card-header">
        <h3 className="text-primary">
          <span>{roomsNumber}</span> комнатная квартира
        </h3>
        <h4 className="my">{shortAddressLine}</h4>
      </div>
      <div className="proposal-card-content">
        <div className="proposal-card-photo">
          <img
            src={
              proposalPhotos.length > 0
                ? proposalPhotos[0].photoURL
                : defaultHouse
            }
            alt=""
          />
        </div>
        <h3 className="text-primary">
          <NumberFormat
            value={price}
            displayType={'text'}
            thousandSeparator={' '}
          />{' '}
          руб.
        </h3>
        <Link to={`/proposals/${_id}`} className="btn btn-block btn-primary">
          Перейти к предложению
        </Link>
      </div>
    </div>
  );
};

ProposalItem.propTypes = {
  proposal: PropTypes.object.isRequired
};

export default ProposalItem;
