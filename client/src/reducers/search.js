import { GET_SEARCH, SEARCH_ERROR, SET_SEARCH_LOADING } from '../actions/types';

const initialState = {
  search: null,
  loading: false
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SEARCH:
      return {
        ...state,
        search: payload,
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
        loading: false
      };
    default:
      return state;
  }
}
