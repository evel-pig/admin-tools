import { getComponentName, history } from '../util/util';
import { delay } from 'redux-saga';
import { take, put } from 'redux-saga/effects';
import loginModel from './login';
import { adminNormalActions } from '../util/util';
import normalActions from '@epig/luna/lib/model/normalActions';
import { createModel } from '../model';

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
}

interface PaneConfig {
  componentName: string;
  tab: string;
  key: string;
  options?: any;
  backComponent: BackComponentDecorator;
  originComponentName: string;
}

export interface UpdatePaneModalConfig {
  title: string;
  width?: number;
  onCancel?: () => void;
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

const model = createModel({
  modelName: 'menu',
  action: {
    simple: {
      changeSubMenu: 'changeSubMenu',
      activePane: 'activePane',
      pushPane: 'pushPane',
      popPane: 'popPane',
      refreshPane: 'refreshPane',
      refreshPaneEnd: 'refreshPaneEnd',
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
    },
    api: {
      getOperatorInfo: {
        path: '/system/getOperatorInfo',
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
        for (let i = 0; i < paneConfigs.length; i++) {
          if (paneConfigs[i].key === activePath) {
            paneConfigs[i].componentName = '';
          }
        }

        return {
          ...state,
          paneConfigs: paneConfigs,
        };
      },
      [simpleActionNames.refreshPaneEnd](state, action) {
        const { activePath, paneConfigs } = state;
        if (activePath === '') {
          return state;
        }
        const { newComponentName, options } = action.payload;
        for (let i = 0; i < paneConfigs.length; i++) {
          if (paneConfigs[i].key === activePath) {
            paneConfigs[i].componentName = newComponentName;
            if (options) {
              paneConfigs[i].options = options;
            }
          }
        }

        return {
          ...state,
          paneConfigs: paneConfigs,
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
          menus: action.payload.res.operatorInfo.menus,
          loading: false,
          name: action.payload.res.operatorInfo.name,
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
      [normalActions.redirect as any](state, action) {
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
      [simpleActionNames.cancelModal](state, action) {
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
    function* refreshTabPane() {
      while (true) {
        const req: any = yield take(actionNames.simple.refreshPane);
        yield delay(100);
        yield put(actions.simple.refreshPaneEnd({
          newComponentName: req.payload.newComponentName,
          options: req.payload.options || null,
        }));
      }
    }
    function* goTab() {
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
          }));
        }
      }
    }

    return [
      refreshTabPane,
      goTab,
    ];
  },
});

export type UpdatePaneMode = 'default' | 'modal';

export interface UpdatePanePayload {
  componentName: string;
  backComponent?: Partial<BackComponentDecorator>;
  mode?: UpdatePaneMode;
  modalConfig?: UpdatePaneModalConfig;
}

export function updatePane(dispatch, payload: UpdatePanePayload, options = null) {
  dispatch(normalActions.redirect({
    ...payload,
    options,
  }));
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
