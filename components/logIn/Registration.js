import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Image, TextInput} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import firebase from 'firebase';
import {updateNav} from '../../actions/Index';

const SCREE_WIDTH = Dimensions.get('window').width;


class Registration extends Component {
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
          placeholder = "email"
          onChangeText = {(email) => {this.setState({ email: email})}}
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
          secureTextEntry = {true}
        />
        <TextInput style={{
          width: 210,
          height: 50,
          color: '#fff'
        }}
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
                this.props.updateNav('LogIn');
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
            backgroundColor="#fdd835"
          />
      </View>
    );
  }
}

function mapStatetoProps(state){
    return{
      username: state.UserConfigReducer.username,
      nav: state.NavigationReducer.nav
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators ( {
      updateNav: updateNav
    },dispatch)
}

export default connect(mapStatetoProps,matchDispatchToProps)(Registration);

const style = StyleSheet.create({

});
