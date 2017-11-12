
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

      case "ADD_FAVOURITE":
        state = Object.assign({}, state, {
          favourites: action.payload
        });
        break;

      case "SET_INITIAL_DATA_FETCHED":
        state = Object.assign({}, state, {
          fetchedInitialData: action.payload.fetched
        });
        break;

      case "SET_USER_DATA_FULFILLED":
        state = Object.assign({}, state, {
          email: action.payload.email,
          favourites: action.payload.favourites || [],
          lastSearched: action.payload.lastSearched || []
        });
        break;



    default:
      return state;
  }

  return state;
}
