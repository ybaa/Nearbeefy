import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Platform, ScrollView, Modal, Image} from 'react-native';
import {Text, Button, Slider, SearchBar, Icon, List, ListItem  } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { getPlacesNearbyNextPage, getDistance } from '../actions/Index';
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
    isReady: false,
    distancesDownloaded: false,
    modalVisible: false,
    modalContent: <View/>
  }
};

  render() {

    if(this.props.showMore){
      this.props.getPlacesNearbyNextPage(this.props.pageToken);
    }
    else{
      console.log('else', this.state.distancesDownloaded);
        if(this.state.distancesDownloaded === false){
          console.log('jestem w ifie', this.state.distancesDownloaded);
          this.setState({
            distancesDownloaded: true
          });
          let destinations = this.props.nearbyPlaces.map(place => {
            return place.latitude + ',' + place.longitude;
          });
          destinations = destinations.join('|');
          console.log('joined', destinations)
          this.props.getDistance(this.props.address, destinations).then( () => {
            console.log('done');
          })
         }
    }


    let placesList = this.props.nearbyPlaces.map( (place, index) => {
      return <ListItem
        key = {index}
        title = {place.name}
        avatar={{uri:place.icon}}
        subtitle={place.types.join(', ')}
        avatarStyle = {{backgroundColor:'#fff'}}
        badge={{value: place.distance, containerStyle: { marginTop: 5, backgroundColor:'#fff' }, textStyle: { color: '#4caf50' }}}
        hideChevron={true}
        onPress = { () => {
          this.setState({
            modalVisible: true,
            modalContent: <View style={{
            alignItems: 'center'
            }}>
             <Text style={{
               fontFamily: 'Quicksand-Light',
               fontSize: 20,
               marginTop: 25,
               marginBottom: 20,
               marginLeft: 20,
               marginRight: 20,
               textAlign: 'center'
             }}>{place.name}</Text>
             <Text style={{
               fontFamily: 'Quicksand-Light',
               fontSize: 14,
               textAlign: 'center'
             }}>types: {place.types.join(', ')}</Text>
             <Text style={{
               fontFamily: 'Quicksand-Light',
               fontSize: 14,
               textAlign: 'center',
               marginTop: 20
             }}>distance: {place.distance}</Text>
             <Text style={{
               fontFamily: 'Quicksand-Light',
               fontSize: 14,
               textAlign: 'center',
               marginTop: 20
             }}>duration: {place.duration}</Text>
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
                 buttonStyle = {style.logInButton}
                 icon={{name: 'ios-arrow-back', type: 'ionicon'}}
               />
          </View>

          })
        }}
      />
    });


    return (
      <View>
        <Text style={{ fontFamily: 'Quicksand-Light', fontSize: 24}}>{this.props.address}</Text>
        <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { this.setState({modalVisible:false})}}
            >
           <View style={{
              flex:1,
             backgroundColor: 'rgba(0,0,0,0.5)'
           }}>
           <View style={{
             flex:1,
             marginTop:25,
             marginBottom: 25,
             marginLeft: 25,
             marginRight: 25,
             backgroundColor: '#fff'
           }}>
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
  logInButton: {
    marginTop: 10,
    marginBottom: 10,
    width: 210
  }
}
