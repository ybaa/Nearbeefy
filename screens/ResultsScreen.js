import React, { Component } from 'react';
import { View, Platform, Text, Image, Button} from 'react-native';
import Expo, { Font} from 'expo';
import { STATUS_BAR_HEIGHT } from '../constants';
import icon from '../assets/icons/bigRectangleLogoWithTextTransparent.png';
import { Icon } from 'react-native-elements';
import ResultsComponent from '../components/ResultsComponent';



const cacheImage = images => images.map( (image) => {
    if(typeof image === 'string')
      return Image.prefetch(image);

      return Expo.Asset.fromModule(image).downloadAsync();
});

class ResultsScreen extends Component {
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
    title: 'Results',
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
           navigation.navigate('LogIn');
        }}
      />
    )
  });




  render() {
    console.log("results screen");
    return (
      <View style={{  flex: 1, backgroundColor: '#fff' }}>
      {
        this.state.fontLoaded ? (
            <ResultsComponent navi={this.props.navigation}/>
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

export default ResultsScreen;
