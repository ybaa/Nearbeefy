import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import {bindActionCreators } from 'redux';
import { StackNavigator, TabNavigator, addNavigationHelpers, NavigationActions  } from 'react-navigation';
import { BackHandler } from 'react-native';
import * as firebase from 'firebase';
import store from './store';
import MainScreen from './screens/MainScreen';
import AddLocationScreen from './screens/AddLocationScreen';
import FavouritesScreen from './screens/FavouritesScreen';
import LogInScreen from './screens/LogInScreen';
import MainNavigator from './routes/routes';


class App extends Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }
  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0 || nav.routes[0].index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
     const { dispatch, nav } = this.props;

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

    return (
      <MainNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })} />
    );
  }
}

const mapStateToProps = (state) => ({
  nav: state.NavigationReducer,
});


const AppWithNavigation = connect(mapStateToProps)(App);

export default () => (
  <Provider store = {store}>
    <AppWithNavigation />
  </Provider>
);
