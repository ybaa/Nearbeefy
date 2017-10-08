import React, {Component} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {Text, Button, Slider, SearchBar, Icon } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeAddress} from '../actions/Index';


const SCREE_WIDTH = Dimensions.get('window').width;

class HomePageComponent extends Component {
  state = {
    distancePrecision: 0,
    typedAddress: ''
  }

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
              console.log('icon pressed');
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
          onPress={()=>{console.log('button clicked');
          this.props.changeAddress(this.state.typedAddress);
          console.log("TYPED ADDRESS",this.state.typedAddress);
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
        address: state.LocationReducer.address
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators ( {
        changeAddress: changeAddress
    },dispatch)
}

export default connect(mapStatetoProps,matchDispatchToProps)(HomePageComponent);

const style = StyleSheet.create({

});
