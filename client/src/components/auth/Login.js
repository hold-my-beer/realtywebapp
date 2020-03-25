import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';

const Login = ({ login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    login(email, password);
  };

  return (
    <div className="container">
      <h1 className="text-primary my-1">Вход</h1>
      <p className="lead">Войдите, чтобы воспользоваться аккаунтом</p>
      <form onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Введите адрес вашей электронной почты..."
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="Введите ваш пароль..."
            onChange={e => onChange(e)}
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

Login.propTypes = {
  login: PropTypes.func.isRequired
};

export default connect(null, { login })(Login);
