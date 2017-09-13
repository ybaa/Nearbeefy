export default function LocationReducer(state = {
                                                  address: 'none'
                                                },
                                                action) {

  switch (action.type) {
    case 'CHANGE_ADDRESS':

      state = Object.assign({}, state, {
        address: action.payload.address
      });

      break;

      default:
      return state
  }

  return state
}
