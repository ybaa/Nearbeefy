export default function LocationReducer(state = {
                                                  address: 'no address',
                                                  coords: {
                                                    longitude: '',
                                                    latitude: ''
                                                  },
                                                  nearbyPlaces: [],
                                                  showMore: false,
                                                  pageToken: ''
                                                },
                                                action) {

  switch (action.type) {
    case 'CHANGE_ADDRESS':
      state = Object.assign({}, state, {
        address: action.payload.address
      });
      break;

      case 'UPDATE_LOCATION_COORDS':
        state = Object.assign({}, state, {
          address: state.address,
          coords: Object.assign({}, state.coords, {
            longitude: action.payload.long,
            latitude: action.payload.lat
          })
        });
        console.log(state);
        break;

        case 'REVERSE_COORDS_ENCODING_FULFILLED':
          state = Object.assign({}, state, {
            address: action.payload.address,
            coords: Object.assign({}, state.coords, {
              longitude: state.coords.longitude,
              latitude: state.coords.lati
            })
          });
          console.log(state);
          break;

          case 'ENCODE_ADDRESS_FULFILLED':
            state = Object.assign({}, state, {
              address: action.payload.address,
              coords: Object.assign({}, state.coords, {
                longitude: action.payload.longitude,
                latitude: action.payload.latitude
              })
            });
            console.log(state);
            break;

            case 'GET_PLACES_NEARBY_FULFILLED':
              state = Object.assign({}, state, {
                address: state.address,
                coords: Object.assign({}, state.coords, {
                  longitude: state.coords.longitude,
                  latitude: state.coords.latitude
                }),
                nearbyPlaces : action.payload.nearbyPlaces,
                showMore: action.payload.showMore,
                pageToken: action.payload.pageToken
              });
              console.log(state);
              break;

              case 'GET_PLACES_NEARBY_NEXT_PAGE_FULFILLED':
              let newPlaces = state.nearbyPlaces;
              action.payload.nearbyPlaces.map( (place) => {
                newPlaces.push(place);
              });
                state = Object.assign({}, state, {
                  address: state.address,
                  coords: Object.assign({}, state.coords, {
                    longitude: state.coords.longitude,
                    latitude: state.coords.latitude
                  }),
                  nearbyPlaces : newPlaces,
                  showMore: action.payload.showMore,
                  pageToken: action.payload.pageToken
                });
                console.log(state);
                break;

              case 'GET_DISTANCE_FULFILLED':
                let newState = state.nearbyPlaces.map( (place, index) => {
                  if(typeof action.payload.data[index].distance !== 'undefined'){
                    return {
                      'name': place.name,
                      'types': place.types,
                      'icon': place.icon,
                      'address': place.address,
                      'distance': action.payload.data[index].distance.text,
                      'duration': action.payload.data[index].duration.text,
                      'latitude': place.latitude,
                      'longitude': place.longitude
                    }
                  }
                  else{
                    return place;
                  }
                });
                  state = Object.assign({}, state, {
                    nearbyPlaces: newState
                  });
              break;

              case 'SORT_RESULTS':
              if(action.payload.distanceAsc){
                newState = [...state.nearbyPlaces];
                newState.sort((a, b) => {
                  let distanceA = a.distance;
                  let distanceB = b.distance;

                  // w skrocie to mam liczby w formie '10 m' lub '0.1 km' wiec zamieniam wszystko
                  // na metry i biore sama liczbe
                  let isDistanceAInKilometers = distanceA.match(/km/g);
                  if(isDistanceAInKilometers !== null){
                    distanceA = distanceA.match(/\d+(\.\d+)?/g);
                    distanceA = parseInt(distanceA *= 1000);
                  } else {
                    distanceA = distanceA.match(/\d+(\.\d+)?/g);
                    distanceA = parseInt(distanceA);
                  }

                  let isDistanceBInKilometers = distanceB.match(/km/g);
                  if(isDistanceBInKilometers !== null){
                    distanceB = distanceB.match(/\d+(\.\d+)?/g);
                    distanceB = parseInt(distanceB *= 1000);
                  } else {
                    distanceB = distanceB.match(/\d+(\.\d+)?/g);
                    distanceB = parseInt(distanceB);
                  }

                  console.log('distance ab', distanceA, distanceB)
                  return distanceA - distanceB;
                })
              }else if(action.payload.distanceDesc){
                newState = [...state.nearbyPlaces];
                newState.sort((a, b) => {
                  let distanceA = a.distance;
                  let distanceB = b.distance;

                  // w skrocie to mam liczby w formie '10 m' lub '0.1 km' wiec zamieniam wszystko
                  // na metry i biore sama liczbe
                  let isDistanceAInKilometers = distanceA.match(/km/g);
                  if(isDistanceAInKilometers !== null){
                    distanceA = distanceA.match(/\d+(\.\d+)?/g);
                    distanceA = parseInt(distanceA *= 1000);
                  } else {
                    distanceA = distanceA.match(/\d+(\.\d+)?/g);
                    distanceA = parseInt(distanceA);
                  }

                  let isDistanceBInKilometers = distanceB.match(/km/g);
                  if(isDistanceBInKilometers !== null){
                    distanceB = distanceB.match(/\d+(\.\d+)?/g);
                    distanceB = parseInt(distanceB *= 1000);
                  } else {
                    distanceB = distanceB.match(/\d+(\.\d+)?/g);
                    distanceB = parseInt(distanceB);
                  }
              
                  console.log('distance ab', distanceA, distanceB)
                  return distanceB - distanceA;
                })
              }else if(action.payload.category){

              }else{

              }

              console.log("sorted Places: ", newState)



                  state = Object.assign({}, state, {
                    nearbyPlaces: newState
                  });
              break;


      default:
      return state
    }

  return state
}
