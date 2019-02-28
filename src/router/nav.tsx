import { BasicLayoutOwnProps, injectBasicLayout } from '../layouts/BasicLayout';
import UserLayout from '../layouts/UserLayout';
import { injectLogin, LoginOwnProps } from '../containers/Login';

import { NavData } from '../router';

export interface GetNavDataOptions {
  injectLoginConfig?: LoginOwnProps;
  injectBasicLayoutConfig?: BasicLayoutOwnProps;
}

function getNavData(routes, options: Partial<GetNavDataOptions> = {
  injectLoginConfig: {},
  injectBasicLayoutConfig: {},
}): NavData[] {
  return [
    {
      component: UserLayout,
      layout: 'UserLayout',
      name: '用户页',
      path: '/user',
      children: [
        {
          name: '登陆',
          path: '/user/login',
          components: {
            Login: injectLogin(options.injectLoginConfig),
          },
        },
      ],
    },
    {
      component: injectBasicLayout(options.injectBasicLayoutConfig),
      layout: 'BasicLayout',
      name: '首页',
      path: '/',
      children: routes(),
    },
  ];
}

export {
  getNavData,
};