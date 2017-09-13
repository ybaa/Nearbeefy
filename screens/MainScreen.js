import React, { Component } from 'react';
import { View, Platform, Text, Image} from 'react-native';
import Expo from 'expo';
import { STATUS_BAR_HEIGHT } from '../constants';
import icon from '../assets/icons/transparentSmallLogo.png';
import TestComponent from '../components/TestComponent'

const cacheImage = images => images.map( (image) => {
    if(typeof image === 'string')
      return Image.prefetch(image);

      return Expo.Asset.fromModule(image).downloadAsync();
});

class MainScreen extends Component {
  static navigationOptions = () => ({
    title: 'Nearbeefy',
    headerStyle: {
      height: Platform.OS === 'android' ? 54 + STATUS_BAR_HEIGHT : 54,
      backgroundColor: '#4caf50'
    },
    headerTitleStyle: {
      marginTop: Platform.OS === 'android' ? STATUS_BAR_HEIGHT : 0,
      color: 'white'
    },
    headerLeft: (
      <Image
        source={icon}
        style={styles.imageStyle}
       />
    )
  });

state = {
  appIsReady: false
}

componentWillMound() {
  this._loadAssetsAsync();
}

async _loadAssetsAsync() {
  const imagesAssets = cacheImage([icon]);
  await Promise.all([...imagesAssets]);
  this.setState({
    appIsReady:   true
  })
}

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#ddd' }}>
        <TestComponent />
      </View>
    );
  }
}

const styles = {
  imageStyle: {
    marginTop: 20,
    marginLeft: 10,
    width: 40,
    height:40
  }
}

export default MainScreen;
