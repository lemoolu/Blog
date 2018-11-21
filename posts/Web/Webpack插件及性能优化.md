---
title: Webpack插件及性能优化
date: 2018-01-01
tags: git
---


# Webpack插件及性能优化

## 插件配置优化

### babel
```js
loaders: [
  {
    test: /\.js(x)*$/,
    loader: 'babel-loader',
    include: paths.appSrc,
    exclude: /node_modules/,
    query: {
      presets: ['react', 'es2015-ie', 'stage-1']
    },
    options: {
      cacheDirectory: true, // 开启缓存
    }
  }
]
```

### devServer热加载
```js
devServer: {
    contentBase: path.resolve(__dirname, 'static'),
    // 提供给外部访问
    host: '0.0.0.0',
    port: 8388,
    // 允许开发服务器访问本地服务器的包JSON文件，防止跨域
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    // 设置热替换
    hot: true,
    // 设置页面引入
    inline: true,
    watchOptions: {
      ignored: /node_modules/,
    },
},
```

### 码压缩用ParallelUglifyPlugin代替自带的 UglifyJsPlugin插件
```js
new webpack.optimize.UglifyJsPlugin({
  sourceMap: true,
  compress: {
      warnings: false
  }
}),


ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

new ParallelUglifyPlugin({
 cacheDir: '.cache/',
 uglifyJS:{
   output: {
     comments: false
   },
   compress: {
     warnings: false
   }
 }
}),
```

## 性能优化 
[转自 https://segmentfault.com/a/1190000007891318](https://segmentfault.com/a/1190000007891318)

### 方案一 合理配置 CommonsChunkPlugin

1. 传入字符串参数，由chunkplugin自动计算提取
```js
new webpack.optimize.CommonsChunkPlugin('common.js')
```
这种做法默认会把所有入口节点的公共代码提取出来, 生成一个common.js

2. 有选择的提取公共代码
```js
new webpack.optimize.CommonsChunkPlugin('common.js',['entry1','entry2']);
```
只提取entry1节点和entry2中的共用部分模块, 生成一个common.js

3. 将entry下所有的模块的公共部分（可指定引用次数）提取到一个通用的chunk中
```js
new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    minChunks: function (module, count) {
       return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
       )
    }
});
```
提取所有node_modules中的模块至vendors中，也可以指定minChunks中的最小引用数；

4. 抽取enry中的一些lib抽取到vendors中
```js
entry = {
    vendors: ['fetch', 'loadash']
};
new webpack.optimize.CommonsChunkPlugin({
    name: "vendors",
    minChunks: Infinity
});
```
添加一个entry名叫为vendors，并把vendors设置为所需要的资源库，CommonsChunk会自动提取指定库至vendors中。


### 方案二 通过 externals 配置来提取常用库

> external就是把我们的依赖资源声明为一个外部依赖，然后通过script外链脚本引入。只是通过配置后可以告知webapck遇到此类变量名时就可以不用解析和编译至模块的内部文件中，而改用从外部变量中读取，这样能极大的提升编译速度，同时也能更好的利用CDN来实现缓存。

external的配置相对比较简单，只需要完成如下三步：

1. 在页面中加入需要引入的lib地址，如下：
```html
<head>
<script src="/static/common/react.min.js"></script>
<script src="/static/common/react-dom.js"></script>
<script src="/static/common/react-router.js"></script>
</head>
```

2. 在webapck.config.js中加入external配置项：
```js
module.export = {
    externals: {
        'react-router': {
            amd: 'react-router',
            root: 'ReactRouter',
            commonjs: 'react-router',
            commonjs2: 'react-router'
        },
        react: {
            amd: 'react',
            root: 'React',
            commonjs: 'react',
            commonjs2: 'react'
        },
        'react-dom': {
            amd: 'react-dom',
            root: 'ReactDOM',
            commonjs: 'react-dom',
            commonjs2: 'react-dom'
        }
    }
}
```

3. 非常重要的是一定要在output选项中加入如下一句话：
```js
output: {
  libraryTarget: 'umd'
}
```
通过libraryTarget可告知我们构建出来的业务模块，当读到了externals中的key时，需要以umd的方式去获取资源名，否则会有出现找不到module的情况


### 方案三 利用 DllPlugin 和 DllReferencePlugin 预编译资源模块
> 简单来说DllPlugin的作用是预先编译一些模块，而DllReferencePlugin则是把这些预先编译好的模块引用起来。这边需要注意的是DllPlugin必须要在DllReferencePlugin执行前先执行一次，dll这个概念应该也是借鉴了windows程序开发中的dll文件的设计理念。

相对于externals，dllPlugin有如下几点优势：

1. dll预编译出来的模块可以作为静态资源链接库可被重复使用，尤其适合多个项目之间的资源共享，如同一个站点pc和手机版等；
2. dll资源能有效地解决资源循环依赖的问题，部分依赖库如：react-addons-css-transition-group这种原先从react核心库中抽取的资源包，整个代码只有一句话：
  ```js
  module.exports = require('react/lib/ReactCSSTransitionGroup');
  ```
  却因为重新指向了react/lib中，这也会导致在通过externals引入的资源只能识别react,寻址解析react/lib则会出现无法被正确索引的情况。

3. 由于externals的配置项需要对每个依赖库进行逐个定制，所以每次增加一个组件都需要手动修改，略微繁琐，而通过dllPlugin则能完全通过配置读取，减少维护的成本；


配置dllPlugin对应资源表并编译文件，增加一个配置文件：webpack.dll.config.js

```js
const webpack = require('webpack');
const path = require('path');
const isDebug = process.env.NODE_ENV === 'development';
const outputPath = isDebug ? path.join(__dirname, '../common/debug') : path.join(__dirname, '../common/dist');
const fileName = '[name].js';

// 资源依赖包，提前编译
const lib = [
  'react',
  'react-dom',
  'react-router',
  'history',
  'react-addons-pure-render-mixin',
  'react-addons-css-transition-group',
  'redux',
  'react-redux',
  'react-router-redux',
  'redux-actions',
  'redux-thunk',
  'immutable',
  'whatwg-fetch',
  'byted-people-react-select',
  'byted-people-reqwest'
];

const plugin = [
  new webpack.DllPlugin({
    /**
     * path
     * 定义 manifest 文件生成的位置
     * [name]的部分由entry的名字替换
     */
    path: path.join(outputPath, 'manifest.json'),
    /**
     * name
     * dll bundle 输出到那个全局变量上
     * 和 output.library 一样即可。
     */
    name: '[name]',
    context: __dirname
  }),
  new webpack.optimize.OccurenceOrderPlugin()
];

if (!isDebug) {
  plugin.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$', 'exports', 'require']
      },
      compress: { warnings: false },
      output: { comments: false }
    })
  )
}

module.exports = {
  devtool: '#source-map',
  entry: {
    lib: lib
  },
  output: {
    path: outputPath,
    filename: fileName,
    /**
     * output.library
     * 将会定义为 window.${output.library}
     * 在这次的例子中，将会定义为`window.vendor_library`
     */
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: plugin
};
```

然后执行命令：
```js
$ NODE_ENV=development webpack --config  webpack.dll.lib.js --progress
$ NODE_ENV=production webpack --config  webpack.dll.lib.js --progress 
```

文件说明：

* lib.js 可以作为编译好的静态资源文件直接在页面中通过src链接引入，与externals的资源引入方式一样，生产与开发环境可以通过类似charles之类的代理转发工具来做路由替换；
* manifest.json 中保存了webpack中的预编译信息，这样等于提前拿到了依赖库中的chunk信息，在实际开发过程中就无需要进行重复编译；

dllPlugin的静态资源引入

> lib.js和manifest.json存在一一对应的关系，所以我们在调用的过程也许遵循这个原则，如当前处于开发阶段，对应我们可以引入common/debug文件夹下的lib.js和manifest.json，切换到生产环境的时候则需要引入common/dist下的资源进行对应操作，这里考虑到手动切换和维护的成本，我们推荐使用add-asset-html-webpack-plugin进行依赖资源的注入，可得到如下结果：
```html
<head>
<script src="/static/common/lib.js"></script>
</head>
```

在webpack.config.js文件中增加如下代码：

```js
const isDebug = (process.env.NODE_ENV === 'development');
const libPath = isDebug ? '../dll/lib/manifest.json' : 
'../dll/dist/lib/manifest.json';

// 将mainfest.json添加到webpack的构建中

module.export = {
  plugins: [
       new webpack.DllReferencePlugin({
       context: __dirname,
       manifest: require(libPath),
      })
  ]
}
```

多个工程之间如果需要使用共同的lib资源，也只需要引入对应的lib.js和manifest.js即可，plugin配置中也支持多个webpack.DllReferencePlugin同时引入使用，如下：

```js
module.export = {
  plugins: [
     new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require(libPath),
      }),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require(ChartsPath),
      })
  ]
}
```


### 方案四 使用 Happypack 加速你的代码构建
> happypack的处理思路是将原有的webpack对loader的执行过程从单一进程的形式扩展多进程模式，原本的流程保持不变，这样可以在不修改原有配置的基础上来完成对编译过程的优化，具体配置如下：
```js
const HappyPack = require('happypack');
const os = require('os')
const HappyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length}); // 启动线程池});

module:{
    rules: [
      {
        test: /\.(js|jsx)$/,
        // use: ['babel-loader?cacheDirectory'],
        use: 'happypack/loader?id=jsx',
        exclude: /^node_modules$/
      }
    ]
  },
  plugins:[
    new HappyPack({
     id: 'jsx',
     cache: true,
     threadPool: HappyThreadPool,
     loaders: ['babel-loader']
   })
  ]
```

我们可以看到通过在loader中配置直接指向happypack提供的loader，对于文件实际匹配的处理 loader，则是通过配置在plugin属性来传递说明，这里happypack提供的loader与plugin的衔接匹配，则是通过id=happybabel来完成

### 方案五、增强 uglifyPlugin

使用配置也非常简单，只需要将我们原来webpack中自带的uglifyPlugin配置：
```js
new webpack.optimize.UglifyJsPlugin({
   exclude:/\.min\.js$/
   mangle:true,
   compress: { warnings: false },
   output: { comments: false }
})
```
修改成如下代码即可：
```
const os = require('os');
    const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
    
    new UglifyJsParallelPlugin({
      workers: os.cpus().length,
      mangle: true,
      compressor: {
        warnings: false,
        drop_console: true,
        drop_debugger: true
       }
    })
```

目前webpack官方也维护了一个支持多核压缩的UglifyJs插件：uglifyjs-webpack-plugin,使用方式类似，优势在于完全兼容webpack.optimize.UglifyJsPlugin中的配置，可以通过uglifyOptions写入，因此也做为推荐使用，参考配置如下：

```js
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
  new UglifyJsPlugin({
    uglifyOptions: {
      ie8: false,
      ecma: 8,
      mangle: true,
      output: { comments: false },
      compress: { warnings: false }
    },
    sourceMap: false,
    cache: true,
    parallel: os.cpus().length * 2
  })


```

### 方案六、Tree-shaking & Scope Hoisting
> wepback在2.X和3.X中从rolluo中借鉴了tree-shaking和Scope Hoisting，利用es6的module特性，利用AST对所有引用的模块和方法做了静态分析，从而能有效地剔除项目中的没有引用到的方法，并将相关方法调用归纳到了独立的webpack_module中，对打包构建的体积优化也较为明显，但是前提是所有的模块写法必须使用ES6 Module进行实现，具体配置参考如下：

```js
 // .babelrc: 通过配置减少没有引用到的方法
  {
    "presets": [
      ["env", {
        "targets": {
          "browsers": ["last 2 versions", "safari >= 7"]
        }
      }],
      // https://www.zhihu.com/question/41922432
      ["es2015", {"modules": false}]  // tree-shaking
    ]
  }

  // webpack.config: Scope Hoisting
  {
    plugins:[
      // https://zhuanlan.zhihu.com/p/27980441
      new webpack.optimize.ModuleConcatenationPlugin()
    ]
  }
```

### 在实际的开发过程中，可灵活地选择适合自身业务场景的优化手段。

|     优化手段    | 开发环境 | 生产环境 |
|-----------------|----------|----------|
| CommonsChunk    | √        | √        |
| externals       |          | √        |
| DllPlugin       | √        | √        |
| Happypack       | √        |          |
| uglify-parallel |          | √        |
