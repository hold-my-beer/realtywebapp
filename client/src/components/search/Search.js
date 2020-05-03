import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

const Search = props => {
  const [searchType, setSearchType] = useState('0');

  const [formData, setFormData] = useState({
    dealType: 'Продажа',
    address: '',
    priceFrom: '',
    priceTo: '',
    houseYearFrom: '',
    houseYearTo: '',

    // houseType: [],
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
    bathroom: 'Не важно',
    // saveSearchToggle: false,
    searchName: ''
  });

  const [toggleAny, setToggleAny] = useState({
    anyHouseYear: false,
    anyHouseType: false,
    anyFloors: false,
    anyFloor: false,
    anyRoomsNumber: false,
    anyTotalArea: false,
    anyLivingArea: false,
    anyKitchenArea: false
  });

  const [displaySaveParameters, toggleSaveParameters] = useState(false);

  const {
    dealType,
    address,
    priceFrom,
    priceTo,
    houseYearFrom,
    houseYearTo,

    // houseType,
    // panel,
    // block,
    // brick,
    // monolithic,

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
    bathroom,
    // saveSearchToggle,
    searchName
  } = formData;

  const {
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
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onToggleAnyHouseYear = e => {
    setToggleAny({ ...toggleAny, [e.target.name]: e.target.checked });
    setFormData({
      ...formData,
      houseYearFrom: e.target.checked ? '1850' : '',
      houseYearTo: e.target.checked ? new Date().getFullYear() : ''
    });
  };

  const onToggleAnyHouseType = e => {
    setToggleAny({ ...toggleAny, [e.target.name]: e.target.checked });
    setFormData({
      ...formData,
      panel: e.target.checked ? 'Панельный' : '',
      block: e.target.checked ? 'Блочный' : '',
      brick: e.target.checked ? 'Кирпичный' : '',
      monolithic: e.target.checked ? 'Монолит' : ''
    });
  };

  const onToggleAnyFloors = e => {
    setToggleAny({ ...toggleAny, [e.target.name]: e.target.checked });
    setFormData({
      ...formData,
      floorsFrom: e.target.checked ? '1' : '',
      floorsTo: e.target.checked ? '1000' : ''
    });
  };

  const onToggleAnyFloor = e => {
    setToggleAny({ ...toggleAny, [e.target.name]: e.target.checked });
    setFormData({
      ...formData,
      floorFrom: e.target.checked ? '1' : '',
      floorTo: e.target.checked ? '1000' : ''
    });
  };

  const onToggleAnyRoomsNumber = e => {
    setToggleAny({ ...toggleAny, [e.target.name]: e.target.checked });
    setFormData({
      ...formData,
      roomsNumberFrom: e.target.checked ? '1' : '',
      roomsNumberTo: e.target.checked ? '100' : ''
    });
  };

  const onToggleAnyTotalArea = e => {
    setToggleAny({ ...toggleAny, [e.target.name]: e.target.checked });
    setFormData({
      ...formData,
      totalAreaFrom: e.target.checked ? '1' : '',
      totalAreaTo: e.target.checked ? '10000' : ''
    });
  };

  const onToggleAnyLivingArea = e => {
    setToggleAny({ ...toggleAny, [e.target.name]: e.target.checked });
    setFormData({
      ...formData,
      livingAreaFrom: e.target.checked ? '1' : '',
      livingAreaTo: e.target.checked ? '10000' : ''
    });
  };

  const onToggleAnyKitchenArea = e => {
    setToggleAny({ ...toggleAny, [e.target.name]: e.target.checked });
    setFormData({
      ...formData,
      kitchenAreaFrom: e.target.checked ? '1' : '',
      kitchenAreaTo: e.target.checked ? '10000' : ''
    });
  };

  return (
    <Fragment>
      <h1 className="text-primary my-1">Поиск квартир</h1>
      <p className="lead">Задайте параметры, чтобы найти квартиру</p>

      <form>
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
        <div className="form-group">
          <label>Как искать</label>
          <select
            className="select-css my"
            value={searchType}
            name="searchType"
            id="searchType"
            onChange={e => onSearchTypeChange(e)}
          >
            <option value="0">Поиск по адресу, району</option>
            <option value="1">Поиск на карте города</option>
            <option value="2">Поиск на карте метро</option>
          </select>
          {searchType === '0' && (
            <div className="search-by search-by-address">
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                placeholder="Введите район / метро / улицу..."
                onChange={e => onChange(e)}
              />
            </div>
          )}
          {searchType === '1' && (
            <div className="search-by search-by-address">
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                placeholder="Введите адрес объекта..."
                onChange={e => onChange(e)}
              />
              <div className="map city">
                <img src="../img/city-map.jpg" alt="" />
              </div>
            </div>
          )}
          {searchType === '2' && (
            <div className="search-by search-by-metro">
              <div className="map metro">
                <img src="../img/city-map.jpg" alt="" />
              </div>
            </div>
          )}
        </div>
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
                  onChange={e => onChange(e)}
                  disabled={anyHouseType}
                  style={{ opacity: `${anyHouseType ? '0.5' : '1'}` }}
                  checked={anyHouseType}
                />
                Панельный
              </div>
              <div className="checkbox-group">
                <input
                  id="block"
                  type="checkbox"
                  name="block"
                  value="Блочный"
                  onChange={e => onChange(e)}
                  disabled={anyHouseType}
                  style={{ opacity: `${anyHouseType ? '0.5' : '1'}` }}
                  checked={anyHouseType}
                />{' '}
                Блочный
              </div>
              <div className="checkbox-group">
                <input
                  id="brick"
                  type="checkbox"
                  name="brick"
                  value="Кирпичный"
                  onChange={e => onChange(e)}
                  disabled={anyHouseType}
                  style={{ opacity: `${anyHouseType ? '0.5' : '1'}` }}
                  checked={anyHouseType}
                />
                Кирпичный
              </div>
              <div className="checkbox-group">
                <input
                  id="monolithic"
                  type="checkbox"
                  name="monolithic"
                  value="Монолит"
                  onChange={e => onChange(e)}
                  disabled={anyHouseType}
                  style={{ opacity: `${anyHouseType ? '0.5' : '1'}` }}
                  checked={anyHouseType}
                />
                Монолит
              </div>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                name="anyHouseType"
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
                id="roomsFrom"
                name="roomsFrom"
                value={anyRoomsNumber ? '1' : roomsNumberFrom}
                placeholder="От..."
                min="1"
                onChange={e => onChange(e)}
                disabled={anyRoomsNumber}
                style={{ opacity: `${anyRoomsNumber ? '0.5' : '1'}` }}
              />
              <input
                type="number"
                id="roomsTo"
                name="roomsTo"
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
                disabled={anyLivingArea}
                style={{ opacity: `${anyLivingArea ? '0.5' : '1'}` }}
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
              <select name="cooker" value={cooker} onChange={e => onChange(e)}>
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
        <div className="save-parameters-group">
          <input
            type="checkbox"
            id="save-parameters"
            name="saveParameters"
            value="on"
            className="my-1"
            onChange={() => toggleSaveParameters(!displaySaveParameters)}
          />
          <label htmlFor="save-parameters">Сохранить параметры поиска</label>
        </div>
        {displaySaveParameters && (
          <div className="search-name-group">
            <strong>Наименование поиска *</strong>
            <input
              type="text"
              name="searchName"
              id="searchName"
              value={searchName}
              placeholder="Введите имя поиска..."
              onChange={e => onChange(e)}
            />
            <small>
              * Укажите имя поиска, чтобы в будущем быстрее идентифицировать его
              среди других сохраненных вами поисков
            </small>
          </div>
        )}

        <input
          type="submit"
          className="btn btn-primary btn-block"
          value="Найти квартиры"
        />
      </form>
    </Fragment>
  );
};

Search.propTypes = {};

export default Search;
