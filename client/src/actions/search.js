import axios from 'axios';
import {
  GET_SEARCHES,
  GET_SEARCH,
  ADD_SEARCH,
  EDIT_SEARCH,
  POSTPONE_SEARCH,
  SEARCH_ERROR,
  SET_SEARCH_LOADING,
  DELETE_SEARCH
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
    // const errors = err.response.data.errors;

    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    // }

    dispatch({
      type: SEARCH_ERROR,
      payload: err.response.data
    });
  }
};

// Get user search by id
export const getSearchById = id => async dispatch => {
  dispatch(setSearchLoading());
  try {
    const res = await axios.get(`/api/search/${id}`);

    dispatch({
      type: GET_SEARCH,
      payload: res.data
    });
  } catch (err) {
    // const errors = err.response.data.errors;

    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    // }

    dispatch({
      type: SEARCH_ERROR,
      payload: err.response.data
    });
  }
};

// Add new search parameters
export const addSearch = (
  formData,
  address,
  searchName,
  searchType
) => async dispatch => {
  dispatch(setSearchLoading());

  let search = {};

  search.data = formData;
  search.address = address;
  search.name = searchName;
  search.searchType = searchType;

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
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: SEARCH_ERROR,
      payload: err.response.data
    });
  }
};

// Edit search parameters
export const editSearch = (
  id,
  formData,
  address,
  searchName,
  searchType
) => async dispatch => {
  dispatch(setSearchLoading());

  let search = {};

  search.data = formData;
  search.address = address;
  search.name = searchName;
  search.searchType = searchType;

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(`/api/search/${id}`, search, config);

    dispatch(setAlert('Критерии поиска успешно изменены', 'success'));

    dispatch({
      type: EDIT_SEARCH,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: SEARCH_ERROR,
      payload: err.response.data
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
  let search = {};
  search.data = formData;
  search.address = address;
  search.name = searchName;
  search.searchType = searchType;

  dispatch({
    type: POSTPONE_SEARCH,
    payload: search
  });
};

// Delete search
export const deleteSearch = (id, history) => async dispatch => {
  try {
    await axios.delete(`/api/search/${id}`);

    dispatch({
      type: DELETE_SEARCH
    });

    dispatch(setAlert('Поиск успешно удален', 'success'));

    history.push('/my-searches');
  } catch (err) {
    // const errors = err.response.data.errors;

    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    // }

    dispatch({
      type: SEARCH_ERROR,
      payload: err.response.data
    });
  }
};

// Set search loading
export const setSearchLoading = () => dispatch => {
  dispatch({
    type: SET_SEARCH_LOADING
  });
};
