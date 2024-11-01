---
title: 从了解到深入虚拟dom和实现diff算法虚拟dom算法
date: 2021-07-30 09:14:13
updated: 2021-07-30 09:14:13
tags: [前端, Vue, 虚拟DOM, diff算法]
categories: [前端]
copyright: false
top: 1
---
## 从了解到深入虚拟DOM和实现diff算法虚拟DOM 和 diff 算法

原文：https://juejin.cn/post/6990582632270528525

> 前言

`虚拟DOM` 和 `diff` 算法 ，大家有的时候就会经常听到，那么它们是什么实现的呢，这是小浪我在学习的 `虚拟DOM` 和 `diff` 的时候总结，在这里就来带大家来深入了解 `virtual DOM` 和 `diff` 算法，从 **snabbdom** 的基础使用 ,到自己实现一个丐版 **snabbdom**，自己实现 **h函数**(创建虚拟DOM) **patch**函数(通过比较新旧虚拟DOM更新视图)，这里我也画了几个动图 来帮助大家理解 **diff** 的四种优化策略，文章有点长，希望大家耐心阅读，最后会贴出所有代码，大家可以动手试试喔

最后希望大家能给小浪一个 **赞**

> 往期精彩：
>
> [手写一个简易vue响应式带你了解响应式原理](https://juejin.cn/post/6989106100582744072 "https://juejin.cn/post/6989106100582744072")
>
> [从使用到自己实现简单Vue Router看这个就行了](https://juejin.cn/post/6988316779818778631 "https://juejin.cn/post/6988316779818778631")
>
> [前端面试必不可少的基础知识，虽然少但是你不能不知道](https://juejin.cn/post/6983934602196811789 "https://juejin.cn/post/6983934602196811789")

1.介绍
----

> **Virtual DOM** 简单的介绍

是`JavaScript`按照`DOM`的结构来创建的虚拟树型结构对象，是对`DOM`的抽象，比`DOM`更加轻量型

> 为啥要使用**Virtual DOM**

*   当然是前端优化方面，避免频繁操作`DOM`，频繁操作`DOM`会可能让浏览器回流和重绘，性能也会非常低，还有就是手动操作 `DOM` 还是比较麻烦的，要考虑浏览器兼容性问题，当前`jQuery`等库简化了 `DOM`操作，但是项目复杂了，`DOM`操作还是会变得复杂，数据操作也变得复杂
*   并不是所有情况使用虚拟`DOM` 都提高性能，是针对在复杂的的项目使用。如果简单的操作，使用虚拟`DOM`,要创建虚拟`DOM`对象等等一系列操作，还不如普通的`DOM` 操作
*   虚拟`DOM` 可以实现跨平台渲染，服务器渲染 、小程序、原生应用都使用了虚拟`DOM`
*   使用虚拟`DOM`改变了当前的状态不需要立即的去更新`DOM` 而且更新的内容进行更新，对于没有改变的内容不做任何操作，通过前后两次差异进行比较
*   虚拟 DOM 可以维护程序的状态，跟踪上一次的状态

2.snabbdom 介绍
-------------

> 首先来介绍下 snabbdom

我们要了解虚拟DOM ，那么就先了解它的始祖，也就是 **snabbdom**

**snabbdom** 是一个开源的项目，**Vue** 里面的 虚拟**DOM** 当初是借鉴了 **snabbdom**,我们可以通过了解**snabbdom** 的虚拟**DOM** 来理解 **Vue** 的虚拟**DOM**,**Vue** 的源码太多，**snabbdom** 比较简洁，所以用它来展开 虚拟 **DOM** 的研究

通过npm 进行安装

```bash
npm install snabbdom
```

### 1.snabbdom简单使用

> 下面来写个简单的例子使用下 snabbdom

```html
<body>
  <div id="app"></div>
  <script src="./js/test.js"></script>
</body>
```

> 写个 test.js 进行使用

 ```javascript
import { h, init, thunk } from 'snabbdom'


let patch = init(\[\])






let vnode = h('div#box', '测试', \[
  h('ul.list', \[
    h('li', '我是一个li'),
    h('li', '我是一个li'),
    h('li', '我是一个li'),
  \]),
\])

let app = document.querySelector('#app')

let oldNode = patch(app, vnode)

setTimeout(() => {
  let vNode = h('div#box', '重新获取了数据', \[
    h('ul.list', \[
      h('li', '我是一个li'),
      h('li', '通过path判断了差异性'),
      h('li', '更新了数据'),
    \]),
  \])

  patch(oldNode, vNode)
}, 3000)
```



![image-20210726224703891](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93f5b5f17b44461485732581e68afd90~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看见把 虚拟**DOM**更新到了 真实**DOM** ,直接 把之前的 **div#app** 给替换更新了

![9](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33bb43d23ef649e58cca26cf4e6290a9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

过了3秒进行对比虚拟**DOM** 的 差异来添加到真实**DOM** ，这里改变了第二个和第三个 **li** 用h函数渲染成虚拟**DOM** 和**oldNode** 不一样所以进行了对比更新

### 2.介绍下 snabbdom中的模块

> 几个模块 这里简单过一下

| 模块名 | 简介 |
| --- | --- |
| **attributes** | DOM 自定义属性，包括两个布尔值 `checked``selected`，通过`setAttribute()` 设置 |
| **props** | 是DOM 的 property属性，通过 `element\[attr\] = value` 设置 |
| **dataset** | 是 `data-` 开头的属性 data-src... |
| **style** | 行内样式 |
| **eventListeners** | 用来注册和移除事件 |

> 有了上面的介绍，那我们就来简单的使用一下

 ```javascript
import { h, init } from 'snabbdom'


import attr from 'snabbdom/modules/attributes'
import style from 'snabbdom/modules/style'
import eventListeners from 'snabbdom/modules/eventlisteners'


let patch = init(\[attr, style, eventListeners\])


let vnode = h(
  'div#app',
  {

    attrs: {
      myattr: '我是自定义属性',
    },

    style: {
      fontSize: '29px',
      color: 'skyblue',
    },

    on: {
      click: clickHandler,
    },
  },
  '我是内容'
)


function clickHandler() {

  let elm = this.elm
  elm.style.color = 'red'
  elm.textContent = '我被点击了'
}


let app = document.querySelector('#app')


patch(app, vnode)
```



然后再 `html` 中引入

```html
<body>
  <div id="app"></div>
  <script src="./js/module_test.js"></script>
  <script></script>
</body>
```

来看看效果

![11](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1875f83c496e4ad282639c099b510ac9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看见的是 自定义属性 ，行内样式 ，点击事件都被 **h()** 渲染出来了

上面的使用都简单地过了一遍，那么我们就来看看 **snabbdom** 中的源码吧

3.虚拟DOM 例子
----------

说了这么久的 **h()** 函数和 虚拟**DOM** 那么 渲染出来的 虚拟**DOM** 是什么样呢

> 真实DOM 结构

```html
<div class="container">
  <p>哈哈</p>
  <ul class="list">
    <li>1</li>
    <li>2</li>
  </ul>
</div>
```

> 转为为 虚拟DOM 之后的结构

```javascript
{

  "sel": "div",

  "data": {
    "class": { "container": true }
  },

  "elm": undefined,

  "key": undefined,

  "children": \[
    {
      "elm": undefined,
      "key": undefined,
      "sel": "p",
      "data": { "text": "哈哈" }
    },
    {
      "elm": undefined,
      "key": undefined,
      "sel": "ul",
      "data": {
        "class": { "list": true }
      },
      "children": \[
        {
          "elm": undefined,
          "key": undefined,
          "sel": "li",
          "data": {
            "text": "1"
          },
          "children": undefined
        },
        {
          "elm": undefined,
          "key": undefined,
          "sel": "li",
          "data": {
            "text": "1"
          },
          "children": undefined
        }
      \]
    }
  \]
}
```



在之前提到的 `snabbdom` 中 `patch`方法

就是对 **新的虚拟DOM** 和 **老的虚拟DOM** 进行**diff**(精细化比较)，找出最小量更新 是在虚拟**DOM** 比较

不可能把所有的 **DOM** 都拆掉 然后全部重新渲染

4.h 函数
------

在上面我们体验了**虚拟DOM**的使用 ，那么我们现在来实现一个 丐版的 **snabbdom**

> h 函数在介绍下

在 **snabbdom** 我们也使用了多次的 **h** 函数，主要作用是创建 虚拟节点

**snabbdom** 使用 **TS** 编写, 所以 **h** 函数中做了 **方法重载** 使用起来灵活

下面是 **snabbdom** 中 **h** 函数，可以看出 参数的有好几种方式

```javascript
export declare function h(sel: string): VNode;
export declare function h(sel: string, data: VNodeData): VNode;
export declare function h(sel: string, children: VNodeChildren): VNode;
export declare function h(sel: string, data: VNodeData, children: VNodeChildren): VNode;
```

> 实现 vnode 函数

在写 **h** 函数之前 先实现 **vnode** 函数，**vnode** 函数要在 **h** 中使用， 其实这个 **vnode** 函数实现功能非常简单 在 **TS** 里面规定了很多类型，不过我这里和之后都是 用 **JS** 去写

 ```javascript
\* 把传入的 参数 作为 对象返回
 \* @param {string} sel 选择器
 \* @param {object} data 数据
 \* @param {array} children 子节点
 \* @param {string} text 文本
 \* @param {dom} elm DOM
 \* @returns object
 */
export default function (sel, data, children, text, elm) {
  return { sel, data, children, text, elm }
}
```



> 实现简易 h 函数

这里写的 h 函数 只实现主要功能，没有实现重载，直接实现 3个 参数的 h 函数

 ```javascript
import vnode from './vnode'




 \*
 \* @param {string} a sel
 \* @param {object} b data
 \* @param {any} c 是子节点 可以是文本，数组
 */
export default function h(a, b, c) {

  if (arguments.length < 3) throw new Error('请检查参数个数')


  if (typeof c === 'string' || typeof c === 'number') {


    return vnode(a, b, undefined, c, undefined)
  }
  else if (Array.isArray(c)) {


    let children = \[\]

    for (let i = 0; i < c.length; i++) {

      if (!(typeof c\[i\] === 'object' && c\[i\].sel))
        throw new Error('第三个参数为数组时只能传递 h() 函数')

      children.push(c\[i\])
    }

    return vnode(a, b, children, undefined, undefined)
  }
  else if (typeof c === 'object' && c.sel) {

    let children = \[c\]

    return vnode(a, b, children, undefined, undefined)
  }
}
```



是不是很简单呢，他说起来也不是递归，像是一种嵌套，不断地收集 **{sel,data,children,text,elm}**

**chirldren** 里面再套 **{sel,data,children,text,elm}**

> 举个例子

 ```javascript
import h from './my-snabbdom/h'

let vnode = h('div', {},
  h('ul', {}, \[
    h('li', {}, '我是一个li'),
    h('li', {}, '我是一个li'),
    h('li', {}, '我是一个li'),
  ),
\])
console.log(vnode)
```



```html
<body>
  <div id="container"></div>
  <script src="/virtualdir/bundle.js"></script>
</body>
```

![image-20210727204731661](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/942b20c050664ddb82a4073c95198075~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**OK**，写的 **h** 函数没有问题，生成了虚拟**DOM** 树，生成了虚拟 DOM,我们之后 就会用的到

简单说下流程吧

大家都知道`js` 函数执行，当然是先执行最里面的 函数

*   1.`h('li', {}, '我是一个li')`第一个执行 返回的 `{sel,data,children,text,elm}` 连续三个 li 都是这个

*   2.接着就是 `h('ul', {}, \[\])` 进入到了第二个判断是否为数组，然后 把每一项 进行判断是否对象 和 有**sel** 属性，然后添加到 **children** 里面又返回了出去 `{sel,data,children,text,elm}`

*   3.第三就是执行 `h('div', {},h())` 了， 第三个参数 直接是 `h()`函数 = `{sel,data,children,text,elm}` ，他的 **children** 把他用 **\[ \]** 包起来

    再返回给 **vnode**


5.patch 函数
----------

> 简介

在 **snabbdom** 中我们 通过 **init()** 返回了一个 **patch** 函数，通过 **patch** 进行吧比较两个 虚拟 DOM 然后添加的 真实的 **DOM** 树上，中间比较就是我们等下要说的 **diff**

先来了解下 **patch**里面做了什么

![image-20210728172052418](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58f567538c1d4cffa7264cf5467ed271~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

按照上面的流程我们来写个简单的 **patch**

### 1.patch

> 先写个sameVnode

用来对比两个虚拟**DOM** 的 **key** 和 **sel**

 ```javascript
\* 判断两个虚拟节点是否是同一节点
 \* @param {vnode} vnode1 虚拟节点1
 \* @param {vnode} vnode2 虚拟节点2
 \* @returns boolean
 */
export default function sameVnode(vnode1, vnode2) {
  return (
    (vnode1.data ? vnode1.data.key : undefined) ===
      (vnode2.data ? vnode2.data.key : undefined) && vnode1.sel === vnode2.sel
  )
}
```



> 写个基础的patch

 ```javascript
import vnode from './vnode'




 \*
 \* @param {vnode/DOM} oldVnode
 \* @param {vnode} newVnode
 */
export default function patch(oldVnode, newVnode) {

  if (!oldVnode.sel) {

    oldVnode = emptyNodeAt(oldVnode)
  }


  if (sameVnode(oldVnode, newVnode)) {

    ...
  } else {

    ...
  }
  newVnode.elm = oldVnode.elm


  return newVnode
}


 \* 转为 虚拟 DOM
 \* @param {DOM} elm DOM节点
 \* @returns {object}
 */
function emptyNodeAt(elm) {




  return vnode(elm.tagName.toLowerCase(), undefined, undefined, undefined, elm)
}
```



现在要处理是否是 同一个虚拟节点的问题

### 2.createElm

> 先来处理不是同一个虚拟节点

处理这个我们得去写个 创建节点的方法 这里就放到 **createElm.js** 中完成

 ```javascript
\* 创建元素
 \* @param {vnode} vnode 要创建的节点
 */
export default function createElm(vnode) {

  let node = document.createElement(vnode.sel)


  if (
    vnode.text !== '' &&
    (vnode.children === undefined || vnode.children.length === 0)
  ) {

    node.textContent = vnode.text


  } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    let children = vnode.children

    for (let i = 0; i < children.length; i++) {

      let ch = children\[i\]

      let chDom = createElm(ch)

      node.appendChild(chDom)
    }
  }

  vnode.elm = node

  return node
}
```



上面的 **createElm** 就是使用了递归的方式去创建子节点 ，然后我们就去 patch 中 具体的调用这个 创建节点的方法

 ```javascript
import vnode from './vnode'
import createElm from './createElm'




 \*
 \* @param {vnode/DOM} oldVnode
 \* @param {vnode} newVnode
 */
export default function patch(oldVnode, newVnode) {

  if (!oldVnode.sel) {

    oldVnode = emptyNodeAt(oldVnode)
  }


  if (sameVnode(oldVnode, newVnode)) {

    ...
  } else {


    let newNode = createElm(newVnode)

    if (oldVnode.elm.parentNode) {
      let parentNode = oldVnode.elm.parentNode

      parentNode.insertBefore(newNode, oldVnode.elm)

      parentNode.removeChild(oldVnode.elm)
    }
  }
  newVnode.elm = oldVnode.elm
  return newVnode
}
...
}
```



在递归添加子节点 到了最后我们在 **patch** 添加到 真实的 **DOM** 中，移除之前的老节点

写到这里了来试试 不同节点 是否真的添加

 ```javascript
import h from './my-snabbdom/h'
import patch from './my-snabbdom/patch'


let app = document.querySelector('#app')

let vnode = h('ul', {}, \[
  h('li', {}, '我是一个li'),
  h('li', {}, \[
    h('p', {}, '我是一个p'),
    h('p', {}, '我是一个p'),
    h('p', {}, '我是一个p'),
  \]),
  h('li', {}, '我是一个li'),
\])


let oldVnode = patch(app, vnode)
```



```html
<body>
  <div id="app">hellow</div>
  <script src="/virtualdir/bundle.js"></script>
</body>
```

![image-20210728164308771](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6be430ef040d448b8b2b059b4823dfc2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

把 **div#app** 给替换了，并且成功替换

### 3.patchVnode

> 我们现在来实现同一个虚拟 DOM 的处理

在 patchVnode 中

步骤都是按照 之前那个流程图进行编写,我们把比较两个**相同**的 虚拟 DOM 代码写在 **patchVnode.js**中

在比较 两个相同的虚拟节点分支 有好几种情况

 ```javascript
import createElm from './createElm'


 \*
 \* @param {vnode} oldVnode 老的虚拟节点
 \* @param {vnode} newVnode 新的虚拟节点
 \* @returns
 */

export default function patchVnode(oldVnode, newVnode) {

  console.log('同一个虚拟节点')
  if (oldVnode === newVnode) return


  if (newVnode.text && !newVnode.children) {

    if (oldVnode.text !== newVnode.text) {
      console.log('文字不相同')

      oldVnode.elm.textContent = newVnode.text
    }
  } else {

    if (oldVnode.children) {
      ...这里新旧节点都存在children 这里要使用 updateChildren 下面进行实现
    } else {
      console.log('old没有children，new有children')



      oldVnode.elm.innerHTML = ''

      let newChildren = newVnode.children
      for (let i = 0; i < newChildren.length; i++) {

        let node = createElm(newChildren\[i\])

        oldVnode.elm.appendChild(node)
      }
    }
  }
}
```



按照流程图进行编码，现在要处理 **newVnode** 和 **oldVnode** 都存在 **children** 的情况了

在这里我们要进行精细化比较 也就是我们经常说的 **diff**

### 4.diff

经常听到的 **diff(精细化比较)** ,那我们先来了解下

> diff四种优化策略

在这里要使用 4 个指针,从1-4的顺序来开始命中优化策略，命中一个，指针进行移动`(新前和旧前向下移动，新后和旧后向上移动)`，没有命中，就使用**下一个策略**，如果四个策略都没有命中，只能靠循环来找

命中：两个节点 **sel** 和 **key** 一样

1.  新前与旧前
2.  新后与旧后
3.  新后与旧前
4.  新前与旧后

> 先来说下新增的情况

四种策略都是在 循环里面执行

```javascript
while(旧前<=旧后&&新前<=新后){
  ...
}
```

![14](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5d39847b94f4a3ca1763eb939366ae0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看出 **旧子节点** 先循环完毕，那么说明了新的子节点有需要 新增的 子节点

**新前** 和 **新后** 的 节点 就是需要新增的字节

> 删除的情况1

![19](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8727f03b28e4dd48d960c73e3b4be85~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这里新子节点 先循环完毕说明 旧子节点有需要删除的节点

> 删除的情况2

当我们删除多个，而且 4种策略都没有满足，我们得通过 **while** 循环 旧子节点 找到 新子节点需要寻找节点并标记为 `undefined` 虚拟节点是 **undefined**实际上在 **DOM**已经把它移动了 ,**旧前** 和 **旧后** 之间的节点就是需要删除的节点

![18](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4bc4cbb7093444988b87830f036bba3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 复杂情况1

当触发了 第四种 策略，这里就需要移动节点了，旧后指向的节点（在虚拟节点标为 **undefined**），实际把 **新前** 指向的节点 在**DOM** 中 移动到**旧前之前**

![20](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99cc589cb22548528139cc46d6498234~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 复杂情况2

当触发了 第三种 策略，这里也需要移动节点了，旧前 指向的节点（在虚拟节点标为 **undefined**），实际把 **新后** 指向的节点 在**DOM** 中 移动到**旧后之后**

![21](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f9bbbb7afce48da85d76991d7367e80~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 注意几个点 :

*   `h('li',{key:'A'} : "A"})` 比如这其中的 key 是这个节点的唯一的标识
*   它的存在是在告诉 **diff** ,在更改前后它们是同一个**DOM**节点。
*   只有是**同一个虚拟节点，**才进行精细化比较，否则就是**暴力删除旧的**、插入新的
*   同一虚拟节点 不仅要 key 相同而且要 选择器相同也就是上面的 `h()` 函数创建的 虚拟节点 对象里的 `sel`
*   只进行同层比较，不会进行跨层比较

### 5.updateChildren

看了上面对于 **diff** 的介绍，不知道我画的图 演示清楚了没，然后我们接着继续来完成 **patchVnode**

我们得写个 **updateChildren** 来进行精细化比较

这个文件就是 **diff** 算法的核心，我们用来比较 **oldVnode** 和 **newVnode** 都存在 **children** 的情况

这里有点绕，注释都写了，请耐心观看，流程就是按照 diff 的四种策略来写，还要处理没有命中的情况

 ```javascript
import createElm from './createElm'
import patchVnode from './patchVnode'
import sameVnode from './sameVnode'



 \*
 \* @param {dom} parentElm 父节点
 \* @param {array} oldCh 旧子节点
 \* @param {array} newCh 新子节点
 */
export default function updateChildren(parentElm, oldCh, newCh) {


  let oldStartIdx = 0,
    newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  let oldStartVnode = oldCh\[0\]
  let oldEndVnode = oldCh\[oldEndIdx\]
  let newStartVnode = newCh\[0\]
  let newEndVnode = newCh\[newEndIdx\]
  let keyMap = null

  while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
    console.log('---进入diff---')






    if (oldCh\[oldStartIdx\] == undefined) {
      oldStartVnode = oldCh\[++oldStartIdx\]
    } else if (oldCh\[oldEndIdx\] == undefined) {
      oldEndVnode = oldCh\[--oldEndIdx\]
    } else if (newCh\[newStartIdx\] == undefined) {
      newStartVnode = newCh\[++newStartIdx\]
    } else if (newCh\[newEndIdx\] == undefined) {
      newEndVnode = newCh\[--newEndIdx\]
    }


    else if (sameVnode(oldStartVnode, newStartVnode)) {
      console.log('1命中')

      patchVnode(oldStartVnode, newStartVnode)

      newStartVnode = newCh\[++newStartIdx\]
      oldStartVnode = oldCh\[++oldStartIdx\]
    }
    else if (sameVnode(oldEndVnode, newEndVnode)) {
      console.log('2命中')

      patchVnode(oldEndVnode, newEndVnode)

      newEndVnode = newCh\[--newEndIdx\]
      oldEndVnode = oldCh\[--oldEndIdx\]
    }
    else if (sameVnode(oldStartVnode, newEndVnode)) {
      console.log('3命中')

      patchVnode(oldStartVnode, newEndVnode)


      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)

      newEndVnode = newCh\[--newEndIdx\]
      oldStartVnode = oldCh\[++oldStartIdx\]
    }

    else if (sameVnode(oldEndVnode, newStartVnode)) {
      console.log('4命中')

      patchVnode(oldEndVnode, newStartVnode)

      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)

      newStartVnode = newCh\[++newStartIdx\]
      oldEndVnode = oldCh\[--oldEndIdx\]
    } else {
      console.log('diff四种优化策略都没命中')


      if (!keyMap) {

        keyMap = {}

        for (let i = oldStartIdx; i < oldEndIdx; i++) {

          const key = oldCh\[i\].data.key

          if (!key) keyMap\[key\] = i
        }
      }


      let idInOld = keyMap\[newStartIdx.data\]
        ? keyMap\[newStartIdx.data.key\]
        : undefined


      if (idInOld) {
        console.log('移动节点')

        let moveElm = oldCh\[idInOld\]

        patchVnode(moveElm, newStartVnode)

        oldCh\[idInOld\] = undefined


        parentElm.insertBefore(moveElm.elm, oldStartVnode.elm)
      } else {
        console.log('添加新节点')



        parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.elm)
      }


      newStartVnode = newCh\[++newStartIdx\]
    }
  }


  if (newStartIdx <= newEndIdx) {
    console.log('进入添加剩余节点')


    let beforeFlag = newCh\[newEndIdx + 1\] ? newCh\[newEndIdx + 1\] : null

    for (let i = newStartIdx; i <= newEndIdx; i++) {

      parentElm.insertBefore(createElm(newCh\[i\]), beforeFlag)
    }
  } else if (oldStartIdx <= oldEndIdx) {
    console.log('进入删除多余节点')

    for (let i = oldStartIdx; i <= oldEndIdx; i++) {

      if (oldCh\[i\].elm) parentElm.removeChild(oldCh\[i\].elm)
    }
  }
}
```



到了这里我们基本写都完成了， **h** 函数 创建 虚拟 **DOM** , **patch** 比较 虚拟**DOM** 进行更新视图

6.我们来测试一下写的
-----------

其实在写代码的时候就在不断的调试。。。现在随便测试几个

### 1.代码

> html

```html
<body>
  <button class="btn">策略3</button>
  <button class="btn">复杂</button>
  <button class="btn">删除</button>
  <button class="btn">复杂</button>
  <button class="btn">复杂</button>
  <ul id="app">
    hellow
  </ul>

  <script src="/virtualdir/bundle.js"></script>
</body>
```

> index.js

 ```javascript
import h from './my-snabbdom/h'
import patch from './my-snabbdom/patch'

let app = document.querySelector('#app')

let vnode = h('ul', {}, \[
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'E' }, 'E'),
\])

let oldVnode = patch(app, vnode)

let vnode2 = h('ul', {}, \[
  h('li', { key: 'E' }, 'E'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'A' }, 'A'),
\])
let vnode3 = h('ul', {}, \[
  h('li', { key: 'E' }, 'E'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'K' }, 'K'),
\])
let vnode4 = h('ul', {}, \[
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
\])
let vnode5 = h('ul', {}, \[
  h('li', { key: 'E' }, 'E'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'V' }, 'V'),
\])
let vnode6 = h('ul', {}, \[
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'D' }, 'D'),
  h(
    'li',
    { key: 'E' },
    h('ul', {}, \[
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B'),
      h('li', { key: 'C' }, 'C'),
      h('li', { key: 'D' }, 'D'),
      h('li', { key: 'E' }, h('div', { key: 'R' }, 'R')),
    \])
  ),
\])
let vnodeList = \[vnode2, vnode3, vnode4, vnode5, vnode6\]
let btn = document.querySelectorAll('.btn')
for (let i = 0; i < btn.length; i++) {
  btn\[i\].onclick = () => {
    patch(vnode, vnodeList\[i\])
  }
}
```

### 2.演示

> 策略3

![22](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f95d637265f4ea894fb0ee36e9c9bdb~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 复杂

![23](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5582ea0aa45e4b05b751e3c54a2b59c9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 删除

![24](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/246cbf9a6c6749a494e27f0ef5fecbb1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 复杂

![25](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b351a63e539467598b4e3ff1990bef9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 复杂（这里是简单 。。）

![26](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff817315ac8c4cacac1dab0330a96e6e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

7.结语
----

注释我都写了喔，大家可以对照 我上面画的图不清楚可以反复耐心的看哈

如果看的话没什么感觉，大家可以自己动手写写，下面我会贴出所有的代码

代码同样也放在 [**github**](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FLianTianNo1%2FVirtual_DOM_demo%2Ftree%2Fmain%2Fsrc%2Fmy-snabbdom "https://github.com/LianTianNo1/Virtual_DOM_demo/tree/main/src/my-snabbdom")

完整代码：

> h.js

 ```javascript
import vnode from './vnode'




 \*
 \* @param {string} a sel
 \* @param {object} b data
 \* @param {any} c 是子节点 可以是文本，数组
 */
export default function h(a, b, c) {

  if (arguments.length < 3) throw new Error('请检查参数个数')


  if (typeof c === 'string' || typeof c === 'number') {


    return vnode(a, b, undefined, c, undefined)
  }
  else if (Array.isArray(c)) {


    let children = \[\]

    for (let i = 0; i < c.length; i++) {

      if (!(typeof c\[i\] === 'object' && c\[i\].sel))
        throw new Error('第三个参数为数组时只能传递 h() 函数')

      children.push(c\[i\])
    }

    return vnode(a, b, children, undefined, undefined)
  }
  else if (typeof c === 'object' && c.sel) {

    let children = \[c\]

    return vnode(a, b, children, undefined, undefined)
  }
}
```



> patch.js

 ```javascript
import vnode from './vnode'
import createElm from './createElm'
import patchVnode from './patchVnode'
import sameVnode from './sameVnode'



 \*
 \* @param {vnode/DOM} oldVnode
 \* @param {vnode} newVnode
 */
export default function patch(oldVnode, newVnode) {

  if (!oldVnode.sel) {

    oldVnode = emptyNodeAt(oldVnode)
  }


  if (sameVnode(oldVnode, newVnode)) {

    patchVnode(oldVnode, newVnode)
  } else {


    let newNode = createElm(newVnode)

    if (oldVnode.elm.parentNode) {
      let parentNode = oldVnode.elm.parentNode

      parentNode.insertBefore(newNode, oldVnode.elm)

      parentNode.removeChild(oldVnode.elm)
    }
  }
  newVnode.elm = oldVnode.elm



  return newVnode
}


 \* 转为 虚拟 DOM
 \* @param {DOM} elm DOM节点
 \* @returns {object}
 */
function emptyNodeAt(elm) {




  return vnode(elm.tagName.toLowerCase(), undefined, undefined, undefined, elm)
}
```



> createElm.js

 ```javascript
\* 创建元素
 \* @param {vnode} vnode 要创建的节点
 */
export default function createElm(vnode) {

  let node = document.createElement(vnode.sel)


  if (
    vnode.text !== '' &&
    (vnode.children === undefined || vnode.children.length === 0)
  ) {

    node.textContent = vnode.text

  } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    let children = vnode.children

    for (let i = 0; i < children.length; i++) {

      let ch = children\[i\]

      let chDom = createElm(ch)

      node.appendChild(chDom)
    }
  }

  vnode.elm = node

  return node
}
```



> vnode.js

 ```javascript
\* 把传入的 参数 作为 对象返回
 \* @param {string} sel 选择器
 \* @param {object} data 数据
 \* @param {array} children 子节点
 \* @param {string} text 文本
 \* @param {dom} elm DOM
 \* @returns
 */
export default function (sel, data, children, text, elm) {
  return { sel, data, children, text, elm }
}
```



> patchVnode.js

 ```javascript
import createElm from './createElm'
import updateChildren from './updateChildren'

 \*
 \* @param {vnode} oldVnode 老的虚拟节点
 \* @param {vnode} newVnode 新的虚拟节点
 \* @returns
 */

export default function patchVnode(oldVnode, newVnode) {


  if (oldVnode === newVnode) return


  if (newVnode.text && !newVnode.children) {

    if (oldVnode.text !== newVnode.text) {
      console.log('文字不相同')

      oldVnode.elm.textContent = newVnode.text
    }
  } else {

    if (oldVnode.children) {
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
    } else {
      console.log('old没有children，new有children')



      oldVnode.elm.innerHTML = ''

      let newChildren = newVnode.children
      for (let i = 0; i < newChildren.length; i++) {

        let node = createElm(newChildren\[i\])

        oldVnode.elm.appendChild(node)
      }
    }
  }
}
```



> sameVnode.js

 ```javascript
\* 判断两个虚拟节点是否是同一节点
 \* @param {vnode} vnode1 虚拟节点1
 \* @param {vnode} vnode2 虚拟节点2
 \* @returns boolean
 */
export default function sameVnode(vnode1, vnode2) {
  return (
    (vnode1.data ? vnode1.data.key : undefined) ===
      (vnode2.data ? vnode2.data.key : undefined) && vnode1.sel === vnode2.sel
  )
}
```



> updateChildren.js

 ```javascript
import createElm from './createElm'
import patchVnode from './patchVnode'
import sameVnode from './sameVnode'



 \*
 \* @param {dom} parentElm 父节点
 \* @param {array} oldCh 旧子节点
 \* @param {array} newCh 新子节点
 */
export default function updateChildren(parentElm, oldCh, newCh) {


  let oldStartIdx = 0,
    newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  let oldStartVnode = oldCh\[0\]
  let oldEndVnode = oldCh\[oldEndIdx\]
  let newStartVnode = newCh\[0\]
  let newEndVnode = newCh\[newEndIdx\]
  let keyMap = null

  while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
    console.log('---进入diff---')






    if (oldCh\[oldStartIdx\] == undefined) {
      oldStartVnode = oldCh\[++oldStartIdx\]
    } else if (oldCh\[oldEndIdx\] == undefined) {
      oldEndVnode = oldCh\[--oldEndIdx\]
    } else if (newCh\[newStartIdx\] == undefined) {
      newStartVnode = newCh\[++newStartIdx\]
    } else if (newCh\[newEndIdx\] == undefined) {
      newEndVnode = newCh\[--newEndIdx\]
    }


    else if (sameVnode(oldStartVnode, newStartVnode)) {
      console.log('1命中')

      patchVnode(oldStartVnode, newStartVnode)

      newStartVnode = newCh\[++newStartIdx\]
      oldStartVnode = oldCh\[++oldStartIdx\]
    }
    else if (sameVnode(oldEndVnode, newEndVnode)) {
      console.log('2命中')

      patchVnode(oldEndVnode, newEndVnode)

      newEndVnode = newCh\[--newEndIdx\]
      oldEndVnode = oldCh\[--oldEndIdx\]
    }
    else if (sameVnode(oldStartVnode, newEndVnode)) {
      console.log('3命中')

      patchVnode(oldStartVnode, newEndVnode)


      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)

      newEndVnode = newCh\[--newEndIdx\]
      oldStartVnode = oldCh\[++oldStartIdx\]
    }

    else if (sameVnode(oldEndVnode, newStartVnode)) {
      console.log('4命中')

      patchVnode(oldEndVnode, newStartVnode)

      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)

      newStartVnode = newCh\[++newStartIdx\]
      oldEndVnode = oldCh\[--oldEndIdx\]
    } else {
      console.log('diff四种优化策略都没命中')


      if (!keyMap) {

        keyMap = {}

        for (let i = oldStartIdx; i < oldEndIdx; i++) {

          const key = oldCh\[i\].data.key

          if (!key) keyMap\[key\] = i
        }
      }


      let idInOld = keyMap\[newStartIdx.data\]
        ? keyMap\[newStartIdx.data.key\]
        : undefined


      if (idInOld) {
        console.log('移动节点')

        let moveElm = oldCh\[idInOld\]

        patchVnode(moveElm, newStartVnode)

        oldCh\[idInOld\] = undefined


        parentElm.insertBefore(moveElm.elm, oldStartVnode.elm)
      } else {
        console.log('添加新节点')



        parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.elm)
      }


      newStartVnode = newCh\[++newStartIdx\]
    }
  }


  if (newStartIdx <= newEndIdx) {
    console.log('进入添加剩余节点')


    let beforeFlag = newCh\[newEndIdx + 1\] ? newCh\[newEndIdx + 1\] : null

    for (let i = newStartIdx; i <= newEndIdx; i++) {

      parentElm.insertBefore(createElm(newCh\[i\]), beforeFlag)
    }
  } else if (oldStartIdx <= oldEndIdx) {
    console.log('进入删除多余节点')

    for (let i = oldStartIdx; i <= oldEndIdx; i++) {

      if (oldCh\[i\].elm) parentElm.removeChild(oldCh\[i\].elm)
    }
  }
}
```
