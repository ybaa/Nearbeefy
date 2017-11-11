import React, { Component } from "react";
import { View, Platform, Text, Image, Button } from "react-native";
import Expo, { Font } from "expo";
import { STATUS_BAR_HEIGHT } from "../constants";
import icon from "../assets/icons/bigRectangleLogoWithTextTransparent.png";
import MapViewComponent from "../components/MapViewComponent";
import { Icon } from "react-native-elements";
import firebase from "firebase";

const cacheImage = images =>
  images.map(image => {
    if (typeof image === "string") return Image.prefetch(image);

    return Expo.Asset.fromModule(image).downloadAsync();
  });

class MapViewScreen extends Component {
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

  static navigationOptions = ({ navigation }) => ({
    title: "Map",
    headerStyle: {
      height: Platform.OS === "android" ? 54 + STATUS_BAR_HEIGHT : 54,
      backgroundColor: "#4caf50"
    },
    headerTitleStyle: {
      marginTop: Platform.OS === "android" ? STATUS_BAR_HEIGHT : 0,
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
          console.log("navigation", navigation);
          navigation.navigation.goBack();
        }}
      />
    ),
    headerRight: (
      <View style={style.navHeaderRight}>
        <Icon
          name="user"
          type="evilicon"
          size={32}
          color="#fff"
          style={style.headerRightIconUser}
          onPress={() => {
            if(firebase.auth().currentUser !== null){
              navigation.navigate("Profile");
            } else {
              navigation.navigate("LogIn");
            }
          }}
        />
        <Icon
          name="md-more"
          type="ionicon"
          size={32}
          color="#fff"
          style={style.headerRightIconDots}
        />
      </View>
    )
  });

  render() {
    return <MapViewComponent />;
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
    flexDirection: "row",
    alignItems: "stretch"
  },
  headerRightIconUser: {
    marginRight: 10,
    marginTop: 25,
    marginLeft: 10
  },
  headerRightIconDots: {
    marginRight: 20,
    marginTop: 22,
    marginLeft: 10
  }
};

export default MapViewScreen;
