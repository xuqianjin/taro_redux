import Taro from "@tarojs/taro";
import request from "./request";

const API_POST_REDPACK = API_HOST + "/c/redpacks";
const API_POST_REDPACK_CHARGE = API_HOST + "/c/charge/redpack";
const API_POST_REDPACK_WITHDRAW = API_HOST + "/c/withdraw/redpack";

const API_GET_REDPACK_DETAIL = API_HOST + "/c/redpack/{id}";
const API_GET_REDPACK_OPEN = API_HOST + "/c/redpack/{id}/open";
const API_GET_REDPACK_RECEIVE = API_HOST + "/c/redpacks/receive";
const API_GET_REDPACK_SEND = API_HOST + "/c/redpacks/send";

const API_GET_REDPACK_STATISTIC = API_HOST + "/c/statistic/redpack";

export const postRedPack = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_REDPACK,
    payload: request.post(API_POST_REDPACK, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};
export const postRedPackCharge = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_REDPACK_CHARGE,
    payload: request.post(API_POST_REDPACK_CHARGE, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};
export const postRedPackWithDraw = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_REDPACK_WITHDRAW,
    payload: request.post(API_POST_REDPACK_WITHDRAW, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};
export const getRedPackDetail = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_GET_REDPACK_DETAIL,
    payload: request.get(API_GET_REDPACK_DETAIL, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId
    })
  });
};
export const getRedPackOpen = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_GET_REDPACK_OPEN,
    payload: request.get(API_GET_REDPACK_OPEN, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId
    })
  });
};
export const getRedPackReceive = params => (dispatch, getState) => {
  return dispatch({
    type: API_GET_REDPACK_RECEIVE,
    payload: request.get(API_GET_REDPACK_RECEIVE, {
      header: {
        Authorization: getState().userReducer.token
      },
      params
    })
  });
};

export const getRedPackSend = params => (dispatch, getState) => {
  return dispatch({
    type: API_GET_REDPACK_SEND,
    payload: request.get(API_GET_REDPACK_SEND, {
      header: {
        Authorization: getState().userReducer.token
      },
      params
    })
  });
};

export const getRedPackStatistic = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_REDPACK_STATISTIC,
    payload: request.get(API_GET_REDPACK_STATISTIC, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  });
};

const init_state = {
  roomkinds: "",
  redpackstatistic: ""
};

export default function reducer(state = init_state, action) {
  switch (action.type) {
    case `${API_GET_REDPACK_STATISTIC}_FULFILLED`:
      return {
        ...state,
        redpackstatistic: action.payload
      };
    default:
      return state;
  }
}
