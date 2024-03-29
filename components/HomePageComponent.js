import React, { Component } from "react";
import {
  View,
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
  CheckBox,
  List,
  ListItem
} from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateLocationCoords,
  reverseCoordsEncoding,
  encodeAddress,
  getPlacesNearby,
  setUserData,
  setInitialDataFetched,
  setCategoryToSearch,
  openFilterModal,
  setCategoriesState
} from "../actions/Index";
import { Constants, Location, Permissions } from "expo";
import { NavigationActions } from "react-navigation";
import firebase from 'firebase';
import translate from 'translatr';
import dictionary from '../languages/dictionary';


class HomePageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      distancePrecision: 100,
      typedAddress: "",
      location: null,
      errorMessage: null
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
    setTimeout( () => {
      if(firebase.auth().currentUser !== null && !this.props.fetchedInitialData){
        let user = firebase.auth().currentUser;
        this.props.setUserData(user.uid).then( () => {
            this.props.setInitialDataFetched(true);

            const setParamsActionMain = NavigationActions.setParams({
              params: { lang: this.props.language},
              key: "Main",
             });
           this.props.navi.dispatch(setParamsActionMain);

           const setParamsActionFavs = NavigationActions.setParams({
             params: { lang: this.props.language},
             key: "Favourites",
            });
          this.props.navi.dispatch(setParamsActionFavs);
        })
      }
    }, 1000 );



    let categoriesCheckBoxes = this.props.categories.map(current => {
      return (
        <CheckBox
          title={current.name}
          checked={current.checked}
          fontFamily="Quicksand-Light"
          textStyle={{ fontWeight: "100" }}
          onPress={() => {
            let newState = this.props.categories.map(category => {
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
            this.props.setCategoriesState(newState);
          }}
        />
      );
    });

    let historyList = <Text style={style.emptyHistoryStyle}>{translate(dictionary, 'emptyHistory', this.props.language).emptyHistory}</Text>;
    if(this.props.lastSearched.length > 0){
      historyList = this.props.lastSearched.map( (current,index) => {
        return  <ListItem
          key = {index}
          title = {current}
          fontFamily="Quicksand-Regular"
          onPress = { () => {
            let promise = new Promise(resolve => {
              let x = this.props.encodeAddress(current);
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
        />
      });
    }

    return (
    <View>
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
              <Text style={style.modalTitle}> {translate(dictionary, 'chooseType', this.props.language).chooseType} </Text>
              <View style={style.checkboxesStyle}>{categoriesCheckBoxes}</View>
              <Button
                onPress={() => {
                  this.props.openFilterModal(false);
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
              placeholder={translate(dictionary, 'typeAddress', this.props.language).typeAddress}
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
                {translate(dictionary, 'searchInRadius', this.props.language).searchInRadius} {this.state.distancePrecision} m
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
            title={translate(dictionary, 'getPlacesNearby', this.props.language).getPlacesNearby}
            fontFamily="Quicksand-Light"
            color="#fff"
            backgroundColor="#4caf50"
            buttonStyle={style.getPlacesButton}
            icon={{ name: "directions", type: "simple-line-icon" }}
            borderRadius={1}
          />
        </View>
      </View>
        <View style={style.historyCardStyle}>
          <Text style = {style.LastSearchedStyle}> {translate(dictionary, 'lastSearched', this.props.language).lastSearched} </Text>
          <List>
            {historyList}
          </List>
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
    categoryToSearch: state.FilterModalReducer.categoryToSearch,
    categories: state.FilterModalReducer.categories,
    lastSearched: state.UserConfigReducer.lastSearched,
    language: state.UserConfigReducer.language
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateLocationCoords: updateLocationCoords,
      reverseCoordsEncoding: reverseCoordsEncoding,
      encodeAddress: encodeAddress,
      getPlacesNearby: getPlacesNearby,
      setUserData: setUserData,
      setInitialDataFetched: setInitialDataFetched,
      setCategoryToSearch: setCategoryToSearch,
      openFilterModal: openFilterModal,
      setCategoriesState: setCategoriesState
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
  },
  emptyHistoryStyle: {
    fontFamily: "Quicksand-Light",
    textAlign: 'center',
    backgroundColor: '#eee',
    padding: 20,

  },
  LastSearchedStyle:{
    fontFamily: "Quicksand-Light",
    backgroundColor: '#eee',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5
  },
  historyCardStyle: {
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
  },
});
