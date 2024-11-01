---
title: 快速入手Electron 拥有一个自己的桌面应用
date: 2021-10-05 08:01:09
updated: 2021-10-05 08:01:09
tags: [Electron, 桌面应用]
categories: [前端]
---
## 快速入手Electron，拥有一个自己的桌面应用在这里小浪会简单介绍Elctron的一些基本使用，和如何快速用Eletr

原文：https://juejin.cn/post/7015476516196712462

> 前言

小浪学习`electron`的原因是软件构造课需要交一个软件作业，不想用`java`写，还不能是网页，一开始想到的是用`uniapp`写个项目打包成`APP`，然后想了想，一直听说 `electron` 可以把前端页面(`原生`/`h5`/`vue`/`react`...)打包成桌面应用，把前端页面当做`GUI`这岂不是很`Nice`,`Typora` 就是 `electron` 做的，很好奇，就去学学看，下面是小浪学习 `electron` 的笔记，希望能给大家一点帮助，学习 `electron` 教程好像很多，但是还是官方文档比较清晰全面，有可能你在视频教程里看见的能使用的，自己去敲的时候发现各种问题，还以为是自己哪里拼错了，一看是官方文档更新了...

1.基础使用
------

要想弄个桌面端的应用，那我们得快速的去了解它

### 1.1终端乱码问题

> `tip`: electron 控制打印会出现中文乱码

![image-20211004134055911](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/415ede9a1d404238b155cab94420d9f7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

只需要在终端（`cmd`）输入 `chcp 65001` 运行下就行了

![image-20211004134132071](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cc9e6036f4949e5becdd4c2bec3badb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 1.2安装

```bash
// 如果没有node 的话先装 node
http://nodejs.cn/download/

// 在当前目录安装最新
npm i -D electron

// 全局安装最新
cnpm install electron -g

// 当然你可以指定版本号安装
npm i -D electron@11.0.4
```

`node -v``electron -v`查看是否安装成功

### 1.3快速创建

> 开始创建一个 electron

*   首先说下目录必须包括：`package.json` 这个文件
*   然后要有个入口文件下面这个例子我用 `index.js`举例，不过一般写成 `main.js`比较好
*   起码你需要个展示的GUI界面，一般是前端页面，也可以直接放个网址

新建一个目录(项目):

初始化`package.json`文件

```bash
npm init
```

描述记得写，这个`electron` 打包的时候我记得需要描述

启动命令写 `"test": "nodemon --watch index.js --exec electron ."` ，这样子最后在终端输入 `npm test`这样每次修改`index.js` 主进程文件都会重新启动项目了，`index.js`可以自行修改 `main.js`等等

来看看最后的的 `package.json`文件吧

 ```js
{
  "name": "electron_demo",
  "version": "1.0.0",
  "description": "\\"这是一个electron demo\\"",
  "main": "index.js",
  "scripts": {
    "test": "nodemon --watch index.js --exec electron ."
  },
  "author": "",
  "license": "ISC"
}
```



我的目录下放了以下几个文件

![image-20211002115657083](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c71f4ff2f1af4b369da5a8faf9ca4aaa~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

`electron` 分为两个进程 **主进程** 和 **渲染进程**

> `index.js` 这个文件是 **主进程**

官方是这样写的

```js
const { app, BrowserWindow } = require('electron')

function createWindow () {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })


  win.loadFile('index.html')


  win.webContents.openDevTools()
}




app.whenReady().then(createWindow)


app.on('window-all-closed', () => {


  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {


  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```



我看其他人差不多是这样写的

```js
const { app, BrowserWindow } = require('electron')
let win

app.on('ready', function () {

    win = new BrowserWindow({


    resizable: false,
    width: 800,
    height: 600,
    icon: iconPath,
    minWidth: 300,
    minHeight: 500,
    maxWidth: 300,
    maxHeight: 600,

    webPreferences:{
      backgroundThrottling: false,
      nodeIntegration:true,
      contextIsolation: false,

    }
  })

  win.loadFile('index.html')




  win.on('closed',()=>{

      win = null
  })
})


app.on('window-all-closed', () => {

    console.log('窗口全部都关闭了')
})
```

> `index.html`是**渲染进程**也就是前端页面里面随便写点东西，这里相当是把前端当成 GUI 了

```html
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>electron test</title>
  </head>
  <body>
    electron demo
    <script></script>
  </body>
</html>
```



> 这样使用 `npm test` 就可以出来这么一个界面了，`test`这个命令 是 `package.json``script` 中配的

![image-20211003211108491](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72537c1239d349bd96e785df06c7364f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

2.Remote 模块
-----------

在渲染进程里（比如`index.html`里面加载了一些**js文件**，那里面的**js**如果要使用到 **BrowserWindow** 这些属性的话就必须使用 `remote`）

使用 `remote` 模块, 你可以调用 `main`**进程对象的方法**

### 2.1.**electron14.0**之前版本使用

> 在主进程的窗口中加入`enableRemoteModule: true`参数才能够调用remote模块

```js
const { app, BrowserWindow } = require('electron')
app.on('ready', function () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {

      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  win.loadFile('index.html')

  app.on('window-all-closed', () => {

    win = null
    console.log('窗口全部都关闭了')
  })
})
```



> 然后在渲染进程里写，这里我直接内嵌js了

```html
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>electron test</title>
  </head>
  <body>
    electron demo
    <button id="btn">添加新的窗口</button>
    <script>
      const { log } = console

      const { BrowserWindow } = require('electron').remote

      const btn = document.getElementById('btn')
      btn.onclick = () => {
        let newWin = new BrowserWindow({
          width: 800,
          height: 600,
        })

        win.loadFile('index2.html')

        newWin.on('close', () => {
          newWin = null
        })
      }
    </script>
  </body>
</html>
```



这里点击按钮，就又可以创建一个新的窗口了

### 2.2.**electron14.0**版本API修改

> 但是这里是有版本的区分的，这里一开始也困扰了我很久很久...最后看了下文档`14.0`后 改了，我用的`15`。。。

![image-20211003215043335](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12832ff7f85c4ab89c34aaeebed3132f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 1.还得自行安装 `remote`

```bash
npm i -D @electron/remote
```

> 2.主进程中导入

```js
app.on('ready',function(){
	require('@electron/remote/main').initialize()
})
```

> 3.渲染进程中

```js
const { BrowserWindow } = require('@electron/remote')
```



3.创建系统菜单
--------

> 1.新建一个 menu.js

```js
const { Menu } = require('electron')


const template = \[
  {
    label: '菜单一',

    submenu: \[
      {
          label: '子菜单一' ,

          accelerator: 'ctrl+n'
      },
      { label: '子菜单二' },
      { label: '子菜单三' },
      { label: '子菜单四' },
    \],
  },
  {
    label: '菜单二',

    submenu: \[
      { label: '子菜单一' },
      { label: '子菜单二' },
      { label: '子菜单三' },
      { label: '子菜单四' },
    \],
  },
\]


const myMenu = Menu.buildFromTemplate(template)


Menu.setApplicationMenu(myMenu)
```



`accelerator: 'ctrl+n'`可以指定菜单的快捷键

> 2.随便写个页面

```html
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>自定义菜单</title>
  </head>
  <body>
    自定义菜单
    <script></script>
  </body>
</html>
```



> 3.写 main.js

```js
const { app, BrowserWindow } = require('electron')

let win = null

require('./menu')


app.on('ready', function () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  win.webContents.openDevTools()
  win.loadFile('./index.html')

  win.on('close', () => {
    win = null
  })
})
```



> npm test启动

![46](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ab8963721d54f73a508a93088ef71f6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

4.给菜单添加事件
---------

> 比如给子菜单添加一个点击事件新建一个窗口

```js
const { Menu, BrowserWindow } = require('electron')


const template = \[
  {
    label: '菜单一',

    submenu: \[
      {
        label: '子菜单一',

        click: () => {

          let sonWin = new BrowserWindow({
            width: 200,
            height: 200,
          })
          sonWin.loadFile('./index2.html')

          sonWin.on('close', () => {
            sonWin = null
          })
        },
      },
      { label: '子菜单二' },
      { label: '子菜单三' },
      { label: '子菜单四' },
    \],
  },
  {
    label: '菜单二',

    submenu: \[
      { label: '子菜单一' },
      { label: '子菜单二' },
      { label: '子菜单三' },
      { label: '子菜单四' },
    \],
  },
\]


const myMenu = Menu.buildFromTemplate(template)


Menu.setApplicationMenu(myMenu)
```



> 效果图

![47](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68fdf9ed39c0403188c1193c1021b9b5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 上面的的开发者工具和**chrome/edge浏览器**一样，在菜单栏的`View -> Toggle Developer Tools`，或者 `Ctrl + Shift + I`就能调用出来，用来调试页面

5.使用Node.js 模块/API
------------------

比如写个**读写文件**例子

在主线程创建窗口的时候 `webPreferences`一定在加上 `nodeIntegration: true`，`contextIsolation: false`

这样在渲染进程才能使用`node` 的一些语法

> main.js

```js
const { app, BrowserWindow } = require('electron')

let mainWindow = null

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.loadFile('./main.html')

  mainWindow.on('close', () => {
    mainWindow = null
  })
})
```

> main.html 主要的渲染文件

```html
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>读写文件测试</title>
  </head>
  <body>
    <button onclick="readFile()">读取文件</button>
    <button onclick="writeFile()">写入文件</button>
    <p id="show\_file\_content">页面内容</p>
    <script src="./index.js"></script>
  </body>
</html>
```



> index.js 加载需要的js

可以看出，在渲染进程中，就是`main.html` 里面加载的 `index.js` 中，既可以使用 `docment.getElementById` 这些 `WebAPI`,又能使用用 `node` 的模块进行混写

```js
const fs = require('fs')
const path = require('path')
const { log } = console


const showContent = document.getElementById('show\_file\_content')


function readFile() {
  console.log('读取文件')
  fs.readFile(path.join(__dirname, '/test.txt'), (err, data) => {
    if (err) {
      throw new Error(err, '读取文件失败')
    }
    showContent.innerText = data
  })
}

const content = '今天是国庆的第二天，在学 electron'


function writeFile() {
  fs.writeFile(
    path.join(__dirname, '/test.txt'),
    content,
    'utf8',
    (err, data) => {
      if (err) {
        return new Error(err, '读取文件失败')
      }
      log('写入文件成功')
    }
  )
}
```



> 测试用的 txt

```txt
今天是国庆的第二天，在学 electron
```

> 项目的目录

![image-20211002155537033](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/261e3ccd1caf4d26847e861205d73278~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 效果图

![45](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e392606cde154267aed6ff0c08c57c09~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

6.设置无边框
-------

> 在创建窗口的时候 可以设置无边框，带的菜单也消失了

```js
let win = new BrowserWindow({
    frame: false,
    width: 800,
    height: 600,
})
```

菜单其实它还在，你仍然可以通过快捷键调用出菜单，可以直接删除菜单`win.removeMenu()`

> 没有菜单栏怎么去拖拽窗口

在css中你可以设置哪个可以进行拖拽/禁止拖拽

比如 `body{ -webkit-app-region: drag | no-drag;}`

> 效果图：无边框，在`body`设置可拖拽

![44](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76910042f01a4848abb0948cdc20a828~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

7.系统托盘
------

![image-20211004102538924](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7b3e10d88f54101a7889b42f01d5aa6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

看到上面这个图大家都应该清楚吧，当我们关闭一个应用程序的时候，它其实关闭了，但是没有完全关闭，只是隐藏了，有的就存在系统托盘中，那么如何在`electron` 设置系统托盘呢

[官方文档：Tray](https://link.juejin.cn/?target=https%3A%2F%2Fwww.electronjs.org%2Fdocs%2Ftutorial%2Ftray "https://www.electronjs.org/docs/tutorial/tray")

> 主进程 index.js

在`electron` 这里一开始我就添加系统托盘，当然你可以监听窗口被关闭的时候在创建托盘

```js
const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron')
const path = require('path')
let win, tray
app.on('ready', function () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  const icon = nativeImage.createFromPath(
    path.join(__dirname, '/static/icon.png')
  )

  tray = new Tray(icon)

  tray.setToolTip('electron demo is running')

  tray.setTitle('electron demo')


  tray.on('right-click', () => {

    const tempate = \[
      {
        label: '无操作',
      },
      {
        label: '退出',
        click: () => app.quit(),
      },
    \]

    const menuConfig = Menu.buildFromTemplate(tempate)

    tray.popUpContextMenu(menuConfig)
  })

  tray.on('click', () => {

    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })
  win.loadFile('index.html')
})

app.on('window-all-closed', () => {

  win = null
  console.log('窗口全部都关闭了')
})
```



> 效果图

![48](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7baeb0d2309f4c38bb107a22a3690f49~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

8.进程间通信
-------

`electron`中主进程和渲染进程两者之间需要通信

> 官方文档：
>
> [ipcMain](https://link.juejin.cn/?target=https%3A%2F%2Fwww.electronjs.org%2Fdocs%2Fapi%2Fipc-main "https://www.electronjs.org/docs/api/ipc-main")
>
> [ipcRenderer](https://link.juejin.cn/?target=https%3A%2F%2Fwww.electronjs.org%2Fdocs%2Fapi%2Fipc-renderer "https://www.electronjs.org/docs/api/ipc-renderer")
>
> [webContents](https://link.juejin.cn/?target=https%3A%2F%2Fwww.electronjs.org%2Fdocs%2Fapi%2Fweb-contents%23contentssendchannel-args "https://www.electronjs.org/docs/api/web-contents#contentssendchannel-args")

**主线程** 到 **渲染线程** 通过 `webContents.send` 来发送 --->`ipcRenderer.on` 来监听

**渲染线程** 到 **主线程** 需要通过 `ipcRenderer.send`发送 ---\> `ipcMain.on`来监听

### 8.1.主进程到渲染进程

[`webContents.send(channel, ...args)`](https://link.juejin.cn/?target=https%3A%2F%2Fwww.electronjs.org%2Fdocs%2Fapi%2Fweb-contents%23contentssendchannel-args "https://www.electronjs.org/docs/api/web-contents#contentssendchannel-args")

*   `channel` String
*   `...args` any\[\]

> 主进程 `mian.js`

在主进程中使用 `webContents.send` 发送消息

```js
const { app, BrowserWindow } = require('electron')
let win

app.on('ready', function () {

  win = new BrowserWindow({
    width: 800,
    height: 600,


    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  setTimeout(() => {
    win.webContents.send('mainMsg', '我是主线程发送的消息')
  }, 3000)

  win.loadFile('main.html')
})


app.on('window-all-closed', () => {

  win = null
  app.quit()
  console.log('窗口全部都关闭了')
})
```



> 渲染进程 `main.html` 外链一个 `render.js`

在渲染线程中使用 `ipcRenderer.on`来进行监听

`ipcRenderer.on(channel, listener)`

*   `channel` String
*   `listener` Function

监听 `channel`, 当有新消息到达，使用 `listener(event, args...)` 调用 `listener` .

还有个监听一次的消息`ipcRenderer.once(channel, listener)`

为这个事件添加一个一次性 `listener` 函数.这个 `listener` 将在下一次有新消息被发送到 `channel` 的时候被请求调用，之后就被删除了

```html
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>通信测试</title>
  </head>
  <body>
    通信测试
    <p id="receive">接收信息</p>
    <script src="./render.js"></script>
  </body>
</html>
```



 ```js
const electron = require('electron')
const { ipcRenderer } = require('electron')
const { log } = console

log(ipcRenderer)
ipcRenderer.on('mainMsg', (event, task) => {
  log(task)
  document.getElementById('receive').innerText = task
})
```



> 效果图

![49](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/087129ad564a42d8b54b1d1785710231~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 8.2.渲染进程到主进程

> `render.js` 渲染线程中进行发送 `ipcRenderer.send`

`ipcRenderer.send(channel\[, arg1\]\[, arg2\]\[, ...\])`

*   `channel` String
*   `arg` (可选)

还有发送同步消息的`ipcRenderer.sendSync(channel\[, arg1\]\[, arg2\]\[, ...\])`

```html
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>通信测试</title>
  </head>
  <body>
    通信测试
    <p id="receive">接收信息</p>
    <button onclick="sendMain()">发送消息给主线程</button>
    <script src="./render.js"></script>
  </body>
</html>
```



```js
const electron = require('electron')
const { ipcRenderer } = require('electron')



function sendMain() {
  ipcRenderer.send('task', '退出程序')
}
```



> `main.js` 主进程里面 `ipcMain.on` 进行监听，这里退出程序

`ipcMain.on(channel, listener)`

*   `channel` String
*   `listener` Function

监听 `channel`, 当新消息到达，将通过 `listener(event, args...)` 调用 `listener`.

还有个 `ipcMain.once(channel, listener)`为事件添加一个一次性用的`listener` 函数.这个 `listener` 只有在下次的消息到达 `channel` 时被请求调用，之后就被删除了.

```js
const { app, BrowserWindow, ipcMain } = require('electron')

app.on('ready', function () {

})

ipcMain.on('task', (event, info) => {
  if (info === '退出程序') {
    app.quit()
  }
})
```



> 效果图

![50](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22c4401cffd7415ba5a167dc9778bd48~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这样就方便里我做一些窗口交互，比如`todoList`,到时间了右下角弹出一个新的窗口进行提醒

### 8.3渲染进程到渲染进程

`ipcRenderer.sendTo(webContentsId, channel, ...args)`

*   `webContentsId` Number
*   `channel` String
*   `...args` any\[\]

通过 `channel` 发送消息到带有 `webContentsId` 的窗口.

前提是要知道对应的渲染进程的`ID`

当然也可以让主进程作为中转站，先发到主进程在到其他的渲染进程

9.Vue + Electron
----------------

那么 `Vue` 怎么使用 `Electron` 打包呢？毕竟学习这个初衷，就是把 `Vue` 项目变成一个桌面应用，前面讲的都是原生的方法，那么继续往下面看吧

### 9.1你需要有个Vue项目

如果手上没有，那么用 `vue ui` 创建一个`Vue`项目/或者直接在命令行里用 `vue create` 创建

```bash
vue ui
```

相信大家都会，这里我就是简单用`vue ui`的建一个，这里大家可以略过

默认打开一个8000端口的服务，一个可视化的UI界面就出来了

![image-20211005094817591](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2e6923ef74c4f6ea63a1242f4666123~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 选择左下角 更多--->项目管理器

![image-20211005095048918](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76c99d4115fc4fa59562e91cb4f75002~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 创建

![image-20211005095255377](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afac3ffe606b4b46aa755acfaa838f9c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 选择好目录后在此创建

![image-20211005095412222](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e5f0460dcf54e77905a256fc9656569~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 填写一些基本信息，包管理我这里用 npm ，然后下一步

![image-20211005095517636](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90b600e4a09446b6996e52bf2d466ccb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 选择预设，我这里选手动

![image-20211005095738225](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f993f6435df4dc1acfbaba2a455f9b9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 需要哪些插件选哪些，我这里就默认了，因为是个简单的例子

![image-20211005095856488](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ccff58b126f4525bc3aedae85b20d37~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 选择 Vue 的版本2.x 还是 3这些按照你的习惯来，平时写什么选什么,下面的选项我选择的标准

![image-20211005100020344](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2c5865a163f451697b9b683f23e7c02~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 创建项目

我这里就不保存预设了，然后就是漫长的等待![image-20211005100221788](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e1fba4cee344604850def265dbb9951~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 创建完毕后运行改项目

![image-20211005102004448](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0711e3fde3644d1689b574ac2e353d5f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 启动项目

![image-20211005102132311](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36896a3101db45069c8dbd833f950a0a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

就会得到一个这样的默认页面

![image-20211005102159772](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33574a90ca55482faca8c36cffbb22fb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

好了创建项目完毕，继续

### 9.2添加 `electron` 插件

> 在插件-->添加插件 搜索 `vue-cli-plugin-electron-builder`,安装第一个

![image-20211005102527050](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ef4ce8185e84d56b9e7378bf43633aa~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 我这里默认选择electorn 13.0.0版本

![image-20211005102834003](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0273671757f4d6285f2780955188d7a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 安装完成后会出现在已安装插件里面

![image-20211005103108921](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98682a2056cd495abd173a697421790b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

当然也可以在 命令行中进行安装

```bash
vue add electron-builder
```

### 9.3运行

> 在当前vue项目下的命令行输入下面的命令运行

```bash
npm run electron:serve
```

![image-20211005103731994](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d5fc62b8e1b40eda84c32e1bd3c2080~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

很好，已经运行出来了

### 9.4 `package.json``background.js`

查看`package.json`文件找找主进程文件在哪

![image-20211005104023792](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a9c7dd81b6f458bb0e26835c0c9c2b4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![image-20211005104135614](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33301c3825a44c6a81a1dfde40a3ad0f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 主进程文件是 `background.js`，这个文件在 `Vue项目/src/下面`

 ```js
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'


protocol.registerSchemesAsPrivileged(\[
  { scheme: 'app', privileges: { secure: true, standard: true } }
\])

async function createWindow() {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {



      nodeIntegration: process.env.ELECTRON\_NODE\_INTEGRATION,
      contextIsolation: !process.env.ELECTRON\_NODE\_INTEGRATION
    }
  })

  if (process.env.WEBPACK\_DEV\_SERVER_URL) {

    await win.loadURL(process.env.WEBPACK\_DEV\_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')

    win.loadURL('app://./index.html')
  }
}


app.on('window-all-closed', () => {


  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {


  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})




app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {

    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})


if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
```



看到上面的主进程文件是不是很熟悉，你可以像以前一样做一些操作，使用node混写完成一些功能

### 9.5打包

上面我们只是运行出来了，上交的软件，老师总不会还特意去配环境，然后`npm run electron:serve`吧，显然是不可能的，那我们继续进行打包成一个可执行的文件exe

命令行执行下面的命令

```bash
npm run electron:build
```

#### 打包出现的问题

> 我在打包的时候特别不顺利... 查来查去原来`electron` 是有问题

我给出的建议就是 把`node_modules`目录下的 **electron 删除**

用`cnpm` 安装 `electron`

如果没有 `cnpm` 先进行安装

> 全局安装`cnpm`

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org

cnpm -v
```

> 重新安装 `electron`

```bash
cnpm i electron
```

> 打包

```js
npm run electron:build
```

![image-20211005131543735](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7678cbda1804561935ae8ef6de76dcc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

打包完成，打包的文件就放在项目下的 `dist_electron` 里面

![image-20211005131647326](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/724e565bb55544f2875b79dcf918c8f2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 9.6安装

> 双击就自动安装了

![image-20211005131805110](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e0725f12ac14e968284a61308834a68~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![image-20211005131940327](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c6ffdb7f54c428fb7bd774222edee60~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

桌面上就出现这么一个应用图标

![image-20211005132041458](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47def2592a1543b0901f34313dc75466~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 9.7自定义

点进去查看没有问题，但是是不是太low 了，一点击就是自动安装，而且使用的默认图标

> 安装打包工具

```bash
cnpm i electron-builder --D
```

#### 9.7.1.首先找一个 `icon` 图片

好像有插件可以把图片转为各种大小的`icon`

安装下，这样就不用网站上转图片了

```bash
cnpm i electron-icon-builder
```



需要在`package.json`中`scripts`添加`build-icon`指令

`longzhu.jpg` 这个图片自己找的 卡卡罗特 可以自行修改

`output` 是输出文件夹

 ```js
"scripts": {
    "build-icon": "electron-icon-builder --input=./public/longzhu.jpg --output=build --flatten"
  },
```

命令行输入

```bash
npm run build-icon
```

![image-20211005141605242](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ceecc86d39184d8c8d1703b4bfbe28a8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

build完成之后，生成了不同大小的图片

#### 9.7.2.vue.config.js

因为我们之前安装的插件是 `vue-cli-plugin-electron-builder` ，而不是`electron-builder`

`electron-builder`打包普通项目，`build` 配置直接在`package.json` 里面写

`vue-cli-plugin-electron-builder`的 `build` 配置是需要在 项目根目录下 `vue.config.js` 里面配置

如果没有请新建

```js
module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.test.app",
        productName: "Lang",
        copyright: "Copyright © 2021",
        directories: {
          output: "./dist"
        },
        win: {

          icon: "./build/icons/icon.ico",
          target: \[
            {
              target: "nsis",
              arch: \[
                "x64",
                "ia32"
              \]
            }
          \]
        },
        nsis: {
          oneClick: false,
          language: "2052",
          perMachine: true,
          allowToChangeInstallationDirectory: true
        }
      }
    }
  }
};
```



#### 9.7.3.执行打包

```bash
npm run electron:build
```

![image-20211005143529020](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41fdf3c10fae49f8afccb04c8ec79a21~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

OK，打包成功！

**可能遇到的问题**

打包的路上不是一帆风顺的，在这一步打包失败了，因为打包的时候去下载一些依赖，然后下载失败了

解决方法1：梯子

解决方法2： [可以参考这个](https://link.juejin.cn/?target=https%3A%2F%2Fblog.csdn.net%2Fwm9028%2Farticle%2Fdetails%2F114583011 "https://blog.csdn.net/wm9028/article/details/114583011")

![image-20211005143747806](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25942115043b41e1ab4d86fbd36b72ef~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 打包好的东西

打包好的东西放在我们之前配置的`build``output: "./dist"` //输出文件路径

![image-20211005144321420](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ac1db1992be43e2982b9ef0292e8189~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看出图标变了

![image-20211005144400797](https://juejin.cn/post/%E5%B0%8F%E6%B5%AA%E5%AD%A6%E4%B9%A0Electron.assets/image-20211005144400797.png)

我们可以自定义安装文件夹了

![image-20211005144559596](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7e48cb6089941d4931870360c333b94~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![image-20211005144749686](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4e56d80bc164586b8379113709c42cd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

好了，基础的打包工作就这么结束了，大家可以自己写属于自己的软件，这里只是一个简单的应用教学

结语
--

`Electron` 真的不错诶，建议大家学习的时候多看看官方的文档，虽然官方文档还有很多地方没有翻译完整，但是并不影响我们去学习他的热情，感觉版本迭代很快，官方文档显得又多又乱，大家可以在文档上面搜索

[Electron官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fwww.electronjs.org%2Fdocs "https://www.electronjs.org/docs")

> 往期精彩

[还不会Vue3？一篇笔记带你快速入门](https://juejin.cn/post/7006518993385160711 "https://juejin.cn/post/7006518993385160711")

[还不会TS？ 带你 TypeScript 快速入门](https://juejin.cn/post/6999440503712251935 "https://juejin.cn/post/6999440503712251935")

[快速上手Vuex 到 手写简易 Vuex](https://juejin.cn/post/6994337441314242590 "https://juejin.cn/post/6994337441314242590")

[从了解到深入虚拟DOM和实现diff算法](https://juejin.cn/post/6990582632270528525 "https://juejin.cn/post/6990582632270528525")

[手写一个简易vue响应式带你了解响应式原理](https://juejin.cn/post/6989106100582744072 "https://juejin.cn/post/6989106100582744072")

[从使用到自己实现简单Vue Router看这个就行了](https://juejin.cn/post/6988316779818778631 "https://juejin.cn/post/6988316779818778631")

[前端面试必不可少的基础知识，虽然少但是你不能不知道](https://juejin.cn/post/6983934602196811789 "https://juejin.cn/post/6983934602196811789")
