import React, { Component } from "react";
import { View, Dimensions, StyleSheet, Image, TextInput } from "react-native";
import { Text, Button } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import firebase from "firebase";
import { StackNavigator, NavigationActions } from "react-navigation";
import { setUserId } from '../actions/Index';

const SCREE_WIDTH = Dimensions.get("window").width;


class ChangePasswordComponent extends Component {
  constructor(props) {
    super(props);
    state = {
      email: ""
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
          placeholder="email"
          onChangeText={email => {
            this.setState({ email: email });
          }}
          placeholderTextColor="#fff"
        />

        <Button
          onPress={() => {
            let auth = firebase.auth();
            let emailAddress = this.state.email;

            auth.sendPasswordResetEmail(emailAddress).then( () => {
              alert('Your password has been reset. Check your mailbox');
              const navigateAction = NavigationActions.navigate({
                routeName: "LogIn"
              });
              this.props.navi.dispatch(navigateAction);
              
            }).catch( (error) => {
              if(typeof this.state.email !== 'undefined'){
                alert('Insert email above');
              } else {
                alert('Cannot reser your password now. Please, try again later or verify the email you have typed');
              }
            });
          }}
          title="Reset password"
          fontFamily="Quicksand-Light"
          color="#fff"
          backgroundColor="#ef5350"
          buttonStyle={style.registerButton}
          icon={{
            name: "account-key",
            type: "material-community",
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
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

export default connect(mapStatetoProps, matchDispatchToProps)(ChangePasswordComponent);

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
    fontFamily: "Quicksand-Light"
  },
  registerButton: {
    marginTop: 20,
    marginBottom: 10,
    width: 210
  }
});
