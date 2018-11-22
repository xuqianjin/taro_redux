import request from "./request";

const API_GET_DEGUG_TOKEN = API_HOST + "/c/wxlite/debugLogin/{id}";
//wx
const API_POST_WXLOGIN = API_HOST + "/c/wxlite/login";
const API_PUT_WXUERINFO = API_HOST + "/c/wxlite/userinfo";
const API_PUT_WXUERPHONE = API_HOST + "/c/wxlite/phonenum";
const API_POST_WXFORMID = API_HOST + "/c/wxlite/formid";
const API_POST_WXQRCODE = API_HOST + "/c/wxlite/qr";

//user
const API_PUT_USER_CARTE = API_HOST + "/c/carte";
const API_GET_USER_CARTE = API_HOST + "/c/carte/{id}";
const API_GET_USER_CARTE_DEC = API_HOST + "/c/carte/{id}/decorate";

const API_PUT_USER_CARTE_COLLECT = API_HOST + "/c/carte/{id}/collect";
const API_DEL_USER_CARTE_COLLECT = API_HOST + "/c/carte/{id}/uncollect";

const API_POST_CHARGE = API_HOST + "/c/charge";

export const getDebugToken = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_GET_DEGUG_TOKEN,
    payload: request.get(API_GET_DEGUG_TOKEN, { operateId })
  });
};

export const postWxLogin = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_WXLOGIN,
    payload: request.post(API_POST_WXLOGIN, { data })
  });
};

export const putWxUserInfo = data => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_WXUERINFO,
    payload: request.put(API_PUT_WXUERINFO, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};

export const putWxUserPhone = data => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_WXUERPHONE,
    payload: request.put(API_PUT_WXUERPHONE, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};

export const postWxFormId = formId => (dispatch, getState) => {
  if (process.env.NODE_ENV !== " production") {
    return null;
  }
  return dispatch({
    type: API_POST_WXFORMID,
    payload: request.post(API_POST_WXFORMID, {
      header: {
        Authorization: getState().userReducer.token
      },
      data: {
        formid: formId,
        senderId: getState().userReducer.userinfo.userId
      }
    })
  });
};

export const postWxQrCode = page => (dispatch, getState) => {
  return dispatch({
    type: API_POST_WXQRCODE,
    payload: request.post(API_POST_WXQRCODE, {
      header: {
        Authorization: getState().userReducer.token
      },
      data: {
        page,
        scene: getState().userReducer.userinfo.userId.toString()
      }
    })
  });
};

export const getUserCarte = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_GET_USER_CARTE,
    payload: request.get(API_GET_USER_CARTE, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId
    })
  });
};

export const putUserCarte = data => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_USER_CARTE,
    payload: request.put(API_PUT_USER_CARTE, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};

export const getUserCarteDesc = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_GET_USER_CARTE_DEC,
    payload: request.get(API_GET_USER_CARTE_DEC, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId
    })
  });
};

export const putUserCarteCollect = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_USER_CARTE_COLLECT,
    payload: request.put(API_PUT_USER_CARTE_COLLECT, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId
    })
  });
};

export const delUserCarteCollect = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_DEL_USER_CARTE_COLLECT,
    payload: request.delete(API_DEL_USER_CARTE_COLLECT, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId
    })
  });
};

export const postCharge = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_CHARGE,
    payload: request.post(API_POST_CHARGE, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};

const init_state = {
  token: "",
  userinfo: "",
  usercarte: ""
};

export default function reducer(state = init_state, action) {
  switch (action.type) {
    case `${API_GET_DEGUG_TOKEN}_FULFILLED`:
      return {
        ...state,
        token: action.payload.token,
        userinfo: action.payload
      };
    case `${API_GET_USER_CARTE}_FULFILLED`:
      return {
        ...state,
        usercarte: action.payload
      };
    case `${API_POST_WXLOGIN}_FULFILLED`:
      return {
        ...state,
        token: action.payload.token,
        userinfo: action.payload
      };
    default:
      return state;
  }
}
