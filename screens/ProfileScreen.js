import React, { Component } from "react";
import { View, Platform, Text, Image, Button } from "react-native";
import Expo, { Font } from "expo";
import { STATUS_BAR_HEIGHT } from "../constants";
import icon from "../assets/icons/bigRectangleLogoWithTextTransparent.png";
import { Icon } from "react-native-elements";
import MyProfileComponent from "../components/MyProfileComponent";
import firebase from 'firebase';
import translate from 'translatr';
import dictionary from '../languages/dictionary';
import { NavigationActions } from "react-navigation";

const cacheImage = images =>
  images.map(image => {
    if (typeof image === "string") return Image.prefetch(image);

    return Expo.Asset.fromModule(image).downloadAsync();
  });

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appIsReady: false,
      fontLoaded: false
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf")
    });
    this.setState({ fontLoaded: true });
    this.props.navigation.setParams({
      lang: this.props.language
    });
  }

  componentWillMound() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    const imagesAssets = cacheImage([icon]);
    await Promise.all([...imagesAssets]);
    this.setState({
      appIsReady: true
    });
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    const params = state.params || {};
    return {
      title: translate(dictionary, 'profile', params.lang || 'en').profile,
      headerStyle: {
        height: Platform.OS === "android" ? 54 + STATUS_BAR_HEIGHT : 67+STATUS_BAR_HEIGHT,
        backgroundColor: "#4caf50"
      },
      headerTitleStyle: {
        marginTop: Platform.OS === "android" ? STATUS_BAR_HEIGHT : STATUS_BAR_HEIGHT -7,
        color: "white"
      },
      headerLeft: (
        <Icon
          name="ios-arrow-back"
          type="ionicon"
          size={32}
          color="#fff"
          style={style.backIconStyle}
          onPress={() => {
            const backAction = NavigationActions.back();
            navigation.dispatch(backAction)
          }}
        />
      )
    }
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#ddd" }}>
        {this.state.fontLoaded ? (
          <MyProfileComponent navi={this.props.navigation} />
        ) : null}
      </View>
    );
  }
}

const style = {
  backIconStyle: {
    marginTop: 25,
    paddingLeft: 15
  },
  navHeaderLeft: {
    width: 40,
    height: 40,
    marginLeft: 15,
    marginTop: 20
  },
  navHeaderRight: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  headerRightIconUser: {
    marginRight: 10,
    marginTop: 25,
    marginLeft: 10
  },
  headerRightIconDots: {
    paddingRight: 10,
    marginRight: 10,
    marginTop: 22,
    paddingLeft: 10
  }
};


export default ProfileScreen;
