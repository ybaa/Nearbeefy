import categories from "../constants/categories";

export default function FilterModalReducer(
  state = {
    modalVisible: false,
    categoryToSearch: null,
    categories: categories
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

    case "SET_CATEGORIES_STATE":
      state = Object.assign({}, state, {
        categories: action.payload.categories
      });
      break;



    default:
      return state;
  }

  return state;
}
