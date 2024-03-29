import React, { Component } from "react";
import { View, Dimensions, StyleSheet, Image, TextInput } from "react-native";
import { Text, Button } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import firebase from "firebase";
import { NavigationActions } from "react-navigation";
import { setUserData, setInitialDataFetched} from '../actions/Index';
import translate from 'translatr';
import dictionary from '../languages/dictionary';


class LogInComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  render() {
    return (
      <View style={style.mainView}>
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
        <Button
          onPress={() => {
            firebase
              .auth()
              .signInWithEmailAndPassword(this.state.email, this.state.password)
              .then(user => {
                if (user && user.emailVerified) {
                  this.props.setUserData(user.uid).then( () => {
                      this.props.setInitialDataFetched(true);
                  })

                  const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: "Main" })]
                  });
                  this.props.navi.dispatch(resetAction);
                } else {
                  alert("You have to verify your email first");
                }
              })
              .catch( (error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === "auth/wrong-password") {
                  alert("Wrong password");
                } else {
                  alert(errorMessage);
                }
              });
          }}
          title={translate(dictionary, 'logInButton', this.props.language).logInButton}
          fontFamily="Quicksand-Light"
          color="#000"
          backgroundColor="#ffee58"
          buttonStyle={style.logInButton}
          icon={{ name: "login", type: "simple-line-icon", color: "#000" }}
          borderRadius={3}
        />
        <Text style={style.goToRegistrationText}>
          {translate(dictionary, 'forgottenPassword', this.props.language).forgottenPassword}
        </Text>
        <Button
          onPress={() => {
            const navigateAction = NavigationActions.navigate({
              routeName: "ResetPassword"
            });
            this.props.navi.dispatch(navigateAction);
          }}
          title={translate(dictionary, 'resetPassword', this.props.language).resetPassword}
          fontFamily="Quicksand-Light"
          color="#fff"
          backgroundColor="#ef5350"
          borderRadius={3}
          buttonStyle={style.otherButton}
          icon={{ name: "account-key", type: "material-community"}}
        />

        <Text style={style.goToRegistrationText}>
          {translate(dictionary, 'doNotHaveAccount', this.props.language).doNotHaveAccount}
        </Text>
        <Button
          onPress={() => {
            const navigateAction = NavigationActions.navigate({
              routeName: "Register"
            });
            this.props.navi.dispatch(navigateAction);
          }}
          title={translate(dictionary, 'register', this.props.language).register}
          fontFamily="Quicksand-Light"
          color="#fff"
          backgroundColor="#2979ff"
          borderRadius={3}
          buttonStyle={style.otherButton}
          icon={{ name: "user-follow", type: "simple-line-icon" }}
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
  return bindActionCreators({
    setUserData: setUserData,
    setInitialDataFetched: setInitialDataFetched
  }, dispatch);
}

export default connect(mapStatetoProps, matchDispatchToProps)(LogInComponent);

const style = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#4caf50"
  },
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
    borderBottomWidth: 1
  },
  logInButton: {
    marginTop: 20,
    marginBottom: 10,
    width: 210
  },
  otherButton: {
    marginTop: 10,
    marginBottom: 10,
    width: 210
  },
  goToRegistrationText: {
    color: "#fff",
    marginTop: 15,
    marginBottom: 5
  }
});
