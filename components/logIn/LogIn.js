import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Image, TextInput} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import firebase from 'firebase';
import {StackNavigator} from 'react-navigation';
import { NavigationActions } from 'react-navigation';


const SCREE_WIDTH = Dimensions.get('window').width;


class LogIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  render() {



    return (
      <View style={{flex:1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#4caf50'
      }}>
        <Image
          style={{width: 250,
                  height: 70
                }}
          source={require('../../assets/icons/bigRectangleLogoWithTextTransparent.png')}
        />
        <TextInput style={{
          width: 210,
          height: 50,
          color: '#fff'
        }}
          placeholder = "username"
          onChangeText = {(username) => {this.setState({ username: username})}}
          placeholderTextColor = '#fff'
        />
        <TextInput style={{
          width: 210,
          height: 50,
          color: '#fff'
        }}
          placeholder = "password"
          onChangeText = {(password) => {this.setState({ password: password})}}
          placeholderTextColor = '#fff'
        />
        <Button
          onPress={()=>{

          }}
            title="Log in"
            fontFamily="Quicksand-Light"
            color="#000"
            backgroundColor="#fdd835"
            secureTextEntry = {true}
          />

          <Text style={{color: '#fff'}}>  Do not have any account yet? </Text>
          <Button
            onPress={()=>{
              this.props.action('Register'); 
            }}
              title="Click here to register"
              fontFamily="Quicksand-Light"
              color="#fff"
              backgroundColor="#4fc3f7"
              secureTextEntry = {true}
            />
        <Text style={{color: '#fff'}}>  or </Text>
        <Button
          onPress={()=>{
            this.navigator.dispatch(
              NavigationActions.navigate({
                routeName: target,
              }),
            )


            // let googleLogInProvider = new firebase.auth.GoogleAuthProvider();
            // // firebase.austh().signInWithRedirect(googleLogInProvider);
            // firebase.auth().getRedirectResult().then(function(result) {
            //   if (result.credential) {
            //     // This gives you a Google Access Token. You can use it to access the Google API.
            //     var token = result.credential.accessToken;
            //     console.log(token);
            //     // ...
            //   }
            //   // The signed-in user info.
            //   var user = result.user;
            // }).catch(function(error) {
            //   // Handle Errors here.
            //   var errorCode = error.code;
            //   var errorMessage = error.message;
            //   // The email of the user's account used.
            //   var email = error.email;
            //   // The firebase.auth.AuthCredential type that was used.
            //   var credential = error.credential;
            //   console.log(errorMessage)
            //   // ...
            // });


        }}
          title="Log in with Google+"
          fontFamily="Quicksand-Light"
          color="#fff"
          backgroundColor="#ef5350"
      />
      </View>
    );
  }
}

function mapStatetoProps(state){
    return{
      username: state.UserConfigReducer.username
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators ( {
    },dispatch)
}

export default connect(mapStatetoProps,matchDispatchToProps)(LogIn);

const style = StyleSheet.create({

});
