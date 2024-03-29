import React, { Component } from "react";
import { View,  StyleSheet, Image, TextInput } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import firebase from "firebase";
import { NavigationActions } from "react-navigation";
import { addUserToDatabase } from '../actions/Index';
import translate from 'translatr';
import dictionary from '../languages/dictionary';

class RegistrationComponent extends Component {
  constructor(props) {
    super(props);
    state = {
      email: "",
      password: "",
      confirmPassword: "",
      postKey: ''
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#4caf50"
        }}
      >
        <Image
          style={style.bigLogo}
          source={require("../assets/icons/bigRectangleLogoWithTextTransparent.png")}
        />
        <TextInput
          style={style.inputStyle}
          placeholder={translate(dictionary, 'email', this.props.language).email}
          onChangeText={email => {
            this.setState({ email: email });
          }}
          placeholderTextColor="#fff"
        />
        <TextInput
          style={style.inputStyle}
          placeholder={translate(dictionary, 'password', this.props.language).password}
          onChangeText={password => {
            this.setState({ password: password });
          }}
          placeholderTextColor="#fff"
          secureTextEntry={true}
        />
        <TextInput
          style={style.inputStyle}
          placeholder={translate(dictionary, 'confirmPassword', this.props.language).confirmPassword}
          onChangeText={confirm => {
            this.setState({ confirmPassword: confirm });
          }}
          placeholderTextColor="#fff"
          secureTextEntry={true}
        />
        <Button
          onPress={() => {
            if (this.state.password === this.state.confirmPassword) {
              firebase
                .auth()
                .createUserWithEmailAndPassword(
                  this.state.email,
                  this.state.password
                )
                .then(user => {
                  alert("Registration succeeded! Check your mailbox and verify your account.");
                  if (user && user.emailVerified === false) {
                    user.sendEmailVerification().then( () => {
                      this.props.addUserToDatabase(this.state.email, user.uid, this.props.language).then( () => {
                        const navigateAction = NavigationActions.navigate({
                          routeName: "LogIn"
                        });
                        this.props.navi.dispatch(navigateAction);
                      })
                    });
                  }


                })
                .catch( (error) => {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  alert(errorMessage);
                });
            } else {
              alert("password and confirmation are different");
            }
          }}
          title={translate(dictionary, 'register', this.props.language).register}
          fontFamily="Quicksand-Light"
          color="#000"
          backgroundColor="#ffee58"
          buttonStyle={style.registerButton}
          icon={{
            name: "user-follow",
            type: "simple-line-icon",
            color: "#000"
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
  return bindActionCreators({
    addUserToDatabase: addUserToDatabase
  }, dispatch);
}

export default connect(mapStatetoProps, matchDispatchToProps)(
  RegistrationComponent
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
    color: "#fff",
    fontFamily: "Quicksand-Light",
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 13
  },
  registerButton: {
    marginTop: 20,
    marginBottom: 10,
    width: 210
  }
});
