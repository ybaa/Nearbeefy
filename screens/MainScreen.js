import React, { Component } from "react";
import { View, Platform, Text, Image,  Modal } from "react-native";
import Expo, { Font } from "expo";
import { STATUS_BAR_HEIGHT } from "../constants";
import icon from "../assets/icons/bigRectangleLogoWithTextTransparent.png";
import HomePageComponent from "../components/HomePageComponent";
import { Icon, CheckBox, Button  } from "react-native-elements";
import firebase from "firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import translate from 'translatr';
import dictionary from '../languages/dictionary';
import { changeLanguage, openOptionsModal, syncLanguageWithDatabase } from '../actions/Index'
import { NavigationActions } from "react-navigation";


const cacheImage = images =>
  images.map(image => {
    if (typeof image === "string") return Image.prefetch(image);

    return Expo.Asset.fromModule(image).downloadAsync();
  });

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this._changeModalVisibility = this._changeModalVisibility.bind(this);
    this.state = {
      appIsReady: false,
      fontLoaded: false,
      modalVisible: this.props.modalVisible,
      pl: false,          //this is for checkboxes state - click or unclicked
      en: false
    };
  }


  _changeModalVisibility() {
    this.setState({
      modalVisible: true
    });
    switch(this.props.language){
      case "en":
        this.setState({
          en: true,
          pl: false
        });
        break;
      case "pl":
        this.setState({
          en: false,
          pl: true
        });
        break;
    }
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

    switch(this.props.language){
      case "en":
        this.setState({
          en: true,
          pl: false
        });
        break;
      case "pl":
        this.setState({
          en: false,
          pl: true
        });
        break;
    }
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


  static navigationOptions =  ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    const params = state.params || {};
    return {
      title: translate(dictionary, 'findLocation', params.lang || 'en').findLocation,
      tabBarLabel: translate(dictionary, 'findLabel', params.lang || 'en').findLabel,
      tabBarIcon: ({ tintColor }) => (
        <Icon name="search" type="evilicon" size={28} color="#fff" />
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
        <Image
          source={require("../assets/icons/transparentSmallLogo.png")}
          style={style.navHeaderLeft}
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.modalVisible}
          onRequestClose={() => {
            this.props.openOptionsModal(false);
            const setParamsActionMain = NavigationActions.setParams({
              params: { lang: this.props.language},
              key: "Main",
             });
           this.props.navigation.dispatch(setParamsActionMain);

           const setParamsActionFavs = NavigationActions.setParams({
             params: { lang: this.props.language},
             key: "Favourites",
            });
          this.props.navigation.dispatch(setParamsActionFavs);
          }}
        >
          <View style={style.modalStyle}>
            <View style={style.modalContentStyle}>
              <Text style={style.modalTitle}> {translate(dictionary, 'changeLangauge', this.props.language).changeLangauge} </Text>
              <View style={style.checkboxesStyle}>
                <CheckBox
                  title="english"
                  checked={this.state.en}
                  fontFamily="Quicksand-Light"
                  textStyle={{ fontWeight: "100" }}
                  onPress={() => {
                    this.setState({
                      en: true,
                      pl: false
                    });
                    if(firebase.auth().currentUser !== null){
                      this.props.syncLanguageWithDatabase('en', firebase.auth().currentUser.uid, this.props.userData);
                    } else {
                      this.props.changeLanguage('en');
                    }
                  }}
                />
                <CheckBox
                  title="polski"
                  checked={this.state.pl}
                  fontFamily="Quicksand-Light"
                  textStyle={{ fontWeight: "100" }}
                  onPress={() => {
                    this.setState({
                      en: false,
                      pl: true
                    });
                    if(firebase.auth().currentUser !== null){
                      this.props.syncLanguageWithDatabase('pl', firebase.auth().currentUser.uid, this.props.userData);
                    } else {
                      this.props.changeLanguage('pl');
                    }

                  }}
                />

              </View>
              <Button
                onPress={() => {
                  this.props.openOptionsModal(false);
                  const setParamsActionMain = NavigationActions.setParams({
                    params: { lang: this.props.language},
                    key: "Main",
                   });
                 this.props.navigation.dispatch(setParamsActionMain);

                 const setParamsActionFavs = NavigationActions.setParams({
                   params: { lang: this.props.language},
                   key: "Favourites",
                  });
                this.props.navigation.dispatch(setParamsActionFavs);

                }}
                title={translate(dictionary, 'acceptAndClose', this.props.language).acceptAndClose}
                fontFamily="Quicksand-Light"
                color="#fff"
                backgroundColor="#4caf50"
                borderRadius={3}
                buttonStyle={style.acceptButton}
                icon={{
                  name: "ios-arrow-back",
                  type: "ionicon",
                  color: "#fff"
                }}
              />
            </View>
          </View>
        </Modal>
        {this.state.fontLoaded ? (
          <HomePageComponent
            navi={this.props.navigation}
            style={{ fontFamily: "Quicksand-Light" }}
          />
        ) : null}
      </View>
    );
  }
}

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
  },
  modalStyle: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContentStyle: {
    flex: 1,
    marginTop: 25,
    marginBottom: 25,
    marginLeft: 25,
    marginRight: 25,
    backgroundColor: "#fff",

    alignItems: "center"
  },
  modalTitle: {
    fontFamily: "Quicksand-Light",
    fontSize: 20,
    marginTop: 25,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: "center"
  },
  checkboxesStyle: {
    marginLeft: 10,
    marginRight: 10,
    width: 240
  },
  acceptButton: {
    marginTop: 200,
    width: 210
  }
};

function mapStatetoProps(state) {
  return {
    language: state.UserConfigReducer.language,
    modalVisible: state.AdditionalOptionsModalReducer.modalVisible,
    userData: state.UserConfigReducer
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changeLanguage: changeLanguage,
      openOptionsModal: openOptionsModal,
      syncLanguageWithDatabase: syncLanguageWithDatabase
    },
    dispatch
  );
}

export default connect(mapStatetoProps, matchDispatchToProps)(MainScreen);
