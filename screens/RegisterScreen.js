import React, { Component } from "react";
import { View, Platform } from "react-native";
import { STATUS_BAR_HEIGHT } from "../constants";
import { Icon } from "react-native-elements";
import RegistrationComponent from "../components/RegistrationComponent";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import translate from 'translatr';
import dictionary from '../languages/dictionary';
import { NavigationActions } from "react-navigation";


class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appIsReady: false
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      lang: this.props.language
    });
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    const params = state.params || {};
    return {
      title: translate(dictionary, 'registerTitle', params.lang || 'en').registerTitle,
      headerStyle: {
        height: Platform.OS === "android" ? 54 + STATUS_BAR_HEIGHT : 67+STATUS_BAR_HEIGHT,
        backgroundColor: "#4caf50"
      },
      headerTitleStyle: {
        marginTop: Platform.OS === "android" ? STATUS_BAR_HEIGHT : STATUS_BAR_HEIGHT -7,
        color: "white"
      },
      headerLeft: (
        <Icon
          name="ios-arrow-back"
          type="ionicon"
          size={32}
          color="#fff"
          style={style.backIconStyle}
          onPress={() => {
            const backAction = NavigationActions.back();
            navigation.dispatch(backAction)
          }}
        />
      )
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#ddd" }}>
        <RegistrationComponent navi={this.props.navigation} />
      </View>
    );
  }
}

function mapStatetoProps(state) {
  return {
    language: state.UserConfigReducer.language
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

const style = {
  backIconStyle: {
    marginTop: 25,
    paddingLeft: 15
  }
};

export default connect(mapStatetoProps, matchDispatchToProps)(RegisterScreen);
