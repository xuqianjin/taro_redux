import Taro from "@tarojs/taro";
import request from "./request";

const API_GET_VISIT_GUEST = API_HOST + "/c/visits/guest";
const API_GET_VISIT_INTENT = API_HOST + "/c/visits/intent";
const API_GET_VISIT_CHART = API_HOST + "/c/visits/chart";

const API_PUT_VISIT = API_HOST + "/c/visit/{id}";
const API_GET_VISIT_LOG = API_HOST + "/c/visit/{id}/viewLogs";
const API_POST_FRIENDSHIP = API_HOST + "/c/friendship";

const API_GET_VIEW_LOG = API_HOST + "/c/viewLogs";
const API_POST_VIEW_LOG = API_HOST + "/c/viewLogs";
const API_PUT_VIEW_LOG_TIME = API_HOST + "/c/viewLog/{id}/duration";

export const getVisitGuest = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_VISIT_GUEST,
    payload: request.get(API_GET_VISIT_GUEST, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  });
};
export const getVisitIntent = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_VISIT_INTENT,
    payload: request.get(API_GET_VISIT_INTENT, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  });
};
export const getVisitChart = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_VISIT_CHART,
    payload: request.get(API_GET_VISIT_CHART, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  });
};
export const putVisit = (operateId, data) => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_VISIT,
    payload: request.put(API_PUT_VISIT, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId,
      data
    })
  });
};

export const postFriendShip = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_FRIENDSHIP,
    payload: request.post(API_POST_FRIENDSHIP, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};

export const getVisitLog = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_GET_VISIT_LOG,
    payload: request.get(API_GET_VISIT_LOG, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId
    })
  });
};
export const getViewlogs = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_VIEW_LOG,
    payload: request.get(API_GET_VIEW_LOG, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  });
};
export const postViewlogs = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_VIEW_LOG,
    payload: request.post(API_POST_VIEW_LOG, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};
export const putViewlogs = (operateId, data) => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_VIEW_LOG_TIME,
    payload: request.put(API_PUT_VIEW_LOG_TIME, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId,
      data
    })
  });
};

const init_state = {
  visitguest: "",
  visitintent: "",
  visitchart: "",
  visitlog: "",
  viewlogs: ""
};

export default function reducer(state = init_state, action) {
  switch (action.type) {
    case `${API_GET_VISIT_GUEST}_FULFILLED`:
      return {
        ...state,
        visitguest: action.payload
      };
    case `${API_GET_VISIT_INTENT}_FULFILLED`:
      return {
        ...state,
        visitintent: action.payload
      };
    case `${API_GET_VISIT_CHART}_FULFILLED`:
      return {
        ...state,
        visitchart: action.payload
      };
    case `${API_GET_VISIT_LOG}_FULFILLED`:
      return {
        ...state,
        visitlog: action.payload
      };
    case `${API_GET_VIEW_LOG}_FULFILLED`:
      return {
        ...state,
        viewlogs: action.payload
      };
    default:
      return state;
  }
}
