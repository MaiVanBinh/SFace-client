import * as actionsType from '../store/actionTypes';

const initState = null; // filter creatures

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionsType.GET_PERSONS:
      return action.payload;
    // case actionsType.CREATE_PERSON:
    default:
      return state;
  }
};

export default reducer;
