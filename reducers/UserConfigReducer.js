export default function UserConfigReducer(
  state = {
    username: "",
    navigateToMainScreen: true
  },
  action
) {
  switch (action.type) {
    default:
      return state;
  }

  return state;
}
