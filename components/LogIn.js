import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Image, TextInput} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import firebase from 'firebase';
import {StackNavigator, NavigationActions } from 'react-navigation';

const SCREE_WIDTH = Dimensions.get('window').width;


class LogIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  render() {
    console.log('n',this.props.navi);


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
          source={require('../assets/icons/bigRectangleLogoWithTextTransparent.png')}
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
        <Button
          onPress={()=>{
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((user) => {
              if(user && user.emailVerified){
                const navigateAction = NavigationActions.navigate({routeName:'Main'});
                this.props.navi.dispatch(navigateAction)
              }else{
                alert("You have to verify your email first");
              }
            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
              } else {
                alert(errorMessage);
              }
              console.log(error);
            });
          }}
            title="Log in"
            fontFamily="Quicksand-Light"
            color="#000"
            backgroundColor="#fdd835"
          />

          <Text style={{color: '#fff'}}>  Do not have any account yet? </Text>
          <Button
            onPress={()=>{
              //navigate('Register');
              const navigateAction = NavigationActions.navigate({routeName:'Register'});
              this.props.navi.dispatch(navigateAction)
            }}
              title="Click here to register"
              fontFamily="Quicksand-Light"
              color="#fff"
              backgroundColor="#4fc3f7"
            />
        <Text style={{color: '#fff'}}>  or </Text>
        <Button
          onPress = { () => {
          alert('it is going to be implemented in the future')
          }}
          title="Log in with Google"
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
