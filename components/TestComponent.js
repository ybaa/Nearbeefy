import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeAddress} from '../actions/Index';

const SCREE_WIDTH = Dimensions.get('window').width;

class TestComponent extends Component {
  render() {

    return (
      <View>
        <Text h3>{this.props.address}</Text>
        <Button
          onPress={()=>{console.log('button clicked');
          this.props.changeAddress('new address');
        }}
          title="changeAddress"
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
