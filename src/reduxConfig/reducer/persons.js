import * as actionsType from '../store/actionTypes';

const initState = null; // filter creatures

const deleteFaceById = (deleteData, state) => {
  const personIndex = state.findIndex((e) => e.uuid === deleteData.personId);
  if (personIndex >= 0) {
    const newFaces = state[personIndex].faces.filter((e) => e.id !== deleteData.faceId);
    state[personIndex].faces = newFaces;
    return [...state];
  }
  // console.log(deleteData, state);
  return state;
};

const registerFace = (registerData, state) => {
  const personIndex = state.findIndex((e) => e.uuid === registerData.personId);
  
  if (personIndex >= 0) {
    
    state[personIndex].faces.push(registerData);
    console.log(registerData)
    console.log(state[personIndex].faces)
    return [...state];
  }
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionsType.SET_PERSONS:
      return action.payload;
    case actionsType.DELETE_FACE:
      return deleteFaceById(action.payload, state);
    case actionsType.REGISTER_FACE:
     
      return registerFace(action.payload, state);
    default:
      return state;
  }
};

export default reducer;
