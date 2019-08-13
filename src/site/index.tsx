import App from '../app';

const processResponse = res => res.data;

const app = new App({
  appName: 'epig-test-admin-app',
  routes: () => require('../.admin-tools/router'),
  // noRequestMenu: true,
  customMenus: () => [
    {
      id: 1,
      text: '系统管理',
      name: 'system',
      icon: 'team',
      items: [{
        id: 1001,
        text: '账号管理',
        name: 'account',
        leaf: true,
        permissionId: -1,
      }],
    },
  ],
  persistConfig: {
    key: 'epig-test-admin-app',
  },
  processResponse: processResponse,
  getOperatorInfoConfig: {
    apiPath: '/system/managerInfo',
    handleSuccess: (state, action) => {
      return {
        menus: action.payload.res.menus,
      };
    },
  },
  commonContainers: () => require('./commonContainers'),
});

app.start('root');

declare const module: any;
if (module.hot) {
  module.hot.accept('../.admin-tools/router', () => {
    // 当window['hotReload'] = true，不使用缓存的组件，达到热加载的效果
    window['hotReloadLayout'] = true;
    window['hotReload'] = true;
    app.start('root');
  });
  module.hot.accept('./commonContainers', () => {
    // 当window['hotReload'] = true，不使用缓存的组件，达到热加载的效果
    window['hotReload'] = true;
    app.start('root');
  });
}
