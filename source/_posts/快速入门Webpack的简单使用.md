---
title: 快速入门Webpack的简单使用
date: 2022-01-02 16:11:42
updated: 2022-01-02 16:11:42
tags: [Webpack]
categories: [前端]
---

## 快速入门 Webpack 的简单使用

原文：https://juejin.cn/post/7048497932647006216

> 前言

大家好呀，我是小浪，这次给大家带来的是我以前学习`webpack`如何使用的时候的学习总结，希望能够帮助到有需要的朋友，在学校里的事挺多的，所以好久都没有在掘金发文章。要放假了，继续坚持学习，刷到林三心大佬的 B 站视频，三心大佬他自己写文章然后去分享给他人，是一种快速学习的途径，我认为对于我来说也是十分正确，在分享的同时自己印象也会深刻

**Webpack 简介**：

> Webpack 是目前主流的前端工程化解决方案之一
>
> **主要功能**：它提供了友好的前端模块化开发支持，以及代码压缩混淆、处理浏览器端 JavaScript 的兼容性、性 能优化等强大的功能。
>
> **好处**：让程序员把工作的重心放到具体功能的实现上，提高了前端开发效率和项目的可维护性。 注意：目前 Vue，React 等前端项目，基本上都是基于 webpack 进行工程化开发的

## 前期准备

项目结构如下：

```bash
project_name
|—— src
|    |—— index.js
|—— index.html
|—— package.json
|—— webpack.config.js
|—— babel.config.js
```

### 安装

在项目中安装 webpack + webpack-cli，使用 `-D` 相当于 `--save-dev`

`-D` 写入到`package.json`中 `devDependencies`进行添加，表示我们只有在开发阶段才使用到

`-S` 相当于 `--save` 写入到 `dependencies` 对象，表示开发环境和生产都使用

如果项目没有 `package.json` 使用 `npm init -y` 快速配置一下

```bash
npm install webpack@5.42.1 webpack-cli@4.9.0 -D
```

```json
"devDependencies": {
   "webpack": "^5.42.1",
   "webpack-cli": "^4.9.0"
}
```

### 配置启动命令

在`package.json`配置 `scripts`

```json
"scripts": {
    "dev": "webpack",
},
```

在命令行我们就使用 `npm run dev` 来启动 `webpack`命令

## 基本使用

### 创建 webpack.config.js 文件

在项目根目录中，创建名为 webpack.config.js 的 webpack 配置文件，webpack 在真正开始打包构建之前，会先读取这个配置文件，从而基于给定的配置，对项目进行打包。

### 设置 mode

```js
module.exports = {
  mode: "development",
};
```

`mode` 可选值有两个，分别是：

> `development`
>
> - 开发环境
> - 不会对打包生成的文件进行代码压缩和性能优化
> - 打包速度快，适合在开发阶段使用
>
> `production`
>
> - 生产环境
> - 会对打包生成的文件进行代码压缩和性能优化
> - 打包速度很慢，仅适合在项目发布阶段使用

### 设置入口和出口

webpack 4.x 和 5.x 中默认约定：

- 默认入口文件为 `src -> index.js`
- 默认输出文件 `dist -> main.js`

我们可以在`webpack.config.js`中自定义

`entry`：打包的入口

`output`：打包的出口

我们就可以像下面一样设置

```js
module.exports = {
  entry: "./src/index.js",
  output: "./dist/mian.js",
};
```

还是这样写比较好，使用`path`模块来拼接路径

```js
const path = require("path");
module.exports = {
  mode: "development",
  entry: path.join(__dirname, "./src/index.js"),
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "js/bundle.js",
  },
};
```

## webpack-dev-server 简单使用

当修改了源代码，`webpack` 会自动进行项目的打包和构建，这个就不用每次自己去`npm run dev`了

`webpack-dev-server` 提供热更新的开发服务器

### 安装

```bash
npm install webpack-dev-server@3.11.2 -D
```

安装完毕之后可通过 `webpack serve` 启动

### 配置

方便`webpack-dev-server`的启动我们在`package.json`的`scripts`新加一个命令

```json
"scripts": {
    "serve": "webpack serve",
},
```

在`webpack.config.js`配置端口，`devServer`可配置的选项有很多，我在这里就配置一个端口

```js
module.exports = {
  devServer: {
    port: 8080,
  },
};
```

> devServer.compress，启用 gzip 压缩。
>
> devServer.contentBase，告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。
>
> devServer.host，指定 host。使用 0.0.0.0 可以让局域网内可访问。
>
> devServer.hot，启用 webpack 的模块热替换特性（Hot Module Replacement）。
>
> devServer.hotOnly，构建失败的时候是否不允许回退到使用刷新网页。
>
> devServer.inline，模式切换。默认为内联模式，使用 false 切换到 iframe 模式。
>
> devServer.open，启动 webpack-dev-server 后是否使用浏览器打开首页。
>
> devServer.overlay，是否允许使用全屏覆盖的方式显示编译错误。默认不允许
>
> devServer.port，监听端口号。默认 8080。
>
> devServer.proxy，代理，对于另外有单独的后端开发服务器 API 来说比较适合。
>
> devServer.publicPath，设置内存中的打包文件的输出目录。区别于 output.publicPath。

修改后使用 `npm run serve` 进行项目的打包

![image-20211225133914336](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05445615b7d24fda9a42568be26c67ff~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

打包完毕后，启动一个实时打包的 `http` 服务器，提示我们访问 `http://localhost:8080/`，访问之后就可以查看我们页面效果

### 打包的文件

打包生成的文件存放到了内存中，因为内存更快，提高实时打包的性能，所以上面设置的`output`的输出路径是针对**没有安装**`webpack-dev-server`来说的

如何访问我们打包好的`bundel.js`呢，因为 `webpack-dev-server` 开启了一个服务器，`/`是项目的根目录，我们直接在**地址栏**就能访问到`bundle.js`

![image-20211225135310863](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/898d1a90f1e04ee8ae218ee1fc5a937d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 插件 plugin

通过安装和配置第三方的插件，可以拓展 `webpack` 使它更强大

### html-webpack-plugin

这个插件我们会经常使用到它，将公共的`css`，`js`文件插入到 html 中，可以减少请求次数，达到优化的效果，以通过此插件自定制 `index.html` 页面的内容。

HTML 插件在生成的 `index.html` 页面，自动注入了打包的 `bundle.js` 文件

#### 安装

```bash
npm install html-webpack-plugin@5.3.2 -D
```

#### 配置

在 `webpack.config.js` 的 `plugins` 进行配置

```js
var HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {


  plugins: \[
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
      filename: path.join(__dirname, './dist/index.html'),
    }),
  \],
}
```

`HtmlWebpackPlugin`有很多可选的参数，我就说下面三个常用的

> **`title`**: 生成的 html 文档的标题。配置该项，它并不会替换指定模板文件中的 title 元素的内容
>
> **`template`**: 本地模板文件的位置，支持加载器(如 handlebars、ejs、undersore、html 等)
>
> **`filename`**：输出文件的文件名称，默认为**index.html**，不配置就是该文件名；此外，还可以为输出文件指定目录位置（例如'./dist/index.html'）

#### 使用

运行命令 `npm run dev` 就可以看见打包完成

![image-20211225142229881](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b66e1783df734f88a0b9c76e1f1d0005~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

如果是用 `npm run serve` 就不会有这两个，而是都在内存中，我们可以使用地址栏查看

### clean-webpack-plugin

时自动清理掉 dist 目录中的旧文件

#### 安装

```bash
npm install clean-webpack-plugin@3.0.0 -D
```

#### 配置

在 `webpack.config.js` 的 `plugins` 进行配置

```js
const { ClenWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {

  plugins: \[
    new ClenWebpackPlugin(),
  \],
}
```

## 加载器 loader

非 `.js` 后缀模块`webpack`默认处理不了只能理解 `JavaScript` 和 `JSON` 文件，需要调用`loader`加载器才可以正常打包

`loader` 加载器的作用：**导出为函数的 `JavaScript` 模块**。比如：

> - css-loader 打包处理 .css 相关的文件
> - less-loader 打包处理 .less 相关的文件
> - babel-loader 打包处理 webpack 无法处理的高级 js 语法

### loader 调用流程

![image-20211225143748510](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ce4b9fc6f334ca6a27cfb9a444f03d4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 打包 css

#### 安装

```bash
npm i style-loader@3.0.0 css-loader@5.2.6 -D
```

#### 配置

其中，`test` 表示匹配的文件类型（用正则）， `use` 表示对应要调用的 `loader` 注意：

- `use` 数组中指定的 `loader` 顺序是固定的
- `loader`调用顺序是：从右往左

在 `webpack.config.js` 的 `module` 进行配置

```js
module.exports = {

  module: {
    rules: \[
      {
        test: /\\.css$/,
        use: \['style-loader', 'css-loader'\],
      },
    \],
  },
}
```

### 打包 less

#### 安装

```bash
npm i less-loader@10.0.1 less@4.1.1 -D
```

#### 配置

在 `webpack.config.js` 的 `module` 进行配置

```bash
module.exports = {
  //...
  module: {
    rules: \[
      {
        test: /\\.less$/,
        use: \['style-loader', 'css-loader','less-loader\],
      },
    \],
  },
}
```

其他的 css 打包处理也一样安装指定的加载器

### 打包文件

`loader`除了能打包`css`的之外，我们使用 ` file-loader``url-loader `还可以对`url`引用的图片进行处理

#### 安装

```bash
npm i url-loader@4.1.1 file-loader@6.2.0 -D
```

#### 配置

在 `webpack.config.js` 的 `module` 进行配置

```js
module.exports = {

  module: {
    rules: \[
      {
        test: /\\.jpg|png|gif$/,
        use: {
            loader: 'url-loader',
           	options: {
                limit: 77777,
                outputPath: 'image',
            }
        }
      },
    \],
  },
}
```

> `options`是 `loader` 的参数项：
>
> `limit` 用来指定图片的大小，单位是字节（byte）只有 ≤ limit 大小的图片，才会被转为 base64 格式的图片
>
> `outputPath`:是指定的存储文件夹 `dist/image` 把图片文件统一生成到 image 目录中

### babel-loader 简单使用

借助于 `babel-loader` 进行打包处理 js 中的高级语法

#### 安装

```bash
npm i babel-loader@8.2.2 @babel/core@7.14.6 @babel/plugin-proposal-decorators@7.14.5 -D
```

#### 配置

在 `webpack.config.js` 的 `module` 进行配置

```js
module.exports = {

  module: {
    rules: \[
      {
        test: /\\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
    \],
  },
}
```

> **注意**：记得使用`exclude`排除掉 `/node_modules/`下面的模块

在项目根目录下，创建 `babel.config.js` 文件进行配置

声明 `babel` 可用的插件

```js
module.exports = {
  plugins: \[\['@babel/plugin-proposal-decorators', { legacy: true }\]\],
}
```

## 打包发布

开发环境打包生成的文件不会进行代码压缩和性能优化，而且存放在内存中，所以在生产环境中打包发布

在 `package.json`的`scripts`中新增

```js
"scripts": {
    "build": "webpack --mode production",
},
```

之后使用 `npm run build` 就直接打包发布了，这个 `--model` 是 `production` 代表生产环境，会对打包生成的文件 进行代码压缩和性能优化。 这里覆盖 `webpack.config.js` 中的 `model` 选项

## webpack 创建 Vue 项目

其实大家使用 `vue-cli` 和 `vue ui` 搭建出来的`vue`项目`webpack`都帮我们配置好了，这里我介绍下如何用 `webpack` 创建 `vue` 项目。

### 初始化项目目录

建立项目文件夹之后初始化`package.json`

```bash
npm init -y
```

在项目根目录创建 webpack 配置文件 `webpack.config.js` 在真正的开发中分开发环境和生产环境，这里为了方便就只写一个。

`index.js`:入口文件

`index.html`:入口文件模板

`babel.config.js`：babel 配置文件（先创建之后在说）

项目结构如下：

```bash
project_name
|—— src
|    |—— index.js
|    |—— App.vue
|—— index.html
|—— package.json
|—— webpack.config.js
|—— babel.config.js
```

### 安装配置 webpack 相关

安装 ` webpack``webpack-cli``webpack-dev-server ` 依赖

```bash
npm install webpack@5.42.1 webpack-cli@4.9.0 webpack-dev-server@3.11.2 -D
```

配置 `package.json`

```json
"scripts": {
    "dev": "webpack",
    "serve": "webpack-dev-server --open --hot",
    "build": "webpack --mode=development --progress --hide-modules",
},
```

配置 `webpack.config.js`

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "./src/index.js"),
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "js/bundle.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "./dist"),
    port: 8080,
  },
};
```

### 安装配置 `Vue` 相关

安装 `vue` 需要的依赖 ` vue-loader``vue-template-compiler `

```bash
npm install vue-loader vue-template-compiler -D
```

如果项目没有 `vue` 记得装 `vue`

```bash
npm install vue
```

配置 `webpack.config.js`

> 注意要引入 `VueLoaderPlugin`

```js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {

 module: {
      rules: \[

      {
          test: /\\.vue$/,
          loader: 'vue-loader'
      }
      \]
  },
  plugins: \[
      new VueLoaderPlugin()
  \]
}
```

### 安装插件

`html-webpack-plugin`和`clean-webpack-plugin`插件，这两个插件我们都上面都有介绍过

安装

```bash
npm install html-webpack-plugin@5.3.2 clean-webpack-plugin@3.0.0 -D
```

配置 `webpack.config.js`

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {

	plugins: \[
		new HtmlWebpackPlugin({
     		template:'./index.html',
		}),
        new CleanWebpackPlugin(),
	\],
 };
```

### 安装加载器

`style-loader`、`css-loader`、 ` file-loader``url-loader `等等我们上面都有介绍如果需要`sass`、`less`加载器可自行安装，这里我安装的是`sass`

```bash
npm install style-loader@3.0.0 css-loader@5.2.6 url-loader@4.1.1 file-loader@6.2.0 sass-loader node-sass -D
```

配置 `webpack.config.js`

> `sass`要把 `node_modules` 排除

```js
module.exports = {

   module: {
       rules: \[
           {
               test: /\\.css$/,
               use: \[
                   'style-loader',
                   'css-loader'
               \]
           },
          {
           test: /\\.jpg|png|gif$/,
           use: {
               loader: 'url-loader',
               options: {
                   limit: 77777,
                   outputPath: 'image',
               	}
               }
            },
           {
             test: /\\.sass$/,
             use:\['vue-style-loader',
                'css-loader', 'sass-loader'
             \],
             include: path.resolve(__dirname + '/src/'),
             exclude: /node_modules/
           },
       \]
   }
}
```

### 安装 bable

这里我安装几个常用的

```bash
npm install  babel-loader @babel/core @babel/cli @babel/preset-env -D
npm install  @babel/runtime @babel/plugin-transform-runtime -D
npm install  @babel/plugin-transform-arrow-functions -D
```

配置 `webpack.config.js`

> 同样的和上面一样要把 `node_modules` 排除

```js
module.exports = {

   module: {
       rules: \[

           {
               test: /\\.js$/,
               use: \[
                   'babel-loader'
               \],
               exclude: /node_modules/
           },
       \]
   }
}
```

配置 `babel.config.js`

```js
module.exports = function (api) {
    api.cache(true);

    const presets = \[
        '@babel/preset-env',
    \];
    const plugins = \[
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-transform-runtime'
    \];

    return {
      presets,
      plugins
    };
  }
```

最后我们就可以通过 `npm run serve`来启动`vue`项目了

## 往期精彩：

> [快速入手 Electron，拥有一个自己的桌面应用](https://juejin.cn/post/7015476516196712462 "https://juejin.cn/post/7015476516196712462")
>
> [还不会 Vue3？一篇笔记带你快速入门](https://juejin.cn/post/7006518993385160711 "https://juejin.cn/post/7006518993385160711")
>
> [还不会 TS？ 带你 TypeScript 快速入门](https://juejin.cn/post/6999440503712251935 "https://juejin.cn/post/6999440503712251935")
>
> [快速上手 Vuex 到 手写简易 Vuex](https://juejin.cn/post/6994337441314242590 "https://juejin.cn/post/6994337441314242590")
>
> [从了解到深入虚拟 DOM 和实现 diff 算法](https://juejin.cn/post/6990582632270528525 "https://juejin.cn/post/6990582632270528525")
>
> [手写一个简易 vue 响应式带你了解响应式原理](https://juejin.cn/post/6989106100582744072 "https://juejin.cn/post/6989106100582744072")
>
> [从使用到自己实现简单 Vue Router 看这个就行了](https://juejin.cn/post/6988316779818778631 "https://juejin.cn/post/6988316779818778631")
>
> [前端面试必不可少的基础知识，虽然少但是你不能不知道](https://juejin.cn/post/6983934602196811789 "https://juejin.cn/post/6983934602196811789")
