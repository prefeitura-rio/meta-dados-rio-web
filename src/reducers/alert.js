import { ADD_ALERT, REMOVE_ALERT, CLEAR_ALERTS } from "../actions/types";

const initialState = [];

const alertReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_ALERT:
      if (state.some((alert) => alert.id === payload.id)) {
        return state;
      } else {
        return [...state, payload];
      }
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    case CLEAR_ALERTS:
      return [];
    default:
      return state;
  }
};

export default alertReducer;
