import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/profile" />;
  }

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

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
