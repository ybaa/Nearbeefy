import React, { Component } from "react";
import { Platform } from "react-native";
import { STATUS_BAR_HEIGHT } from "../constants";
import MapViewComponent from "../components/MapViewComponent";


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

export default MapViewScreen;
