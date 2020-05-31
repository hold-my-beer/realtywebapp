import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';
import { setAlert } from '../../actions/alert';
import { addSearch } from '../../actions/search';
import PropTypes from 'prop-types';

const Register = ({
  setAlert,
  register,
  addSearch,
  search,
  proposals,
  isAuthenticated
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    password: '',
    password2: ''
  });

  const { firstName, secondName, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (password !== password2) {
      setAlert('Пароли не совпадают, попробуйте ввести еще раз', 'danger');
    } else {
      await register(firstName, secondName, email, password);

      if (search.postponedSearch) {
        // console.log('to addSearch');
        addSearch(
          search.postponedSearch.data,
          search.postponedSearch.address,
          search.postponedSearch.name,
          search.postponedSearch.searchType
        );
      }
    }
  };

  if (isAuthenticated && search.postponedSearch) {
    return <Redirect to="/proposals" />;
  } else if (isAuthenticated) {
    return <Redirect to="/profile" />;
  }

  return (
    <Fragment>
      <h1 className="text-primary my-1">Регистрация</h1>
      <p className="lead">
        Зарегистрируйтесь, чтобы размещать предложения и сохранять историю
        поиска
      </p>
      <form onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <label htmlFor="firstName">Имя *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            placeholder="Введите ваше имя..."
            onChange={e => onChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="secondName">Фамилия</label>
          <input
            type="text"
            id="secondName"
            name="secondName"
            value={secondName}
            placeholder="Введите вашу фамилию..."
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Введите адрес вашей электронной почты..."
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="Введите пароль..."
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Повторите пароль *</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            placeholder="Введите пароль повторно..."
            onChange={e => onChange(e)}
            required
          />
        </div>
        <small>* - поля, обязательные для заполнения</small>
        <input
          type="submit"
          className="btn btn-primary my-1"
          value="Зарегистрироваться"
        />
      </form>
      <p>
        Уже зарегистрированы? <Link to="/login">Войти</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { setAlert, register, addSearch })(
  Register
);
