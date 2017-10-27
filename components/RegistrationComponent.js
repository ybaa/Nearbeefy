import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Image, TextInput} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import firebase from 'firebase';
import {StackNavigator, NavigationActions } from 'react-navigation';

const SCREE_WIDTH = Dimensions.get('window').width;


class RegistrationComponent extends Component {
  constructor(props){
    super(props);
    state = {
      email: '',
      password: '',
      confirmPassword: ''
    }
  }

  render() {

    return (
      <View style={{flex:1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#4caf50'
      }}>
        <Image
          style={style.bigLogo}
          source={require('../assets/icons/bigRectangleLogoWithTextTransparent.png')}
        />
        <TextInput style={style.inputStyle}
          placeholder = "email"
          onChangeText = {(email) => {this.setState({ email: email})}}
          placeholderTextColor = '#fff'
        />
        <TextInput style={style.inputStyle}
          placeholder = "password"
          onChangeText = {(password) => {this.setState({ password: password})}}
          placeholderTextColor = '#fff'
          secureTextEntry = {true}
        />
        <TextInput style={style.inputStyle}
          placeholder = "confirm password"
          onChangeText = {(confirm) => {this.setState({ confirmPassword: confirm})}}
          placeholderTextColor = '#fff'
          secureTextEntry = {true}
        />
        <Button
          onPress={()=>{
            if(this.state.password === this.state.confirmPassword){
              firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((user)=>{
                alert('Registration succeeded!');
                if(user && user.emailVerified === false){
                 user.sendEmailVerification().then(function(){
                   console.log("email verification sent to user");
                 });
               }
               const navigateAction = NavigationActions.navigate({routeName:'LogIn'});
               this.props.navi.dispatch(navigateAction)
              }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
                // ...
              });
            }
            else{
              alert('password and confirmation are different');
            }
        }}

            title="Register"
            fontFamily="Quicksand-Light"
            color="#000"
            backgroundColor="#ffee58"
            buttonStyle = {style.registerButton}
            icon={{name: 'user-follow', type: 'simple-line-icon', color: '#000'}}
            borderRadius={3}
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

export default connect(mapStatetoProps,matchDispatchToProps)(RegistrationComponent);

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
    color: '#fff',
    fontFamily: 'Quicksand-Light'
  },
  registerButton: {
    marginTop: 20,
    marginBottom: 10,
    width: 210
  }
});
