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
import { getPlacesNearbyNextPage } from "../actions/Index";
import { Constants, Location, Permissions } from "expo";
import axios from "axios";
import { API_KEY } from "../constants/index";
import firebase from "firebase";

const SCREE_WIDTH = Dimensions.get("window").width;

class MyProfileComponent extends Component {
  render() {
    return (
      <View>
        <Text style={{ fontFamily: "Quicksand-Light", fontSize: 24 }}>
          My Profile content
        </Text>
        <Button
          onPress={() => {
            firebase
              .auth()
              .signOut()
              .then(function() {
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: "Main" })]
                });
                this.props.navi.dispatch(resetAction);
              })
              .catch(function(error) {
                // An error happened.
              });
          }}
          title="sign out"
          fontFamily="Quicksand-Light"
          color="#fff"
          backgroundColor="#4caf50"
        />
      </View>
    );
  }
}

function mapStatetoProps(state) {
  return {
    address: state.LocationReducer.address,
    coords: state.LocationReducer.coords,
    showMore: state.LocationReducer.showMore,
    pageToken: state.LocationReducer.pageToken
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPlacesNearbyNextPage: getPlacesNearbyNextPage
    },
    dispatch
  );
}

export default connect(mapStatetoProps, matchDispatchToProps)(
  MyProfileComponent
);
