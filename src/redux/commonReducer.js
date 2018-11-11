import Taro from '@tarojs/taro'

const GET_DEVICE_INFO = 'GET_DEVICE_INFO'
const SET_STATE = 'SET_STATE'

export const setState = (data) => (dispatch, getState) => {
  dispatch({
    type: SET_STATE,
    payload: data
  })
}
export const getDeviceInfo = () => (dispatch, getState) => {
  dispatch({
    type: GET_DEVICE_INFO,
    payload: Taro.getSystemInfo()
  })
}


const init_state = {
  deviceinfo: ''
}

export default function counter(state = init_state, action) {
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
    default:
      return state
  }
}