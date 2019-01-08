import request from "./request";

const API_GET_DEGUG_TOKEN = API_HOST + "/c/wxlite/debugLogin/{id}";
//wx
const API_POST_WXLOGIN = API_HOST + "/c/wxlite/login";
const API_POST_WXLOGIN_UID = API_HOST + "/c/wxlite/loginWithUserInfo";
const API_PUT_WXUERINFO = API_HOST + "/c/wxlite/userinfo";
const API_PUT_WXUERPHONE = API_HOST + "/c/wxlite/phonenum";
const API_POST_WXFORMID = API_HOST + "/c/wxlite/formid";
const API_POST_WXQRCODE = API_HOST + "/c/wxlite/qr";
const API_POST_WXFORCEPUSH = API_HOST + "/c/wxlite/forcepush";
const API_POST_MAGICMESSAGE = API_HOST + "/c/wxlite/magicMessageHook";

//user
const API_GET_USER_INFO = API_HOST + "/c/user";
const API_PUT_USER_CARTE = API_HOST + "/c/carte";
const API_GET_USER_CARTE = API_HOST + "/c/carte/{id}";
const API_GET_USER_CARTE_VISITORS = API_HOST + "/c/carte/{id}/visitors";
const API_GET_USER_CARTE_OTHER = API_HOST + "/c/carte/{id}_other";
const API_GET_USER_CARTE_DEC = API_HOST + "/c/carte/{id}/decorate";
const API_GET_USER_CARTE_DEC_OTHER = API_HOST + "/c/carte/{id}/decorate_other";

const API_GET_USER_CARTE_COLLECT = API_HOST + "/c/cartes/collect";
const API_PUT_USER_CARTE_COLLECT = API_HOST + "/c/carte/{id}/collect";
const API_DEL_USER_CARTE_COLLECT = API_HOST + "/c/carte/{id}/uncollect";

const API_POST_CHARGE = API_HOST + "/c/charge/vip";

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

export const postWxLoginUid = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_WXLOGIN_UID,
    payload: request.post(API_POST_WXLOGIN_UID, { data })
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

export const postWxFormId = (formId, senderId) => (dispatch, getState) => {
  console.log({ formId, senderId });
  if (formId === "the formId is a mock one") {
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
        senderId: Number(senderId) || getState().userReducer.userinfo.userId
      }
    })
  });
};

export const postWxQrCode = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_WXQRCODE,
    payload: request.post(API_POST_WXQRCODE, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};
export const postWxForcepush = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_WXFORCEPUSH,
    payload: request.post(API_POST_WXFORCEPUSH, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};
export const postWxMagicMessage = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_MAGICMESSAGE,
    payload: request.post(API_POST_MAGICMESSAGE, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
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
export const getUserCarteVisitors = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_GET_USER_CARTE_VISITORS,
    payload: request.get(API_GET_USER_CARTE_VISITORS, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId
    })
  });
};
export const getUserCarteOther = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_GET_USER_CARTE_OTHER,
    payload: request.get(API_GET_USER_CARTE, {
      header: {
        Authorization: getState().userReducer.token
      },
      operateId
    })
  });
};
export const getUserInfoDetail = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_USER_INFO,
    payload: request.get(API_GET_USER_INFO, {
      header: {
        Authorization: getState().userReducer.token
      }
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

export const getUserCarteDescOther = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_GET_USER_CARTE_DEC_OTHER,
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

export const getUserCarteCollect = params => (dispatch, getState) => {
  return dispatch({
    type: API_GET_USER_CARTE_COLLECT,
    payload: request.get(API_GET_USER_CARTE_COLLECT, {
      header: {
        Authorization: getState().userReducer.token
      },
      params
    })
  });
};

export const delUserCarteCollect = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_DEL_USER_CARTE_COLLECT,
    payload: request.put(API_DEL_USER_CARTE_COLLECT, {
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
  userinfodetail: "",
  usercarte: "",
  usercartevisitors: "",
  usercartedesc: "",
  cartecollect: ""
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
    case `${API_GET_USER_CARTE_VISITORS}_FULFILLED`:
      return {
        ...state,
        usercartevisitors: action.payload
      };
    case `${API_GET_USER_CARTE_DEC}_FULFILLED`:
      return {
        ...state,
        usercartedesc: action.payload
      };
    case `${API_GET_USER_CARTE_COLLECT}_FULFILLED`:
      return {
        ...state,
        cartecollect: action.payload
      };
    case `${API_POST_WXLOGIN_UID}_FULFILLED`:
    case `${API_POST_WXLOGIN}_FULFILLED`:
      return {
        ...state,
        token: action.payload.token,
        userinfo: action.payload
      };
    case `${API_GET_USER_INFO}_FULFILLED`:
      return {
        ...state,
        userinfodetail: action.payload
      };
    default:
      return state;
  }
}
