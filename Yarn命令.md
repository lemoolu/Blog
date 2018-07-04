# Yarn命令

### yarn add

```js
yarn add lodash // 添加lodash库，并保存到dependencies
yarn add lodash --dev // 添加lodash库，并保存到devDependencies
yarn add lodash@2.0.0 // 添加lodash库2.0.0版本，并保存到dependencies
yarn add lodash@2 // 添加lodash库 大版本号为2的最新版本，可能是2.4.2，并保存到dependencies
```


### yarn upgrade
```js
yarn upgrade // 升级所有包到它们基于规范范围的最新版本。
yarn upgrade lodash // 升级包到它们基于规范范围的最新版本。
yarn upgrade lodash@3 // 当指定包包含版本时，将升级到该版本。 package.json 中指明的依赖也将同时更改为指定的版本。 
yarn upgrade lodash --latest // 忽略规范范围，升级到最新版本，并保存到dependencies
```


### yarn remove
```
yarn remove lodash // 移除库 
```


### yarn list
```
yarn list // 列出已安装的包
yarn list --depth=0 // 默认情况下，所有包和它们的依赖会被显示。 要限制依赖的深度
yarn list lodash // 查看当前以安装库版本
``` 


### yarn cache list
```
yarn cache list // 列出已缓存的每个包
```


### yarn info
```
yarn info react // 拉取包的信息并返回为树格式，包不必安装到本地
yarn info react@15.3.0 // 获取特定版本信息
yarn info react description // 获取特定字段信息，描述信息
yarn info react version // 获取特定字段信息，当前最新版本号
yarn info react versions // 获取特定字段信息，所有发布版本号
```


### yarn info
```
yarn info lodash // 查看lodash的所有信息
```


### yarn init
```
yarn init // 交互式创建或更新 package.json 文件
```

### yarn install
```
yarn install // 在本地 node_modules 目录安装 package.json 里列出的所有依赖
yarn install --force // 重新拉取所有包，即使之前已经安装的
yarn install --flat // 安装所有依赖，但每个依赖只允许有一个版本存在。 第一次运行这个命令时，会提示你在每个依赖包的多个版本范围中选择一个版本。 这会被添加到你的 package.json 文件的 resolutions 字段。
```

