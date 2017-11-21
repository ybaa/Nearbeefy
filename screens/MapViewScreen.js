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

  static navigationOptions = ({ navigation }) =>  {
    return {
      title: "Map",
      headerStyle: {
        height: Platform.OS === "android" ? 54 + STATUS_BAR_HEIGHT : 67+STATUS_BAR_HEIGHT,
        backgroundColor: "#4caf50"
      },
      headerTitleStyle: {
        marginTop: Platform.OS === "android" ? STATUS_BAR_HEIGHT : STATUS_BAR_HEIGHT -7,
        color: "white"
      }
    }
  }

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
