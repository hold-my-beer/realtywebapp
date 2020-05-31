import {
  GET_PROVINCES,
  CLEAR_PROVINCE,
  PROVINCE_ERROR,
  SET_PROVINCE_LOADING
} from '../actions/types';

const initialState = {
  provinces: [],
  loading: false
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROVINCES:
      return {
        ...state,
        provinces: payload,
        loading: false
      };
    case CLEAR_PROVINCE:
      return {
        ...state,
        provinces: [],
        loading: false
      };
    case PROVINCE_ERROR:
      return {
        ...state,
        provinces: [],
        loading: false
      };
    case SET_PROVINCE_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
