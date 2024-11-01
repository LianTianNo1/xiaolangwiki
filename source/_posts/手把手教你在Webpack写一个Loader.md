---
title: 手把手教你在Webpack写一个Loader
date: 2022-05-22 08:14:26
updated: 2022-05-22 08:14:26
tags: [webpack,loader]
categories: [前端]
---

## 手把手教你在 Webpack 写一个 Loader

原文：https://juejin.cn/post/7100534685134454815

## 前言

有的时候，你可能在从零搭建 `Webpack` 项目很熟悉，配置过各种 `loader` ,面试官在 `Webpack` 方面问你，是否自己实现过一个`loader`?如果没有去了解过如果去实现，确实有点尴尬，其实呢，`loader`实现其实很简单的。下面说下`loader`是什么？

### 为什么需要 Loader?

> `Webpack` 它只能处理 `js` 和 `JSON` 文件。面对 `css` 文件还有一些图片等等，`Webpack` 它自己是不能够处理的，它需要`loader` 处理其他类型的文件并将它们转换为有效的模块以供应用程序使用并添加到依赖关系图中，

### Loader 是什么？

> `loader`本质上是一个`node`模块，符合`Webpack`中一切皆模块的思想。由于它是一个 `node` 模块，它必须导出一些东西。`loader`本身就是一个函数，在该函数中对接收到的内容进行转换，然后返回转换后的结果

下面小浪为你简单介绍下`webpack`中的`loader`

## 常见的 loader

我们先来回顾下常见的 `Loader` 基础的配置和使用吧（仅仅只是常见的，`npm`上面开发者大佬们发布的太多了）

那么开始吧，首先先介绍 处理 `CSS` 相关的 `Loader`

### css-loader 和 style-loader

> 安装依赖

```bash
npm install css-loader style-loader
```

> 使用加载器

```js
module.exports = {

    module: {
        rules: \[{
            test: /\\.css$/,
            use: \['style-loader', 'css-loader'\],
        }\],
    },
}；
```

其中`module.rules`代表模块的处理规则。 每个规则可以包含很多配置项

`test` 可以接收正则表达式或元素为正则表达式的数组。 只有与正则表达式匹配的模块才会使用此规则。 在此示例中，`/\\.css$/` 匹配所有以 `.css` 结尾的文件。

`use` 可以接收一个包含规则使用的加载器的数组。 如果只配置了一个`css-loader`，当只有一个`loader`时也可以为字符串

`css-loader` 的作用只是处理 `CSS` 的各种加载语法（`@import` 和 `url()` 函数等），如果样式要工作，则需要 `style-loader` 将样式插入页面

`style-loader`加到了`css-loader`前面，这是因为在`Webpack`打包时是按照数组从后往前的顺序将资源交给`loader`处理的，因此要把最后生效的放在前面

> 还可以这样写成对象的形式，里面`options`传入配置

```js
module.exports = {

    module: {
        rules: \[{
            test: /\\.css$/,
            use: \[
                'style-loader',
                  {
                    loader: 'css-loader',
                    options: {

                	},
            	  }
            \],
        }\],
    },
}；
```

> `exclude`与`include`
>
> `include`代表该规则只对正则匹配到的模块生效
>
> `exclude`的含义是，所有被正则匹配到的模块都排除在该规则之外

```js
rules: \[
    {
        test: /\\.css$/,
        use: \['style-loader', 'css-loader'\],
        exclude: /node_modules/,
        include: /src/,
    }
\],
```

是否都还记得呢，现在有现成的脚手架，很多人都很少自己去配置这些了，欸~当然还有相关的 `sass/less`等等预处理器`loader`这里就不一一介绍了。

### babel-loader

`babel-loader` 这个`loader`十分的重要，把高级语法转为`ES5`，常用于处理 `ES6+` 并将其编译为 `ES5`。 它允许我们在项目中使用最新的语言特性（甚至在提案中），而无需特别注意这些特性在不同平台上的兼容性。

> 介绍下主要的三个模块

- babel-loader：使 `Babel` 与 `Webpack` 一起工作的模块
- @babel/core：`Babel`核心模块。
- @babel/preset-env：是`Babel`官方推荐的`preseter`，可以根据用户设置的目标环境，自动添加编译`ES6+`代码所需的插件和补丁

> 安装

```bash
npm install babel-loader @babel/core @babel/preset-env
```

> 配置

```js
rules: \[
  {
    test: /\\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: \[\[
          'env', {
            modules: false,
          }
        \]\],
      },
    },
  }
\],
```

### html-loader

`Webpack` 可不认识 `html`，直接报错，需要`loader`转化

`html-loader` 用于将 `HTML` 文件转换为字符串并进行格式化，它允许我们通过 `JS` 加载一个 `HTML` 片段。

> 安装

```bash
npm install html-loader
```

> 配置

```js
rules: \[
    {
        test: /\\.html$/,
        use: 'html-loader',
    }
\],
```

```js
import otherHtml from "./other.html";
document.write(otherHtml);
```

这样你可以在 js 中加载另一个页面，写刀当前 index.html 里面

### file-loader

用于打包文件类型的资源，比如对`png`、`jpg`、`gif`等图片资源使用`file-loader`，然后就可以在`JS`中加载图片了

> 安装

```bash
npm install file-loader
```

> 配置

```js
const path = require('path');
module.exports = {
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: \[
            {
                test: /\\.(png|jpg|gif)$/,
                use: 'file-loader',
            }
        \],
    },
}；
```

### url-loader

既然介绍了 `file-loader` 就不得不介绍 `url-loader`，它们很相似，但是唯一的区别是用户可以设置文件大小阈值。 大于阈值时返回与`file-loader`相同的`publicPath`，小于阈值时返回文件`base64`编码。

> 安装

```bash
npm install url-loader
```

> 配置

```js
rules: \[
    {
        test: /\\.(png|jpg|gif)$/,
        use: {
            loader: 'url-loader',
            options: {
                limit: 1024,
                name: '\[name\].\[ext\]',
                publicPath: './assets/',
            },
        },
    }
\],
```

### ts-loader

`TypeScript`使用得越来越多，对于我们平时写代码有了更好的规范，项目更加利于维护...等等好处，我们也在`Webpack`中来配置 loader,本质上类似于 `babel-loader`，是一个连接 `Webpack` 和 `Typescript` 的模块

> 安装

```bash
npm install ts-loader typescript
```

> loader 配置，主要的配置还是在 `tsconfig.json` 中

```js
rules: \[
    {
        test: /\\.ts$/,
        use: 'ts-loader',
    }
\],
```

### vue-loader

用来处理`vue`组件,还要安装`vue-template-compiler`来编译`Vue`模板，估计大家大部分都用脚手架了

> 安装

```bash
npm install vue-loader  vue-template-compiler
```

```js
rules: \[
    {
        test: /\\.vue$/,
        use: 'vue-loader',
    }
\],
```

## 写一个简单的 Loader

介绍了几个常见的 loader 的安装配置，我们在具体的业务的实现的时候，可能遇到各种需求，上面介绍的或者 npm 上都没有的加载器都不适合当前的业务场景，那我们可以自己去实现一个自己的`loader`来满足自己的需求，小浪下面介绍一下如何自定义一个`loader`

### 1.初始化项目

> 初始化项目

先创建一个项目文件夹（名字可以随意，当然肯定是英文名）后进行初始化

```bash
npm init -y
```

> 安装依赖

安装依赖： `Webpack` 和 `Webpack`脚手架 和 热更新服务器

不同的版本 `Webpack` 可能有些差异，如果你跟着我的这个例子写的话，小浪建议和我装一样的版本

```bash
npm install webpack@4.39.2 webpack-cli@3.3.6 webpack-dev-server@3.11.0 -D
```

> 新建一个`index.html`文件

`dist/index.html`

```html
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title></title>
  </head>
  <body>
    <script src="./bundle.js"></script>
  </body>
</html>
```

> 新建一个入口文件 `index.js` 文件

`src/index.js`

```js
document.write("hello world");
```

> 创建 `webpack.config.js` 配置文件

配置出口和入口文件

配置`devServer`服务

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: "./dist",
    overlay: {
      warnings: true,
      errors: true,
    },
    open: true,
  },
};
```

> 在 `package.json` 中配置启动命令

```json
"scripts": {
   "dev": "Webpack-dev-server"
 },
```

> 启动 `npm run dev`

`devServer`帮我们启动一个服务器，每次修改`index.js不`需要自己在去打包，而是自动帮我们完成这项任务

页面内容就是我们`index.js`编写的内容被打包成在`dist/bundle.js`引入到`index.html`了

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da2abd89712944d6a81877f7af8a6d54~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> 当前的文件目录

```bash
Webpack-demo
 ├── dist
 │   └── index.html
 ├── package-lock.json
 ├── package.json
 ├── src
 │   └── index.js
 └── Webpack.config.js
```

### 2.实现一个简单的 loader

> 在 `src/MyLoader/my-loader.js`

```js
module.exports = function (source) {
  return source.replace("world", ", I am Xiaolang");
};
```

返回其它结果 `this.callback`

```js
this.callback(

    err: Error | null,

    content: string | Buffer,

    sourceMap?: SourceMap,

    abstractSyntaxTree?: AST
);
```

打开代码对应的`source-map`，方便调试源代码。`source-map` 可以方便实际开发者在浏览器控制台查看源代码。 如果不处理`source-map`，最终将无法生成正确的`map`文件，在浏览器的开发工具中可能会看到混乱的源代码。

为了在使用 `this.callback` 返回内容时将 `source-map` 返回给 `Webpack`

`loader` 必须返回 `undefined` 让 `Webpack` 知道 `loader` 返回的结果在 `this.callback` 中，而不是在 `return`

```js
module.exports = function (source, sourceMaps) {
  this.callback(null, source.replace("world", ", I am Xiaolang"), sourceMaps);
  return;
};
```

> 常用加载本地 `loader` 两种方式

1.`path.resolve`

使用 `path.resolve` 指向这个本地文件

```js
const path = require('path')

module.exports = {
    module: {
        rules: \[
            {
                test: /\\.js$/,
                use: path.resolve('./src/myLoader/my-loader.js'),
            },
        \],
    },
}
```

2.`ResolveLoader`

先去 `node_modules` 项目下寻找 `my-loader`，如果找不到，会再去 `./src/myLoader/` 目录下寻找。

```js
module.exports = {

    module: {
        rules: \[
            {
                test: /\\.js$/,
                use: \['my-loader'\],
            },
        \],
    },
    resolveLoader: {
        modules: \['node_modules', './src/myLoader'\],
    },
}
```

一个 `loader`的职责是单一的，使每个`loader`易维护。

如果源文件需要分多步转换才能正常使用，通过多个 Loader 进行转换。当调用多个`loader`进行文件转换时，每个`loader`都会链式执行。

第一个`loader`会得到要处理的原始内容，将前一个 loader 处理的结果传递给下一个。 处理完毕，最终的 Loader 会将处理后的最终结果返回给 `Webpack`

所以，当你写`loader`记得保持它的职责单一，你只关心输入和输出。

![image-20220522142823507](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96657df8c0484e4b9c915bbbb58fed5c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 3.`option`参数

```js
module: {
    rules: \[
        {
            test: /\\.js$/,
            use: \[
                {
                    loader: 'my-loader',
                    options: {
                        flag: true,
                    },
                },
            \],
        },
    \],
},
```

那么我们如何在 loader 中获取这个写入配置信息呢？

`Webpack` 提供了`loader-utils`工具

> 在之前写的 loader 修改

```js
const loaderUtils = require("loader-utils");
module.exports = function (source) {
  const options = loaderUtils.getOptions(this);
  console.log("options-->", options);

  return source.replace("world", ", I am Xiaolang");
};
```

控制台也打印了出来

![image-20220522143828316](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ff214671bba483da8487233a4c70357~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 4.缓存

如果为每个构建重新执行重复的转换操作，这样`Webpack`构建可能会变得非常慢。

`Webpack` 默认会缓存所有`loader`的处理结果，也就是说，当待处理的文件或者依赖的文件没有变化时，不会再次调用对应的`loader`进行转换操作

```js
module.exports = function (source) {
  this.cacheable && this.cacheable();

  return source.replace("world", ", I am Xiaolang");
};
```

一般默认开启缓存，如果不想`Webpack`这个`loader`进行缓存，也可以关闭缓存

```js
module.exports = function (source) {
  this.cacheable(false);

  return source.replace("world", ", I am Xiaolang");
};
```

### 5.同步与异步

在某些情况下，转换步骤只能异步完成。

例如，您需要发出网络请求以获取结果。 如果使用同步方式，网络请求会阻塞整个构建，导致构建非常缓慢。

```js
module.exports = function (source) {
  var callback = this.async();

  someAsyncOperation(source, function (err, result, sourceMaps, ast) {
    callback(err, result, sourceMaps, ast);
  });
};
```

### 6.处理二进制数据

默认情况下，`Webpack` 传递给 `Loader` 的原始内容是一个 `UTF-8` 格式编码的字符串。 但是在某些场景下，加载器处理的不是文本文件，而是二进制文件

官网例子 通过 `exports.raw` 属性告诉 `Webpack` 该 `Loader` 是否需要二进制数据

```js
module.exports = function (source) {
  source instanceof Buffer === true;

  return source;
};

module.exports.raw = true;
```

### 7.实现一个渲染 markdown 文档 loader

> 安装依赖 `md` 转 `html` 的依赖，当然可以选择另外一个模块 `marked`
>
> 我这里使用的 `markdown-it`

```bash
npm install markdown-it@12.0.6 -D
```

> 辅助工具 用来添加 `div` 和 `class`

```js
module.exports = function ModifyStructure(html) {
  const htmlList = html
    .replace(/<h3/g, "$*(<h3")
    .replace(/<h2/g, "$*(<h2")
    .split("$*(");

  return htmlList
    .map((item) => {
      if (item.indexOf("<h3") !== -1) {
        return `<div class="card card-3">${item}</div>`;
      } else if (item.indexOf("<h2") !== -1) {
        return `<div class="card card-2">${item}</div>`;
      }
      return item;
    })
    .join("");
};
```

> 新建一个 loader

`/src/myLoader/md-loader.js`

```js
const { getOptions } = require('loader-utils')
const MarkdownIt = require('markdown-it')
const beautify = require('./beautify')
module.exports = function (source) {
    const options = getOptions(this) || {}
    const md = new MarkdownIt({
        html: true,
        ...options,
    })
    let html = beautify(md.render(source))
    html = \`module.exports = ${JSON.stringify(html)}\`
    this.callback(null, html)
}
```

这样`loader`也写完了，`this.callback(null, html)` 和 `return` 在这里差不多哈。

```js
html = \`module.exports = ${JSON.stringify(html)}\`
```

这里解析的结果是一个 `HTML` 字符串。 如果直接返回，也会面临`Webpack`无法解析模块的问题。 正确的做法是把这个`HTML`字符串拼接成一段`JS`代码。

这时候我们要返回的代码就是通过`module.exports`导出这个`HTML`字符串，这样外界在导入模块的时候就可以接收到这个`HTML`字符串。

> 然后在`webpack.config.js`使用这个加载器

```js
const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: \[
            {
                test: /\\.js$/,
                use: \[
                    {
                        loader: 'my-loader',
                        options: {
                            flag: true,
                        },
                    },
                \],
            },
            {
                test: /\\.md$/,
                use: \[
                    {
                        loader: 'md-loader',
                    },
                \],
            },
        \],
    },
    resolveLoader: {
        modules: \['node_modules', './src/myLoader'\],
    },
    devServer: {
        contentBase: './dist',
        overlay: {
            warnings: true,
            errors: true,
        },
        open: true,
    },
}
```

> 使用
>
> 最后在`index.js`中加载一个`md`文件，我这里随便整个，新建`github`的`readme.md`

```js
document.write("hello world");

import mdHtml from "./test.md";
const content = document.createElement("div");
content.className = "content";
content.innerHTML = mdHtml;
document.body.appendChild(content);
```

> 结果图

![image-20220522165928553](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a4ced26d90c4fb0b91e484856af5019~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 目录结构

```bash
Webpack-demo
 ├── dist
 │   └── index.html
 ├── package-lock.json
 ├── package.json
 ├── src
 │   ├── index.js
 │   ├── myLoader
 │   │   ├── beautify.js
 │   │   ├── md-loader.js
 │   │   └── my-loader.js
 │   └── test.md
 └── webpack.config.js
```

> [github 仓库地址](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FLianTianNo1%2Fwebpack-loader-demo "https://github.com/LianTianNo1/webpack-loader-demo")

## 结语

感谢大家能看到这里哈~ ，现在打包构建工具也慢慢增多了`vue-cli`，`vite`等等，但是 `webpack` 仍然有一席之地，很多值得学习的地方，继续努力学习~~
