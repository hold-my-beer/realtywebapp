import axios from 'axios';
import { GET_SEARCH, SEARCH_ERROR, SET_SEARCH_LOADING } from './types';
import { setAlert } from './alert';

// Add new search parameters
export const addSearch = (formData, address) => async dispatch => {
  dispatch({
    type: SET_SEARCH_LOADING
  });

  let search = formData;
  search.address = address;

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/search', search, config);

    dispatch({
      type: GET_SEARCH,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: SEARCH_ERROR
    });
  }
};
