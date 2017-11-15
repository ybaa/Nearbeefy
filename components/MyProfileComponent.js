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
import { clearUserState} from "../actions/Index";
import { Constants, Location, Permissions } from "expo";
import axios from "axios";
import { API_KEY } from "../constants/index";
import firebase from "firebase";
import { NavigationActions } from "react-navigation";

const SCREE_WIDTH = Dimensions.get("window").width;

class MyProfileComponent extends Component {
  render() {
    return (
      <View style = {style.mainView}>
        <Text style={{ fontFamily: "Quicksand-Light", fontSize: 24 }}>
          My Profile content
        </Text>
        <Button
          onPress={() => {
            firebase.auth().signOut().then( (resp) => {
              this.props.clearUserState();
                const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: "Main" })]
                });
                this.props.navi.dispatch(resetAction);
              })
              .catch( (error) => {
                console.log("ERROR:", error);
              });
          }}
          title="Sign out"
          fontFamily="Quicksand-Light"
          color="#fff"
          backgroundColor="#4caf50"
          buttonStyle={style.changePassButton}
        />
        <Button
          onPress={() => {
            const navigateAction = NavigationActions.navigate({
              routeName: "ChangePassword"
            });
            this.props.navi.dispatch(navigateAction);
          }}
          title="Change your password"
          fontFamily="Quicksand-Light"
          color="#fff"
          backgroundColor="#4caf50"
          buttonStyle={style.changePassButton}
        />
      </View>
    );
  }
}

function mapStatetoProps(state) {
  return {
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearUserState: clearUserState
    },
    dispatch
  );
}

export default connect(mapStatetoProps, matchDispatchToProps)(MyProfileComponent);

const style = StyleSheet.create({
  mainView:{
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
  },
  changePassButton: {
    marginTop: 10,
    marginBottom: 10,
    width: 210
  }
});
