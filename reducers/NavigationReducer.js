import {NavigationActions} from 'react-navigation';
import MainNavigator from '../routes/routes';
import { StackNavigator} from 'react-navigation';

console.log('reducer');
const initialNavState = MainNavigator.router.getStateForAction(NavigationActions.reset({
	index: 0,
	actions: [
	  NavigationActions.navigate({
		routeName: 'Main',
	  }),
	],
}))

//const initialState = MainNavigator.router.getStateForAction(NavigationActions.init());

export default (state = initialNavState, action) => {
  const nextState = MainNavigator.router.getStateForAction(action, state);
  return nextState || state;
};
