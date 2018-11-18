import Taro from '@tarojs/taro'
import request from './request'

const API_GET_VISIT_GUEST = API_HOST + '/c/visits/guest'
const API_GET_VISIT_INTENT = API_HOST + '/c/visits/intent'
const API_PUT_VISIT = API_HOST + '/c/visit/{id}'
const API_GET_VISIT_LOG = API_HOST + '/c/visit/{visitorId}/viewLogs'

export const getVisitGuest = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_VISIT_GUEST,
    payload: request.get(API_GET_VISIT_GUEST, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  })
}
export const getVisitIntent = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_VISIT_INTENT,
    payload: request.get(API_GET_VISIT_INTENT, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  })
}
export const putVisit = (oprateId, data) => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_VISIT,
    payload: request.put(API_PUT_VISIT, {
      header: {
        Authorization: getState().userReducer.token
      },
      oprateId,
      data
    })
  })
}

export const getVisitLog = (oprateId) => (dispatch, getState) => {
  return dispatch({
    type: API_GET_VISIT_LOG,
    payload: request.get(API_GET_VISIT_LOG, {
      header: {
        Authorization: getState().userReducer.token
      },
      oprateId
    })
  })
}

const init_state = {
  visitguest: '',
  visitintent: '',
  visitlog: ''
}

export default function reducer(state = init_state, action) {
  switch (action.type) {
    case `${API_GET_VISIT_GUEST}_FULFILLED`:
      return {
        ...state,
        visitguest: action.payload
      }
    case `${API_GET_VISIT_INTENT}_FULFILLED`:
      return {
        ...state,
        visitintent: action.payload
      }
    case `${API_GET_VISIT_LOG}_FULFILLED`:
      return {
        ...state,
        visitlog: action.payload
      }
    default:
      return state
  }
}