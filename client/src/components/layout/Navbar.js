import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';

const Navbar = ({ logout, isAuthenticated }) => {
  const toggleMenu = () => {
    const navButton = document.querySelector('.nav-button');
    const nav = document.querySelector('.nav');

    navButton.classList.toggle('open');
    nav.classList.toggle('show');
  };

  const guestLinks = (
    <ul className="medium">
      <li className="my-2">
        <Link to="/search">
          <i className="fas fa-shopping-cart"></i> Купить
        </Link>
      </li>
      <li className="my-2">
        <Link to="/search">
          <i className="far fa-calendar-alt"></i> Снять
        </Link>
      </li>
      <li className="my-2">
        <Link to="/login">
          <i className="fas fa-tag"></i> Продать
        </Link>
      </li>
      <li className="my-2">
        <Link to="/login">
          <i className="fas fa-key"></i> Сдать
        </Link>
      </li>
      <li className="my-2">
        <Link to="/login">
          <i className="fas fa-user"></i> Войти
        </Link>
      </li>
    </ul>
  );

  const authLinks = (
    <ul className="medium">
      <li className="my-2">
        <Link to="/search">
          <i className="fas fa-shopping-cart"></i> Купить
        </Link>
      </li>
      <li className="my-2">
        <Link to="/search">
          <i className="far fa-calendar-alt"></i> Снять
        </Link>
      </li>
      <li className="my-2">
        <Link to="/create-proposal">
          <i className="fas fa-tag"></i> Продать
        </Link>
      </li>
      <li className="my-2">
        <Link to="/create-proposal">
          <i className="fas fa-key"></i> Сдать
        </Link>
      </li>
      <li className="my-2">
        <Link onClick={logout} to="/login">
          <i className="fas fa-sign-out-alt"></i> Выйти
        </Link>
      </li>
    </ul>
  );

  return (
    <Fragment>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <h1 className="text-center">
              <i className="far fa-building"></i> НЭП
            </h1>
          </Link>
        </div>
        <div className="nav-button" onClick={() => toggleMenu()}>
          <div className="nav-button-item"></div>
          <div className="nav-button-item"></div>
          <div className="nav-button-item"></div>
        </div>
      </nav>
      <div className="nav">{isAuthenticated ? authLinks : guestLinks}</div>
    </Fragment>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(Navbar);
