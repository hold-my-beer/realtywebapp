import {
  GET_PROPOSAL,
  GET_PROPOSALS,
  ACTIVATE_PROPOSAL,
  DEACTIVATE_PROPOSAL,
  GET_FAVORITES,
  DELETE_PROPOSAL,
  CLEAR_PROPOSAL,
  PROPOSAL_ERROR,
  SET_PROPOSAL_LOADING
} from '../actions/types';

const initialState = {
  proposal: null,
  proposals: [],
  error: {},
  loading: false
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROPOSAL:
      return {
        ...state,
        proposal: payload,
        loading: false
      };
    case GET_PROPOSALS:
    case GET_FAVORITES:
      return {
        ...state,
        proposals: payload,
        loading: false
      };
    case DELETE_PROPOSAL:
      return {
        ...state,
        proposal: null,
        loading: false
      };
    case CLEAR_PROPOSAL:
      return {
        ...state,
        proposal: null,
        proposals: [],
        error: {},
        loading: false
      };
    case PROPOSAL_ERROR:
      return {
        ...state,
        proposal: null,
        proposals: [],
        error: payload,
        loading: false
      };
    case ACTIVATE_PROPOSAL:
    case DEACTIVATE_PROPOSAL:
      return {
        ...state,
        loading: false
      };
    case SET_PROPOSAL_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
