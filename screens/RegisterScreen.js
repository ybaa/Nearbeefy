import React, { Component } from 'react';
import { View, Platform, Text, Image} from 'react-native';
import { STATUS_BAR_HEIGHT } from '../constants';
import { Icon } from 'react-native-elements';
import RegistrationComponent from '../components/RegistrationComponent';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const cacheImage = images => images.map( (image) => {
    if(typeof image === 'string')
      return Image.prefetch(image);

      return Expo.Asset.fromModule(image).downloadAsync();
});

class RegisterScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      appIsReady: false
    };
  }

  static navigationOptions = (navigation) => ({
    title: 'Log in',
    headerStyle: {
      height: Platform.OS === 'android' ? 54 + STATUS_BAR_HEIGHT : 54,
      backgroundColor: '#4caf50'
    },
    headerTitleStyle: {
      marginTop: Platform.OS === 'android' ? STATUS_BAR_HEIGHT : 0,
      color: 'white'
    },
    headerLeft: (
      <Icon
        name='ios-arrow-back'
        type='ionicon'
        size= {32}
        color='#fff'
        style = {style.backIconStyle}
        onPress= {() => {
          console.log('navigation', navigation);
          navigation.navigation.goBack();
        }}
      />
    )
  });

  render() {

    return (
      <View style={{  flex: 1, backgroundColor: '#ddd' }}>
        <RegistrationComponent navi={this.props.navigation}/>
      </View>
    );
  }
}

function mapStatetoProps(state){
    return{
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators ( {
    },dispatch)
}


const style = {
  backIconStyle: {
    marginTop: 25,
    marginLeft: 20
  }
}

export default connect(mapStatetoProps,matchDispatchToProps)(RegisterScreen);
