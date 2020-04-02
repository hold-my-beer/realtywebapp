import axios from 'axios';
import {
  GET_PROFILE,
  PROFILE_ERROR,
  SET_PROFILE_LOADING,
  GET_PROFILE_PHOTO
} from './types';
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

// Upload profile photo
export const uploadProfilePhoto = file => async dispatch => {
  dispatch(setProfileLoading());

  const url = 'https://api.cloudinary.com/v1_1/dax1o7jk6/image/upload';
  const preset = 'yxjpaicn';

  // default x-auth-token header not allowed by cloudinary
  const instance = axios.create();
  delete instance.defaults.headers.common['x-auth-token'];

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);

  try {
    let res = await instance.post(url, formData);
    console.log(res);
    const { public_id, secure_url } = res.data;

    const userPhoto = {
      id: public_id,
      url: secure_url
    };
    // const userPhoto = res.data.secure_url;

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    //const body = JSON.stringify({ userPhoto });
    const body = JSON.stringify({ userPhoto });

    res = await axios.post('/api/profile/photo', body, config);

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
