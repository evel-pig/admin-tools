import { adminNormalActions } from '../util/util';
import { createModel } from '../model';
import loginModel from './login';

let getToken = null;

export function setGetToken(func) {
  getToken = func;
}

function defaultGetToken(res) {
  const { status, des, ...others } = res;
  const token = {};
  Object.keys(others).forEach(key => {
    if (typeof others[key] !== 'object') {
      token[key] = others[key];
    }
  });

  return token;
}

getToken = defaultGetToken;

export default createModel({
  modelName: 'token',
  action: {
    simple: {
      setToken: 'setToken',
    },
  },
  reducer: ({ simpleActionNames, createReducer }) => {
    return createReducer<any, any>({
      [loginModel.actionNames.api.login.success](state, action) {
        let res = action.payload.res;
        const token = getToken(res);
        return {
          ...token,
        };
      },
      [loginModel.actionNames.api.login.error](state, action) {
        const newState = {};
        Object.keys(state).forEach(key => {
          newState[key] = null;
        });
        return newState;
      },
      [loginModel.actionNames.api.logout.success](state, action) {
        const newState = {};
        Object.keys(state).forEach(key => {
          newState[key] = null;
        });
        return newState;
      },
      [adminNormalActions.loginTimeout as any](state, action) {
        const newState = {};
        Object.keys(state).forEach(key => {
          newState[key] = null;
        });
        return newState;
      },
      [simpleActionNames.setToken](state, action) {
        return {
          token: action.payload.token,
        };
      },
    }, {
    });
  },
});
