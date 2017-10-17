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
