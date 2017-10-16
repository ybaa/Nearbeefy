export default function LocationReducer(state = {
                                                  address: 'no address',
                                                  coords: {
                                                    longitude: '',
                                                    latitude: ''
                                                  }
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

      default:
      return state
    }

  return state
}
