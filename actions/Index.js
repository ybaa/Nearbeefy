export const changeAddress = (address) => {
  return {
    type: 'CHANGE_ADDRESS',
    payload: {
      'address': address
    }
  }
};

export const updateNav = (nav) => {
  return {
    type: 'UPDATE_NAV',
    payload: {
      'nav': nav
    }
  }
};

export const updateLocationCoords = (lat, long) => {
  return {
    type: 'UPDATE_LOCATION_COORDS',
    payload: {
      'lat': lat,
      'long': long
    }
  }
};
