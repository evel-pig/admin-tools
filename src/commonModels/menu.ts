import { getComponentName, history } from '../util/util';
import { take, put, select } from 'redux-saga/effects';
import loginModel from './login';
import { adminNormalActions } from '../util/util';
import normalActions from '@epig/luna/lib/model/normalActions';
import { createModel } from '../model';
import { refreshUniTable } from '../event/handler';

export interface GoTabPayload {
  path: string;
  component: {
    componentName: string;
    options: any;
  };
}

// reducers

export interface MenuDecorator {
  text: string;
  name: string;
  icon?: string;
  leaf?: boolean;
  items?: MenuDecorator[];
  id?: any;
  permissionId?: any;
  notDisplayInMenu?: boolean;
}

export interface BackComponentDecorator {
  componentName: string;
  options?: any;
  onClick?: () => void;
  backComponent?: BackComponentDecorator;
  id: any;
}

interface PaneConfig {
  componentName: string;
  tab: string;
  key: string;
  options?: any;
  backComponent: BackComponentDecorator;
  originComponentName: string;
  id: string;
}

export interface UpdatePaneModalConfig {
  title: string;
  width?: number;
  onCancel?: () => void;
  /**
   * 触发这些action的时候关闭Modal，默认会自动刷新父组件的UniTable
   */
  cancelActionNames?: any[];
  /**
   * 需要刷新的Unitable action
   */
  refreshUniTableAction?: any;
}

export interface ModalPaneConfig extends UpdatePaneModalConfig {
  componentName: string;
  key: string;
  options?: any;
}

export interface MenuState {
  menus: MenuDecorator[];
  activeSubMenu: string[];
  activePath: string;
  paneConfigs: PaneConfig[];
  exception: string;
  loading: boolean;
  name: string;
  headerTheme: { value: string; text: string };
  siderTheme: { value: string; text: string };
  previewHeaderTheme: string;
  previewSiderTheme: string;
  avatar: string;
  collapsed: boolean;
  breadcrumbNames: any[];
  multipleTab: boolean;
  noRequestMenu: boolean;
  modalPaneConfig: ModalPaneConfig;
}

export interface GetOperatorInfoConfig {
  /**
   * 获取用户信息接口
   */
  apiPath: string;
  /**
   * 处理返回数据
   */
  handleSuccess: (state, action) => any;
}

let getOperatorInfoConfig: GetOperatorInfoConfig = {
  apiPath: '/system/getOperatorInfo',
  handleSuccess: (state, action) => {
    return {
      menus: action.payload.res.operatorInfo.menus,
      name: action.payload.res.operatorInfo.name,
    };
  },
};

export function setGetOperatorInfoConfig(newConfig: GetOperatorInfoConfig) {
  if (newConfig) {
    getOperatorInfoConfig = newConfig;
  }
}

const model = createModel({
  modelName: 'menu',
  action: {
    simple: {
      updatePane: 'updatePane',
      changeSubMenu: 'changeSubMenu',
      activePane: 'activePane',
      pushPane: 'pushPane',
      popPane: 'popPane',
      refreshPane: 'refreshPane',
      removeOtherPanes: 'removeOtherPanes',
      setException: 'setException',
      previewHeaderTheme: 'previewHeaderTheme',
      resetHeaderTheme: 'resetHeaderTheme',
      setHeaderTheme: 'setHeaderTheme',
      previewSiderTheme: 'previewSiderTheme',
      resetSiderTheme: 'resetSiderTheme',
      setSiderTheme: 'setSiderTheme',
      back: 'back',
      goTab: 'goTab',
      afterGoTab: 'afterGoTab',
      toogleCollapsed: 'toogleCollapsed',
      changeBreadcrumbNames: 'changeBreadcrumbNames',
      changeMultiTab: 'changeMultiTab',
      setMenus: 'setMenus',
      setName: 'setName',
      checkPermission: 'checkPermission',
      completeCheckPermission: 'completeCheckPermission',
      cancelModal: 'cancelModal',
      startCancelModal: 'startCancelModal',
    },
    api: {
      getOperatorInfo: {
        path: () => getOperatorInfoConfig.apiPath,
      },
    },
  },
  reducer: ({ simpleActionNames, apiActionNames, createReducer }) => {
    return createReducer<MenuState, any>({
      [simpleActionNames.setMenus](state, action) {
        return {
          ...state,
          menus: action.payload.menus,
          noRequestMenu: action.payload.noRequestMenu !== undefined
          ? action.payload.noRequestMenu : state.noRequestMenu,
        };
      },
      [simpleActionNames.changeSubMenu](state, action) {
        return {
          ...state,
          activeSubMenu: action.payload.activeSubMenu,
        };
      },
      [simpleActionNames.activePane](state, action) {
        let activeSubMenu = state.activeSubMenu || [];
        if (activeSubMenu.indexOf(action.payload.activeSubMenu) < 0) {
          activeSubMenu.push(action.payload.activeSubMenu);
        }
        return {
          ...state,
          activePath: action.payload.activePath,
          activeSubMenu: activeSubMenu,
          exception: null,
        };
      },
      [simpleActionNames.pushPane](state, action) {
        let activePath = action.payload.activePath;
        let tmpComponentName = activePath.match(/[^\/]\w+$/)[0];
        let componentName = getComponentName(tmpComponentName);
        let paneConfigs = state.paneConfigs;
        if (paneConfigs.filter(item => item.key === activePath).length === 0) {
          const newPaneConfig = {
            componentName: componentName,
            tab: action.payload.title,
            key: activePath,
            backComponent: null,
            originComponentName: componentName,
            id: action.payload.id,
          };
          if (state.multipleTab) {
            paneConfigs = paneConfigs.concat(newPaneConfig);
          } else {
            paneConfigs = [newPaneConfig];
          }
        }
        let activeSubMenu = state.activeSubMenu || [];
        if (activeSubMenu.indexOf(action.payload.activeSubMenu) < 0) {
          activeSubMenu.push(action.payload.activeSubMenu);
        }
        return {
          ...state,
          activePath: activePath,
          paneConfigs,
          exception: null,
          activeSubMenu,
        };
      },
      [simpleActionNames.popPane](state, action) {
        let targetKey = action.payload.key;
        let activePath = action.payload.activePath;
        let paneConfigs = state.paneConfigs;
        paneConfigs = paneConfigs.filter(paneConfig => paneConfig.key !== targetKey);
        return {
          ...state,
          activePath: activePath,
          paneConfigs,
        };
      },
      [simpleActionNames.removeOtherPanes](state, action) {
        let paneConfigs = state.paneConfigs.filter(item => item.key === state.activePath);
        return {
          ...state,
          paneConfigs,
        };
      },
      [simpleActionNames.refreshPane](state, action) {
        const { activePath, paneConfigs } = state;
        if (activePath === '') {
          return state;
        }
        const newPaneConfigs = paneConfigs.map(item => {
          return {
            ...item,
            id: item.key === activePath ? action.payload.id : item.id,
          };
        });

        return {
          ...state,
          paneConfigs: newPaneConfigs,
        };
      },
      [apiActionNames.getOperatorInfo.request](state, action) {
        return {
          ...state,
          loading: true,
        };
      },
      [apiActionNames.getOperatorInfo.success](state, action) {
        return {
          ...state,
          ...getOperatorInfoConfig.handleSuccess(state, action),
          loading: false,
        };
      },
      [apiActionNames.getOperatorInfo.error](state, action) {
        return {
          ...state,
          menus: [],
          activeSubMenu: [],
          activePath: '',
          paneConfigs: [],
          loading: false,
        };
      },
      [adminNormalActions.loginTimeout as any](state, action) {
        return {
          ...state,
          menus: state.noRequestMenu ? state.menus : [],
          activeSubMenu: [],
          activePath: '',
          paneConfigs: [],
        };
      },
      [loginModel.actionNames.api.logout.success](state, action) {
        return {
          ...state,
          menus: state.noRequestMenu ? state.menus : [],
          activeSubMenu: [],
          activePath: '',
          paneConfigs: [],
          name: '',
          avatar: '',
        };
      },
      [simpleActionNames.updatePane](state, action) {
        let { activePath } = state;
        const mode: UpdatePaneMode = action.payload.mode || 'default';
        let componentName = getComponentName(action.payload.componentName);
        let options = action.payload.options;
        let modalPaneConfig: ModalPaneConfig = null;
        const paneConfigs = state.paneConfigs.map(item => {
          if (item.key === activePath) {
            switch (mode) {
              case 'default':
                let origin = false;
                if (item.backComponent) {
                  origin = componentName === item.originComponentName;
                }
                return {
                  ...item,
                  componentName: componentName,
                  options: options,
                  backComponent: origin ? null : {
                    ...item,
                    ...(action.payload.backComponent || {}),
                  },
                  id: action.payload.id,
                };
              case 'modal':
                modalPaneConfig = {
                  componentName: action.payload.componentName,
                  options: options,
                  key: item.key,
                  ...action.payload.modalConfig,
                };
              default:
                return item;
            }
          }
          return item;
        });
        return {
          ...state,
          paneConfigs,
          modalPaneConfig,
        };
      },
      [simpleActionNames.startCancelModal](state, action) {
        return {
          ...state,
          modalPaneConfig: null,
        };
      },
      [simpleActionNames.afterGoTab](state, action) {
        let { activePath } = state;
        let componentName = getComponentName(action.payload.componentName);
        let options = action.payload.options;
        const paneConfigs = state.paneConfigs.map(item => {
          if (item.key === activePath) {
            let backComponent = null;
            if (componentName !== item.originComponentName) {
              backComponent = item.backComponent || { componentName: item.componentName, options: item.options };
            }
            return {
              ...item,
              componentName: componentName,
              options: options,
              backComponent: backComponent,
            };
          }
          return item;
        });
        return {
          ...state,
          paneConfigs,
        };
      },
      [simpleActionNames.back](state, action) {
        let { activePath } = state;
        const paneConfigs = state.paneConfigs.map(item => {
          if (item.key === activePath) {
            if (item.backComponent) {
              const origin = item.backComponent.componentName === item.originComponentName;
              return {
                ...item,
                componentName: item.backComponent.componentName,
                options: item.backComponent.options,
                backComponent: origin ? null : item.backComponent.backComponent,
                id: item.backComponent.id,
              };
            }
            return item;
          }
          return item;
        });
        return {
          ...state,
          paneConfigs: paneConfigs,
        };
      },
      [simpleActionNames.setException](state, action) {
        return {
          ...state,
          exception: action.payload.exception,
        };
      },
      [simpleActionNames.previewHeaderTheme](state, action) {
        return {
          ...state,
          previewHeaderTheme: action.payload.theme,
        };
      },
      [simpleActionNames.resetHeaderTheme](state, action) {
        return {
          ...state,
          previewHeaderTheme: null,
        };
      },
      [simpleActionNames.setHeaderTheme](state, action) {
        return {
          ...state,
          headerTheme: action.payload.theme,
        };
      },
      [simpleActionNames.previewSiderTheme](state, action) {
        return {
          ...state,
          previewSiderTheme: action.payload.theme,
        };
      },
      [simpleActionNames.resetSiderTheme](state, action) {
        return {
          ...state,
          previewSiderTheme: null,
        };
      },
      [simpleActionNames.setSiderTheme](state, action) {
        return {
          ...state,
          siderTheme: action.payload.theme,
        };
      },
      [simpleActionNames.toogleCollapsed](state, action) {
        return {
          ...state,
          collapsed: action.payload.collapsed,
          activeSubMenu: action.payload.collapsed ? [] : state.activeSubMenu,
        };
      },
      [simpleActionNames.changeBreadcrumbNames](state, action) {
        return {
          ...state,
          breadcrumbNames: action.payload.breadcrumbNames || [],
        };
      },
      [simpleActionNames.changeMultiTab](state, action) {
        return {
          ...state,
          multipleTab: action.payload.multipleTab,
        };
      },
      [simpleActionNames.setName](state, action) {
        return {
          ...state,
          name: action.payload.name,
        };
      },
      [simpleActionNames.checkPermission](state, action) {
        return {
          ...state,
          loading: true,
        };
      },
      [simpleActionNames.completeCheckPermission](state, action) {
        return {
          ...state,
          loading: false,
        };
      },
    }, {
      menus: [],
      activeSubMenu: [],
      activePath: '',
      paneConfigs: [],
      exception: null,
      loading: false,
      name: '',
      headerTheme: { value: 'header-default', text: '默认' },
      siderTheme: { value: 'sider-default', text: '默认' },
      previewHeaderTheme: null,
      previewSiderTheme: null,
      avatar: '',
      collapsed: false,
      breadcrumbNames: [],
      multipleTab: true,
      noRequestMenu: false,
      modalPaneConfig: null,
    });
  },
  sagas: ({ actionNames, actions }) => {
    function* redirect() {
      while (true) {
        const r = yield take(normalActions.redirect);
        yield put(actions.simple.updatePane({
          ...r.payload,
          id: getPaneId(),
        }));
      }
    }
    function* handleGoTab() {
      while (true) {
        const { payload } = yield take(actionNames.simple.goTab);
        history.push(payload.path);
        yield take([actionNames.simple.activePane, actionNames.simple.pushPane]);
        if (payload.component) {
          yield put(actions.simple.afterGoTab({
            ...payload.component,
          }));
          yield put(actions.simple.refreshPane({
            newComponentName: payload.component.componentName,
            id: getPaneId(),
          }));
        }
      }
    }
    function* handleCancelModal() {
      while (true) {
        yield take(actionNames.simple.cancelModal);
        const state: MenuState = yield select<any>(s => s.menu);
        if (state.modalPaneConfig && state.modalPaneConfig.refreshUniTableAction) {
          refreshUniTable(state.modalPaneConfig.refreshUniTableAction);
        }
        yield put(actions.simple.startCancelModal({}));
      }
    }

    return [
      redirect,
      handleGoTab,
      handleCancelModal,
    ];
  },
});

export function getPaneId() {
  return Math.random().toString(36).substr(2);
}

export type UpdatePaneMode = 'default' | 'modal';

export interface UpdatePanePayload {
  componentName: string;
  backComponent?: Partial<BackComponentDecorator>;
  mode?: UpdatePaneMode;
  modalConfig?: UpdatePaneModalConfig;
}

export function updatePane(payload: UpdatePanePayload, options = null) {
  window['store'].dispatch(model.actions.simple.updatePane({
    ...payload,
    options,
    id: getPaneId(),
  }));
}

export function goTab(options: GoTabPayload) {
  window['store'].dispatch(model.actions.simple.goTab(options));
}

export function cancelModal() {
  if (window['store']) {
    window['store'].dispatch(model.actions.simple.cancelModal());
  }
}

export function* cancelModalSaga() {
  yield put(model.actions.simple.cancelModal());
}

export default model;
