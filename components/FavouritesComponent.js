import React, { Component } from "react";
import { View, Dimensions, StyleSheet, Platform } from "react-native";
import {
  Text,
  Button,
  Slider,
  SearchBar,
  Icon,
  List,
  ListItem
} from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUserData, setInitialDataFetched, encodeAddress, getPlacesNearby } from '../actions/Index';
import { Constants, Location, Permissions } from "expo";
import axios from "axios";
import { API_KEY } from "../constants/index";
import firebase from "firebase";
import { NavigationActions } from "react-navigation";

const SCREE_WIDTH = Dimensions.get("window").width;

class FavouritesComponent extends Component {
  constructor(props){
    super();
    this.state = {
      distancePrecision: 100
    }
  }
  render() {

    let favouritesList = this.props.userData.favourites.map( (current,index) => {
      return <ListItem
        key = {index}
        title = {current}
        fontFamily="Quicksand-Regular"
        onPress = { () => {
          let promise = new Promise(resolve => {
            let x = this.props.encodeAddress(current);
            resolve(x);
          });

          promise.then(() => {
            let placesPromise = new Promise(resolve => {
              let places = this.props.getPlacesNearby(
                this.props.coords.latitude,
                this.props.coords.longitude,
                this.state.distancePrecision,
                null
              );
              resolve(places);
            });

            placesPromise.then(() => {
              this.props.navi.dispatch(
                NavigationActions.navigate({ routeName: "Results" })
              );
            });
          });
        }}
      />
    });

    console.log("AUTH: ", firebase.auth().currentUser, this.props.fetchedInitialData);
    if(firebase.auth().currentUser !== null && !this.props.fetchedInitialData){
      let user = firebase.auth().currentUser;
      this.props.setUserData(user.uid).then( () => {
          this.props.setInitialDataFetched(true);
      })
    }

    let display = <Text>"You have to be signed in to have your favourites addresses"</Text>
    if(firebase.auth().currentUser !== null){
      display = <View>
        <View style={style.barAndRadiusStyle}>
          <Slider
            maximumValue={500}
            value={this.state.distancePrecision}
            thumbTintColor="#ffee58"
            style={style.sliderStyle}
            minimumTrackTintColor="#494949"
            thumbStyle={style.sliderThumbStyle}
            onValueChange={value => {
              this.setState({
                distancePrecision: parseInt(value)
              });
            }}
          />
          <Text style={style.radiusValue}>
            Search in radius: {this.state.distancePrecision} m
          </Text>
        </View>
        <List>
          {favouritesList}
        </List>
      </View>
    }



    return (
      <View>
        {display}

      </View>
    );
  }
}

function mapStatetoProps(state) {
  return {
    userData: state.UserConfigReducer,
    fetchedInitialData: state.UserConfigReducer.fetchedInitialData,
    coords: state.LocationReducer.coords
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUserData: setUserData,
      setInitialDataFetched: setInitialDataFetched,
      encodeAddress: encodeAddress,
      getPlacesNearby: getPlacesNearby
    },
    dispatch
  );
}

export default connect(mapStatetoProps, matchDispatchToProps)(FavouritesComponent);

const style = StyleSheet.create({
  sliderStyle: {
    marginTop: 8
  },
  sliderThumbStyle: {
    borderColor: "black",
    borderWidth: 1
  },
  radiusValue: {
    fontFamily: "Quicksand-Light",
    marginTop: 3
  },
  barAndRadiusStyle: {
    marginLeft: 20,
    marginRight: 20
  }
});
