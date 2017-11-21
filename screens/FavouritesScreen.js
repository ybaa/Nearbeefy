import React, { Component } from "react";
import { View, Platform, Text, Image, Modal } from "react-native";
import Expo, { Font } from "expo";
import { STATUS_BAR_HEIGHT } from "../constants";
import icon from "../assets/icons/bigRectangleLogoWithTextTransparent.png";
import { Icon, CheckBox } from "react-native-elements";
import firebase from "firebase";
import FavouritesComponent from '../components/FavouritesComponent'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUserData, setInitialDataFetched, openOptionsModal } from '../actions/Index';
import translate from 'translatr';
import dictionary from '../languages/dictionary';

class FavouritesScreen extends Component {
  constructor(props) {
    super(props);
    this._changeModalVisibility = this._changeModalVisibility.bind(this);
    this.state = {
      fontLoaded: false,
      modalVisible: this.props.modalVisible
    };
  }

  _changeModalVisibility() {
    this.setState({
      modalVisible: true
    });
    this.props.openOptionsModal(true);
  }

  async componentDidMount() {
    await Font.loadAsync({
      "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
      "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
    this.props.navigation.setParams({
      changeModalVisibility: this._changeModalVisibility,
      lang: this.props.language
    });
  }

  componentWillMount() {
    this._loadAssetsAsync();
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
      title: translate(dictionary, 'favourites', params.lang || 'en').favourites,
      tabBarLabel: translate(dictionary, 'favourites', params.lang || 'en').favourites,
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="favorite-border"
          type="material-icons"
          size={25}
          color="#fff"
        />
      ),
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
            navigation.navigate("Main");
          }}
        />
      ),
      headerRight: (
        <View style={style.navHeaderRight}>
          <Icon
            name="user"
            type="evilicon"
            size={32}
            color="#fff"
            style={style.headerRightIconUser}
            onPress={() => {
              if(firebase.auth().currentUser !== null){
                navigation.navigate("Profile");
              } else {
                navigation.navigate("LogIn");
              }
            }}
          />
          <Icon
            name="md-more"
            type="ionicon"
            size={32}
            color="#fff"
            style={style.headerRightIconDots}
            onPress = { () => {
              params.changeModalVisibility();
            }}
          />
        </View>
      )
    }
  };



  render() {


    return (

      <View style={{ flex: 1, backgroundColor: "#eee" }}>
        {this.state.fontLoaded ? (
          <FavouritesComponent
            navi={this.props.navigation}
          />
        ) : null}
      </View>
    );



  }
}

function mapStatetoProps(state) {
  return {
    fetchedInitialData: state.UserConfigReducer.fetchedInitialData,
    language: state.UserConfigReducer.language,
    modalVisible: state.AdditionalOptionsModalReducer.modalVisible
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUserData: setUserData,
      setInitialDataFetched: setInitialDataFetched,
      openOptionsModal: openOptionsModal
    },
    dispatch
  );
}

export default connect(mapStatetoProps, matchDispatchToProps)(FavouritesScreen);

const style = {
  backIconStyle: {
    marginTop: 25,
    paddingLeft: 15
  },
  navHeaderLeft: {
    width: 40,
    height: 40,
    marginLeft: 15,
    marginTop: 20
  },
  navHeaderRight: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  headerRightIconUser: {
    marginRight: 10,
    marginTop: 25,
    marginLeft: 10
  },
  headerRightIconDots: {
    paddingRight: 10,
    marginRight: 10,
    marginTop: 22,
    paddingLeft: 10
  }
};
