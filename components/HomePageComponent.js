import React, { Component } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  Modal,
  ScrollView
} from "react-native";
import {
  Text,
  Button,
  Slider,
  SearchBar,
  Icon,
  CheckBox
} from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateLocationCoords,
  reverseCoordsEncoding,
  encodeAddress,
  getPlacesNearby,
  setEmail,
  setUserData,
  setInitialDataFetched,
  setCategoryToSearch,
  openFilterModal
} from "../actions/Index";
import { Constants, Location, Permissions } from "expo";
import { NavigationActions } from "react-navigation";
import categories from "../constants/categories";
import firebase from 'firebase';

const SCREE_WIDTH = Dimensions.get("window").width;

class HomePageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      distancePrecision: 100,
      typedAddress: "",
      location: null,
      errorMessage: null,
      categoriesState: categories,
    };
  }



  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "This will not work on an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }



  }
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  render() {
    if(firebase.auth().currentUser !== null && !this.props.fetchedInitialData){
      let user = firebase.auth().currentUser;
      this.props.setUserData(user.uid).then( () => {
          this.props.setInitialDataFetched(true);
      })
    }

    let categoriesCheckBoxes = this.state.categoriesState.map(current => {
      return (
        <CheckBox
          title={current.name}
          checked={current.checked}
          fontFamily="Quicksand-Light"
          textStyle={{ fontWeight: "100" }}
          onPress={() => {
            let newState = this.state.categoriesState.map(category => {
              if (category.name === current.name) {
                this.props.setCategoryToSearch(current.name)
                return {
                  name: current.name,
                  checked: !current.checked
                };
              } else {
                return {
                  name: category.name,
                  checked: false
                };
              }
            });
            this.setState({
              categoriesState: newState
            });
          }}
        />
      );
    });

    console.log('MODAL VIS: ',this.props.modalVisible);
    return (
      <View style={style.mainCardStyle}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.modalVisible}
          onRequestClose={() => {
            this.props.openFilterModal(false);
          }}
        >
          <ScrollView style={style.modalStyle}>
            <View style={style.modalContentStyle}>
              <Text style={style.modalTitle}> Choose type: </Text>
              <View style={style.checkboxesStyle}>{categoriesCheckBoxes}</View>
              <Button
                onPress={() => {
                  this.props.openFilterModal(false);
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
          </ScrollView>
        </Modal>
        <View style={style.searchBarAndIcon}>
          <View style={{ flex: 4 }}>
            <SearchBar
              value={this.state.typedAddress}
              onChangeText={newAddress => {
                this.setState({
                  typedAddress: newAddress
                });
              }}
              placeholder="Type address here..."
              containerStyle={style.searchBarStyle}
              inputStyle={style.searchBarInput}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Icon
              name="location"
              type="evilicon"
              size={47}
              style={style.getLocationIconStyle}
              color="#000"
              onPress={() => {
                let text = "Waiting..";
                if (this.state.errorMessage) {
                  text = this.state.errorMessage;
                } else if (this.state.location) {
                  this.props.updateLocationCoords(
                    this.state.location.coords.latitude,
                    this.state.location.coords.longitude
                  );
                  this.props
                    .reverseCoordsEncoding(
                      this.state.location.coords.latitude,
                      this.state.location.coords.longitude
                    )
                    .then(() => {
                      this.setState({
                        typedAddress: this.props.address
                      });
                    });
                  text = JSON.stringify(this.state.location);
                }
              }}
            />
          </View>
        </View>
        <View>
          <Slider
            maximumValue={500}
            value={this.state.distancePrecision}
            thumbTintColor="#ffee58"
            style={style.sliderStyle}
            minimumTrackTintColor="#494949"
            thumbStyle={style.sliderThumbStyle}
            onValueChange={value => {
              this.setState({
                distancePrecision: parseInt(value)
              });
            }}
          />
          <View style={style.searchBarAndIcon}>
            <View style={{ flex: 4 }}>
              <Text style={style.radiusValue}>
                Search in radius: {this.state.distancePrecision} m
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Icon
                name="filter"
                type="material-community"
                size={20}
                color="#000"
                onPress={() => {
                this.props.openFilterModal(true);
                }}
              />
            </View>
          </View>

          <Button
            onPress={() => {
              let promise = new Promise(resolve => {
                let x = this.props.encodeAddress(this.state.typedAddress);
                resolve(x);
              });

              promise.then(() => {
                let placesPromise = new Promise(resolve => {
                  let places = this.props.getPlacesNearby(
                    this.props.coords.latitude,
                    this.props.coords.longitude,
                    this.state.distancePrecision,
                    this.props.categoryToSearch
                  );
                  resolve(places);
                });

                placesPromise.then(() => {
                  this.props.navi.dispatch(
                    NavigationActions.navigate({ routeName: "Results" })
                  );
                });
              });
            }}
            title="get places nearby"
            fontFamily="Quicksand-Light"
            color="#fff"
            backgroundColor="#4caf50"
            buttonStyle={style.getPlacesButton}
            icon={{ name: "directions", type: "simple-line-icon" }}
            borderRadius={1}
          />
        </View>
      </View>
    );
  }
}

function mapStatetoProps(state) {
  return {
    address: state.LocationReducer.address,
    coords: state.LocationReducer.coords,
    showMore: state.LocationReducer.showMore,
    pageToken: state.LocationReducer.pageToken,
    fetchedInitialData: state.UserConfigReducer.fetchedInitialData,
    modalVisible: state.FilterModalReducer.modalVisible,
    categoryToSearch: state.FilterModalReducer.categoryToSearch
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateLocationCoords: updateLocationCoords,
      reverseCoordsEncoding: reverseCoordsEncoding,
      encodeAddress: encodeAddress,
      getPlacesNearby: getPlacesNearby,
      setEmail: setEmail,
      setUserData: setUserData,
      setInitialDataFetched: setInitialDataFetched,
      setCategoryToSearch: setCategoryToSearch,
      openFilterModal: openFilterModal
    },
    dispatch
  );
}

export default connect(mapStatetoProps, matchDispatchToProps)(HomePageComponent);

const style = StyleSheet.create({
  mainCardStyle: {
    margin: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 3,
    borderRightColor: "#ddd",
    borderRightWidth: 3,
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    borderLeftColor: "#ddd",
    borderLeftWidth: 1,
    backgroundColor: "#eee",
    padding: 20
  },
  searchBarAndIcon: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  searchBarStyle: {
    backgroundColor: "#eee",
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb"
  },
  searchBarInput: {
    backgroundColor: "#eee",
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
    borderColor: "black",
    borderWidth: 1
  },
  radiusValue: {
    fontFamily: "Quicksand-Light",
    marginTop: 3
  },
  getPlacesButton: {
    marginTop: 15,
    marginLeft: 0,
    paddingLeft: 0
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
    marginTop: 20,
    width: 210,
    marginBottom: 20
  }
});
