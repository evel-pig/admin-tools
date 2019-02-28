# tt-admin-tools

> 管理后台底层库

## 库说明

| 名称 | 描述|
|-----|-----|
| commonModels | 公共model |
| components | 组件库 |
| containers | 容器 |
| layouts    | 布局 |

## 工具

> support nodejs v8.0.0 and higher.

### 创建model

```bash
node tools model <modelPath>
```

#### options

* `--modelName` -- set model name
* `--no-api` -- create model without api
* `--list` -- create model with list
* `--apiPath` -- set api path

#### usage

```bash
node tools model /models/common
```

```bash
node tools model /containers/System/OperatorList/model --modelName operator --list --apiPath /system/getOperatorList
```
