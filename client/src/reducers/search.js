import {
  ADD_SEARCH,
  EDIT_SEARCH,
  GET_SEARCH,
  POSTPONE_SEARCH,
  GET_SEARCHES,
  DELETE_SEARCH,
  CLEAR_SEARCH,
  SEARCH_ERROR,
  SET_SEARCH_LOADING
} from '../actions/types';

const initialState = {
  search: null,
  postponedSearch: null,
  searches: [],
  error: {},
  loading: false
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_SEARCH:
    case EDIT_SEARCH:
    case GET_SEARCH:
      return {
        ...state,
        search: payload,
        loading: false
      };
    case POSTPONE_SEARCH:
      return {
        ...state,
        search: null,
        postponedSearch: payload,
        loading: false
      };
    case GET_SEARCHES:
      return {
        ...state,
        searches: payload,
        loading: false
      };
    case DELETE_SEARCH:
      return {
        ...state,
        search: null,
        loading: false
      };
    case CLEAR_SEARCH:
      return {
        ...state,
        search: null,
        postponedSearch: null,
        searches: [],
        error: {},
        loading: false
      };
    case SET_SEARCH_LOADING:
      return {
        ...state,
        loading: true
      };
    case SEARCH_ERROR:
      return {
        ...state,
        search: null,
        postponedSearch: null,
        searches: [],
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
