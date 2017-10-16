import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StackNavigator, TabNavigator } from 'react-navigation';
import * as firebase from 'firebase';
import store from './store';
import MainScreen from './screens/MainScreen';
import AddLocationScreen from './screens/AddLocationScreen';
import FavouritesScreen from './screens/FavouritesScreen';
import LogInScreen from './screens/LogInScreen';


export default class App extends Component {
  render() {
    let config = {
        apiKey: "AIzaSyB-H9xpLk9Zmt3JoGrx2Yx1LnnSXOj4qqQ",
        authDomain: "nearbeefy.firebaseapp.com",
        databaseURL: "https://nearbeefy.firebaseio.com",
        projectId: "nearbeefy",
        storageBucket: "nearbeefy.appspot.com",
        messagingSenderId: "32273090789"
      };
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    
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
        LogInScreen: {screen: LogInScreen}
      });


    return (
      <Provider store={store}>
        <MainNavigator />
        {/* <Tabs /> */}
      </Provider>
    );
  }
}
