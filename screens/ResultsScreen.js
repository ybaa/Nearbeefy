import React, { Component } from "react";
import { View, Platform, Text, Image, Modal } from "react-native";
import Expo, { Font } from "expo";
import { STATUS_BAR_HEIGHT } from "../constants";
import ResultsComponent from "../components/ResultsComponent";
import firebase from "firebase";
import { Icon, CheckBox, Button } from "react-native-elements";
import { sortResults, setCategoryToSearch, setCategoriesState } from "../actions/Index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import categories from "../constants/categories";

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
}

  componentDidMount() {
    this.props.navigation.setParams({
      changeModalVisibility: this._changeModalVisibility
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
    console.log("params", params);
    return {
      title: "Results",
      headerStyle: {
        height: Platform.OS === "android" ? 54 + STATUS_BAR_HEIGHT : 54,
        backgroundColor: "#4caf50"
      },
      headerTitleStyle: {
        marginTop: Platform.OS === "android" ? STATUS_BAR_HEIGHT : 0,
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
            name="sort-amount-asc"
            type="font-awesome"
            size={22}
            color="#fff"
            style={style.headerRightIconSort}
            onPress={() => {
              params.changeModalVisibility();
              // this.setState({
              //   modalVisible: true
              // })
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
          <Text>Nothing to show here</Text>
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
                <Text style={style.modalTitle}> Sort </Text>
                <View style={style.checkboxesStyle}>
                  <CheckBox
                    title="distance ascending"
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
                    title="distance descending"
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
                    title="category"
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
                  title="Accept and close"
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
    nearbyPlaces: state.LocationReducer.nearbyPlaces
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      sortResults: sortResults,
      setCategoryToSearch: setCategoryToSearch,
      setCategoriesState: setCategoriesState
    },
    dispatch
  );
}

export default connect(mapStatetoProps, matchDispatchToProps)(ResultsScreen);

const style = {
  backIconStyle: {
    marginTop: 25,
    marginLeft: 20
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
  }
};
