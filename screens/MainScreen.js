import React, { Component } from 'react';
import { View, Platform, Text, Image} from 'react-native';
import Expo from 'expo';
import { STATUS_BAR_HEIGHT } from '../constants';
import icon from '../assets/icons/bigRectangleLogoWithTextTransparent.png';
import TestComponent from '../components/TestComponent'
import { MaterialIcons } from '@expo/vector-icons'


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
      <MaterialIcons name="menu" color="#fff" size={32}
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
    appIsReady: true
  })
}


  render() {
    return (
      <View style={{ fontFamily: 'Quicksand-Light', flex: 1, backgroundColor: '#ddd' }}>
        <TestComponent />
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

export default MainScreen;
