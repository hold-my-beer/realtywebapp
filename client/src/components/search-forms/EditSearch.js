import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProvinces } from '../../actions/province';
import { getProposalsByParameters } from '../../actions/proposal';
import { getSearchById, editSearch } from '../../actions/search';

import Spinner from '../layout/Spinner';

const EditSearch = ({
  getProvinces,
  getProposalsByParameters,
  getSearchById,
  editSearch,
  search: { search, loading },
  province: { provinces },
  auth: { isAuthenticated },
  match,
  history
}) => {
  const [searchType, setSearchType] = useState('');

  const [formData, setFormData] = useState({
    dealType: 'Продажа',
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

  const [searchData, setSearchData] = useState({
    saveSearch: true,
    searchName: ''
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

  const [provinceDropdown, setProvinceDropdown] = useState({
    localities: [],
    districts: [],
    routes: [],
    metros: []
  });

  const [toggleAny, setToggleAny] = useState({
    anyDistrict: false,
    anyRoute: false,
    anyMetro: false,
    anyHouseYear: false,
    anyHouseType: false,
    anyFloors: false,
    anyFloor: false,
    anyRoomsNumber: false,
    anyTotalArea: false,
    anyLivingArea: false,
    anyKitchenArea: false
  });

  // const [displaySaveParameters, toggleSaveParameters] = useState(false);

  useEffect(() => {
    getProvinces();
  }, [getProvinces]);

  useEffect(() => {
    getSearchById(match.params.id);
  }, [getSearchById, match.params.id]);

  useEffect(() => {
    setSearchType(
      search === null || !search.searchType ? '' : search.searchType
    );

    setFormData({
      dealType: !search.dealType ? 'Продажа' : search.dealType,
      priceFrom: !search.priceFrom ? '' : search.priceFrom,
      priceTo: !search.priceTo ? '' : search.priceTo,
      houseYearFrom: !search.houseYearFrom ? '' : search.houseYearFrom,
      houseYearTo: !search.houseYearTo ? '' : search.houseYearTo,
      panel: !search.panel ? '' : search.panel,
      block: !search.block ? '' : search.block,
      brick: !search.brick ? '' : search.brick,
      monolithic: !search.monolithic ? '' : search.monolithic,
      floorsFrom: !search.floorsFrom ? '' : search.floorsFrom,
      floorsTo: !search.floorsTo ? '' : search.floorsTo,
      elevator: !search.elevator ? 'Не важно' : search.elevator,
      floorFrom: !search.floorFrom ? '' : search.floorFrom,
      floorTo: !search.floorTo ? '' : search.floorTo,
      exceptLast: !search.exceptLast ? 'false' : search.exceptLast,
      roomsNumberFrom: !search.roomsNumberFrom ? '' : search.roomsNumberFrom,
      roomsNumberTo: !search.roomsNumberTo ? '' : search.roomsNumberTo,
      totalAreaFrom: !search.totalAreaFrom ? '' : search.totalAreaFrom,
      totalAreaTo: !search.totalAreaTo ? '' : search.totalAreaTo,
      livingAreaFrom: !search.livingAreaFrom ? '' : search.livingAreaFrom,
      livingAreaTo: !search.livingAreaTo ? '' : search.livingAreaTo,
      kitchenAreaFrom: !search.kitchenAreaFrom ? '' : search.kitchenAreaFrom,
      kitchenAreaTo: !search.kitchenAreaTo ? '' : search.kitchenAreaTo,
      balcony: !search.balcony ? 'Не важно' : search.balcony,
      windows: !search.windows ? 'Не важно' : search.windows,
      cooker: !search.cooker ? 'Не важно' : search.cooker,
      bathroom: !search.bathroom ? 'Не важно' : search.bathroom
    });

    setSearchData({
      searchName: !search.name ? '' : search.name
    });

    setAddress({
      province: !search.province ? '' : search.province,
      locality: !search.locality ? '' : search.locality,
      metroDuration: !search.metroDuration ? '' : search.metroDuration,
      pedestrian: !search.pedestrian ? false : search.pedestrian,
      addressDistricts: !search.addressDistricts ? [] : search.addressDistricts,
      addressRoutes: !search.addressRoutes ? [] : search.addressRoutes,
      addressMetros: !search.addressMetros ? [] : search.addressMetros
    });
  }, [search]);

  useEffect(() => {
    setProvinceDropdown({
      localities:
        search === null || provinces.length === 0 || !province
          ? []
          : provinces[provinces.map(item => item.name).indexOf(province)]
              .localities,
      districts:
        search === null ||
        provinces.length === 0 ||
        localities.length === 0 ||
        !locality
          ? []
          : localities[localities.map(item => item.name).indexOf(locality)]
              .districts,
      routes:
        search === null ||
        provinces.length === 0 ||
        localities.length === 0 ||
        !locality
          ? []
          : localities[localities.map(item => item.name).indexOf(locality)]
              .routes,
      metros:
        search === null ||
        provinces.length === 0 ||
        localities.length === 0 ||
        routes.length === 0
          ? []
          : routes
              .map(
                route =>
                  routes[routes.map(item => item.name).indexOf(route.name)]
                    .metros
              )
              .flat()
    });
  }, [
    provinces,
    address,
    provinceDropdown.localities,
    provinceDropdown.routes
  ]);

  useEffect(() => {
    setToggleAny({
      // ...toggleAny,
      anyDistrict:
        search === null ||
        !search.addressDistricts ||
        search.addressDistricts.length === 0 ||
        districts.length === 0
          ? false
          : search.addressDistricts.length === districts.length,
      // anyDistrict:
      //   search.addressDistricts.length !== 0 &&
      //   districts.length !== 0 &&
      //   search.addressDistricts.length === districts.length,
      anyRoute:
        search === null ||
        !search.addressRoutes ||
        search.addressRoutes.length === 0 ||
        routes.length === 0
          ? false
          : search.addressRoutes.length === routes.length,
      anyMetro:
        search === null ||
        !search.addressMetros ||
        search.addressMetros.length === 0 ||
        metros.length === 0
          ? false
          : search.addressMetros.length === metros.length,
      anyHouseType:
        search === null
          ? false
          : search.panel === 'Панельный' &&
            search.block === 'Блочный' &&
            search.brick === 'Кирпичный' &&
            search.monolithic === 'Монолит',
      anyHouseYear:
        search === null
          ? false
          : search.houseYearFrom === 1850 &&
            search.houseYearTo === new Date().getFullYear(),
      anyFloors:
        search === null
          ? false
          : search.floorsFrom === 1 && search.floorsTo === 1000,
      anyFloor:
        search === null
          ? false
          : search.floorFrom === 1 && search.floorTo === 1000,
      anyRoomsNumber:
        search === null
          ? false
          : search.roomsNumberFrom === 1 && search.roomsNumberTo === 100,
      anyTotalArea:
        search === null
          ? false
          : search.totalAreaFrom === 1 && search.totalAreaTo === 10000,
      anyLivingArea:
        search === null
          ? false
          : search.livingAreaFrom === 1 && search.livingAreaTo === 10000,
      anyKitchenArea:
        search === null
          ? false
          : search.kitchenAreaFrom === 1 && search.kitchenAreaTo === 10000
    });
  }, [search, provinceDropdown.districts]);

  const {
    dealType,
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

  const { saveSearch, searchName } = searchData;

  const {
    province,
    locality,
    metroDuration,
    addressDistricts,
    addressRoutes,
    addressMetros,
    pedestrian
  } = address;

  const { localities, districts, routes, metros } = provinceDropdown;

  const {
    anyDistrict,
    anyRoute,
    anyMetro,
    anyHouseYear,
    anyHouseType,
    anyFloors,
    anyFloor,
    anyRoomsNumber,
    anyTotalArea,
    anyLivingArea,
    anyKitchenArea
  } = toggleAny;

  const onSearchTypeChange = e => {
    setSearchType(e.target.value);
    setAddress({
      ...address,
      addressDistricts: e.target.value === '0' ? addressDistricts : [],
      addressRoutes: e.target.value === '1' ? addressRoutes : [],
      addressMetros: e.target.value === '1' ? addressDistricts : []
    });
    setToggleAny({
      ...toggleAny,
      anyDistrict: false,
      anyRoute: false,
      anyMetro: false
    });
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onAddressChange = e => {
    switch (e.target.name) {
      case 'province':
        setAddress({
          province: e.target.value,
          locality: '',
          addressDistricts: [],
          addressRoutes: [],
          addressMetros: [],
          metroDuration: '',
          pedestrian: false
        });
        let localitiesArray = [];
        if (e.target.value) {
          const provinceIndex = provinces
            .map(item => item.name)
            .indexOf(e.target.value);
          localitiesArray = provinces[provinceIndex].localities;
        }
        setProvinceDropdown({
          localities: localitiesArray,
          districts: [],
          routes: [],
          metros: []
        });
        break;
      case 'locality':
        setAddress({
          ...address,
          locality: e.target.value,
          addressDistricts: [],
          addressRoutes: [],
          addressMetros: [],
          metroDuration: '',
          pedestrian: false
        });
        let districtsArray = [];
        let routesArray = [];
        if (e.target.value) {
          const localityIndex = localities
            .map(item => item.name)
            .indexOf(e.target.value);
          districtsArray = localities[localityIndex].districts;
          routesArray = localities[localityIndex].routes;
        }
        setProvinceDropdown({
          ...provinceDropdown,
          districts: districtsArray,
          routes: routesArray,
          metros: []
        });
        if (routesArray.length === 0) {
          setSearchType('0');
        }
        break;
      case 'metroDuration':
        setAddress({ ...address, metroDuration: e.target.value });
        break;
      default:
        break;
    }
    setToggleAny({
      ...toggleAny,
      anyDistrict: false,
      anyRoute: false,
      anyMetro: false
    });
  };

  const onDistrictChange = e => {
    setAddress({
      ...address,
      addressDistricts: e.target.checked
        ? [...addressDistricts, e.target.value]
        : addressDistricts.filter(item => item !== e.target.name)
    });
  };

  const onRouteChange = e => {
    setAddress({
      ...address,
      addressRoutes: e.target.checked
        ? [...addressRoutes, e.target.value]
        : addressRoutes.filter(item => item !== e.target.name),
      addressMetros: []
    });
    let metrosArray = [];
    if (e.target.value) {
      const routeIndex = routes.map(item => item.name).indexOf(e.target.value);
      metrosArray = routes[routeIndex].metros;
    }
    setProvinceDropdown({
      ...provinceDropdown,
      metros: e.target.checked
        ? [...metros, ...metrosArray]
        : metros.filter(item => !metrosArray.includes(item))
    });
  };

  const onMetroChange = e => {
    setAddress({
      ...address,
      addressMetros: e.target.checked
        ? [...addressMetros, e.target.value]
        : addressMetros.filter(item => item !== e.target.name)
    });
  };

  const onToggleAnyDistrict = e => {
    // console.log(e.target);
    // console.log(e.target.checked);
    // setToggleAny({ ...toggleAny, anyDistrict: e.target.checked });
    setToggleAny({ ...toggleAny, anyDistrict: !anyDistrict });
    setAddress({
      ...address,
      addressDistricts: e.target.checked ? districts.map(item => item.name) : []
    });
  };

  const onToggleAnyRoute = e => {
    setToggleAny({
      ...toggleAny,
      anyRoute: e.target.checked,
      anyMetro: e.target.checked ? anyMetro : false
    });
    setAddress({
      ...address,
      addressRoutes: e.target.checked ? routes.map(item => item.name) : [],
      addressMetros: e.target.checked ? addressMetros : []
    });
    let metrosArray = [];
    routes.forEach(item => (metrosArray = [...metrosArray, ...item.metros]));
    setProvinceDropdown({
      ...provinceDropdown,
      metros: e.target.checked ? metrosArray : []
    });
  };

  const onToggleAnyMetro = e => {
    setToggleAny({ ...toggleAny, anyMetro: e.target.checked });
    setAddress({
      ...address,
      addressMetros: e.target.checked ? metros.map(item => item.name) : []
    });
  };

  const onTogglePedestrian = e => {
    setAddress({ ...address, pedestrian: e.target.checked });
  };

  const onToggleHouseType = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked ? e.target.value : ''
    });
  };

  const onToggleAnyHouseYear = e => {
    setToggleAny({ ...toggleAny, anyHouseYear: e.target.checked });
    setFormData({
      ...formData,
      houseYearFrom: e.target.checked ? '1850' : '',
      houseYearTo: e.target.checked ? new Date().getFullYear() : ''
    });
  };

  const onToggleAnyHouseType = e => {
    setToggleAny({ ...toggleAny, anyHouseType: e.target.checked });
    setFormData({
      ...formData,
      panel: e.target.checked ? 'Панельный' : '',
      block: e.target.checked ? 'Блочный' : '',
      brick: e.target.checked ? 'Кирпичный' : '',
      monolithic: e.target.checked ? 'Монолит' : ''
    });
  };

  const onToggleAnyFloors = e => {
    setToggleAny({ ...toggleAny, anyFloors: e.target.checked });
    setFormData({
      ...formData,
      floorsFrom: e.target.checked ? '1' : '',
      floorsTo: e.target.checked ? '1000' : ''
    });
  };

  const onToggleAnyFloor = e => {
    setToggleAny({ ...toggleAny, anyFloor: e.target.checked });
    setFormData({
      ...formData,
      floorFrom: e.target.checked ? '1' : '',
      floorTo: e.target.checked ? '1000' : ''
    });
  };

  const onToggleAnyRoomsNumber = e => {
    setToggleAny({ ...toggleAny, anyRoomsNumber: e.target.checked });
    setFormData({
      ...formData,
      roomsNumberFrom: e.target.checked ? '1' : '',
      roomsNumberTo: e.target.checked ? '100' : ''
    });
  };

  const onToggleAnyTotalArea = e => {
    setToggleAny({ ...toggleAny, anyTotalArea: e.target.checked });
    setFormData({
      ...formData,
      totalAreaFrom: e.target.checked ? '1' : '',
      totalAreaTo: e.target.checked ? '10000' : ''
    });
  };

  const onToggleAnyLivingArea = e => {
    setToggleAny({ ...toggleAny, anyLivingArea: e.target.checked });
    setFormData({
      ...formData,
      livingAreaFrom: e.target.checked ? '1' : '',
      livingAreaTo: e.target.checked ? '10000' : ''
    });
  };

  const onToggleAnyKitchenArea = e => {
    setToggleAny({ ...toggleAny, anyKitchenArea: e.target.checked });
    setFormData({
      ...formData,
      kitchenAreaFrom: e.target.checked ? '1' : '',
      kitchenAreaTo: e.target.checked ? '10000' : ''
    });
  };

  const onSubmit = e => {
    e.preventDefault();

    getProposalsByParameters(formData, address, history);
    editSearch(
      match.params.id,
      formData,
      address,
      searchData.searchName,
      searchType
    );
  };

  return (
    <Fragment>
      <h1 className="text-primary my-1">Редкатирование поиска квартир</h1>
      <p className="lead">Измените параметры и нажмите "Найти квартиры"</p>

      {search === null ? (
        <Spinner />
      ) : (
        <form onSubmit={e => onSubmit(e)}>
          <div className="form-group deal-type">
            <label htmlFor="dealType">Купить / Снять</label>
            <select
              className="select-css"
              name="dealType"
              value={dealType}
              id="dealType"
              onChange={e => onChange(e)}
            >
              <option value="Продажа">Купить</option>
              <option value="Аренда">Снять</option>
            </select>
          </div>
          {provinces === null ? (
            <Spinner />
          ) : (
            <Fragment>
              <div className="form-group province">
                <label>Выберите регион</label>
                <select
                  className="select-css"
                  name="province"
                  value={province}
                  id="province"
                  onChange={e => onAddressChange(e)}
                >
                  <option value="">Все регионы</option>
                  {provinces.map(item => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              {province && localities && (
                <Fragment>
                  <div className="form-group locality">
                    <label>Выберите населенный пункт</label>
                    <select
                      className="select-css"
                      name="locality"
                      value={locality}
                      id="locality"
                      onChange={e => onAddressChange(e)}
                    >
                      <option value="">Все населенные пункты</option>
                      {localities.map(item => (
                        <option key={item._id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {locality && (
                    <Fragment>
                      {districts.length > 0 && routes.length > 0 && (
                        <div className="form-group search-type">
                          <label>Как искать</label>
                          <select
                            className="select-css"
                            value={searchType}
                            name="searchType"
                            id="searchType"
                            onChange={e => onSearchTypeChange(e)}
                          >
                            <option value="">Выберите тип поиска</option>
                            <option value="0">
                              Поиск по населенному пункту / району
                            </option>
                            <option value="1">
                              Поиск по линиям / станциям метро
                            </option>
                          </select>
                        </div>
                      )}
                      {searchType === '0' && (
                        <div className="districts-parameter search-parameter my">
                          <strong>Районы</strong>
                          <div className="search-parameter-values">
                            {districts.map(item => (
                              <div className="checkbox-group" key={item._id}>
                                <input
                                  id={item.name}
                                  type="checkbox"
                                  name={item.name}
                                  value={item.name}
                                  onChange={e => onDistrictChange(e)}
                                  disabled={anyDistrict}
                                  style={{
                                    opacity: `${anyDistrict ? '0.5' : '1'}`
                                  }}
                                  checked={addressDistricts.includes(item.name)}
                                />
                                {item.name}
                              </div>
                            ))}
                            <div className="checkbox-group">
                              <input
                                type="checkbox"
                                name="anyDistrict"
                                checked={anyDistrict}
                                onChange={e => onToggleAnyDistrict(e)}
                              />{' '}
                              Не важно
                            </div>
                          </div>
                        </div>
                      )}
                      {searchType === '1' && (
                        <Fragment>
                          <div className="routes-parameter search-parameter my">
                            <strong>Линии метро</strong>
                            <div>
                              <ul className="routes-list">
                                {routes.map(item => (
                                  <li className="checkbox-group" key={item._id}>
                                    <input
                                      id={item.name}
                                      type="checkbox"
                                      name={item.name}
                                      value={item.name}
                                      onChange={e => onRouteChange(e)}
                                      disabled={anyRoute}
                                      style={{
                                        opacity: `${anyRoute ? '0.5' : '1'}`
                                      }}
                                      checked={addressRoutes.includes(
                                        item.name
                                      )}
                                    />
                                    {item.name}
                                  </li>
                                ))}
                              </ul>
                              <div className="checkbox-group">
                                <input
                                  type="checkbox"
                                  name="anyRoute"
                                  checked={anyRoute}
                                  onChange={e => onToggleAnyRoute(e)}
                                />{' '}
                                Не важно
                              </div>
                            </div>
                          </div>
                          {addressRoutes.length > 0 && (
                            <Fragment>
                              <div className="metros-parameter search-parameter my">
                                <strong>Станции метро</strong>
                                <div>
                                  <ul className="metros-list">
                                    {metros.map(item => (
                                      <li
                                        className="checkbox-group"
                                        key={item._id}
                                      >
                                        <input
                                          id={item.name}
                                          type="checkbox"
                                          name={item.name}
                                          value={item.name}
                                          onChange={e => onMetroChange(e)}
                                          disabled={anyMetro}
                                          style={{
                                            opacity: `${anyMetro ? '0.5' : '1'}`
                                          }}
                                          checked={addressMetros.includes(
                                            item.name
                                          )}
                                        />
                                        {item.name}
                                      </li>
                                    ))}
                                  </ul>

                                  <div className="checkbox-group">
                                    <input
                                      type="checkbox"
                                      name="anyMetro"
                                      checked={anyMetro}
                                      onChange={e => onToggleAnyMetro(e)}
                                    />{' '}
                                    Не важно
                                  </div>
                                </div>
                              </div>
                            </Fragment>
                          )}
                        </Fragment>
                      )}
                    </Fragment>
                  )}
                </Fragment>
              )}
            </Fragment>
          )}
          <div className="search-parameters">
            <div className="price-parameter search-parameter">
              <strong>Стоимость, руб.</strong>
              <div className="search-parameter-values">
                <input
                  type="number"
                  id="priceFrom"
                  name="priceFrom"
                  value={priceFrom}
                  placeholder="От..."
                  min="1"
                  onChange={e => onChange(e)}
                />
                <input
                  type="number"
                  id="priceTo"
                  name="priceTo"
                  value={priceTo}
                  placeholder="До..."
                  min="1"
                  onChange={e => onChange(e)}
                />
              </div>
            </div>
            {locality && routes.length > 0 && (
              <div className="metroDuration-parameter search-parameter">
                <strong>Время до метро, минут</strong>
                <div className="metroDuration-parameter-values">
                  <input
                    type="number"
                    id="metroDuration"
                    name="metroDuration"
                    value={metroDuration}
                    placeholder="Не более..."
                    min="1"
                    onChange={e => onAddressChange(e)}
                  />
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="pedestrian"
                    checked={pedestrian}
                    onChange={e => onTogglePedestrian(e)}
                  />{' '}
                  пешком
                </div>
              </div>
            )}

            <div className="year-parameter search-parameter">
              <strong>Год постройки дома</strong>
              <div className="search-parameter-values">
                <input
                  type="number"
                  id="houseYearFrom"
                  name="houseYearFrom"
                  value={anyHouseYear ? '1850' : houseYearFrom}
                  placeholder="От..."
                  min="1850"
                  max={new Date().getFullYear()}
                  onChange={e => onChange(e)}
                  disabled={anyHouseYear}
                  style={{ opacity: `${anyHouseYear ? '0.5' : '1'}` }}
                />
                <input
                  type="number"
                  id="houseYearTo"
                  name="houseYearTo"
                  value={anyHouseYear ? new Date().getFullYear() : houseYearTo}
                  placeholder="До..."
                  min="1850"
                  max={new Date().getFullYear()}
                  onChange={e => onChange(e)}
                  disabled={anyHouseYear}
                  style={{ opacity: `${anyHouseYear ? '0.5' : '1'}` }}
                />
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="anyHouseYear"
                  checked={anyHouseYear}
                  onChange={e => onToggleAnyHouseYear(e)}
                />{' '}
                Не важно
              </div>
            </div>
            <div className="type-parameter search-parameter">
              <strong>Тип дома</strong>
              <div className="search-parameter-values">
                <div className="checkbox-group">
                  <input
                    id="panel"
                    type="checkbox"
                    name="panel"
                    value="Панельный"
                    onChange={e => onToggleHouseType(e)}
                    disabled={anyHouseType}
                    style={{ opacity: `${anyHouseType ? '0.5' : '1'}` }}
                    checked={panel === 'Панельный'}
                  />
                  Панельный
                </div>
                <div className="checkbox-group">
                  <input
                    id="block"
                    type="checkbox"
                    name="block"
                    value="Блочный"
                    onChange={e => onToggleHouseType(e)}
                    disabled={anyHouseType}
                    style={{ opacity: `${anyHouseType ? '0.5' : '1'}` }}
                    checked={block === 'Блочный'}
                  />{' '}
                  Блочный
                </div>
                <div className="checkbox-group">
                  <input
                    id="brick"
                    type="checkbox"
                    name="brick"
                    value="Кирпичный"
                    onChange={e => onToggleHouseType(e)}
                    disabled={anyHouseType}
                    style={{ opacity: `${anyHouseType ? '0.5' : '1'}` }}
                    checked={brick === 'Кирпичный'}
                  />
                  Кирпичный
                </div>
                <div className="checkbox-group">
                  <input
                    id="monolithic"
                    type="checkbox"
                    name="monolithic"
                    value="Монолит"
                    onChange={e => onToggleHouseType(e)}
                    disabled={anyHouseType}
                    style={{ opacity: `${anyHouseType ? '0.5' : '1'}` }}
                    checked={monolithic === 'Монолит'}
                  />
                  Монолит
                </div>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="anyHouseType"
                  checked={anyHouseType}
                  onChange={e => onToggleAnyHouseType(e)}
                />{' '}
                Не важно
              </div>
            </div>
            <div className="floors-parameter search-parameter">
              <strong>Этажность дома</strong>
              <div className="search-parameter-values">
                <input
                  type="number"
                  id="floorsFrom"
                  name="floorsFrom"
                  value={anyFloors ? '1' : floorsFrom}
                  placeholder="От..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyFloors}
                  style={{ opacity: `${anyFloors ? '0.5' : '1'}` }}
                />
                <input
                  type="number"
                  id="floorsTo"
                  name="floorsTo"
                  value={anyFloors ? '1000' : floorsTo}
                  placeholder="До..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyFloors}
                  style={{ opacity: `${anyFloors ? '0.5' : '1'}` }}
                />
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="anyFloors"
                  checked={anyFloors}
                  onChange={e => {
                    onToggleAnyFloors(e);
                  }}
                />{' '}
                Не важно
              </div>
            </div>
            <div className="elevator-parameter search-parameter">
              <strong>Лифт</strong>
              <div className="search-parameter-values">
                <select
                  name="elevator"
                  id="elevator"
                  value={elevator}
                  onChange={e => onChange(e)}
                >
                  <option value="Не важно">Не важно</option>
                  <option value="Пассажирский">Пассажирский</option>
                  <option value="Пассажирский и грузовой">
                    Пассажирский и грузовой
                  </option>
                </select>
              </div>
            </div>

            <div className="floor-parameter search-parameter">
              <strong>Этаж</strong>
              <div className="search-parameter-values">
                <input
                  type="number"
                  id="floorFrom"
                  name="floorFrom"
                  value={anyFloor ? '1' : floorFrom}
                  placeholder="От..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyFloor}
                  style={{ opacity: `${anyFloor ? '0.5' : '1'}` }}
                />
                <input
                  type="number"
                  id="floorTo"
                  name="floorTo"
                  value={anyFloor ? '1000' : floorTo}
                  placeholder="До..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyFloor}
                  style={{ opacity: `${anyFloor ? '0.5' : '1'}` }}
                />
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="anyFloor"
                  checked={anyFloor}
                  onChange={e => onToggleAnyFloor(e)}
                />{' '}
                Не важно
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="exceptLast"
                  value={exceptLast}
                  onChange={e => {
                    e.target.value = e.target.checked;
                    onChange(e);
                  }}
                />
                Кроме последнего
              </div>
            </div>

            <div className="rooms-parameter search-parameter">
              <strong>Количество комнат</strong>
              <div className="search-parameter-values">
                <input
                  type="number"
                  id="roomsNumberFrom"
                  name="roomsNumberFrom"
                  value={anyRoomsNumber ? '1' : roomsNumberFrom}
                  placeholder="От..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyRoomsNumber}
                  style={{ opacity: `${anyRoomsNumber ? '0.5' : '1'}` }}
                />
                <input
                  type="number"
                  id="roomsNumberTo"
                  name="roomsNumberTo"
                  value={anyRoomsNumber ? '100' : roomsNumberTo}
                  placeholder="До..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyRoomsNumber}
                  style={{ opacity: `${anyRoomsNumber ? '0.5' : '1'}` }}
                />
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="anyRoomsNumber"
                  checked={anyRoomsNumber}
                  onChange={e => onToggleAnyRoomsNumber(e)}
                />{' '}
                Не важно
              </div>
            </div>

            <div className="total-area-parameter search-parameter">
              <strong>Общая площадь</strong>
              <div className="search-parameter-values">
                <input
                  type="number"
                  id="totalAreaFrom"
                  name="totalAreaFrom"
                  value={anyTotalArea ? '1' : totalAreaFrom}
                  placeholder="От..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyTotalArea}
                  style={{ opacity: `${anyTotalArea ? '0.5' : '1'}` }}
                />
                <input
                  type="number"
                  id="totalAreaTo"
                  name="totalAreaTo"
                  value={anyTotalArea ? '10000' : totalAreaTo}
                  placeholder="До..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyTotalArea}
                  style={{ opacity: `${anyTotalArea ? '0.5' : '1'}` }}
                />
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="anyTotalArea"
                  checked={anyTotalArea}
                  onChange={e => onToggleAnyTotalArea(e)}
                />{' '}
                Не важно
              </div>
            </div>

            <div className="living-area-parameter search-parameter">
              <strong>Жилая площадь</strong>
              <div className="search-parameter-values">
                <input
                  type="number"
                  id="livingAreaFrom"
                  name="livingAreaFrom"
                  value={anyLivingArea ? '1' : livingAreaFrom}
                  placeholder="От..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyLivingArea}
                  style={{ opacity: `${anyLivingArea ? '0.5' : '1'}` }}
                />
                <input
                  type="number"
                  id="livingAreaTo"
                  name="livingAreaTo"
                  value={anyLivingArea ? '10000' : livingAreaTo}
                  placeholder="До..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyLivingArea}
                  style={{ opacity: `${anyLivingArea ? '0.5' : '1'}` }}
                />
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="anyLivingArea"
                  checked={anyLivingArea}
                  onChange={e => onToggleAnyLivingArea(e)}
                />{' '}
                Не важно
              </div>
            </div>

            <div className="kitchen-area-parameter search-parameter">
              <strong>Площадь кухни</strong>
              <div className="search-parameter-values">
                <input
                  type="number"
                  id="kitchenAreaFrom"
                  name="kitchenAreaFrom"
                  value={anyKitchenArea ? '1' : kitchenAreaFrom}
                  placeholder="От..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyKitchenArea}
                  style={{ opacity: `${anyKitchenArea ? '0.5' : '1'}` }}
                />
                <input
                  type="number"
                  id="kitchenAreaTo"
                  name="kitchenAreaTo"
                  value={anyKitchenArea ? '10000' : kitchenAreaTo}
                  placeholder="До..."
                  min="1"
                  onChange={e => onChange(e)}
                  disabled={anyKitchenArea}
                  style={{ opacity: `${anyKitchenArea ? '0.5' : '1'}` }}
                />
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="anyKitchenArea"
                  checked={anyKitchenArea}
                  onChange={e => onToggleAnyKitchenArea(e)}
                />
                Не важно
              </div>
            </div>

            <div className="balcony-parameter search-parameter">
              <strong>Балкон</strong>
              <div className="search-parameter-values">
                <select
                  name="balcony"
                  value={balcony}
                  onChange={e => onChange(e)}
                >
                  <option value="Не важно">Не важно</option>
                  <option value="Есть">Есть</option>
                  <option value="Два и более">Два и более</option>
                </select>
              </div>
            </div>

            <div className="windows-parameter search-parameter">
              <strong>Окна выходят</strong>
              <div className="search-parameter-values">
                <select
                  name="windows"
                  value={windows}
                  onChange={e => onChange(e)}
                >
                  <option value="Не важно">Не важно</option>
                  <option value="На улицу">На улицу</option>
                  <option value="Во двор">Во двор</option>
                  <option value="На улицу и во двор">На улицу и во двор</option>
                </select>
              </div>
            </div>

            <div className="cooker-parameter search-parameter">
              <strong>Плита</strong>
              <div className="search-parameter-values">
                <select
                  name="cooker"
                  value={cooker}
                  onChange={e => onChange(e)}
                >
                  <option value="Не важно">Не важно</option>
                  <option value="Электрическая">Электрическая</option>
                  <option value="Газовая">Газовая</option>
                </select>
              </div>
            </div>

            <div className="bathroom-parameter search-parameter">
              <strong>Санузел</strong>
              <div className="search-parameter-values">
                <select
                  name="bathroom"
                  value={bathroom}
                  onChange={e => onChange(e)}
                >
                  <option value="Не важно">Не важно</option>
                  <option value="Совмещенный">Совмещенный</option>
                  <option value="Раздельный">Раздельный</option>
                  <option value="Два и более">Два и более</option>
                </select>
              </div>
            </div>
          </div>
          {/* <div className="save-parameters-group">
            <input
              type="checkbox"
              id="save-parameters"
              name="saveParameters"
              // value="on"
              // value={saveSearch}
              className="my-1"
              // onChange={() => toggleSaveParameters(!displaySaveParameters)}
              onChange={e =>
                setSearchData({ ...searchData, saveSearch: e.target.checked })
              }
            />
            <label htmlFor="save-parameters">Сохранить параметры поиска</label>
          </div> */}
          {
            // displaySaveParameters
            // saveSearch && (
            <div className="search-name-group my">
              <strong>Наименование поиска *</strong>
              <input
                type="text"
                name="searchName"
                id="searchName"
                value={searchName}
                placeholder="Введите имя поиска..."
                // onChange={e => onChange(e)}
                onChange={e =>
                  setSearchData({
                    ...searchData,
                    searchName: e.target.value
                  })
                }
              />
              <small>
                * Укажите имя поиска, например "Двушка в Останкино", чтобы было
                удобнее идентифицировать его среди других сохраненных вами
                поисков
              </small>
            </div>
            // )
          }

          <input
            type="submit"
            className="btn btn-primary btn-block"
            value="Найти квартиры"
          />
        </form>
      )}
    </Fragment>
  );
};

EditSearch.propTypes = {
  getProvinces: PropTypes.func.isRequired,
  getProposalsByParameters: PropTypes.func.isRequired,
  getSearchById: PropTypes.func.isRequired,
  editSearch: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired,
  province: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  search: state.search,
  province: state.province,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getProvinces,
  getProposalsByParameters,
  getSearchById,
  editSearch
})(withRouter(EditSearch));
