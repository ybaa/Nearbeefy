import { combineReducers } from 'redux';
import LocationReducer from './LocationReducer';
import UserConfigReducer from './UserConfigReducer';
import NavigationReducer from './NavigationReducer';

export default combineReducers({
  LocationReducer,
  UserConfigReducer,
  NavigationReducer
});
