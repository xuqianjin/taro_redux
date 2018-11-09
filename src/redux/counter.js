const ADD = 'ADD'
const MINUS = 'MINUS'

export const add = () => (dispatch, getState) => {
  return dispatch({
    type: ADD,
    payload: {}
  })
}
export const minus = (type) => (dispatch, getState) => {
  console.log(type);
  dispatch({
    type: MINUS,
    payload: {}
  })
}

// 异步的action
export const asyncAdd = () => (dispatch, getState) => {
  setTimeout(() => {
    dispatch(add())
  }, 500)
}


const INITIAL_STATE = {
  num: 0
}

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        num: state.num + 1
      }
    case MINUS:
      return {
        ...state,
        num: state.num - 1
      }
    default:
      return state
  }
}
