import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Platform, ScrollView} from 'react-native';
import {Text, Button, Slider, SearchBar, Icon, List, ListItem  } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { getPlacesNearbyNextPage } from '../actions/Index';
import { Constants, Location, Permissions } from 'expo';
import axios from 'axios';
import {API_KEY} from '../constants/index';


const SCREE_WIDTH = Dimensions.get('window').width;

const list = [
  {
    title: 'Appointments',
    icon: 'av-timer'
  },
  {
    title: 'Trips',
    icon: 'flight-takeoff'
  }
]


class ResultsComponent extends Component {
constructor(props){
  super(props);
  this.state = {
    isReady: false
  }
};

  render() {

    if(this.props.showMore){
      this.props.getPlacesNearbyNextPage(this.props.pageToken);
      // this.setState({
      //   isReady: false
      // });
    }
    else{

      //
      // this.setState({
      //   isReady: true
      // });
    }

    let placesList = this.props.nearbyPlaces.map( (place, index) => {
      return <ListItem
        key = {index}
        title = {place.name}
        avatar={{uri:place.icon}}
        subtitle={place.type}
      />
    });


    return (



      <ScrollView>
        <Text style={{ fontFamily: 'Quicksand-Light', fontSize: 24}}>{this.props.address}</Text>
        <List>
          {placesList}
        </List>
      </ScrollView>
    );
  }
}

function mapStatetoProps(state){
    return{
        address: state.LocationReducer.address,
        coords: state.LocationReducer.coords,
        showMore: state.LocationReducer.showMore,
        pageToken: state.LocationReducer.pageToken,
        nearbyPlaces: state.LocationReducer.nearbyPlaces
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators ( {
        getPlacesNearbyNextPage: getPlacesNearbyNextPage
    },dispatch)
}

export default connect(mapStatetoProps,matchDispatchToProps)(ResultsComponent);
