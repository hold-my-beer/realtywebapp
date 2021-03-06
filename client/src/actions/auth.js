import axios from 'axios';
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_AUTH_LOADING,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  CLEAR_PROFILE,
  CLEAR_PROPOSAL,
  CLEAR_PROVINCE,
  CLEAR_SEARCH
} from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  dispatch(setAuthLoading());

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = (
  firstName,
  secondName,
  email,
  password,
  phoneNumber
) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({
    firstName,
    secondName,
    email,
    password,
    phoneNumber
  });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout user
export const logout = () => dispatch => {
  dispatch({
    type: CLEAR_PROPOSAL
  });

  dispatch({
    type: CLEAR_PROFILE
  });

  dispatch({
    type: CLEAR_PROVINCE
  });

  dispatch({
    type: CLEAR_SEARCH
  });

  dispatch({
    type: LOGOUT
  });
};

// Set Auth Loading
export const setAuthLoading = () => dispatch => {
  dispatch({
    type: SET_AUTH_LOADING
  });
};
