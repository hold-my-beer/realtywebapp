import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Landing = props => {
  return (
    <div className="landing">
      <div className="dark-overlay">
        <div className="landing-inner p-2">
          <h1 className="x-large text-center">Недвижимость - это просто</h1>
          <h3 className="medium text-center">
            Ваш путеводитель в мире недвижимости
          </h3>

          <Link to="/showcase" className="btn btn-primary">
            Продолжить
          </Link>
        </div>
      </div>
    </div>
  );
};

Landing.propTypes = {};

export default Landing;
