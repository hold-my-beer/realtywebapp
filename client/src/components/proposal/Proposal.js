import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Proposal = props => {
  return (
    <Fragment>
      <h1 class="text-primary my-1">Продается 3-х комнатная квартира</h1>
      <h2 class="text-primary my">16 000 000 рублей</h2>
      <p class="lead">г.Москва, ул. Ленина, дом 1</p>
      <div class="proposal-photos">
        <div class="proposal-photo">
          <img src="../img/create-proposal-img-1.jpg" alt="" />
        </div>
        <div class="proposal-photo">
          <img src="../img/create-proposal-img-2.jpg" alt="" />
        </div>
        <div class="proposal-photo">
          <img src="../img/create-proposal-img-3.jpg" alt="" />
        </div>
        <div class="proposal-photo">
          <img src="../img/create-proposal-img-4.jpg" alt="" />
        </div>
      </div>

      <div class="map">
        <img src="../img/city-map.jpg" alt="" />
      </div>

      <div class="parameters my-2">
        <div class="parameter-name">
          <strong>Год постройки дома</strong>
        </div>
        <div class="parameter-value">1995</div>
        <div class="parameter-name">
          <strong>Тип дома</strong>
        </div>
        <div class="parameter-value">Панельный</div>
        <div class="parameter-name">
          <strong>Этажность дома</strong>
        </div>
        <div class="parameter-value">16</div>
        <div class="parameter-name">
          <strong>Лифт</strong>
        </div>
        <div class="parameter-value">Пассажирский и грузовой</div>
        <div class="parameter-name">
          <strong>Количество комнат</strong>
        </div>
        <div class="parameter-value">3</div>
        <div class="parameter-name">
          <strong>Общая площадь</strong>
        </div>
        <div class="parameter-value">110 кв.м.</div>
        <div class="parameter-name">
          <strong>Жилая площадь</strong>
        </div>
        <div class="parameter-value">82 кв.м.</div>
        <div class="parameter-name">
          <strong>Площадь кухни</strong>
        </div>
        <div class="parameter-value">12 кв.м.</div>
        <div class="parameter-name">
          <strong>Этаж</strong>
        </div>
        <div class="parameter-value">3</div>
        <div class="parameter-name">
          <strong>Балкон</strong>
        </div>
        <div class="parameter-value">Один</div>
        <div class="parameter-name">
          <strong>Плита</strong>
        </div>
        <div class="parameter-value">Электрическая</div>
        <div class="parameter-name">
          <strong>Окна выходят</strong>
        </div>
        <div class="parameter-value">На улицу и во двор</div>
        <div class="parameter-name">
          <strong>Санузел</strong>
        </div>
        <div class="parameter-value">Раздельный</div>
      </div>

      <input
        type="submit"
        class="btn btn-primary btn-block"
        value="Сохранить в понравившиеся"
      />
      <a href="./profile.html" class="btn btn-dark btn-block">
        Контакты продавца
      </a>
      <button class="btn btn-danger btn-block">Удалить предложение</button>
    </Fragment>
  );
};

Proposal.propTypes = {};

export default Proposal;
