import request from './request'

const API_HOST = 'http://sigoden.com:3000'


const API_GET_DEGUG_TOKEN = API_HOST + '/c/wxlite/debugLogin/{id}'
//user
const API_PUT_USER_CARTE = API_HOST + '/c/carte'
const API_GET_USER_CARTE = API_HOST + '/c/carte/{id}'
const API_GET_USER_CARTE_DEC = API_HOST + '/c/carte/{id}/decorate'

const API_PUT_USER_CARTE_COLLECT = API_HOST + '/c/carte/{id}/collect'
const API_DEL_USER_CARTE_COLLECT = API_HOST + '/c/carte/{id}/uncollect'

export const getDebugToken = (data) => (dispatch, getState) => {
  dispatch({
    type: API_GET_DEGUG_TOKEN,
    payload: request.get(API_GET_DEGUG_TOKEN)
  })
}


export const getUserCarte = (data) => (dispatch, getState) => {
  dispatch({
    type: API_GET_USER_CARTE,
    payload: request.get(API_GET_USER_CARTE)
  })
}

export const putUserCarte = (data) => (dispatch, getState) => {
  dispatch({
    type: API_PUT_USER_CARTE,
    payload: request.get(API_PUT_USER_CARTE)
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
    default:
      return state
  }
}