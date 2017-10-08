import React, { Component } from 'react';
import { View, Platform, Text, Image} from 'react-native';
import Expo, { Font} from 'expo';
import { STATUS_BAR_HEIGHT } from '../constants';
import icon from '../assets/icons/bigRectangleLogoWithTextTransparent.png';
import { Icon } from 'react-native-elements';

const cacheImage = images => images.map( (image) => {
    if(typeof image === 'string')
      return Image.prefetch(image);

      return Expo.Asset.fromModule(image).downloadAsync();
});

class AddLocationScreen extends Component {
  static navigationOptions = () => ({
    title: 'Add location',
    tabBarLabel: 'Add',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='add-location'
        type='material-icons'
        size= {28}
        color='#fff'
      />
   ),
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

state = {
  appIsReady: false
}

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
    return (
      <View style={{  flex: 1, backgroundColor: '#ddd' }}>
      <Text>add location screen</Text>

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

export default AddLocationScreen;
