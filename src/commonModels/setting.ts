import { createModel } from '../model';

export interface SettingState {
  visible: boolean;
}

export default createModel({
  modelName: 'setting',
  action: {
    simple: {
      toogleVisible: 'toogleVisible',
    },
  },
  reducer: ({ simpleActionNames, createReducer }) => {
    return createReducer<SettingState>({
      [simpleActionNames.toogleVisible](state, action) {
        return {
          ...state,
          visible: action.payload.visible,
        };
      },
    }, {
      visible: false,
    });
  },
});
