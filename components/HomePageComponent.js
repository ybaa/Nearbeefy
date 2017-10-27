import React, {Component} from 'react';
import {View, Dimensions, StyleSheet, Platform} from 'react-native';
import {Text, Button, Slider, SearchBar, Icon } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateLocationCoords,
        reverseCoordsEncoding,
        encodeAddress,
        getPlacesNearby
} from '../actions/Index';
import { Constants, Location, Permissions } from 'expo';
import { NavigationActions } from 'react-navigation';

const SCREE_WIDTH = Dimensions.get('window').width;

class HomePageComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      distancePrecision: 100,
      typedAddress: '',
      location: null,
      errorMessage: null
    };
  };

  componentWillMount() {
   if (Platform.OS === 'android' && !Constants.isDevice) {
     this.setState({
       errorMessage: 'This will not work on an Android emulator. Try it on your device!',
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
      <View style={ style.mainCardStyle }>
        <View style={ style.searchBarAndIcon }>
          <View style= {{flex:4}}>
            <SearchBar
              value = {this.state.typedAddress}
              onChangeText = { (newAddress) => {
                this.setState({
                  typedAddress: newAddress
                });
              }}
              placeholder='Type address here...'
              containerStyle = {style.searchBarStyle}
              inputStyle= {style.searchBarInput}
            />
          </View>
          <View style={{flex: 1}}>
            <Icon
              name='location'
              type='evilicon'
              size= {47}
              style={style.getLocationIconStyle}
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
          maximumValue = {500}
          value = {this.state.distancePrecision}
            thumbTintColor = '#ffee58'
          style={style.sliderStyle}
          minimumTrackTintColor= '#494949'
          thumbStyle = {style.sliderThumbStyle}
          onValueChange = { (value) => {
            this.setState({
              distancePrecision: parseInt(value)
            })
          }}
        />
        <Text
          style={style.radiusValue}
        >
          Search in radius: {this.state.distancePrecision} m
        </Text>
        <Button
          onPress={()=>{
            let promise = new Promise( (resolve) => {
                let x = this.props.encodeAddress(this.state.typedAddress);
                resolve(x)
            });

            promise.then( () => {
              let placesPromise = new Promise ( (resolve) => {
                let places = this.props.getPlacesNearby(this.props.coords.latitude, this.props.coords.longitude, this.state.distancePrecision);
                resolve(places);
              });

              placesPromise.then ( () => {
                this.props.navi.dispatch(NavigationActions.navigate({routeName:'Results'}));
              });
            })
          }}
          title="get places nearby"
          fontFamily="Quicksand-Light"
          color="#fff"
          backgroundColor="#4caf50"
          buttonStyle = {style.getPlacesButton}
          icon={{name: 'directions', type: 'simple-line-icon'}}
          borderRadius={1}
        />
      </View>
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
        updateLocationCoords: updateLocationCoords,
        reverseCoordsEncoding: reverseCoordsEncoding,
        encodeAddress: encodeAddress,
        getPlacesNearby: getPlacesNearby
    },dispatch)
}

export default connect(mapStatetoProps,matchDispatchToProps)(HomePageComponent);

const style = StyleSheet.create({
  mainCardStyle: {
    margin:10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 3,
    borderRightColor: '#ddd',
    borderRightWidth: 3,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    borderLeftColor: '#ddd',
    borderLeftWidth: 1,
    backgroundColor: '#eee',
    padding:20
  },
  searchBarAndIcon: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  searchBarStyle: {
    backgroundColor:'#eee',
    borderTopWidth:0,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb'
  },
  searchBarInput: {
    backgroundColor: '#eee',
    fontFamily: "Quicksand-Light",
    marginBottom: 1
  },
  getLocationIconStyle: {
    paddingTop: 12,
    paddingLeft: 5
  },
  sliderStyle: {
    marginTop: 8
  },
  sliderThumbStyle: {
    borderColor: 'black',
    borderWidth: 1
  },
  radiusValue: {
    fontFamily:"Quicksand-Light"
  },
  getPlacesButton: {
    marginTop: 15,
    marginLeft: 0,
    paddingLeft: 0
  }
});
