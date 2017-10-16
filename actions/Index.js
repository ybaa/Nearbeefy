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
//   // return {
//   //   type: 'REVERSE_COORDS_ENCODING',
//   //   payload: {
//   //     'lat': lat,
//   //     'long': long
//   //   }
//   // }
//     let addressToGet = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + ',' + long + '&key=' + API_KEY;
//     // let addressToReturn =
//     //   axios.get(addressToGet).then((response) => {
//     //     addressToReturn = response.data.results[0].formatted_address;
//     //     console.log('success');
//     //     return response.data.results[0].formatted_address;
//     //   })
//     //   .catch((error) => {
//     //     console.log(error);
//     //     console.log('error');
//     //   });
//     // console.log('after get');
//   return {
//     type: 'REVERSE_COORDS_ENCODING',
//     payload:
//        axios.get(addressToGet).then((response) => {
//          console.log('success');
//          return { adddress: response.data.results[0].formatted_address}
//        })
//        .catch((error) => {
//          console.log(error);
//          return { address: 'error'}
//        });
// }
// };
