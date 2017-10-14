import React, { Component } from 'react';
import { View, Platform, Text, Image} from 'react-native';
import Expo, { Font} from 'expo';
import { STATUS_BAR_HEIGHT } from '../constants';
import icon from '../assets/icons/bigRectangleLogoWithTextTransparent.png';
import { Icon } from 'react-native-elements';
import LogIn from '../components/logIn/LogIn';
import Registration from '../components/logIn/Registration';

const cacheImage = images => images.map( (image) => {
    if(typeof image === 'string')
      return Image.prefetch(image);

      return Expo.Asset.fromModule(image).downloadAsync();
});

class LogInScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      appIsReady: false,
      nav: 'LogIn'
    };
    this.handler = this.handler.bind(this);
  }

  handler(nav){
      this.setState({
        nav: nav
      });
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

  let toShow = '';
  if(this.state.nav === 'LogIn'){
    toShow = <LogIn action={this.handler} />
  }
  else if(this.state.nav === 'Profile'){

  }
  else if(this.state.nav === 'Register'){
    toShow = <Registration action={this.handler} />
  }

    return (
      <View style={{  flex: 1, backgroundColor: '#ddd' }}>
      {toShow}

      </View>
    );
  }
}

const styles = {
  imageStyle: {
    marginTop: 25,
    marginLeft: 10
  }
}

export default LogInScreen;
