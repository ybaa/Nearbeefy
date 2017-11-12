export default function FilterModalReducer(
  state = {
    modalVisible: false,
    categoryToSearch: null
  },
  action
) {
  switch (action.type) {
    case "OPEN_FILTER_MODAL":
      state = Object.assign({}, state, {
        modalVisible: action.payload.modalVisible
      });
      break;

      case "SET_CATEGORY_TO_SEARCH":
        state = Object.assign({}, state, {
          categoryToSearch: action.payload.category
        });
        break;



    default:
      return state;
  }

  return state;
}
