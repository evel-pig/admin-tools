import { makeListHandleActions, getInitializeState, setHandleRequestSuccess } from '../listReducers';
import { initApi } from '@epig/luna/lib/model/initApi';
import { handleActions, createAction } from 'redux-actions';

let apis = {
  login: 'login',
};

let apiConfigs = {
  login: {
  path: '/system/login',
  actionName: apis.login,
}};

const testApis = initApi('/api', apiConfigs, 'test');

function createReducer(tApis, apiPath = undefined) {
  const listHandle = makeListHandleActions(tApis.apiActionNames.login, apiPath);
  const reducer = handleActions({
    ...listHandle.handleActions,
  }, {
    ...listHandle.initializeState,
  });
  return reducer;
}

describe('listReducers', () => {
  it('handle list action correctly', () => {
    const reducer = createReducer(testApis);
    const initialState = getInitializeState();

    expect(reducer(undefined, {} as any)).toEqual(initialState);

    expect(reducer(undefined, testApis.apiActions.login({}))).toEqual({
      ...initialState,
      loading: true,
    });

    expect(reducer(undefined, createAction<any>(testApis.apiActionNames.login.success)({
      req: {
        pageNo: 1,
        pageSize: 10,
      },
      res: {
        pageMax: 1,
        totalNum: 1,
        infos: [{
          name: 'mary',
          age: 25,
        }],
      },
    }))).toEqual({
      ...initialState,
      infos: [{
        name: 'mary',
        age: 25,
      }],
      pagination: {
        ...initialState.pagination,
        total: 1,
      },
    });

    expect(reducer(undefined, createAction<any>(testApis.apiActionNames.login.error)({}))).toEqual(
      {
        ...initialState,
      },
    );
  });

  it('handle apiPath list action correctly', () => {
    const reducer = createReducer(testApis, 'login');
    const initialState = getInitializeState();

    expect(reducer(undefined, {} as any)).toEqual({
      login: initialState,
    });

    expect(reducer(undefined, testApis.apiActions.login({}))).toEqual({
      login: {
        ...initialState,
        loading: true,
      },
    });

    expect(reducer(undefined, createAction<any>(testApis.apiActionNames.login.success)({
      req: {
        pageNo: 1,
        pageSize: 10,
      },
      res: {
        pageMax: 1,
        totalNum: 1,
        infos: [{
          name: 'mary',
          age: 25,
        }],
      },
    }))).toEqual({
      login: {
        ...initialState,
        infos: [{
          name: 'mary',
          age: 25,
        }],
        pagination: {
          ...initialState.pagination,
          total: 1,
        },
      },
    });

    expect(reducer(undefined, createAction<any>(testApis.apiActionNames.login.error)({}))).toEqual(
      {
        login: { ...initialState },
      },
    );
  });

  it('custom handle request success', () => {
    setHandleRequestSuccess((state, action) => {
      return {
        ...state,
        loading: false,
        infos: action.payload.res.data.items,
        pagination: {
          ...state.pagination,
          current: action.payload.req.pageNo || 1,
          pageSize: action.payload.req.pageSize || 10,
          total: action.payload.res.data.totalSize,
        },
      };
    });

    const reducer = createReducer(testApis);
    const initialState = getInitializeState();

    expect(reducer(undefined, {} as any)).toEqual(initialState);

    expect(reducer(undefined, testApis.apiActions.login({}))).toEqual({
      ...initialState,
      loading: true,
    });

    expect(reducer(undefined, createAction<any>(testApis.apiActionNames.login.success)({
      req: {
        pageNo: 1,
        pageSize: 10,
      },
      res: {
        data: {
          items: [{
            name: 'mary',
            age: 25,
          }],
          totalSize: 1,
        },
      },
    }))).toEqual({
      ...initialState,
      infos: [{
        name: 'mary',
        age: 25,
      }],
      pagination: {
        ...initialState.pagination,
        total: 1,
      },
    });

    expect(reducer(undefined, createAction<any>(testApis.apiActionNames.login.error)({}))).toEqual(
      {
        ...initialState,
      },
    );
  });
});
