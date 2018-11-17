import Taro from '@tarojs/taro'
import request from './request'

const GET_DEVICE_INFO = 'GET_DEVICE_INFO'
const SET_STATE = 'SET_STATE'
const API_GET_OSS_TOKEN = API_HOST + '/c/oss/token'

export const setState = (data) => (dispatch, getState) => {
  return dispatch({type: SET_STATE, payload: data})
}
export const getDeviceInfo = () => (dispatch, getState) => {
  return dispatch({type: GET_DEVICE_INFO, payload: Taro.getSystemInfo()})
}

export const getOssToken = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_OSS_TOKEN,
    payload: request.get(API_GET_OSS_TOKEN, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  })
}

const init_state = {
  deviceinfo: '',
  osstoken: ''
}

export default function reducer(state = init_state, action) {
  switch (action.type) {
    case `${GET_DEVICE_INFO}_FULFILLED`:
      return {
        ...state,
        deviceinfo: action.payload
      }
    case `${SET_STATE}`:
      return {
        ...state,
        ...action.payload
      }
    case `${API_GET_OSS_TOKEN}_FULFILLED`:
      return {
        ...state,
        osstoken: action.payload
      }
    default:
      return state
  }
}