var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
let stat = Promise.promisify(fs.stat);
let mkdir = Promise.promisify(fs.mkdir);
let writeFile = Promise.promisify(fs.writeFile);
var ejs = require('ejs');
let renderFile = Promise.promisify(ejs.renderFile);

const cwd = process.cwd();

async function createModel(modelPath, options = {}) {
  let modelFolder = path.join(cwd, `./src/${path.dirname(modelPath)}`);
  let fileName = path.basename(modelPath);
  let modelName = fileName;
  if (typeof options.modelName === 'string') {
    modelName = options.modelName;
  }
  try {
    await stat(modelFolder);
  }catch (err) {
    return console.log(`folder ${modelFolder} is not exist, please create it first`);
  }
  try {
    let modelFullPath = path.join(modelFolder, `${fileName}.ts`);
    try {
      await stat(modelFullPath);
      throw new Error(`model ${modelFullPath} already created`);
    }catch(err) {
      let templateFile = 'model.template.ejs';
      if (options.api) {
        templateFile = 'model.template.api.ejs';
      }
      if (options.list) {
        templateFile = 'model.template.list.ejs';
      }
      let depth = modelPath.split('/').length - 2;
      let depthText = '';
      for (i = 0; i < depth; i++) {
        depthText += '../';
      }
      let apiPath = '/system/getName';
      if (options.apiPath) {
        apiPath = options.apiPath;
      }
      let apiActionName = apiPath.match(/\/(\w+)$/)[1];
      let componentName = modelName.replace(/^\w/, modelName[0].toUpperCase());
      let content = await renderFile(path.join(__dirname, templateFile), {
        modelName,
        componentName,
        depthText,
        apiPath,
        apiActionName,
      });
      await writeFile(modelFullPath, content);
      console.log(`create model ${modelFullPath} successful`);
    }
  }catch (err) {
    console.log(err.message);
  }
}

async function model(modelPath, options) {
  try {
    await createModel(modelPath, options);
  }catch(err) {
    console.log(err.message);
  }
}

module.exports = model;