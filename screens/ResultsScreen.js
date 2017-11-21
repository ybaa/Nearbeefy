import React, { Component } from "react";
import { View, Platform, Text, Image, Modal } from "react-native";
import Expo, { Font } from "expo";
import { STATUS_BAR_HEIGHT } from "../constants";
import ResultsComponent from "../components/ResultsComponent";
import firebase from "firebase";
import { Icon, CheckBox, Button } from "react-native-elements";
import {
  sortResults,
  setCategoryToSearch,
  setCategoriesState,
  addAddressToHistory
} from "../actions/Index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import categories from "../constants/categories";
import translate from 'translatr';
import dictionary from '../languages/dictionary';
import { NavigationActions } from "react-navigation";

const cacheImage = images =>
  images.map(image => {
    if (typeof image === "string") return Image.prefetch(image);

    return Expo.Asset.fromModule(image).downloadAsync();
  });

class ResultsScreen extends Component {
  constructor(props) {
    super(props);
    this._changeModalVisibility = this._changeModalVisibility.bind(this);
    this.state = {
      appIsReady: false,
      fontLoaded: false,
      sortDistanceAscending: false,
      sortDistanceDescending: false,
      sortByCategory: false,
      modalVisible: false
    };
  }
componentWillMount(){
  this.props.setCategoryToSearch(null);
  this.props.setCategoriesState(categories);

  if(firebase.auth().currentUser !== null && this.props.nearbyPlaces.length === 0){
      this.props.addAddressToHistory(firebase.auth().currentUser.uid, this.props.address, this.props.userData);
  }
}

  componentDidMount() {
    this.props.navigation.setParams({
      changeModalVisibility: this._changeModalVisibility,
      lang: this.props.language
    });
  }
  _changeModalVisibility() {
    this.setState({
      modalVisible: true
    });
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    const params = state.params || {};
    return {
      title: translate(dictionary, 'results',  params.lang || 'en').results,
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
            name="sort-amount-asc"
            type="font-awesome"
            size={22}
            color="#fff"
            style={style.headerRightIconSort}
            onPress={() => {
              params.changeModalVisibility();

            }}
          />
        </View>
      )
    };
  };

  render() {
    let display = <View />;
    if (this.props.nearbyPlaces.length === 0) {
      display = (
        <View>
          <Text style={style.unsignedUserText}> {translate(dictionary, 'noResults', this.props.language).noResults} </Text>
        </View>
      );
    } else {
      display = <ResultsComponent navi={this.props.navigation} />;
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View>
          {display}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({ modalVisible: false });
            }}
          >
            <View style={style.modalStyle}>
              <View style={style.modalContentStyle}>
                <Text style={style.modalTitle}> {translate(dictionary, 'sort', this.props.language).sort} </Text>
                <View style={style.checkboxesStyle}>
                  <CheckBox
                    title={translate(dictionary, 'distanceAscending', this.props.language).distanceAscending}
                    checked={this.state.sortDistanceAscending}
                    fontFamily="Quicksand-Light"
                    textStyle={{ fontWeight: "100" }}
                    onPress={() => {
                      this.setState({
                        sortDistanceAscending: !this.state.sortDistanceAscending,
                        sortDistanceDescending: false,
                        sortByCategory: false
                      });
                    }}
                  />
                  <CheckBox
                    title={translate(dictionary, 'distanceDescending', this.props.language).distanceDescending}
                    checked={this.state.sortDistanceDescending}
                    fontFamily="Quicksand-Light"
                    textStyle={{ fontWeight: "100" }}
                    onPress={() => {
                      this.setState({
                        sortDistanceAscending: false,
                        sortDistanceDescending: !this.state.sortDistanceDescending,
                        sortByCategory: false
                      });
                    }}
                  />
                  <CheckBox
                    title={translate(dictionary, 'byCategory', this.props.language).byCategory}
                    checked={this.state.sortByCategory}
                    fontFamily="Quicksand-Light"
                    textStyle={{ fontWeight: "100" }}
                    onPress={() => {
                      this.setState({
                        sortDistanceAscending: false,
                        sortDistanceDescending: false,
                        sortByCategory: !this.state.sortByCategory
                      });
                    }}
                  />
                </View>
                <Button
                  onPress={() => {
                    this.props.sortResults(
                      this.state.sortDistanceAscending,
                      this.state.sortDistanceDescending,
                      this.state.sortByCategory
                    );
                    this.setState({
                      modalVisible: false
                    });
                  }}
                  title={translate(dictionary, 'acceptAndClose', this.props.language).acceptAndClose}
                  fontFamily="Quicksand-Light"
                  color="#000"
                  backgroundColor="#ffee58"
                  borderRadius={3}
                  buttonStyle={style.acceptButton}
                  icon={{
                    name: "ios-arrow-back",
                    type: "ionicon",
                    color: "#000"
                  }}
                />
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}
function mapStatetoProps(state) {
  return {
    nearbyPlaces: state.LocationReducer.nearbyPlaces,
    userData: state.UserConfigReducer,
    address: state.LocationReducer.address,
    language: state.UserConfigReducer.language
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      sortResults: sortResults,
      setCategoryToSearch: setCategoryToSearch,
      setCategoriesState: setCategoriesState,
      addAddressToHistory: addAddressToHistory
    },
    dispatch
  );
}

export default connect(mapStatetoProps, matchDispatchToProps)(ResultsScreen);

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
  headerRightIconSort: {
    marginRight: 20,
    marginTop: 27,
    marginLeft: 10
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
  },
  unsignedUserText: {
    fontFamily: "Quicksand-Light",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center"
  }
};
