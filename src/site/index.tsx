import App from '../app';

const processResponse = res => res.data;

const app = new App({
  appName: 'epig-test-admin-app',
  routes: () => [],
  noRequestMenu: true,
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
        permissionId: 4,
      }],
    },
  ],
  persistConfig: {
    key: 'epig-test-admin-app',
  },
  processResponse: processResponse,
});

app.start('root');
