import menuModel from '../menu';
import normalActions from '@epig/luna/lib/model/normalActions';
import TestReducer from '../../../tests/TestReducer';

const initialState = {
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
};

const reducer = new TestReducer(menuModel.reducer, initialState);

const getState = (newState = {}) => {
  return {
    ...initialState,
    ...newState,
  };
};

const addTab = (payload) => {
  return menuModel.actions.simple.pushPane(payload);
};

describe('menu model', () => {
  it('should return the initial state', () => {
    reducer.start();
    expect(reducer.getState())
    .toEqual(getState());
  });

  it('add tab success', () => {
    reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
    }));
    expect(reducer.getState())
    .toEqual(getState({
      activeSubMenu: ['system'],
      activePath: '/system/operatorList',
      paneConfigs: [expect.objectContaining({
        componentName: 'OperatorList',
        tab: '用户管理',
        key: '/system/operatorList',
        backComponent: null,
        originComponentName: 'OperatorList',
      })],
    }));
  });

  it('remove tab success', () => {
    reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
    }))(menuModel.actions.simple.popPane({
      key: '/system/operatorList',
      activePath: '/',
    }));
    expect(reducer.getState()).toEqual(getState({
      paneConfigs: [],
      activeSubMenu: ['system'],
      activePath: '/',
    }));
  });

  it('remove other tab success', () => {
    reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
    }))(addTab({
      activePath: '/system/editPassword',
      title: '修改密码',
      activeSubMenu: 'system',
    }))(menuModel.actions.simple.removeOtherPanes({}));
    expect(reducer.getState()).toEqual(getState({
      activeSubMenu: ['system'],
      activePath: '/system/editPassword',
      paneConfigs: [expect.objectContaining({
        componentName: 'EditPassword',
        tab: '修改密码',
        key: '/system/editPassword',
        backComponent: null,
        originComponentName: 'EditPassword',
      })],
    }));
  });

  it('update pane success', () => {
    reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
    }))(normalActions.redirect({
      componentName: 'EditOperator',
      options: {
        id: 1,
      },
    }));
    const targetPaneConfig = reducer.getState().paneConfigs[0];
    expect(targetPaneConfig.componentName).toEqual('EditOperator');
    expect(targetPaneConfig.options).toEqual({
      id: 1,
    });
  });

  it('update same componentName pane success', () => {
    const t = reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
    }));
    const id = reducer.getState().paneConfigs[0].id;
    t(normalActions.redirect({
      componentName: 'OperatorList',
      options: {
        id: 1,
      },
    }));
    const targetPaneConfig = reducer.getState().paneConfigs[0];
    expect(reducer.getState().paneConfigs[0].id).not.toBe(id);
  });

  it('back success', () => {
    reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
    }))(normalActions.redirect({
      componentName: 'EditOperator',
      options: {
        id: 1,
      },
    }))(normalActions.redirect({
      componentName: 'EditOperator2',
      options: {
        id: 2,
      },
    }))(menuModel.actions.simple.back());
    expect(reducer.getState().paneConfigs[0].componentName).toEqual('EditOperator');
    expect(reducer.getState().paneConfigs[0].options).toEqual({
      id: 1,
    });
    reducer.dispatchAction(menuModel.actions.simple.back());
    expect(reducer.getState().paneConfigs[0].componentName).toEqual('OperatorList');
  });

  it('custom backComponent options', () => {
    reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
    }))(normalActions.redirect({
      componentName: 'EditOperator',
      options: {
        id: 1,
        load: true,
      },
    }))(normalActions.redirect({
      componentName: 'EditOperator2',
      backComponent: {
        options: {
          id: 1,
          load: false,
        },
      },
    }))(menuModel.actions.simple.back());
    expect(reducer.getState().paneConfigs[0].options).toEqual({
      id: 1,
      load: false,
    });
  });

  it('single tab', () => {
    reducer.start()(menuModel.actions.simple.changeMultiTab({
      multipleTab: false,
    }));
    expect(reducer.getState())
    .toEqual(getState({ multipleTab: false }));

    reducer.dispatchAction(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
    }));
    expect(reducer.getState())
    .toEqual(getState({
      multipleTab: false,
      activeSubMenu: ['system'],
      activePath: '/system/operatorList',
      paneConfigs: [expect.objectContaining({
        componentName: 'OperatorList',
        tab: '用户管理',
        key: '/system/operatorList',
        backComponent: null,
        originComponentName: 'OperatorList',
      })],
    }));

    reducer.dispatchAction(addTab({
      activePath: '/system/editPassword',
      title: '修改密码',
      activeSubMenu: 'system',
    }));
    expect(reducer.getState())
    .toEqual(getState({
      multipleTab: false,
      activeSubMenu: ['system'],
      activePath: '/system/editPassword',
      paneConfigs: [expect.objectContaining({
        componentName: 'EditPassword',
        tab: '修改密码',
        key: '/system/editPassword',
        backComponent: null,
        originComponentName: 'EditPassword',
      })],
    }));
  });
});
