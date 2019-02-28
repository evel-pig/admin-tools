import { take } from 'redux-saga/effects';
import { history } from '../util/util';
import { adminNormalActions } from '../util/util';
import { createModel } from '../model';

export interface LoginApiPath {
  login: string;
  logout: string;
}

let loginApiPath: LoginApiPath = {
  login: '/system/login',
  logout: '/system/logout',
};

export function setLoginApiPath(newApiPath: LoginApiPath) {
  loginApiPath = newApiPath;
}

export interface LoginState {
  loading: boolean;
}

const model = createModel({
  modelName: 'login',
  action: {
    api: {
      login: {
        path: () => loginApiPath.login,
        message: '登录成功',
      },
      logout: {
        path: () => loginApiPath.logout,
      },
    },
  },
  reducer: ({ apiActionNames, createReducer }) => {
    return createReducer<LoginState, any>({
      [apiActionNames.login.request](state, action) {
        return {
          ...state,
          loading: true,
        };
      },
      [apiActionNames.login.success](state, action) {
        return {
          ...state,
          loading: false,
        };
      },
      [apiActionNames.login.error](state, action) {
        return {
          ...state,
          loading: false,
        };
      },
      [apiActionNames.logout.request](state, action) {
        return {
          ...state,
          loading: true,
        };
      },
      [apiActionNames.logout.success](state, action) {
        return {
          ...state,
          loading: false,
        };
      },
      [apiActionNames.logout.error](state, action) {
        return {
          ...state,
          loading: false,
        };
      },
      [adminNormalActions.loginTimeout as any](state, action) {
        return {
          ...state,
        };
      },
    }, {
      loading: false,
    });
  },
  sagas: ({ actionNames }) => {
    function* loginSuccess() {
      while (true) {
        yield take(actionNames.api.login.success);
        history.push('/');
      }
    }

    function* logoutSuccess() {
      while (true) {
        yield take(actionNames.api.logout.success);
        history.push('/user/login');
      }
    }
    return [
      loginSuccess,
      logoutSuccess,
    ];
  },
});

export default model;
