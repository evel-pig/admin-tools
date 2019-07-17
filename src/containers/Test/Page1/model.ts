import { createModel } from '@epig/luna';
import { makeListHandleActions, ListState } from '../../../model/listReducers';

export interface Page1State extends ListState<any> {

}

const Model = createModel({
  modelName: 'page1',
  action: {
    simple: {},
    api: {
      getList: {
        path: '/getList',
      },
    },
  },
  reducer: ({ apiActionNames, createReducer }) => {
    const listHandle = makeListHandleActions(apiActionNames.getList);
    return createReducer<Page1State, any>({
      ...listHandle.handleActions,
    }, {
        ...listHandle.initializeState,
      });
  },
  sagas: () => {
    return [];
  },
});

export default Model;
