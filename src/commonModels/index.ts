import loginModel from './login';
import menuModel from './menu';
import settingModel from './setting';
import tokenModel from './token';

export let reducers = {
  [loginModel.modelName]: loginModel.reducer,
  [menuModel.modelName]: menuModel.reducer,
  [settingModel.modelName]: settingModel.reducer,
  [tokenModel.modelName]: tokenModel.reducer,
};

export let sagas = {
  [loginModel.modelName]: loginModel.sagas,
  [menuModel.modelName]: menuModel.sagas,
  [tokenModel.modelName]: tokenModel.sagas,
};
