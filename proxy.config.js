var config = {
  'POST /system/login': {
    status: 0,
    data: {
      token: '123'
    },
  },
  'POST /system/logout': {
    status: 0,
  },
  'POST /system/managerInfo': {
    status: 0,
    data: {
      menus: [
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
    },
  },
}

module.exports = config;
