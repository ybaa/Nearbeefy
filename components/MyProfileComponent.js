import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Button,
  Icon
} from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clearUserState} from "../actions/Index";
import firebase from "firebase";
import { NavigationActions } from "react-navigation";
import translate from 'translatr';
import dictionary from '../languages/dictionary';


class MyProfileComponent extends Component {
  render() {
    return (
      <View style = {style.mainView}>
        <Text style={{ fontFamily: "Quicksand-Light", fontSize: 24, marginTop: 20 }}>
          {translate(dictionary, 'hello', this.props.language).hello} {firebase.auth().currentUser.email} !
        </Text>
        <Icon
          name="user-o"
          type="font-awesome"
          size={50}
          style={style.userIconStyle}
          color="#000"

        />
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
          title={translate(dictionary, 'signOut', this.props.language).signOut}
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
          title={translate(dictionary, 'changePassword', this.props.language).changePassword}
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
    language: state.UserConfigReducer.language
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
  },
  userIconStyle: {
    padding: 20,
    margin: 20
  }
});
