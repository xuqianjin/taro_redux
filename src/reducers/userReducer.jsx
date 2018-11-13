import request from './request'
import { AtMessage } from 'taro-ui'

const API_GET_DEGUG_TOKEN = API_HOST + '/c/wxlite/debugLogin/{id}'
//wx
const API_POST_WXLOGIN = API_HOST + '/c/wxlite/login'
const API_PUT_WXUERINFO = API_HOST + '/c/wxlite/userinfo'
const API_PUT_WXUERPHONE = API_HOST + '/c/wxlite/phonenum'
//user
const API_PUT_USER_CARTE = API_HOST + '/c/carte'
const API_GET_USER_CARTE = API_HOST + '/c/carte/{id}'
const API_GET_USER_CARTE_DEC = API_HOST + '/c/carte/{id}/decorate'

const API_PUT_USER_CARTE_COLLECT = API_HOST + '/c/carte/{id}/collect'
const API_DEL_USER_CARTE_COLLECT = API_HOST + '/c/carte/{id}/uncollect'

export const getDebugToken = (operateId) => (dispatch, getState) => {
  dispatch({
    type: API_GET_DEGUG_TOKEN,
    payload: request.get(API_GET_DEGUG_TOKEN, {operateId})
  })
}

export const postWxLogin = (data) => (dispatch, getState) => {
  dispatch({
    type: API_POST_WXLOGIN,
    payload: request.post(API_POST_WXLOGIN, {data})
  })
}

export const putWxUserInfo = (data) => (dispatch, getState) => {
  dispatch({
    type: API_PUT_WXUERINFO,
    payload: request.put(API_PUT_WXUERINFO, {data})
  })
}

export const postWxUserPhone = (data) => (dispatch, getState) => {
  dispatch({
    type: API_PUT_WXUERPHONE,
    payload: request.post(API_PUT_WXUERPHONE, {data})
  })
}

export const getUserCarte = (operateId) => (dispatch, getState) => {
  dispatch({
    type: API_GET_USER_CARTE,
    payload: request.get(API_GET_USER_CARTE, {operateId})
  })
}

export const putUserCarte = (data) => (dispatch, getState) => {
  dispatch({
    type: API_PUT_USER_CARTE,
    payload: request.put(API_PUT_USER_CARTE, {data})
  })
}

export const putUserCarteDesc = (operateId) => (dispatch, getState) => {
  dispatch({
    type: API_GET_USER_CARTE_DEC,
    payload: request.put(API_GET_USER_CARTE_DEC, {operateId})
  })
}

export const putUserCarteCollect = (operateId) => (dispatch, getState) => {
  dispatch({
    type: API_PUT_USER_CARTE_COLLECT,
    payload: request.put(API_GET_USER_CARTE_DEC, {operateId})
  })
}

export const delUserCarteCollect = (operateId) => (dispatch, getState) => {
  dispatch({
    type: API_DEL_USER_CARTE_COLLECT,
    payload: request.delete(API_DEL_USER_CARTE_COLLECT, {operateId})
  })
}

const init_state = {
  deviceinfo: ''
}

export default function counter(state = init_state, action) {

  switch (action.type) {
    case `${API_GET_DEGUG_TOKEN}_FULFILLED`:
      return {
        ...state,
        deviceinfo: action.payload
      }
    case `${API_POST_WXLOGIN}_REJECTED`:
      console.log(action.payload);
      return state
    default:
      return state
  }
}