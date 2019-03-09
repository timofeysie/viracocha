import { ADD_ENTITY } from "../constants/action-types";
import { DATA_REQUESTED } from "../constants/action-types";

export function addEntity(payload) {
  return { type: ADD_ENTITY, payload };
}

export function getData() {
  return { type: DATA_REQUESTED };
}
