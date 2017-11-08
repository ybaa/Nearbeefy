import React, { Component } from "react";
import { View, Dimensions, StyleSheet, Platform } from "react-native";
import {
  Text,
  Button,
  Slider,
  SearchBar,
  Icon,
  List,
  ListItem
} from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Constants, Location, Permissions } from "expo";
import axios from "axios";
import { API_KEY } from "../constants/index";
import { MapView } from "expo";

const SCREE_WIDTH = Dimensions.get("window").width;

class MapViewComponent extends Component {
  render() {
    let destinationLatLng = {
      latitude: this.props.destinationLatitude,
      longitude: this.props.destinationLongitude
    };
    let originLatLng = {
      latitude: this.props.originLatitude,
      longitude: this.props.originLongitude
    };

    return (
      <MapView
        style={style.mapStyle}
        initialRegion={{
          latitude: this.props.destinationLatitude,
          longitude: this.props.destinationLongitude,
          latitudeDelta: 0.00722,
          longitudeDelta: 0.00421
        }}
      >
        <MapView.Marker coordinate={destinationLatLng} />
        <MapView.Marker coordinate={originLatLng} pinColor="#2979ff" />
      </MapView>
    );
  }
}

function mapStatetoProps(state) {
  return {};
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStatetoProps, matchDispatchToProps)(MapViewComponent);

const style = StyleSheet.create({
  mapStyle: {
    position: "absolute",
    top: 190,
    left: 30,
    right: 30,
    bottom: 80,
    justifyContent: "flex-end",
    alignItems: "center"
  }
});
