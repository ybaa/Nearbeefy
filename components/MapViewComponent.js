import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MapView } from "expo";


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
