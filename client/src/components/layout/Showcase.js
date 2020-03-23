import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Showcase = props => {
  return (
    <Fragment>
      <div className="showcase buy text-white">
        <div className="dark-overlay">
          <div className="showcase-inner">
            <h1 className="large">Купить</h1>
            <p className="lead">Найти и купить жилье вашей мечты</p>
            <Link to="/search" className="btn btn-primary">
              Найти
            </Link>
          </div>
        </div>
      </div>
      <div className="showcase rent text-white">
        <div className="dark-overlay">
          <div className="showcase-inner">
            <h1 className="large">Снять</h1>
            <p className="lead">Найти и снять самое удобное жилье</p>
            <Link to="/search" className="btn btn-primary">
              Найти
            </Link>
          </div>
        </div>
      </div>
      <div className="showcase sell text-white">
        <div className="dark-overlay">
          <div className="showcase-inner">
            <h1 className="large">Продать</h1>
            <p className="lead">Выгодно продать вашу недвижимость</p>
            <Link to="/login" className="btn btn-primary">
              Войти
            </Link>
          </div>
        </div>
      </div>

      <div className="showcase lend text-white">
        <div className="dark-overlay">
          <div className="showcase-inner">
            <h1 className="large">Сдать</h1>
            <p className="lead">Сдать жилье в аренду по выгодным ценам</p>
            <Link to="/login" className="btn btn-primary">
              Войти
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Showcase.propTypes = {};

export default Showcase;
