import React, { Component } from "react";
import { View, Dimensions, StyleSheet, Image, TextInput } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import firebase from "firebase";
import { NavigationActions } from "react-navigation";
import translate from "translatr";
import dictionary from "../languages/dictionary";

class ChangePasswordComponent extends Component {
  constructor(props) {
    super(props);
    state = {
      password: "",
      confirmPassword: ""
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#eee"
        }}
      >
        <Image
          style={style.bigLogo}
          source={require("../assets/icons/bigRectangleLogoWithBlackText2.png")}
        />

        <TextInput
          style={style.inputStyle}
          placeholder={
            translate(dictionary, "newPassword", this.props.language).newPassword
          }
          placeholderTextColor="#000"
          onChangeText={password => {
            this.setState({ password: password });
          }}
          secureTextEntry={true}
        />
        <TextInput
          style={style.inputStyle}
          placeholder={
            translate(dictionary, "confirmPassword", this.props.language)
              .confirmPassword
          }
          placeholderTextColor="#000"
          onChangeText={confirm => {
            this.setState({ confirmPassword: confirm });
          }}
          secureTextEntry={true}
        />
        <Button
          onPress={() => {
            if (this.state.password === this.state.confirmPassword) {
              let user = firebase.auth().currentUser;

              user.updatePassword(this.state.password)
                .then(() => {
                  alert("Your password has been succesfully changed");
                  const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: "Main" })]
                  });
                  this.props.navi.dispatch(resetAction);
                })
                .catch(error => {
                  alert(
                    "Cannot change your password now. Please, try again later"
                  );
                });
            } else {
              alert("password and confirmation are different");
            }
          }}
          title={translate(dictionary, "accept", this.props.language).accept}
          fontFamily="Quicksand-Light"
          color="#fff"
          backgroundColor="#4caf50"
          buttonStyle={style.registerButton}
          icon={{
            name: "md-checkmark-circle-outline",
            type: "ionicon",
            color: "#fff"
          }}
          borderRadius={3}
        />
      </View>
    );
  }
}

function mapStatetoProps(state) {
  return {
    username: state.UserConfigReducer.username,
    language: state.UserConfigReducer.language
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
    },
    dispatch
  );
}

export default connect(mapStatetoProps, matchDispatchToProps)(
  ChangePasswordComponent
);

const style = StyleSheet.create({
  bigLogo: {
    width: 250,
    height: 70,
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 10
  },
  inputStyle: {
    width: 210,
    height: 50,
    color: "#000",
    fontFamily: "Quicksand-Light",
    borderBottomWidth: 1,
    borderBottomColor: "#333"
  },
  registerButton: {
    marginTop: 20,
    marginBottom: 10,
    width: 210
  }
});
