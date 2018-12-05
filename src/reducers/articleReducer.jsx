import Taro from "@tarojs/taro";
import request from "./request";

const API_GET_SYS_ARTICLE = API_HOST + "/c/articles/system";
const API_POST_SYS_ARTICLE = API_HOST + "/c/articles";
const API_GET_USER_ARTICLE_MY = API_HOST + "/c/articles/my";

const API_GET_USER_ARTICLE_COLLECT = API_HOST + "/c/articles/collect";
const API_PUT_USER_ARTICLE_STAR = API_HOST + "/c/articles/star";
const API_PUT_USER_ARTICLE_UNSTAR = API_HOST + "/c/articles/unstar";

const API_GET_ARTICLE = API_HOST + "/c/article/{id}";

export const getSysArticle = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_SYS_ARTICLE,
    payload: request.get(API_GET_SYS_ARTICLE)
  });
};
export const getArticle = operateId => (dispatch, getState) => {
  return dispatch({
    type: API_GET_ARTICLE,
    payload: request.get(API_GET_ARTICLE, { operateId })
  });
};
export const getUserArticleMy = params => (dispatch, getState) => {
  return dispatch({
    type: API_GET_USER_ARTICLE_MY,
    payload: request.get(API_GET_USER_ARTICLE_MY, {
      header: {
        Authorization: getState().userReducer.token
      },
      params
    })
  });
};
export const getUserArticleCollect = () => (dispatch, getState) => {
  return dispatch({
    type: API_GET_USER_ARTICLE_COLLECT,
    payload: request.get(API_GET_USER_ARTICLE_COLLECT, {
      header: {
        Authorization: getState().userReducer.token
      }
    })
  });
};

export const putUserArticleStar = data => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_USER_ARTICLE_STAR,
    payload: request.put(API_PUT_USER_ARTICLE_STAR, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};
export const putUserArticleUnStar = data => (dispatch, getState) => {
  return dispatch({
    type: API_PUT_USER_ARTICLE_UNSTAR,
    payload: request.put(API_PUT_USER_ARTICLE_UNSTAR, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};
export const postSysArticle = data => (dispatch, getState) => {
  return dispatch({
    type: API_POST_SYS_ARTICLE,
    payload: request.post(API_POST_SYS_ARTICLE, {
      header: {
        Authorization: getState().userReducer.token
      },
      data
    })
  });
};

const init_state = {
  deviceinfo: "",
  osstoken: "",
  sysarticle: ""
};

export default function reducer(state = init_state, action) {
  switch (action.type) {
    case `${API_GET_SYS_ARTICLE}_FULFILLED`:
      return {
        ...state,
        sysarticle: action.payload
      };
    default:
      return state;
  }
}
