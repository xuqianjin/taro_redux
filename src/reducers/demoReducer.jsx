import Taro from "@tarojs/taro";
import request from "./request";

const API_GET_ROOMKINDS = API_HOST + "/c/roomKinds";

const API_GET_DEMO_COLLECT = API_HOST + "/c/demos/collect";
const API_GET_DEMO_CREATE = API_HOST + "/c/demos/create";
const API_POST_DEMO = API_HOST + "/c/demos";
const API_PUT_DEMO = API_HOST + "/c/demo/{id}";
const API_GET_DEMO = API_HOST + "/c/demo/{id}";
const API_PUT_DEMO_STAR = API_HOST + "/c/demos/star";
const API_PUT_DEMO_UNSTAR = API_HOST + "/c/demos/unstar";

export const getRoomKinds = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_ROOMKINDS,
    payload: request.get(API_GET_ROOMKINDS)
  });
};

export const getDemoCollect = params => (dispatch, getState) => {
  return dispatch({
    type: API_GET_DEMO_COLLECT,
    payload: request.get(API_GET_DEMO_COLLECT, {
      header: {
        Authorization: getState().userReducer.token
      },
      params
    })
  });
};

export const getDemoCreate = params => (dispatch, getState) => {
  return dispatch({
    type: API_GET_DEMO_CREATE,
    payload: request.get(API_GET_DEMO_CREATE, {
      header: {
        Authorization: getState().userReducer.token
      },
      params
    })
  });
};

export const postDemo = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_DEMO,
    payload: request.post(API_POST_DEMO, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};
export const getDemo = (operateId) => (dispatch, getState) => {
  return dispatch({
    type: API_GET_DEMO,
    payload: request.get(API_GET_DEMO, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId
    })
  });
};
export const putDemo = (operateId, data) => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_DEMO,
    payload: request.put(API_PUT_DEMO, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};
export const putDemoStar = data => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_DEMO_STAR,
    payload: request.put(API_PUT_DEMO_STAR, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};
export const putDemoUnStar = data => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_DEMO_UNSTAR,
    payload: request.put(API_PUT_DEMO_UNSTAR, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};

const init_state = {
  roomkinds: ""
};

export default function reducer(state = init_state, action) {
  switch (action.type) {
    case `${API_GET_ROOMKINDS}_FULFILLED`:
      return {
        ...state,
        roomkinds: action.payload
      };
    default:
      return state;
  }
}
