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

      default:
      return state
    }

  return state
}
