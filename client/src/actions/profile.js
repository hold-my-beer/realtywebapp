import axios from 'axios';
import { GET_PROFILE, PROFILE_ERROR, SET_PROFILE_LOADING } from './types';
import { setAlert } from './alert';

// Get profile
export const getProfile = () => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get('/api/profile');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR
    });
  }
};

// Update profile
export const updateProfile = (formData, history) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    history.push('/profile');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR
    });
  }
};

// Set profile loading
export const setProfileLoading = () => dispatch => {
  dispatch({
    type: SET_PROFILE_LOADING
  });
};
