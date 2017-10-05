import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import {Text, Button, Slider, SearchBar } from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeAddress} from '../actions/Index';


const SCREE_WIDTH = Dimensions.get('window').width;

class TestComponent extends Component {
  state = {
    distancePrecision: 0,
    typedAddress: ''
  }
  render() {

    return (
      <View>
        <Text style={{ fontFamily: 'Quicksand-Light', fontSize: 24}}>{this.props.address}</Text>
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

export default connect(mapStatetoProps,matchDispatchToProps)(TestComponent);
