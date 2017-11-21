
export default function AdditionalOptionsModalReducer(
  state = {
    modalVisible: false
  },
  action
) {
  switch (action.type) {
    case "OPEN_OPTIONS_MODAL":
      state = Object.assign({}, state, {
        modalVisible: action.payload.modalVisible
      });
      break;

    



    default:
      return state;
  }

  return state;
}
