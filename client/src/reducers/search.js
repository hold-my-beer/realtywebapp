import {
  ADD_SEARCH,
  POSTPONE_SEARCH,
  GET_SEARCHES,
  CLEAR_SEARCH,
  SEARCH_ERROR,
  SET_SEARCH_LOADING
} from '../actions/types';

const initialState = {
  search: null,
  postponedSearch: null,
  searches: [],
  loading: false
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_SEARCH:
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
    case CLEAR_SEARCH:
      return {
        ...state,
        search: null,
        postponedSearch: null,
        searches: [],
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
        searches: null,
        loading: false
      };
    default:
      return state;
  }
}
