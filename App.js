import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StackNavigator, TabNavigator } from 'react-navigation';

import store from './store';
import MainScreen from './screens/MainScreen';
import AddLocationScreen from './screens/AddLocationScreen';

export default class App extends Component {
  render() {


          const Tabs = TabNavigator({
                Main: { screen: MainScreen },
                AddLocation: { screen: AddLocationScreen }
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
        AddLocation: { screen: AddLocationScreen }
      });


    return (
      <Provider store={store}>
        <MainNavigator />
        {/* <Tabs /> */}
      </Provider>
    );
  }
}
