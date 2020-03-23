import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Login = props => {
  return (
    <div className="container">
      <h1 className="text-primary my-1">Вход</h1>
      <p className="lead">Войдите, чтобы воспользоваться аккаунтом</p>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value="Введите адрес электронной почты..."
            placeholder="Введите адрес вашей электронной почты..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value="password"
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Войти" />
      </form>
      <p>
        Не зарегистрированы? <Link to="register.html">Регистрация</Link>
      </p>
    </div>
  );
};

Login.propTypes = {};

export default Login;
