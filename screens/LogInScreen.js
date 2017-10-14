import React, { Component } from 'react';
import { View, Platform, Text, Image} from 'react-native';
import Expo, { Font} from 'expo';
import { STATUS_BAR_HEIGHT } from '../constants';
import icon from '../assets/icons/bigRectangleLogoWithTextTransparent.png';
import { Icon } from 'react-native-elements';
import LogIn from '../components/logIn/LogIn';
import Registration from '../components/logIn/Registration';
import {connect} from 'react-redux';
import firebase from 'firebase';
import {updateNav} from '../actions/Index';
import {bindActionCreators} from 'redux';

const cacheImage = images => images.map( (image) => {
    if(typeof image === 'string')
      return Image.prefetch(image);

      return Expo.Asset.fromModule(image).downloadAsync();
});

class LogInScreen extends Component {
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
        name='menu'
        type='material-icons'
        size= {32}
        color='#fff'
        style = {styles.imageStyle}
      />
    )
  });



async componentDidMount() {
    await Font.loadAsync({
      'Quicksand-Light': require('../assets/fonts/Quicksand-Light.ttf'),
    });
    this.setState({ fontLoaded: true});
  }

componentWillMound() {
  this._loadAssetsAsync();
}

async _loadAssetsAsync() {
  const imagesAssets = cacheImage([icon]);
  await Promise.all([...imagesAssets]);
  this.setState({
    appIsReady: true
  })
}


  render() {
const { navigate } = this.props.navigation;

  let toShow = <Text>nothing to show</Text>
  if(this.props.nav === 'LogIn'){
    toShow = <LogIn />

  }
  else if(this.props.nav === 'Profile'){
    toShow = <Text>it's gonna be the profile content</Text>

  }
  else if(this.props.nav === 'Register'){
    toShow = <Registration />
  }


    return (
      <View style={{  flex: 1, backgroundColor: '#ddd' }}>
      {toShow}

      </View>
    );
  }
}

function mapStatetoProps(state){
    return{
      nav: state.NavigationReducer.nav
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators ( {
      updateNav: updateNav
    },dispatch)
}




const styles = {
  imageStyle: {
    marginTop: 25,
    marginLeft: 10
  }
}

export default connect(mapStatetoProps,matchDispatchToProps)(LogInScreen);
