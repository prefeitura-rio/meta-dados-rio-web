import { ADD_ALERT, REMOVE_ALERT, CLEAR_ALERTS } from "./types";

export const add_alert = (id, msg, alertType) => (dispatch) => {
  dispatch({
    type: ADD_ALERT,
    payload: { msg, alertType, id }
  });
};

export const remove_alert = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_ALERT,
    payload: id
  });
};

export const clear_alerts = () => (dispatch) => {
  dispatch({
    type: CLEAR_ALERTS
  });
};
