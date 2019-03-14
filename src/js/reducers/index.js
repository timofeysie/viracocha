import { ADD_ENTITY } from "../constants/action-types";
import { DATA_LOADED } from "../constants/action-types";
import { SELECT_ENTITY } from "../constants/action-types";

const initialState = {
  entity: { cognitive_bias: '', cognitive_biasLabel: '', cognitive_biasDescription: 'Hi' },
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
  if (action.type === SELECT_ENTITY) {
    console.log('action.payload',action.payload);
    return Object.assign({}, state, {
      entity: state.entity = action.payload
    });
  }
  return state;
}

export default rootReducer;
