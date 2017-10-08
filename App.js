import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StackNavigator, TabNavigator } from 'react-navigation';

import store from './store';
import MainScreen from './screens/MainScreen';
import AddLocationScreen from './screens/AddLocationScreen';
import FavouritesScreen from './screens/FavouritesScreen';

export default class App extends Component {
  render() {


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
        Favourites: {screen: FavouritesScreen}
      });


    return (
      <Provider store={store}>
        <MainNavigator />
        {/* <Tabs /> */}
      </Provider>
    );
  }
}
