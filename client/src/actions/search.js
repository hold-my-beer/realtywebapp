import axios from 'axios';
import {
  GET_SEARCHES,
  ADD_SEARCH,
  POSTPONE_SEARCH,
  SEARCH_ERROR,
  SET_SEARCH_LOADING
} from './types';
import { setAlert } from './alert';

// Get user's searches
export const getSearches = () => async dispatch => {
  dispatch(setSearchLoading());

  try {
    const res = await axios.get('/api/search');

    dispatch({
      type: GET_SEARCHES,
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

// Add new search parameters
export const addSearch = (
  formData,
  address,
  searchName,
  searchType
  // search,
  // history = null
  // postponeSearch = false
) => async dispatch => {
  dispatch(setSearchLoading());

  let search = {};

  search.data = formData;
  search.address = address;
  search.name = searchName;
  search.searchType = searchType;
  // console.log(search);

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/search', search, config);

    dispatch({
      type: ADD_SEARCH,
      payload: res.data
    });

    // if (history) {
    //   history.push('/login');
    // }
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

// Temporarily upload to state search parameters
export const postponeSearch = (
  formData,
  address,
  searchName,
  searchType
) => async dispatch => {
  // dispatch(setSearchLoading());

  let search = {};
  search.data = formData;
  search.address = address;
  search.name = searchName;
  search.searchType = searchType;
  // let search = {};

  // for (let item in formData) {
  //   // params.set(item.toString(), formData[item]);
  //   search[item.toString()] = formData[item];
  // }

  // for (let item in address) {
  //   // params.set(item.toString(), formData[item]);
  //   search[item.toString()] = address[item];
  // }

  // search.name = searchData.searchName;
  // search.searchType = searchType;

  dispatch({
    // type: ADD_SEARCH,
    type: POSTPONE_SEARCH,
    payload: search
  });

  // const config = {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // };

  // try {
  //   const res = await axios.post('/api/search', search, config);

  //   dispatch({
  //     type: ADD_SEARCH,
  //     payload: res.data
  //   });

  //   // if (history) {
  //   //   history.push('/login');
  //   // }
  // } catch (err) {
  //   const errors = err.response.data.errors;

  //   if (errors) {
  //     errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
  //   }

  //   dispatch({
  //     type: SEARCH_ERROR
  //   });
  // }
};

// Set proposal loading
export const setSearchLoading = () => dispatch => {
  dispatch({
    type: SET_SEARCH_LOADING
  });
};
