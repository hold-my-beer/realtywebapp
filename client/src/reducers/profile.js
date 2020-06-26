import {
  GET_PROFILE,
  GET_SELLER_PROFILE,
  ADD_TO_FAVORITES,
  DELETE_FROM_FAVORITES,
  CLEAR_PROFILE,
  PROFILE_ERROR,
  FAVORITES_ERROR,
  SET_PROFILE_LOADING
} from '../actions/types';

const initialState = {
  profile: null,
  sellerProfile: null,
  loading: false,
  error: {}
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case ADD_TO_FAVORITES:
    case DELETE_FROM_FAVORITES:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_SELLER_PROFILE:
      return {
        ...state,
        sellerProfile: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        sellerProfile: null,
        error: {},
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        profile: null,
        sellerProfile: null,
        error: payload,
        loading: false
      };
    case FAVORITES_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case SET_PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
