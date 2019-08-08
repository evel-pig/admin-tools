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
  commonContainers: {
    TInfo: {
      component: () => import (/* webpackChunkName: 'cContainers' */
      '../commonContainers/TInfo'),
      models: [
        require('../commonContainers/TInfo/model'),
      ],
    },
  },
});

app.start('root');
