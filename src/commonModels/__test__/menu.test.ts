import menuModel, { getPaneId } from '../menu';
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
    const id = getPaneId();
    reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
      id: id,
    }));
    expect(reducer.getState())
    .toEqual(getState({
      activeSubMenu: ['system'],
      activePath: '/system/operatorList',
      paneConfigs: [{
        componentName: 'OperatorList',
        tab: '用户管理',
        key: '/system/operatorList',
        backComponent: null,
        originComponentName: 'OperatorList',
        id: id,
      }],
    }));
  });

  it('remove tab success', () => {
    const id = getPaneId();
    reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
      id: id,
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
    const id = getPaneId();
    reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
    }))(addTab({
      activePath: '/system/editPassword',
      title: '修改密码',
      activeSubMenu: 'system',
      id: id,
    }))(menuModel.actions.simple.removeOtherPanes({}));
    expect(reducer.getState()).toEqual(getState({
      activeSubMenu: ['system'],
      activePath: '/system/editPassword',
      paneConfigs: [{
        componentName: 'EditPassword',
        tab: '修改密码',
        key: '/system/editPassword',
        backComponent: null,
        originComponentName: 'EditPassword',
        id: id,
      }],
    }));
  });

  it('update pane success', () => {
    reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
    }))(menuModel.actions.simple.updatePane({
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
      id: getPaneId(),
    }));
    const id = reducer.getState().paneConfigs[0].id;
    t(menuModel.actions.simple.updatePane({
      componentName: 'OperatorList',
      options: {
        id: 1,
      },
      id: getPaneId(),
    }));
    expect(reducer.getState().paneConfigs[0].id).not.toBe(id);
  });

  it('back success', () => {
    reducer.start()(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
    }))(menuModel.actions.simple.updatePane({
      componentName: 'EditOperator',
      options: {
        id: 1,
      },
    }))(menuModel.actions.simple.updatePane({
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
    }))(menuModel.actions.simple.updatePane({
      componentName: 'EditOperator',
      options: {
        id: 1,
        load: true,
      },
      id: getPaneId(),
    }))(menuModel.actions.simple.updatePane({
      componentName: 'EditOperator2',
      backComponent: {
        options: {
          id: 1,
          load: false,
        },
      },
      id: getPaneId(),
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

    const id = getPaneId();
    reducer.dispatchAction(addTab({
      activePath: '/system/operatorList',
      title: '用户管理',
      activeSubMenu: 'system',
      id: id,
    }));
    expect(reducer.getState())
    .toEqual(getState({
      multipleTab: false,
      activeSubMenu: ['system'],
      activePath: '/system/operatorList',
      paneConfigs: [{
        componentName: 'OperatorList',
        tab: '用户管理',
        key: '/system/operatorList',
        backComponent: null,
        originComponentName: 'OperatorList',
        id: id,
      }],
    }));

    const id2 = getPaneId();
    reducer.dispatchAction(addTab({
      activePath: '/system/editPassword',
      title: '修改密码',
      activeSubMenu: 'system',
      id: id2,
    }));
    expect(reducer.getState())
    .toEqual(getState({
      multipleTab: false,
      activeSubMenu: ['system'],
      activePath: '/system/editPassword',
      paneConfigs: [{
        componentName: 'EditPassword',
        tab: '修改密码',
        key: '/system/editPassword',
        backComponent: null,
        originComponentName: 'EditPassword',
        id: id2,
      }],
    }));
  });
});
