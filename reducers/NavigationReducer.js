export default function NavigationReducer(state = {
                                                  nav: 'LogIn'
                                                },
                                                action) {

  switch (action.type) {

    case 'UPDATE_NAV':

      state = Object.assign({}, state, {
        nav: action.payload.nav
      });

      break;

      default:
      return state
  }


  return state
}
