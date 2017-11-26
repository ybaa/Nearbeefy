import axios from 'axios';
import { API_KEY } from '../constants/index';
import firebase from 'firebase';



export const updateLocationCoords = (lat, long) => {
  return {
    type: 'UPDATE_LOCATION_COORDS',
    payload: {
      'lat': lat,
      'long': long
    }
  }
};
export const reverseCoordsEncoding = (lat, long) => {
  let addressToGet = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + ',' + long + '&key=' + API_KEY;
  return {
    type: "REVERSE_COORDS_ENCODING",
    payload: axios.get(addressToGet).then(response => {
      return {
        address: response.data.results[0].formatted_address
      };
    })
  };
};


export const encodeAddress = address => {
  let addressToCode = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + '&key=' + API_KEY;
  return {
    type: "ENCODE_ADDRESS",
    payload: axios.get(addressToCode).then(response => {
      return {
        latitude: response.data.results[0].geometry.location.lat,
        longitude: response.data.results[0].geometry.location.lng,
        address: address
      };
    })
  };
};


export const getPlacesNearby = (lat, long, radius, category) => {
  let query = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + ',' + long + "&radius=" + radius + "&key=" + API_KEY;
  if(category !== null){
    query = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + ',' + long + "&radius=" + radius + '&type=' + category + "&key=" + API_KEY;
  }
  return {
    type: "GET_PLACES_NEARBY",
    payload: axios.get(query).then(response => {      
      let pageToken;
      let showMore = false;
      if (response.data.next_page_token) {
        showMore = true;
        pageToken = response.data.next_page_token;
      }
      let nearbyPlaces = [];
      if (response.data.results.length !== 0) {
        nearbyPlaces = response.data.results.map(place => {
          return {
            name: place.name,
            types: place.types,
            icon: place.icon,
            address: place.vicinity,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng
          };
        });
      }
      return {
        nearbyPlaces: nearbyPlaces,
        showMore: showMore,
        pageToken: pageToken
      };
    })
  };
};

export const getPlacesNearbyNextPage = pageToken => {
let query = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=" +pageToken +  "&key=" + API_KEY;
  return {
    type: "GET_PLACES_NEARBY_NEXT_PAGE",
    payload: axios.get(query).then(response => {
      let showMore = false;
      let token;
      if (response.data.next_page_token) {
        showMore = true;
        token = response.data.next_page_token;
      }
      let nearbyPlaces = response.data.results.map(place => {
        return {
          name: place.name,
          types: place.types,
          icon: place.icon,
          address: place.vicinity,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        };
      });
      return {
        nearbyPlaces: nearbyPlaces,
        showMore: showMore,
        pageToken: token
      };
    })
  };
};


export const getDistance = (origin, destinations) => {
  query = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + origin + "&destinations=" + destinations + "&mode=walking&key=" + API_KEY;
  return {
    type: "GET_DISTANCE",
    payload: axios.get(query).then(response => {
      return {
        data: response.data.rows[0].elements
      };
    })
  };
};


export const sortResults = (distanceAsc, distanceDesc, category) => {
  return {
    type: "SORT_RESULTS",
    payload: {
      distanceAsc: distanceAsc,
      distanceDesc: distanceDesc,
      category: category
    }
  };
};


export const addFavourite = (uid, address, userData) => {
  let favs = userData.favourites;
  favs.push(address);
  let promise = new Promise( resolve => {
    resolve(firebase.database().ref().child('users').child(uid).set({
      email: userData.email,
      favourites: favs,
      lastSearched: userData.lastSearched,
      language: userData.language
    }))
  });

  return {
    type: "ADD_FAVOURITE",
    payload: promise.then( () => {
      return favs
    })
  };
};



export const removeFavourite = (uid, address, userData) => {
  let favs = [];
  userData.favourites.map( current => {
    if(current !== address){
      favs.push(current);
    }
  });

  let removePromise = new Promise( resolve => {
    resolve(firebase.database().ref().child('users').child(uid).set({
      email: userData.email,
      favourites: favs,
      lastSearched: userData.lastSearched,
      language: userData.language
    }))
  });

  return {
    type: "REMOVE_FAVOURITE",
    payload: removePromise.then( () => {
      return favs
    })
  };
};

export const setInitialDataFetched = (fetched) => {
  return {
    type: "SET_INITIAL_DATA_FETCHED",
    payload: {
      fetched: fetched
    }
  };
};

export const setUserData = (userId) => {
  let promise = new Promise( resolve => {
    resolve( firebase.database().ref().child('users').child(userId).once('value') )
  });
  return {
    type: "SET_USER_DATA",
    payload: promise.then( (resp) => {
      return resp.val();
    } )
  };
};


export const clearUserState = () => {
  return {
    type: "CLEAR_USER_STATE",
    payload: {}
  };
};

export const openFilterModal = (modalVisible) => {
  return {
    type: "OPEN_FILTER_MODAL",
    payload: {
      modalVisible: modalVisible
    }
  };
};

export const setCategoriesState = (categories) => {
  return {
    type: "SET_CATEGORIES_STATE",
    payload: {
      categories: categories
    }
  };
};

export const setCategoryToSearch = (category) => {
  return {
    type: "SET_CATEGORY_TO_SEARCH",
    payload: {
      category: category
    }
  };
};

export const openOptionsModal = (modalVisible) => {
  return {
    type: "OPEN_OPTIONS_MODAL",
    payload: {
      modalVisible: modalVisible
    }
  };
};

export const addUserToDatabase = (email, uid, lang) => {
  let addUserPromise = new Promise( resolve => {
    let updates = {};
    updates['/users/' + uid] = {
      email: email,
      language: lang
    };
    resolve(firebase.database().ref().update(updates));
  });
  return {
    type: "ADD_USER_TO_DATABASE",
    payload: addUserPromise.then( () => {

    })
  };
};


export const addAddressToHistory = (uid, address, userData) => {
  let history = userData.lastSearched;
  history.reverse();
  let historyWithoutRepetitions = [];

  history.map( current => {
    if(current !== address){
      historyWithoutRepetitions.push(current);
    }
  });
  historyWithoutRepetitions.splice(0,0,address);

  if(historyWithoutRepetitions.length > 3){
    historyWithoutRepetitions.splice(2,1);
  }
  let promise = new Promise( resolve => {
    resolve(firebase.database().ref().child('users').child(uid).set({
      email: userData.email,
      favourites: userData.favourites,
      lastSearched: historyWithoutRepetitions,
      language: userData.language
    }))
  });

  return {
    type: "ADD_ADDRESS_TO_HISTORY",
    payload: promise.then( () => {
      return historyWithoutRepetitions
    })
  };
};

export const changeLanguage = (lang) => {
  return {
    type: "CHANGE_LANGUAGE",
    payload: {
      lang: lang
    }
  };
};

export const syncLanguageWithDatabase = (lang, uid, userData) => {
  let changeLanguagePromise = new Promise( resolve => {
    resolve(firebase.database().ref().child('users').child(uid).set({
      email: userData.email,
      favourites: userData.favourites,
      lastSearched: userData.lastSearched,
      language: lang
    }))
  });
  return {
    type: "SYNC_LANGUAGE_WITH_DATABASE",
    payload: changeLanguagePromise.then( () => {
      return {
        lang: lang
      }
    })
  };
};
