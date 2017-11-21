import React, { Component } from "react";
import { View, Platform, Text, Image } from "react-native";
import Expo, { Font } from "expo";
import { STATUS_BAR_HEIGHT } from "../constants";
import icon from "../assets/icons/bigRectangleLogoWithTextTransparent.png";
import { Icon } from "react-native-elements";
import LogInComponent from "../components/LogInComponent";
import { connect } from "react-redux";
import firebase from "firebase";
import { bindActionCreators } from "redux";
import translate from 'translatr';
import dictionary from '../languages/dictionary';
import { NavigationActions } from "react-navigation";

const cacheImage = images =>
  images.map(image => {
    if (typeof image === "string") return Image.prefetch(image);

    return Expo.Asset.fromModule(image).downloadAsync();
  });

class LogInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appIsReady: false
    };
  }

  componentWillMound() {
    this._loadAssetsAsync();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      lang: this.props.language
    });
  }

  async _loadAssetsAsync() {
    const imagesAssets = cacheImage([icon]);
    await Promise.all([...imagesAssets]);
    this.setState({
      appIsReady: true
    });
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    const params = state.params || {};
    return {
      title: translate(dictionary, 'logIn', params.lang || 'en').logIn,
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
    let navi = this.props.navigation;
    return (
      <View style={{ flex: 1, backgroundColor: "#ddd" }}>
        <LogInComponent navi={this.props.navigation} />
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

export default connect(mapStatetoProps, matchDispatchToProps)(LogInScreen);
