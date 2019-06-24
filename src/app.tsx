import '@babel/polyfill';
import { sagas as commonSagas, reducers as commonReducers } from './commonModels';
import { getNavData, GetNavDataOptions } from './router/nav';
import './app.less';
import router, { NavData } from './router';
import { message as antdMessage, Spin } from 'antd';
import { history, adminNormalActions } from './util/util';
import menuModel, { MenuDecorator, MenuState } from './commonModels/menu';
import React from 'react';
import TTApp, { AppOptions, AppPersistConfig, StoreConfig } from '@epig/luna';
import { createTransform } from '@epig/luna/lib/persist';
import DefaultLoadingComponent from './components/DefaultLoadingComponent';
import { setDefaultLoadingComponent } from './components/DynamicComponent';
import { ApiBasePath } from '@epig/luna/lib/model/initApi';

const apiReg = {
  api: /^api-/,
  error: /_error$/,
};

export const addTokenMiddleware = (tokenKeys = []) => store => next => action => {
  const tokenState = store.getState().token;
  if (tokenState) {
    const token = {};
    tokenKeys.forEach(key => {
      token[key] = tokenState[key];
    });
    if (apiReg.api.test(action.type)) {
      let result = next({
        ...action,
        payload: {
          ...token,
          ...action.payload,
        },
      });

      return result;
    }
  }

  let result2 = next(action);

  return result2;
};

export function isRequestErrorAction(action) {
  return apiReg.api.test(action.type) && apiReg.error.test(action.type);
}

export const requestErrorMiddleware = message => store => next => action => {
  let result = next(action);
  if (isRequestErrorAction(action)) {
    const error = action.payload.error;
    if (message) {
      message.error(error.des);
    }
    if (error.status === -103 || error.status === 401) {
      next(adminNormalActions.loginTimeout({}));
      if (!history) {
        console.error('history不能为空，使用setHistory方法设置history');
      } else {
        history.push({
          pathname: '/user/login',
        });
      }
    }
  }

  return result;
};

const closeModalPaneMiddleware = store => next => action => {
  const menu = store.getState().menu as MenuState;
  if (menu.modalPaneConfig) {
    if ((menu.modalPaneConfig.cancelActionNames || []).indexOf(action.type) >= 0) {
      store.dispatch(menuModel.actions.simple.cancelModal({}));
    }
  }

  return next(action);
};

export function defaultAdminRequestErrorHandle(res) {
  if (res.payload.error || res.payload.res.status !== 0) {
    let error = res.payload.error;
    if (!error) {
      error = res.payload.res;
    }

    return error;
  }

  return null;
}

let defaultTransform = createTransform(
  (state, key) => {
    if (key === 'menu') {
      return {
        menus: [],
        exception: null,
        paneConfigs: state.paneConfigs.map(item => {
          return {
            ...item,
            componentName: item.originComponentName,
            options: null,
          };
        }),
        name: state.name,
        avatar: state.avatar,
        headerTheme: state.headerTheme,
        siderTheme: state.siderTheme,
        previewHeaderTheme: null,
        previewSiderTheme: null,
        breadcrumbNames: state.breadcrumbNames,
        activeSubMenu: state.activeSubMenu,
      };
    }
    return state;
  },
  (state, key) => {
    if (key === 'menu') {
      return {
        ...state,
        menus: [],
        exception: null,
      };
    }
    return state;
  },
  { whitelist: ['menu'] },
);

export interface AdminStoreConfig extends StoreConfig {
  noAddToken?: boolean;
  tokenKeys?: any[];
  noHandleRequestError?: boolean;
}

const defaultAdminPersistConfig: AppPersistConfig = {
  key: 'admin',
  whiteList: [
    'token',
    'menu',
  ],
  transforms: [defaultTransform],
  wrapperLoadingComponent: (
    <div style={{ display: 'flex', alignItems: 'center', height: `${window.innerHeight}px` }}>
      <Spin size="large" style={{ width: '100%', margin: '40px 0' }} />
    </div>
  ),
};

export interface TTAppModelOptions {
  noCommonModels?: boolean;
  message?: any;
  syncModels?: {reducers: any; sagas: any};
  basePath?: ApiBasePath;
}

export interface TTAdminAppOptions {
  persistConfig?: AppPersistConfig;
  model?: TTAppModelOptions;
  store?: AdminStoreConfig;
  routes?: () => any[];
  appName: string;
  /**
   * 自定义navData
   */
  getNavData?: any;
  /**
   * 不请求菜单
   */
  noRequestMenu?: boolean;
  /**
   * 自定义菜单，用于前端写死菜单的情况
   */
  customMenus?: ((state: any) => MenuDecorator[]) | MenuDecorator[];
  /**
   * 多标签页（默认值为true）
   */
  multipleTab?: boolean;
  /**
   * 配置异步加载的Loading组件
   */
  DynamicDefaultLoadingComponent?: React.ReactNode;
  /** 自定义请求错误处理 */
  adminRequestErrorHandle?: (res: any) => any;
  processResponse?: (res: any) => any;
  /** 发起checkPermission action，配合noRequestMenu使用 */
  checkPermission?: boolean;
  navDataOptions?: GetNavDataOptions;
}

const DEFAULT_TTADMINAPP_OPTIONS: TTAdminAppOptions = {
  appName: '',
  noRequestMenu: false,
  multipleTab: true,
  customMenus: [],
  DynamicDefaultLoadingComponent: <DefaultLoadingComponent />,
};

export default class TTAdminApp {
  appName: string;
  noRequestMenu: boolean;
  checkPermission: boolean;
  private _nav: NavData[];
  private _routes: () => any[];
  private _getNavData: any;
  private _core: TTApp;
  private _navDataOptions: GetNavDataOptions;

  constructor(options: TTAdminAppOptions) {
    this._navDataOptions = options.navDataOptions || {};
    options = {
      ...DEFAULT_TTADMINAPP_OPTIONS,
      ...options,
    };
    const message = options.model ? options.model.message || antdMessage : antdMessage;
    let storeOptions = options.store || {};
    storeOptions = {
      ...storeOptions,
      middlewares: [
        closeModalPaneMiddleware,
      ].concat(storeOptions.middlewares || []),
    };
    if (!storeOptions.noAddToken) {
      const tokenKeys = storeOptions.tokenKeys || ['token', 'operatorId'];
      storeOptions.middlewares = [
        addTokenMiddleware(tokenKeys),
      ].concat(storeOptions.middlewares);
    }
    if (!storeOptions.noHandleRequestError) {
      storeOptions.middlewares = [
        requestErrorMiddleware(message),
      ].concat(storeOptions.middlewares);
    }
    const persistConfig = {
      ...defaultAdminPersistConfig,
      ...(options.persistConfig || {}),
    };
    let ttAppOptions: AppOptions = {
      store: storeOptions,
      persistConfig: persistConfig,
      render: () => {
        return router(this._nav, this);
      },
      model: {
        message: message,
        requestErrorHandle: options.adminRequestErrorHandle || defaultAdminRequestErrorHandle,
        basePath: options.model ? options.model.basePath || '' : '',
        processRes: options.processResponse,
      },
    };
    this._core = new TTApp(ttAppOptions);

    if (!options.model || !options.model.noCommonModels) {
      this.model(commonReducers, commonSagas);
    }

    if (options.model && options.model.syncModels) {
      this.model(options.model.syncModels.reducers, options.model.syncModels.sagas);
    }

    /**
     * 读取缓存前要先加载所有同步model
     */
    this._core.persist();

    if (!options.model || !options.model.noCommonModels) {
      this._core.store.dispatch(menuModel.actions.simple.changeMultiTab({
        multipleTab: options.multipleTab,
      }));
      if (options.noRequestMenu) {
        this._core.store.dispatch(menuModel.actions.simple.setMenus({
          menus: typeof options.customMenus === 'function'
          ? options.customMenus(this._core.store.getState()) : options.customMenus,
          noRequestMenu: options.noRequestMenu,
        }));
      }
    }

    this._getNavData = options.getNavData || null;

    this._routes = options.routes;

    this.appName = options.appName;
    this.noRequestMenu = options.noRequestMenu;
    this.checkPermission = options.checkPermission;

    setDefaultLoadingComponent(() => options.DynamicDefaultLoadingComponent );
  }

  setRouter() {
    if (this._getNavData) {
      return this._getNavData();
    }
    return getNavData(this._routes, this._navDataOptions);
  }

  model(reducers, sagas) {
    this._core.model(reducers, sagas);
  }

  start(containerId: string) {
    this._nav = this.setRouter();

    this._core.start(containerId);
  }
}
