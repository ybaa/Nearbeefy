import React, { Component } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Platformm,
  ScrollView
} from "react-native";
import {
  Text,
  Button,
  Slider,
  SearchBar,
  Icon,
  List,
  ListItem,
  CheckBox,
  Modal
} from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setUserData,
  setInitialDataFetched,
  encodeAddress,
  getPlacesNearby,
  openFilterModal,
  setCategoryToSearch,
  setCategoriesState
} from "../actions/Index";
import { Constants, Location, Permissions } from "expo";
import axios from "axios";
import { API_KEY } from "../constants/index";
import firebase from "firebase";
import { NavigationActions } from "react-navigation";
import categories from "../constants/categories";
import translate from 'translatr';
import dictionary from '../languages/dictionary';


const SCREE_WIDTH = Dimensions.get("window").width;

class FavouritesComponent extends Component {
  constructor(props){
    super();
    this.state = {
      distancePrecision: 100,
    }
  }
  render() {

    let favouritesList = this.props.userData.favourites.map( (current,index) => {
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

    let categoriesCheckBoxes = this.props.categories.map(current => {
      return (
        <CheckBox
          title={current.name}
          checked={current.checked}
          fontFamily="Quicksand-Light"
          textStyle={{ fontWeight: "100" }}
          onPress={() => {
            let newState = this.state.categoriesState.map(category => {
              if (category.name === current.name) {
                this.props.setCategoryToSearch(current.name);
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


    setTimeout( () => {
      if(firebase.auth().currentUser !== null && !this.props.fetchedInitialData){
        let user = firebase.auth().currentUser;
        this.props.setUserData(user.uid).then( () => {
            this.props.setInitialDataFetched(true);
        })
      }
    }, 2000 );


    let display = <Text style={style.unsignedUserText}> {translate(dictionary, 'logInFirst', this.props.language).logInFirst} </Text>
    if(firebase.auth().currentUser !== null){
      display = <View>
        <View style={style.barAndRadiusStyle}>
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
        </View>
        <List>
          {favouritesList}
        </List>
      </View>
    }



    return (
      <View>
        <View>
          {display}
        </View>

      </View>
    );
  }
}

function mapStatetoProps(state) {
  return {
    userData: state.UserConfigReducer,
    fetchedInitialData: state.UserConfigReducer.fetchedInitialData,
    coords: state.LocationReducer.coords,
    modalVisible: state.FilterModalReducer.modalVisible,
    categoryToSearch: state.FilterModalReducer.categoryToSearch,
    categories: state.FilterModalReducer.categories,
    language: state.UserConfigReducer.language
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUserData: setUserData,
      setInitialDataFetched: setInitialDataFetched,
      encodeAddress: encodeAddress,
      getPlacesNearby: getPlacesNearby,
      openFilterModal: openFilterModal,
      setCategoryToSearch: setCategoryToSearch,
      setCategoriesState: setCategoriesState
    },
    dispatch
  );
}

export default connect(mapStatetoProps, matchDispatchToProps)(FavouritesComponent);

const style = StyleSheet.create({
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
  barAndRadiusStyle: {
    marginLeft: 20,
    marginRight: 20
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
  unsignedUserText: {
    fontFamily: "Quicksand-Light",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center"
  }
});
