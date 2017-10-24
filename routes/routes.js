import { StackNavigator, TabNavigator, addNavigationHelpers } from 'react-navigation';
import MainScreen from '../screens/MainScreen';
import AddLocationScreen from '../screens/AddLocationScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import LogInScreen from '../screens/LogInScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResultsScreen from '../screens/ResultsScreen';
import ProfileScreen from '../screens/ProfileScreen';

  const Tabs = TabNavigator({
        Main: { screen: MainScreen },
        AddLocation: { screen: AddLocationScreen },
        Favourites: {screen: FavouritesScreen}
      },{
        tabBarPosition: 'bottom',
        tabBarOptions: {
          showIcon: true,
          style: {
            backgroundColor: '#4caf50'
          },
          labelStyle: {
            fontSize: 10
          }
        }
      });

  const MainNavigator = StackNavigator({
    Main: { screen: Tabs },
    AddLocation: { screen: AddLocationScreen },
    Favourites: {screen: FavouritesScreen},
    LogIn: {screen: LogInScreen},
    Register: {screen: RegisterScreen},
    Results: {screen: ResultsScreen},
    Profile: {screen: ProfileScreen}
  });

  export default MainNavigator;
