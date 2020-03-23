import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navbar = props => {
  useEffect(() => {
    toggleNavbar();
  });
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
        <div className="nav-button">
          <div className="nav-button-item"></div>
          <div className="nav-button-item"></div>
          <div className="nav-button-item"></div>
        </div>
      </nav>
      <div className="nav">
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
            <Link to="/login">
              <i className="fas fa-user"></i> Войти
            </Link>
          </li>
        </ul>
      </div>
    </Fragment>
  );
};

const toggleNavbar = () => {
  const navButton = document.querySelector('.nav-button');
  const nav = document.querySelector('.nav');

  /* Functions */
  const toggleButton = () => {
    navButton.classList.toggle('open');
  };

  const toggleNav = () => {
    nav.classList.toggle('show');
  };

  /* EVENTS */
  navButton.addEventListener('click', () => {
    toggleButton();
    toggleNav();
  });

  window.addEventListener('click', e => {
    if (
      !e.target.classList.contains('nav-button-item') &&
      navButton.classList.contains('open')
    ) {
      toggleButton();
      toggleNav();
    }
  });
};

Navbar.propTypes = {};

export default Navbar;
