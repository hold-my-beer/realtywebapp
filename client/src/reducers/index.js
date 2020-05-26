import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import profile from './profile';
import proposal from './proposal';
import province from './province';
import search from './search';

export default combineReducers({
  auth,
  alert,
  profile,
  proposal,
  province,
  search
});
