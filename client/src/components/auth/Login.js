import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../actions/auth';
import { addSearch } from '../../actions/search';
import PropTypes from 'prop-types';

const Login = ({ login, addSearch, search, proposals, isAuthenticated }) => {
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

    await login(email, password);

    if (search.postponedSearch) {
      // console.log('to addSearch');
      addSearch(
        search.postponedSearch.data,
        search.postponedSearch.address,
        search.postponedSearch.name,
        search.postponedSearch.searchType
      );
    }
  };

  if (isAuthenticated && search.postponedSearch) {
    return <Redirect to="/proposals" />;
  } else if (isAuthenticated) {
    return <Redirect to="/profile" />;
  }

  return (
    <Fragment>
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
        Не зарегистрированы? <Link to="/register">Регистрация</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  addSearch: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired,
  proposals: PropTypes.array.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  search: state.search,
  proposals: state.proposal.proposals,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login, addSearch })(Login);
