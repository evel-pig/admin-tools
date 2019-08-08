import { createModel } from '@epig/luna';

export interface TInfoState {

}

const tInfoModel = createModel({
  modelName: 'tInfo',
  action: {
    simple: {},
    api: {},
  },
  reducer: ({ createReducer }) => {
    return createReducer<TInfoState, any>({}, {});
  },
  sagas: () => {
    return [];
  },
});

export default tInfoModel;
