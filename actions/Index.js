import axios from 'axios';
import { API_KEY } from '../constants/index';
import firebase from 'firebase';

export const changeAddress = (address) => {
  return {
    type: 'CHANGE_ADDRESS',
    payload: {
      'address': address
    }
  }
};



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
      console.log(response);
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
      console.log(response);
      let showMore = false;
      if (response.data.next_page_token) {
        showMore = true;
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
        showMore: showMore
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

export const setEmail = (email) => {
  return {
    type: "SET_EMAIL",
    payload: {
      email: email
    }
  };
};

export const setUserId = (id) => {
  return {
    type: "SET_USER_ID",
    payload: {
      id: id
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
      lastSearched: userData.lastSearched
    }))
  });


  return {
    type: "ADD_FAVOURITE",
    payload: promise.then( () => {
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
