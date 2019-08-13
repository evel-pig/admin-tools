module.exports = {
  TInfo: {
    component: () => import (/* webpackChunkName: 'cContainers' */
    '../commonContainers/TInfo'),
    models: [
      () => import (/* webpackChunkName: 'cContainers' */
    '../commonContainers/TInfo/model'),
    ],
  },
};
