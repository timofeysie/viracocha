import { ADD_ENTITY } from "../constants/action-types";
import { DATA_LOADED } from "../constants/action-types";

const initialState = {
  entities: [],
  remoteEntities: []
};

function rootReducer(state = initialState, action) {
  if (action.type === ADD_ENTITY) {
    return Object.assign({}, state, {
      entities: state.entities.concat(action.payload)
    });
  }
  if (action.type === DATA_LOADED) {
    return Object.assign({}, state, {
      remoteEntities: state.remoteEntities.concat(action.payload)
    });
  }
  return state;
}

export default rootReducer;
