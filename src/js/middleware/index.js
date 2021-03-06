import { ADD_ENTITY } from "../constants/action-types";
import { FOUND_BAD_WORD } from "../constants/action-types";

const forbiddenWords = ["spam", "money"];

export function forbiddenWordsMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      // do your stuff
      if (action.type === ADD_ENTITY) {
        const foundWord = forbiddenWords.filter(word =>
          action.payload.cognitive_biasLabel.includes(word)
        );
        if (foundWord.length || action.payload.cognitive_biasLabel.length < 1) {
          return dispatch({ type: FOUND_BAD_WORD });
        }
      }
      return next(action);
    };
  };
}
