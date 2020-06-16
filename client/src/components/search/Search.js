import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getSearchById, deleteSearch } from '../../actions/search';
import { getProposalsByParameters } from '../../actions/proposal';

import Spinner from '../layout/Spinner';
import NumberFormat from 'react-number-format';

const Search = ({
  getSearchById,
  deleteSearch,
  getProposalsByParameters,
  search: { search },
  match,
  history
}) => {
  const [formData, setFormData] = useState({
    name: '',
    dealType: 'Продажа',
    searchType: '',
    priceFrom: '',
    priceTo: '',
    houseYearFrom: '',
    houseYearTo: '',
    panel: '',
    block: '',
    brick: '',
    monolithic: '',
    floorsFrom: '',
    floorsTo: '',
    elevator: 'Не важно',
    floorFrom: '',
    floorTo: '',
    exceptLast: 'false',
    roomsNumberFrom: '',
    roomsNumberTo: '',
    totalAreaFrom: '',
    totalAreaTo: '',
    livingAreaFrom: '',
    livingAreaTo: '',
    kitchenAreaFrom: '',
    kitchenAreaTo: '',
    balcony: 'Не важно',
    windows: 'Не важно',
    cooker: 'Не важно',
    bathroom: 'Не важно'
  });

  const [address, setAddress] = useState({
    province: '',
    locality: '',
    metroDuration: '',
    pedestrian: false,
    addressDistricts: [],
    addressRoutes: [],
    addressMetros: []
  });

  useEffect(() => {
    getSearchById(match.params.id);
  }, [getSearchById, match.params.id]);

  useEffect(() => {
    // getSearchById(match.params.id);

    setFormData({
      name: search === null ? '' : search.name,
      dealType: search === null ? 'Продажа' : search.dealType,
      searchType: search === null ? '' : search.searchType,
      priceFrom: search === null ? '' : search.priceFrom,
      priceTo: search === null ? '' : search.priceTo,
      houseYearFrom: search === null ? '' : search.houseYearFrom,
      houseYearTo: search === null ? '' : search.houseYearTo,
      panel: search === null ? '' : search.panel,
      block: search === null ? '' : search.block,
      brick: search === null ? '' : search.brick,
      monolithic: search === null ? '' : search.monolithic,
      floorsFrom: search === null ? '' : search.floorsFrom,
      floorsTo: search === null ? '' : search.floorsTo,
      elevator: search === null ? 'Не важно' : search.elevator,
      floorFrom: search === null ? '' : search.floorFrom,
      floorTo: search === null ? '' : search.floorTo,
      exceptLast: search === null ? 'false' : search.exceptLast,
      roomsNumberFrom: search === null ? '' : search.roomsNumberFrom,
      roomsNumberTo: search === null ? '' : search.roomsNumberTo,
      totalAreaFrom: search === null ? '' : search.totalAreaFrom,
      totalAreaTo: search === null ? '' : search.totalAreaTo,
      livingAreaFrom: search === null ? '' : search.livingAreaFrom,
      livingAreaTo: search === null ? '' : search.livingAreaTo,
      kitchenAreaFrom: search === null ? '' : search.kitchenAreaFrom,
      kitchenAreaTo: search === null ? '' : search.kitchenAreaTo,
      balcony: search === null ? 'Не важно' : search.balcony,
      windows: search === null ? 'Не важно' : search.windows,
      cooker: search === null ? 'Не важно' : search.cooker,
      bathroom: search === null ? 'Не важно' : search.bathroom
    });

    setAddress({
      province: search === null ? '' : search.province,
      locality: search === null ? '' : search.locality,
      metroDuration: search === null ? '' : search.metroDuration,
      pedestrian:
        search === null || !search.pedestrian ? false : search.pedestrian,
      addressDistricts: search === null ? [] : search.addressDistricts,
      addressRoutes: search === null ? [] : search.addressRoutes,
      addressMetros: search === null ? [] : search.addressMetros
    });
  }, [search]);

  const {
    name,
    dealType,
    searchType,
    priceFrom,
    priceTo,
    houseYearFrom,
    houseYearTo,
    panel,
    block,
    brick,
    monolithic,
    floorsFrom,
    floorsTo,
    elevator,
    floorFrom,
    floorTo,
    exceptLast,
    roomsNumberFrom,
    roomsNumberTo,
    totalAreaFrom,
    totalAreaTo,
    livingAreaFrom,
    livingAreaTo,
    kitchenAreaFrom,
    kitchenAreaTo,
    balcony,
    windows,
    cooker,
    bathroom
  } = formData;

  const {
    province,
    locality,
    metroDuration,
    pedestrian,
    addressDistricts,
    addressRoutes,
    addressMetros
  } = address;

  const onSearchClick = () => {
    getProposalsByParameters(formData, address, history);
  };

  return (
    <Fragment>
      {search === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <button className="btn btn-light" onClick={history.goBack}>
            Назад
          </button>
          <h1 className="text-primary my-1">{name}</h1>
          <p className="lead">Сохраненные вами параметры поиска</p>

          <div className="parameters my-2">
            <div className="parameter-name">
              <strong>Тип сделки</strong>
            </div>
            <div className="parameter-value">{dealType}</div>
            <div className="parameter-name">
              <strong>Регион</strong>
            </div>
            <div className="parameter-value">{province}</div>
            <div className="parameter-name">
              <strong>Населенный пункт</strong>
            </div>
            <div className="parameter-value">{locality}</div>
            <div className="parameter-name">
              <strong>Тип поиска</strong>
            </div>
            <div className="parameter-value">
              {searchType === '0' ? (
                <span>Поиск по населенному пункту / району</span>
              ) : (
                <span>Поиск по линиям / станциям метро</span>
              )}
            </div>
            {searchType === '0' ? (
              <Fragment>
                <div className="parameter-name">
                  <strong>Районы</strong>
                </div>
                <ul className="parameter-value">
                  {addressDistricts.map(district => (
                    <li key={uuidv4()}>{district}</li>
                  ))}
                </ul>
              </Fragment>
            ) : (
              <Fragment>
                <div className="parameter-name">
                  <strong>Линии метро</strong>
                </div>
                <ul className="parameter-value">
                  {addressRoutes.map(route => (
                    <li key={uuidv4()}>{route}</li>
                  ))}
                </ul>
                <div className="parameter-name">
                  <strong>Станции метро</strong>
                </div>
                <ul className="parameter-value">
                  {addressMetros.map(metro => (
                    <li key={uuidv4()}>{metro}</li>
                  ))}
                </ul>
              </Fragment>
            )}
            <div className="parameter-name">
              <strong>Стоимость</strong>
            </div>
            <div className="parameter-value">
              От{' '}
              <NumberFormat
                value={priceFrom}
                displayType={'text'}
                thousandSeparator={' '}
              />{' '}
              до{' '}
              <NumberFormat
                value={priceTo}
                displayType={'text'}
                thousandSeparator={' '}
              />{' '}
              рублей
            </div>
            <div className="parameter-name">
              <strong>Время до метро</strong>
            </div>
            <div className="parameter-value">
              {metroDuration} минут {pedestrian && <span>пешком</span>}
            </div>
            <div className="parameter-name">
              <strong>Год постройки дома</strong>
            </div>
            <div className="parameter-value">
              {houseYearFrom === 1850 &&
              houseYearTo === new Date().getFullYear() ? (
                <span>Не важно</span>
              ) : (
                <span>
                  От {houseYearFrom} до {houseYearTo}
                </span>
              )}
            </div>
            <div className="parameter-name">
              <strong>Тип дома</strong>
            </div>
            {panel && block && brick && monolithic ? (
              <div className="parameter-value">Не важно</div>
            ) : (
              <ul className="parameter-value">
                {panel && <li>Панельный</li>}
                {block && <li>Блочный</li>}
                {brick && <li>Кирпичный</li>}
                {monolithic && <li>Монолит</li>}
              </ul>
            )}

            <div className="parameter-name">
              <strong>Этажность дома</strong>
            </div>
            <div className="parameter-value">
              {floorsFrom === 1 && floorsTo === 1000 ? (
                <span>Не важно</span>
              ) : (
                <span>
                  От {floorsFrom} до {floorsTo}
                </span>
              )}
            </div>
            <div className="parameter-name">
              <strong>Лифт</strong>
            </div>
            <div className="parameter-value">{elevator}</div>
            <div className="parameter-name">
              <strong>Этаж</strong>
            </div>
            <div className="parameter-value">
              {floorFrom === 1 && floorTo === 1000 ? (
                <span>Не важно</span>
              ) : (
                <span>
                  От {floorFrom} до {floorTo}
                </span>
              )}
              {exceptLast && <span>, кроме последнего</span>}
            </div>
            <div className="parameter-name">
              <strong>Количество комнат</strong>
            </div>
            <div className="parameter-value">
              {roomsNumberFrom === 1 && roomsNumberTo === 100 ? (
                <span>Не важно</span>
              ) : (
                <span>
                  От {roomsNumberFrom} до {roomsNumberTo}
                </span>
              )}
            </div>
            <div className="parameter-name">
              <strong>Общая площадь</strong>
            </div>
            <div className="parameter-value">
              {totalAreaFrom === 1 && totalAreaTo === 10000 ? (
                <span>Не важно</span>
              ) : (
                <span>
                  От {totalAreaFrom} до {totalAreaTo}
                </span>
              )}
            </div>
            <div className="parameter-name">
              <strong>Жилая площадь</strong>
            </div>
            <div className="parameter-value">
              {livingAreaFrom === 1 && livingAreaTo === 10000 ? (
                <span>Не важно</span>
              ) : (
                <span>
                  От {livingAreaFrom} до {livingAreaTo}
                </span>
              )}
            </div>
            <div className="parameter-name">
              <strong>Площадь кухни</strong>
            </div>
            <div className="parameter-value">
              {kitchenAreaFrom === 1 && kitchenAreaTo === 10000 ? (
                <span>Не важно</span>
              ) : (
                <span>
                  От {kitchenAreaFrom} до {kitchenAreaTo}
                </span>
              )}
            </div>
            <div className="parameter-name">
              <strong>Балкон</strong>
            </div>
            <div className="parameter-value">{balcony}</div>
            <div className="parameter-name">
              <strong>Окна выходят</strong>
            </div>
            <div className="parameter-value">{windows}</div>
            <div className="parameter-name">
              <strong>Плита</strong>
            </div>
            <div className="parameter-value">{cooker}</div>
            <div className="parameter-name">
              <strong>Санузел</strong>
            </div>
            <div className="parameter-value">{bathroom}</div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            value="Найти квартиры"
            onClick={e => {
              onSearchClick();
            }}
          >
            Найти квартиры
          </button>
          <Link
            to={`/edit-search/${search._id}`}
            className="btn btn-secondary btn-block"
          >
            Редактировать поиск
          </Link>
          <button
            className="btn btn-danger btn-block"
            onClick={e => deleteSearch(search._id, history)}
          >
            Удалить поиск
          </button>
        </Fragment>
      )}
    </Fragment>
  );
};

Search.propTypes = {
  getSearchById: PropTypes.func.isRequired,
  deleteSearch: PropTypes.func.isRequired,
  getProposalsByParameters: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  search: state.search
});

export default connect(mapStateToProps, {
  getSearchById,
  deleteSearch,
  getProposalsByParameters
})(withRouter(Search));
