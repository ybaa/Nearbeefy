import { combineReducers } from 'redux';
import LocationReducer from './LocationReducer';
import UserConfigReducer from './UserConfigReducer';

export default combineReducers({
  LocationReducer,
  UserConfigReducer
});
