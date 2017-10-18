import axios from 'axios';
import { API_KEY } from '../constants/index';

export const changeAddress = (address) => {
  return {
    type: 'CHANGE_ADDRESS',
    payload: {
      'address': address
    }
  }
};

export const updateNav = (nav) => {
  return {
    type: 'UPDATE_NAV',
    payload: {
      'nav': nav
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
   console.log("ADDRESS TO GET: ", addressToGet);
   return {
       type: "REVERSE_COORDS_ENCODING",
       payload:
           axios.get(addressToGet).then((response) => {
              return {
                'address': response.data.results[0].formatted_address
              }

          })
    }
};

export const encodeAddress = (address) => {
   let addressToCode = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + '&key=' + API_KEY;
   return {
       type: "ENCODE_ADDRESS",
       payload:
           axios.get(addressToCode).then((response) => {
              return {
                'latitude': response.data.results[0].geometry.location.lat,
                'longitude': response.data.results[0].geometry.location.lng,
                'address': address
              }

          })
    }
};

export const getPlacesNearby = (lat, long, radius) => {
   let query = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + ',' + long + "&radius=" + radius + "&key=" + API_KEY;
   return {
       type: "GET_PLACES_NEARBY",
       payload:
           axios.get(query).then((response) => {
              console.log(response);
              let showMore = false;
              if(response.data.next_page_token){
                showMore = true;
                pageToken = response.data.next_page_token;
              }
              let nearbyPlaces = response.data.results.map( (place) => {
                return [{
                    'name': place.name,
                    'type': place.types[0]
                  }]

              })
              return {
                'nearbyPlaces': nearbyPlaces,
                'showMore': showMore,
                'pageToken': pageToken
              }

          })
    }
};

export const getPlacesNearbyNextPage = (pageToken) => {
   let query = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=" +pageToken +  "&key=" + API_KEY;
   return {
       type: "GET_PLACES_NEARBY_NEXT_PAGE",
       payload:
           axios.get(query).then((response) => {
              console.log(response);
              let showMore = false;
              if(response.data.next_page_token){
                showMore = true;
              }
              let nearbyPlaces = response.data.results.map( (place) => {
                return [{
                    'name': place.name,
                    'type': place.types[0]
                  }]

              })
              return {
                'nearbyPlaces': nearbyPlaces,
                'showMore': showMore
              }

          })
    }
};
