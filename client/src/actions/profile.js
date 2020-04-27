import axios from 'axios';
import { GET_PROFILE, PROFILE_ERROR, SET_PROFILE_LOADING } from './types';
import { setAlert } from './alert';
import { CLOUDINARY_URL, CLOUDINARY_PRESET } from './consts';

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

  // default x-auth-token header not allowed by cloudinary
  const instance = axios.create();
  delete instance.defaults.headers.common['x-auth-token'];

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  try {
    let res = await instance.post(CLOUDINARY_URL, formData);
    const { public_id, secure_url } = res.data;

    const userPhoto = {
      photoID: public_id,
      photoURL: secure_url
    };

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

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

// Delete profile photo
export const deleteProfilePhoto = () => async dispatch => {
  try {
    dispatch(setProfileLoading());

    const res = await axios.delete('/api/profile/photo');

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
