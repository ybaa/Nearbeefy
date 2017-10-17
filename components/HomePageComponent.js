import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Platform} from 'react-native';
import {Text, Button, Slider, SearchBar, Icon } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeAddress,
        updateLocationCoords,
        reverseCoordsEncoding } from '../actions/Index';
import { Constants, Location, Permissions } from 'expo';
import axios from 'axios';

const SCREE_WIDTH = Dimensions.get('window').width;

class HomePageComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      distancePrecision: 0,
      typedAddress: '',
      location: null,
      errorMessage: null
    };
  };

  componentWillMount() {
   if (Platform.OS === 'android' && !Constants.isDevice) {
     this.setState({
       errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
     });
   } else {
     this._getLocationAsync();
   }
 }
 _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       errorMessage: 'Permission to access location was denied',
     });
   }

   let location = await Location.getCurrentPositionAsync({});
   this.setState({ location });
 };

  render() {
    return (
      <View>
        <Text style={{ fontFamily: 'Quicksand-Light', fontSize: 24}}>{this.props.address}</Text>
        <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
          <View style= {{flex:4}}>
          <SearchBar
            value = {this.state.typedAddress}
            onChangeText = { (newAddress) => {
              this.setState({
                typedAddress: newAddress
              });
            }}
            lightTheme
            placeholder='Type address here...'
          />
        </View>
        <View style={{flex: 1}}>
          <Icon
            name='location'
            type='evilicon'
            size= {40}
            color='#000'
            onPress = {() => {
              let text = 'Waiting..';
               if (this.state.errorMessage) {
                 text = this.state.errorMessage;
               } else if (this.state.location) {
                  this.props.updateLocationCoords(this.state.location.coords.latitude, this.state.location.coords.longitude);
                   this.props.reverseCoordsEncoding(this.state.location.coords.latitude, this.state.location.coords.longitude).then( () => {
                     this.setState({
                       typedAddress: this.props.address
                     });
                   })
                   text = JSON.stringify(this.state.location);
               }
          }}
          />
        </View>
        </View>
      <View>
        <Slider
          maximumValue = {1000}
          value = {this.state.distancePrecision}
          onValueChange = { (value) => {
            this.setState({
              distancePrecision: parseInt(value)
            })
          }}
        />
        <Text>distance precision: {this.state.distancePrecision} m</Text>
        <Button
          onPress={()=>{
            this.props.reverseCoordsEncoding(this.props.coords.latitude, this.props.coords.longitude).then( (result) => {
              this.setState({
                typedAddress: this.props.address  // jak nie bedzie dzialac to wypierdzielic
              });
            })
            // console.log('button clicked');
            // this.props.changeAddress(this.state.typedAddress);
            // console.log("TYPED ADDRESS",this.state.typedAddress);

        }}
          title="click to change address"
          fontFamily="Quicksand-Light"
          color="#000"
          backgroundColor="#4caf50"
      />

      </View>
    </View>
    );
  }
}

function mapStatetoProps(state){
    return{
        address: state.LocationReducer.address,
        coords: state.LocationReducer.coords
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators ( {
        changeAddress: changeAddress,
        updateLocationCoords: updateLocationCoords,
        reverseCoordsEncoding: reverseCoordsEncoding
    },dispatch)
}

export default connect(mapStatetoProps,matchDispatchToProps)(HomePageComponent);

const style = StyleSheet.create({

});
