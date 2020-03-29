import {
  GET_PROFILE,
  PROFILE_ERROR,
  SET_PROFILE_LOADING
} from '../actions/types';

const initialState = {
  profile: null,
  loading: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        profile: null,
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
