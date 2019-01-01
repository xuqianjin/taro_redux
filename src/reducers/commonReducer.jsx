import Taro from "@tarojs/taro";
import request from "./request";

const GET_DEVICE_INFO = "GET_DEVICE_INFO";
const SET_STATE = "SET_STATE";
const API_GET_OSS_TOKEN = API_HOST + "/c/oss/token";
const API_GET_IM_TOKEN = API_HOST + "/c/im/token";
const API_GET_STATISTIC = API_HOST + "/c/statistic";
const API_GET_REGION = API_HOST + "/c/regions";
const API_GET_TAGS = API_HOST + "/c/tags";
const API_GET_VIPKINDS = API_HOST + "/c/vipKinds";
const API_GET_SYSTEM_METADATA = API_HOST + "/c/metadata/system";

export const getSysMetaData = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_SYSTEM_METADATA,
    payload: request.get(API_GET_SYSTEM_METADATA, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  });
};
export const getRegion = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_REGION,
    payload: request.get(API_GET_REGION)
  });
};
export const setState = data => (dispatch, getState) => {
  return dispatch({ type: SET_STATE, payload: data });
};
export const getDeviceInfo = () => (dispatch, getState) => {
  return dispatch({ type: GET_DEVICE_INFO, payload: Taro.getSystemInfo() });
};

export const getOssToken = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_OSS_TOKEN,
    payload: request.get(API_GET_OSS_TOKEN, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  });
};
export const getImToken = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_IM_TOKEN,
    payload: request.get(API_GET_IM_TOKEN, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  });
};

export const getStatistic = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_STATISTIC,
    payload: request.get(API_GET_STATISTIC, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  });
};

export const getTags = params => (dispatch, getState) => {
  return dispatch({
    type: API_GET_TAGS,
    payload: request.get(API_GET_TAGS, { params })
  });
};

export const getVipKinds = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_VIPKINDS,
    payload: request.get(API_GET_VIPKINDS)
  });
};

const init_state = {
  deviceinfo: "",
  sysmetadata: "",
  osstoken: "",
  statistic: "",
  regions: "",
  vipkinds: ""
};

export default function reducer(state = init_state, action) {
  switch (action.type) {
    case `${API_GET_SYSTEM_METADATA}_FULFILLED`:
      return {
        ...state,
        sysmetadata: action.payload
      };
    case `${GET_DEVICE_INFO}_FULFILLED`:
      return {
        ...state,
        deviceinfo: action.payload
      };
    case `${SET_STATE}`:
      return {
        ...state,
        ...action.payload
      };
    case `${API_GET_OSS_TOKEN}_FULFILLED`:
      return {
        ...state,
        osstoken: action.payload
      };
    case `${API_GET_STATISTIC}_FULFILLED`:
      return {
        ...state,
        statistic: action.payload
      };
    case `${API_GET_REGION}_FULFILLED`:
      return {
        ...state,
        regions: action.payload
      };
    case `${API_GET_VIPKINDS}_FULFILLED`:
      return {
        ...state,
        vipkinds: action.payload
      };
    default:
      return state;
  }
}
