import React, { Component } from 'react';
import { View, Platform, Text, Image} from 'react-native';
import Expo, { Font} from 'expo';
import { STATUS_BAR_HEIGHT } from '../constants';
import icon from '../assets/icons/bigRectangleLogoWithTextTransparent.png';
import { Icon } from 'react-native-elements';
import firebase from 'firebase'

const cacheImage = images => images.map( (image) => {
    if(typeof image === 'string')
      return Image.prefetch(image);

      return Expo.Asset.fromModule(image).downloadAsync();
});

class FavouritesScreen extends Component {

  static navigationOptions = ( {navigation} ) => ({
    title: 'Favourites',
    tabBarLabel: 'Favourites',
    tabBarIcon: ({ tintColor }) => (
      <Icon
       name='favorite-border'
       type='material-icons'
       size= {25}
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
        name='ios-arrow-back'
        type='ionicon'
        size= {32}
        color='#fff'
        style = {style.backIconStyle}
        onPress= {() => {
          navigation.navigate('Main');
        }}
      />
    ),
    headerRight: (
      <View
        style={style.navHeaderRight}>
      <Icon
        name='user'
        type='evilicon'
        size= {32}
        color='#fff'
        style = {style.headerRightIconUser}
        onPress = {() => {
          firebase.auth().onAuthStateChanged( (user) => {
            if (user) {
               navigation.navigate('Profile');
            } else {
                navigation.navigate('LogIn');
            }
          });
        }}
      />
      <Icon
        name='md-more'
        type='ionicon'
        size= {32}
        color='#fff'
        style = {style.headerRightIconDots}
      />
    </View>
    )
  });

  render() {
    return (
      <View style={{  flex: 1, backgroundColor: '#fff' }}>
        <Text>favourites screen</Text>
      </View>
    );
  }
}

const style = {
  backIconStyle: {
    marginTop: 25,
    marginLeft: 20
  },
  navHeaderLeft: {
    width: 40,
    height: 40,
    marginLeft: 15,
    marginTop: 20
  },
  navHeaderRight: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  headerRightIconUser: {
    marginRight: 10,
    marginTop:25,
    marginLeft:10
  },
  headerRightIconDots: {
    marginRight: 20,
    marginTop:22,
    marginLeft:10
  }
}

export default FavouritesScreen;
