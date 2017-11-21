import { combineReducers } from "redux";
import LocationReducer from "./LocationReducer";
import UserConfigReducer from "./UserConfigReducer";
import NavigationReducer from "./NavigationReducer";
import FilterModalReducer from './FilterModalReducer';
import AdditionalOptionsModalReducer from './AdditionalOptionsModalReducer'

export default combineReducers({
  LocationReducer,
  UserConfigReducer,
  NavigationReducer,
  FilterModalReducer,
  AdditionalOptionsModalReducer  
});
