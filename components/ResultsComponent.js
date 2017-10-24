import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Platform} from 'react-native';
import {Text, Button, Slider, SearchBar, Icon } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { getPlacesNearbyNextPage } from '../actions/Index';
import { Constants, Location, Permissions } from 'expo';
import axios from 'axios';
import {API_KEY} from '../constants/index';

const SCREE_WIDTH = Dimensions.get('window').width;

class ResultsComponent extends Component {

  render() {
    console.log('im in render');

    if(this.props.showMore){
      this.props.getPlacesNearbyNextPage(this.props.pageToken);
    }

    return (
      <View>
        <Text style={{ fontFamily: 'Quicksand-Light', fontSize: 24}}>{this.props.address}</Text>

    </View>
    );
  }
}

function mapStatetoProps(state){
    return{
        address: state.LocationReducer.address,
        coords: state.LocationReducer.coords,
        showMore: state.LocationReducer.showMore,
        pageToken: state.LocationReducer.pageToken
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators ( {
        getPlacesNearbyNextPage: getPlacesNearbyNextPage
    },dispatch)
}

export default connect(mapStatetoProps,matchDispatchToProps)(ResultsComponent);

const style = StyleSheet.create({

});
