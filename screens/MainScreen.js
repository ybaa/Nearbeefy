import React, { Component } from 'react';
import { View, Platform, Text, Image, Button} from 'react-native';
import Expo, { Font} from 'expo';
import { STATUS_BAR_HEIGHT } from '../constants';
import icon from '../assets/icons/bigRectangleLogoWithTextTransparent.png';
import HomePageComponent from '../components/HomePageComponent'
import { Icon } from 'react-native-elements';



const cacheImage = images => images.map( (image) => {
    if(typeof image === 'string')
      return Image.prefetch(image);

      return Expo.Asset.fromModule(image).downloadAsync();
});

class MainScreen extends Component {
  constructor(props){
    super(props);
    this.  state = {
        appIsReady: false,
        fontLoaded: false
      };
  };

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



  static navigationOptions = ( {navigation} ) => ({
    title: 'Find location',
    tabBarLabel: 'Find',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='search'
        type='evilicon'
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
    ),
    headerRight: (
      <Icon
        name='user'
        type='evilicon'
        size= {32}
        color='#fff'
        style = {styles.imageStyle}
        onPress = {() => {
           navigation.navigate('LogInScreen');
        }}
      />
    )
  });




  render() {
    return (
      <View style={{  flex: 1, backgroundColor: '#ddd' }}>
      {
        this.state.fontLoaded ? (
            <HomePageComponent style={{fontFamily: 'Quicksand-Light'}} />
        ) : null
      }

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
