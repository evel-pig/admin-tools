var config = {
  'POST /test': {
    status: 0,
  },
  'POST /system/login': {
    status: 0,
    data: {
      token: '123'
    },
  },
  'POST /system/logout': {
    status: 0,
  },
  'POST /getList': {
    status: 0,
    data: {
      infos: [{ id: 1 }],
    },
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
        {
          id: 2,
          text: '测试',
          name: 'test',
          icon: 'team',
          items: [{
            id: 1001,
            text: '测试1',
            name: 'page1',
            leaf: true,
            permissionId: -1,
          }],
        },
      ],
    },
  },
  'POST /getUser': {
    status: 0,
    data: {
      info: [{ id: 1, name: 'mary' }],
    },
  },
}

module.exports = config;
