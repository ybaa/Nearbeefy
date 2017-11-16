import { StackNavigator, TabNavigator, addNavigationHelpers } from 'react-navigation';
import MainScreen from '../screens/MainScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import LogInScreen from '../screens/LogInScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResultsScreen from '../screens/ResultsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

  const Tabs = TabNavigator({
        Main: { screen: MainScreen },
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
    Favourites: {screen: FavouritesScreen},
    LogIn: {screen: LogInScreen},
    Register: {screen: RegisterScreen},
    Results: {screen: ResultsScreen},
    Profile: {screen: ProfileScreen},
    ResetPassword: {screen: ResetPasswordScreen},
    ChangePassword: {screen: ChangePasswordScreen}
  });

  export default MainNavigator;
