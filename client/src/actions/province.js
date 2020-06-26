import axios from 'axios';
import { GET_PROVINCES, PROVINCE_ERROR, SET_PROVINCE_LOADING } from './types';
import { setAlert } from './alert';

// Get all provinces
export const getProvinces = () => async dispatch => {
  dispatch(setProvinceLoading);

  try {
    const res = await axios.get('/api/provinces');

    dispatch({
      type: GET_PROVINCES,
      payload: res.data
    });
  } catch (err) {
    // const errors = err.response.data.errors;

    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    // }

    dispatch({
      type: PROVINCE_ERROR,
      payload: err.response.data
    });
  }
};

// Set province loading
export const setProvinceLoading = () => dispatch => {
  dispatch({
    type: SET_PROVINCE_LOADING
  });
};
