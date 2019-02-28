#!/usr/bin/env node

var program = require('commander');

let model = require('../tools/model');
program
.command('model <modelPath>')
.description('create model')
.usage('test')
.option('--modelName [value]', 'model name')
.option('--no-api', 'create model without api')
.option('--list', 'create model with list')
.option('--apiPath [value]', 'set api path')
.action(function(modelPath, options){
  console.log(`create model ${modelPath}`);
  model(modelPath, options);
});

program.parse(process.argv);
