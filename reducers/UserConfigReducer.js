
export default function UserConfigReducer(
  state = {
    email: null,
    id: null,
    favourites: [],
    lastSearched: [],
    fetchedInitialData: false
  },
  action
) {
  switch (action.type) {
    case "SET_EMAIL":
      state = Object.assign({}, state, {
        email: action.payload.email
      });
      break;

      case "SET_USER_ID":
        state = Object.assign({}, state, {
          id: action.payload.id
        });
        break;

      case "CLEAR_USER_STATE":
        state = Object.assign({}, state, {
          email: null,
          favourites: [],
          lastSearched: [],
        });
        break;

      case "ADD_FAVOURITE_FULFILLED":
        state = Object.assign({}, state, {
          favourites: action.payload
        });
        break;

      case "REMOVE_FAVOURITE_FULFILLED":
        state = Object.assign({}, state, {
          favourites: action.payload
        });
        break;

      case "SET_INITIAL_DATA_FETCHED":
        state = Object.assign({}, state, {
          fetchedInitialData: action.payload.fetched
        });
        break;

      case "ADD_USER_TO_DATABASE_FULFILLED":
        state = Object.assign({}, state);
        break;

      case "SET_USER_DATA_FULFILLED":
        state = Object.assign({}, state, {
          email: action.payload.email,
          favourites: action.payload.favourites || [],
          lastSearched: action.payload.lastSearched || []
        });
        break;

      case "ADD_ADDRESS_TO_HISTORY_FULFILLED":
        state = Object.assign({}, state, {
          lastSearched: action.payload
        });
        break;


    default:
      return state;
  }

  return state;
}
