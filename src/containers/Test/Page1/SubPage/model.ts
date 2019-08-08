import { createModel } from '@epig/luna';

export interface SubPageState {

}

const subPageModel = createModel({
  modelName: 'subPage',
  action: {
    simple: {},
    api: {
      test: {
        path: '/test',
        redirect: {
          componentName: 'Page1',
        },
      },
    },
  },
  reducer: ({ createReducer }) => {
    return createReducer<SubPageState, any>({}, {});
  },
  sagas: () => {
    return [];
  },
});

export default subPageModel;
