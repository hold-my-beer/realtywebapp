import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import NumberFormat from 'react-number-format';
// import defaultHouse from '../../img/defaultHouse.png';

const SearchItem = ({
  search: {
    _id,
    name,
    dealType,
    locality,
    priceFrom,
    priceTo,
    roomsNumberFrom,
    roomsNumberTo
  }
}) => {
  return (
    <div className="search-card">
      <div className="search-card-header">
        <h3 className="text-primary">{name}</h3>
        <h4>
          {dealType === 'Продажа' ? <span>Купить </span> : <span>Снять </span>}
          квартиру
        </h4>
      </div>
      <div className="search-card-content">
        {/* <div className="search-card-photo">
          <img src={defaultHouse} alt="" />
        </div> */}
        <p>
          <strong>Населенный пункт: </strong>
          {locality}
        </p>
        <p>
          <strong>Цена: </strong>
          {priceFrom === '' && priceTo === '' ? (
            <span>любая</span>
          ) : (
            <span>
              от{' '}
              <span>
                <NumberFormat
                  value={priceFrom}
                  displayType={'text'}
                  thousandSeparator={' '}
                />{' '}
              </span>{' '}
              до{' '}
              <span>
                <NumberFormat
                  value={priceTo}
                  displayType={'text'}
                  thousandSeparator={' '}
                />{' '}
              </span>{' '}
              рублей
            </span>
          )}
        </p>
        <p>
          <strong>Количество комнат: </strong>
          {roomsNumberFrom === 1 && roomsNumberTo === 100 ? (
            <span>любое</span>
          ) : (
            <span>
              от {roomsNumberFrom} до {roomsNumberTo} комнат
            </span>
          )}
        </p>
        <Link to={`/searches/${_id}`} className="btn btn-block btn-primary">
          Перейти к поиску
        </Link>
      </div>
    </div>
  );
};

SearchItem.propTypes = {
  search: PropTypes.object.isRequired
};

export default SearchItem;
