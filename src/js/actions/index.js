import { ADD_ENTITY } from "../constants/action-types";
import { DATA_REQUESTED } from "../constants/action-types";
import { SELECT_ENTITY } from "../constants/action-types";

export function addEntity(payload) {
  return { type: ADD_ENTITY, payload };
}

export function getData() {
  return { type: DATA_REQUESTED };
}

/** For now the entity is actually the cognitive_bias string which
has the entity code at the end of the uri */
export function selectEntity(entity) {
  return { type: SELECT_ENTITY, entity };
}
