import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Search = props => {
  return (
    <Fragment>
      <h1 className="text-primary my-1">Поиск квартир</h1>
      <p className="lead">Задайте параметры, чтобы найти квартиру</p>

      <form>
        <div className="form-group deal-type">
          <label htmlFor="dealType">Купить / Снять</label>
          <select className="select-css" name="dealType" id="dealType">
            <option value="0" selected>
              Купить
            </option>
            <option value="1">Снять</option>
          </select>
        </div>
        <div className="form-group">
          <label>Как искать</label>
          <select className="select-css my" name="searchType" id="searchType">
            <option value="0" selected>
              Поиск по адресу, району
            </option>
            <option value="1">Поиск на карте города</option>
            <option value="2">Поиск на карте метро</option>
          </select>
          <input
            type="text"
            id="address"
            name="address"
            value="Введите адрес объекта..."
            placeholder="Введите адрес объекта..."
          />
          <div className="map city">
            <img src="../img/city-map.jpg" alt="" />
          </div>
          <div className="map metro">
            <img src="../img/city-map.jpg" alt="" />
          </div>
        </div>
        <div className="search-parameters">
          <div className="price-parameter search-parameter">
            <strong>Стоимость, руб.</strong>
            <div className="search-parameter-values">
              <input
                type="number"
                id="priceFrom"
                name="priceFrom"
                value="От..."
                placeholder="От..."
                min="1"
              />
              <input
                type="number"
                id="priceTo"
                name="priceTo"
                value="До..."
                placeholder="До..."
                min="1"
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
                value="От..."
                placeholder="От..."
                min="1850"
              />
              <input
                type="number"
                id="houseYearTo"
                name="houseYearTo"
                value="До..."
                placeholder="До..."
                min="1850"
              />
            </div>
            <div className="checkbox-group">
              <input type="checkbox" name="houseYearAny" checked value="" /> Не
              важно
            </div>
          </div>
          <div className="type-parameter search-parameter">
            <strong>Тип дома</strong>
            <div className="search-parameter-values">
              <div className="checkbox-group">
                <input type="checkbox" name="panel" checked value="" />
                Панельный
              </div>
              <div className="checkbox-group">
                <input type="checkbox" name="block" checked value="" /> Блочный
              </div>
              <div className="checkbox-group">
                <input type="checkbox" name="brick" checked value="" />
                Кирпичный
              </div>
              <div className="checkbox-group">
                <input type="checkbox" name="monolithic" checked value="" />
                Монолит
              </div>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" name="houseTypeAny" checked value="" /> Не
              важно
            </div>
          </div>
          <div className="floors-parameter search-parameter">
            <strong>Этажность дома</strong>
            <div className="search-parameter-values">
              <input
                type="number"
                id="floorsFrom"
                name="floorsFrom"
                value="От..."
                placeholder="От..."
                min="1"
              />
              <input
                type="number"
                id="floorsTo"
                name="floorsTo"
                value="До..."
                placeholder="До..."
                min="1"
              />
            </div>
            <div className="checkbox-group">
              <input type="checkbox" name="floorsAny" checked value="" /> Не
              важно
            </div>
          </div>
          <div className="elevator-parameter search-parameter">
            <strong>Лифт</strong>
            <div className="search-parameter-values">
              <select name="elevator" id="elevator">
                <option value="0" selected>
                  Не важно
                </option>
                <option value="1">Пассажирский</option>
                <option value="2">Пассажирский и грузовой</option>
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
                value="От..."
                placeholder="От..."
                min="1"
              />
              <input
                type="number"
                id="floorTo"
                name="floorTo"
                value="До..."
                placeholder="До..."
                min="1"
              />
            </div>
            <div className="checkbox-group">
              <input type="checkbox" name="exceptLast" checked value="" />
              Кроме последнего
            </div>
            <div className="checkbox-group">
              <input type="checkbox" name="floorAny" checked value="" /> Не
              важно
            </div>
          </div>

          <div className="rooms-parameter search-parameter">
            <strong>Количество комнат</strong>
            <div className="search-parameter-values">
              <input
                type="number"
                id="roomsFrom"
                name="roomsFrom"
                value="От..."
                placeholder="От..."
                min="1"
              />
              <input
                type="number"
                id="roomsTo"
                name="roomsTo"
                value="До..."
                placeholder="До..."
                min="1"
              />
            </div>
            <div className="checkbox-group">
              <input type="checkbox" name="roomsAny" checked value="" /> Не
              важно
            </div>
          </div>

          <div className="total-area-parameter search-parameter">
            <strong>Общая площадь</strong>
            <div className="search-parameter-values">
              <input
                type="number"
                id="totalAreaFrom"
                name="totalAreaFrom"
                value="От..."
                placeholder="От..."
                min="1"
              />
              <input
                type="number"
                id="totalAreaTo"
                name="totalAreaTo"
                value="До..."
                placeholder="До..."
                min="1"
              />
            </div>
            <div className="checkbox-group">
              <input type="checkbox" name="totalAreaAny" checked value="" /> Не
              важно
            </div>
          </div>

          <div className="living-area-parameter search-parameter">
            <strong>Жилая площадь</strong>
            <div className="search-parameter-values">
              <input
                type="number"
                id="livingAreaFrom"
                name="livingAreaFrom"
                value="От..."
                placeholder="От..."
                min="1"
              />
              <input
                type="number"
                id="livingAreaTo"
                name="livingAreaTo"
                value="До..."
                placeholder="До..."
                min="1"
              />
            </div>
            <div className="checkbox-group">
              <input type="checkbox" name="livingAreaAny" checked value="" /> Не
              важно
            </div>
          </div>

          <div className="kitchen-area-parameter search-parameter">
            <strong>Площадь кухни</strong>
            <div className="search-parameter-values">
              <input
                type="number"
                id="kitchenAreaFrom"
                name="kitchenAreaFrom"
                value="От..."
                placeholder="От..."
                min="1"
              />
              <input
                type="number"
                id="kitchenAreaTo"
                name="kitchenAreaTo"
                value="До..."
                placeholder="До..."
                min="1"
              />
            </div>
            <div className="checkbox-group">
              <input type="checkbox" name="kitchenAreaAny" checked value="" />
              Не важно
            </div>
          </div>

          <div className="balcony-parameter search-parameter">
            <strong>Балкон</strong>
            <div className="search-parameter-values">
              <select name="balcony">
                <option value="0" selected>
                  Не важно
                </option>
                <option value="1">Есть</option>
                <option value="2">Два и более</option>
              </select>
            </div>
          </div>

          <div className="windows-parameter search-parameter">
            <strong>Окна выходят</strong>
            <div className="search-parameter-values">
              <select name="windows">
                <option value="0" selected>
                  Не важно
                </option>
                <option value="1">На улицу</option>
                <option value="2">Во двор</option>
                <option value="3">На улицу и во двор</option>
              </select>
            </div>
          </div>

          <div className="cooker-parameter search-parameter">
            <strong>Плита</strong>
            <div className="search-parameter-values">
              <select name="cooker">
                <option value="0" selected>
                  Не важно
                </option>
                <option value="1">Электрическая</option>
                <option value="2">Газовая</option>
              </select>
            </div>
          </div>

          <div className="bathroom-parameter search-parameter">
            <strong>Санузел</strong>
            <div className="search-parameter-values">
              <select name="bathroom">
                <option value="0" selected>
                  Не важно
                </option>
                <option value="1">Совмещенный</option>
                <option value="2">Раздельный</option>
                <option value="3">Два и более</option>
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
          />
          <label htmlFor="save-parameters">Сохранить параметры поиска</label>
        </div>
        <div className="search-name-group">
          <strong>Наименование поиска *</strong>
          <input
            type="text"
            name="searchName"
            id="searchName"
            value="Введите имя поиска..."
            placeholder="Введите имя поиска..."
          />
          <small>
            * Укажите имя поиска, чтобы в будущем быстрее идентифицировать его
            среди других сохраненных вами поисков
          </small>
        </div>
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
