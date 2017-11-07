import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Platform, ScrollView, Modal, Image, ActivityIndicator } from 'react-native';
import {Text, Button, Slider, SearchBar, Icon, List, ListItem  } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { getPlacesNearbyNextPage, getDistance } from '../actions/Index';
import { Constants, Location, Permissions } from 'expo';
import axios from 'axios';
import {API_KEY} from '../constants/index';
import MapView from 'react-native-maps';
import {StackNavigator, NavigationActions } from 'react-navigation';
import MapViewComponent from './MapViewComponent';


const SCREE_WIDTH = Dimensions.get('window').width;

class ResultsComponent extends Component {
constructor(props){
  super(props);
  this.state = {
    isReady: false,
    distancesDownloaded: false,
    modalVisible: false,
    modalContent: <View/>,
    loadingCircle: <View style={{flexDirection: 'row', marginTop:5}}><Text>Loading distances...</Text><ActivityIndicator/></View>
  }
};

  render() {

    if(this.props.showMore){
      this.props.getPlacesNearbyNextPage(this.props.pageToken);
    }
    else{
        if(this.state.distancesDownloaded === false){
          this.setState({
            distancesDownloaded: true
          });
          let destinations = this.props.nearbyPlaces.map(place => {
            return place.latitude + ',' + place.longitude;
          });
          destinations = destinations.join('|');
          this.props.getDistance(this.props.address, destinations).then( () => {
            this.setState({
              loadingCircle: <View/>
            })
          });
        }
    }


    let placesList = this.props.nearbyPlaces.map( (place, index) => {
      return <ListItem
        key = {index}
        title = {place.name}
        avatar={{uri:place.icon}}
        subtitle={place.types.join(', ')}
        avatarStyle = {{backgroundColor:'#fff'}}
        subtitleStyle = {{fontWeight: "100"}}
        fontFamily = "Quicksand-Regular"
        badge={{
          value: place.distance,
          containerStyle: { marginTop: 5, backgroundColor:'#fff' },
          textStyle: { color: '#4caf50', fontFamily: 'Quicksand-Regular' }
        }}
        hideChevron={true}
        onPress = { () => {
          this.setState({
            modalVisible: true,
            modalContent: <View
              style={{
                alignItems: 'center'
            }}>
             <Text style={ style.modalName }> {place.name} </Text>
             <Text style={ style.modalTypes }> types: {place.types.join(', ')} </Text>
             <Text style={ style.modalDistance }> distance: {place.distance}</Text>
             <Text style={ style.modalDuration }> time to get there: {place.duration}</Text>
             <MapViewComponent
                destinationLatitude={place.latitude}
                destinationLongitude={place.longitude}
                originLatitude={this.props.coords.latitude}
                originLongitude={this.props.coords.longitude} />
             <Button
               onPress={()=>{
                 this.setState({
                   modalVisible: false
                 });
               }}
               title="Close"
               fontFamily="Quicksand-Light"
               color="#fff"
               backgroundColor="#e57373"
               borderRadius={3}
               buttonStyle = {style.closeModalButton}
               icon={{name: 'ios-arrow-back', type: 'ionicon'}}
            />
          </View>
          })
        }}
      />
    });


    return (
      <View>
        <Text
          style={style.address}>{this.props.address}
        </Text>
          {this.state.loadingCircle}
        <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { this.setState({modalVisible:false})}}
        >
           <View style={ style.modalStyle }>
             <View style={ style.modalContentStyle }>
               {this.state.modalContent}
             </View>
           </View>
        </Modal>
        <ScrollView style={{marginBottom:27}}>
          <List>
            {placesList}
          </List>
        </ScrollView>
      </View>
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
        getPlacesNearbyNextPage: getPlacesNearbyNextPage,
        getDistance:getDistance
    },dispatch)
}

export default connect(mapStatetoProps,matchDispatchToProps)(ResultsComponent);


const style = {
  closeModalButton: {
    marginTop: 300,
    marginBottom: 10,
    width: 210
  },
  address: {
    fontFamily: 'Quicksand-Light',
    fontSize: 24, marginTop:5,
    marginBottom:7
  },
  modalStyle: {
    flex:1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContentStyle: {
    flex:1,
    marginTop:25,
    marginBottom: 25,
    marginLeft: 25,
    marginRight: 25,
    backgroundColor: '#fff'
  },
  modalName: {
    fontFamily: 'Quicksand-Light',
    fontSize: 20,
    marginTop: 25,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center'
  },
  modalTypes: {
    fontFamily: 'Quicksand-Light',
    fontSize: 14,
    textAlign: 'center'
  },
  modalDistance: {
    fontFamily: 'Quicksand-Light',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20
  },
  modalDuration: {
    fontFamily: 'Quicksand-Light',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10
  }
}
