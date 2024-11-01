---
title: 从使用到自己实现简单Vue Router看这个就行
date: 2021-07-24 08:00:17
updated: 2021-07-24 08:00:17
tags: ["Vue", "Vue Router"]
categories: ["前端"]
---
## 从使用到自己实现简单Vue Router看这个就行了

原文：https://juejin.cn/post/6988316779818778631

前言
==

> 这是小浪在学习**Vue Router** 总结的笔记，有的地方写的不是很好，请大家多多指教
>
> *   这里带你了解 **Vue Router** 的基本使用
> *   手写一个基础的 **Vue Router** 感受下基础的实现
> *   有了之前的基础，那么按照官方的源码 再写个 **Vue Router** 吧
>
> 在两个手写**Vue Router**地方我都有写详细的注释
>
> 希望这篇文章对您有所帮助，建议自己手动去敲下
>
> 最后：小浪在线**求赞**

Vue Router 基础
=============

让我们先来了解下`Vue Router`的简单使用吧，先了解怎么使用，之后再去想办法怎么去实现

1.简介
----

路由：本质上是一种对应关系

分类分为**前端路由**和**后端路由**

> 后端路由

比如node.js 的路由是 **URL**的请求地址和服务器上面的**资源**对应，根据不同的请求地址返回不同的资源

> 前端路由

在**SPA**（单页应用）中根据用户所触发的事件改变了**URL** 在无需刷新的前提下 显示不同的页面内容，比如等下就要讲的**Vue Router**

2.Vue-Router最基础的使用步骤
--------------------

### 1.引入Vue-Router文件

```html
<script src="./js/vue.js"></script>

<script src="./js/vue-router_3.0.2.js"></script>
```

### 2.在页面上添加 router-link 和 router-view

 ```html
<router-link to="/home">Home</router-link>
<router-link to="/login">Login</router-link>

<router-view></router-view>
```

### 3.创建路由组件

```javascript
const home = {
    template: `
<div>欢迎来到{{name}}</div>
`,
    data() {
        return {
            name: '首页',
        }
    },
}

const login = {
    template: `
		<div>欢迎来到登录页</div>
	`,
}
```

### 4.配置路由规则

```javascript
const router = new VueRouter({
    routes: \[



        {
            path: '/',

            redirect: '/home',
        },
        {
            path: '/home',
            component: home,
        },
        {
            path: '/login',
            component: login,
        },
    \],
})
```

### 5.挂载路由

 ```javascript
let vm = new Vue({
        el: '#app',
        data: {},
        methods: {},

        router,
 })
```

![2](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76bdf2efd0d14eecb50e7dfc199e36f3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

3.嵌套路由
------

> 这里的嵌套路由是基于上面的例子继续写的

### 1.在路由里面添加 子路由链接和 占位符

```javascript
const home = {
    template: `
    <div>
    欢迎来到首页
    <br>
    <!\-\- 子路由链接 -->
    <router-link to="/tab1">Tab1</router-link>
    <router-link to="/tab2">Tab2</router-link>

    <!\-\- 子路由展示 -->
    <router-view></router-view>
    </div>
}
```



### 2.添加路由组件

```javascript
const tab1 = {
    template: `
    <div>
    子路由1
    </div>
    `,
}
const tab2 = {
    template: `
    <div>
    子路由2
    </div>
    `,
}
```

### 3.配置路由规则

```javascript
const router = new VueRouter({
    routes: \[
        {
            path: '/home',
            component: home,

            children: \[
                { path: '/tab1', component: tab1 },
                { path: '/tab2', component: tab2 },
            \],
        },
    \],
})
```

![3](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c79adc65ba146ba89240855603e262c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

4.动态路由
------

> `path`属性加上`/:id` 使用`route`对象的`params.id`获取动态参数

比如现在有这么多个路由，如果自己也配置多个路由，岂不是有点。。。多余

```html
<div id="app">


    <router-link to="/goods/1">goods1</router-link>
    <router-link to="/goods/2">goods2</router-link>
    <router-link to="/goods/3">goods3</router-link>
    <router-link to="/goods/4">goods4</router-link>

    <router-view></router-view>
</div>
```

然后这里就可以使用 动态路由来解决

```javascript
<script>

    const goods = {

        template: `
        <div>欢迎来到商品 {{$route.params.id}}页</div>
        `,
        }

    const router = new VueRouter({
        routes: \[
            {

                path: '/goods/:id',
                component: goods,
            },
        \],
    })
    let vm = new Vue({
        el: '#app',
        data: {},
        methods: {},

        router,
    })
</script>
```

![4](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ccc5241e7f94107b59e39225390b0e6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 最后提一下还可以用**query**进行传参.

```html
// 比如
<router-link to="/goods?id=1">goods</router-link>
```

然后使用`this.$route.query.id`就可以在路由组件中获取到**id**

> 添加动态路由

使用 `this.$router.addRoutes(\[\])` 可以**添加动态路由**,里面传递是一个数组 和 **routes**里面一样

5.路由传参
------

> 我们可以使用 props 进行传值
>
> 为啥要用 props 进行传值，route不香了吗，确实route 不够灵活
>
> props 值有三种情况

### 1.布尔值类型

```javascript
const goods = {

    props: \['id'\],
    template: `
    <div>欢迎来到商品 {{id}}页</div>
    `,
}

const router = new VueRouter({
    routes: \[
        {
            path: '/goods/:id',
            component: goods,

            props: true,
        },
    \],
})
```

### 2.对象类型

但是这里就获取不到 `id` 了，会**报错**

这里的id 需要 `$route.params.id` 获取

```javascript
const goods = {

    props: \['name', 'info', 'id'\],

    template: `
    <div>{{info}}来到{{name}} {{id}}页</div>
    `,
}

const router = new VueRouter({
    routes: \[
        {
            path: '/goods/:id',
            component: goods,


            props: {
                name: '商品',
                info: '欢迎',
            },
        },
    \],
})
```

### 3.函数

```javascript
const goods = {

    props: \['name', 'info', 'id'\],
    template: `
    <div>{{info}}来到{{name}} {{id}}页</div>
    `,
}

const router = new VueRouter({
    routes: \[
        {
            path: '/goods/:id',
            component: goods,

            props: (route) => {
                return {
                    name: '商品',
                    info: '欢迎',
                    id: route.params.id,
                }
            },
        },
    \],
})
```

6.route 和 router
----------------

> 在上面提到了**route** 那么和 **router**有什么区别呢

*   **route**为**当前router跳转对象**里面可以获取**path**，**params**，**hash**，**query**，**fullPath**，**matched**，**name**
*   **router**为**VueRouter实例**用 **new VueRouter**创建的实例，想要导航到不同**URL**，则使用`router.push`方法
*   **routes**是**router**路由实例用来配置路由对象（顺带提一下）

7.命名路由
------

路由组件

```javascript
const goods = {

    props: \['id'\],
    template: `
    <div>商品{{id}}页</div>
    `,
}
```

路由配置

```javascript
const router = new VueRouter({
    routes: \[
        {
            path: '/goods/:id',

            name: 'goods',
            component: goods,
        },
    \],
})
```

绑定 `:to` 通过`name`找到定义的路由 还可以使用 `params` 传递参数

```html
<router-link :to="{name: 'goods', params: { id: 1 } }">goods1</router-link>

<router-view></router-view>
```

8.编程式导航
-------

### 1.声明式导航

> 既然提到了编程式导航，那么先简单说下声明式导航

上面所展示的都是**声明是导航** 比如**router-link**

`<router-link to="/goods/1">goods1</router-link>`

还有**a**标签

`<a href="#/goods/1">goods1</a>`

### 2.编程式导航

> 使用**javaScript**来控制**路由跳转**

在普通的网页中使用 `loaction.href``window.open` 等等进行跳转

现在我要介绍的是**Vue Router**中的编程式导航

我们平时都是用**router.push()** \*\*router.go(n)\*\*方法进行跳转

```javascript
this.$router.push('/home')


this.$ruter.push({path:'/home'})


this.$router.push({path:'/goods',query:{id:'1'}})


this.$router.push({name:'goods',params:{id:1}})


this.$router.go(-1)
```

9.路由守卫
------

### 1.全局守卫

**router.beforeEach** 全局守卫 对所有的路由都起作用

```javascript
router.beforeEach((to, from, next) => {
      next();
    }).catch(()=>{

      next({ path: '/error', replace: true, query: { back: false }}
    )
})
```

> 全局的守卫的三个参数

`to`: 即将要进入的目标 路由对象

`from`: 当前导航正要离开 路由对象

`next`: 参数不同做的事也不同

> *   **next()** 直接进入下一个钩子
> *   **next(false)** 停止当前导航
> *   **next('/路径')** 跳转到**path**路由地址 当然这里面也可以写成对象形式 **next({path : '/路径'})**
> *   **next(error)**: 如果传入参数是一个 **Error** 实例，则导航会被终止且该错误会被传递给 `router.onError()`

### 2.路由独享的守卫

**beforeEnter** 路由对象独享的守卫写在**routes**里面

```javascript
const router = new VueRouter({
  routes: \[
    {
      path: '/goods',
      component: goods,
      beforeEnter: (to, from, next) => {

      }
    }
  \]
})
```

### 3.组件内的守卫(了解)

组件内的守卫 写在组件内部 下面是官方介绍

*   **beforeRouteEnter** 进入路由前,组件还没有被实例化所以这里无法获取到this
*   **beforeRouteUpdate (2.2)** 这个阶段可以获取this,在路由复用同一个组件时触发
*   **beforeRouteLeave** 这个阶段可以获取this,当离开组件对应的路由时,此时可以用来保存数据,或数据初始化,或关闭定时器等等

```javascript
const goods = {
  template: `<div>goods</div>`,
  beforeRouteEnter (to, from, next) {

  },
  beforeRouteUpdate (to, from, next) {

  },
  beforeRouteLeave (to, from, next) {

  }
}
```

10.组件缓存 **keep-alive**
----------------------

页面重新加载会重新渲染页面比如回退的时候等等，我们有的组件它不是一个活动的(数据不变)不希望它被重新渲染，所以这里就可以使用 **`<keep-alive> </keep-alive>`** 包裹起来，这样就不会触发`created`钩子

应用场景：获取一个商品的详情然后回退在前进的时候就使用缓存，提高性能

### 1.不使用 keep-alive例子

> 这里home 组件在**created**进行打印当前的时间

```html
<div id="app">
    <router-link to="/home">home</router-link>
	<router-link to="/login">login</router-link>

	<router-view></router-view>
</div>
```

```javascript
<script>
      const login = {
        template: `
        <div>Login</div>
        `,
      }
      const home = {
        template: `
        <div>Home</div>
        `,
        created() {
          console.log(new Date())
        },
      }
      const router = new VueRouter({
        routes: \[
          {
            path: '/',
            redirect: '/home',
          },
          {
            path: '/home',
            component: home,
          },
          {
            path: '/login',
            component: login,
          },
        \],
      })
      let vm = new Vue({
        el: '#app',
        data: {},
        methods: {},
        router,
      })
  </script>
```

![5](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12d49c936f34449798635c804731805c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

如上，每切换`home` 的路由 组件就会**重新渲染**，打印当前的时间

如果使用 **keep-alive** 会有什么效果呢

### 2.使用keep-alive

> 这里只需简单的包裹起来就行了

```html
<div id="app">
    <router-link to="/home">home</router-link>
    <router-link to="/login">login</router-link>

    <keep-alive>
        <router-view></router-view>
    </keep-alive>
</div>
```

![6](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d9d1e2bdad646d88b3d9823980fbef8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看到的是只打印一次，说明切换了路由它并**没有重新渲染组件**

> 当然可以在 组件内取个**name**名字 `keep-alive` 标签里面添加 **include** 属性就可以对相应的组件进行缓存

```javascript
const login = {
    name: login,
    template: `
    <div>Login</div>
    `,
}
const home = {
    name: home,
    template: `
    <div>Home</div>
    `,
    created() {
    	console.log(new Date())
    },
}
```

```html
<div id="app">
    <router-link to="/home">home</router-link>
    <router-link to="/login">login</router-link>

    <keep-alive include="login,home">
        <router-view></router-view>
    </keep-alive>
</div>
```

### 3.activated 和 deactivated

> keep-alive 生命周期执行顺序

第一次访问路由时：

*   `created`-->`mounted` -->`activated`
*   `deactivated`在退出后触发

**以后进入只会触发**`activated`

11.hash 和 history 模式
--------------------

### 1.hash模式

在vue-router中**默认使用**的是 **hash** 模式

`hash`是url中的锚点就是**`#`**,通过锚点作为路由地址,我们通常改变的是改变**`#`**后面部分,实现浏览器渲染指定的组件.,锚点发生改变会触发 **onhashchange** 事件

### 2.history模式

history 模式就是平时正常的地址，使用方面需要服务器支持

如果访问的路径资源没有 直接就是 `404`

在**HTML5**后新增了两个API

**pushState()**: IE10后支持

**replaceState()**

在`vue-router`中如果要使用 `history` 模式**需要指定**

```javascript
const router = new VueRouter({
  mode: 'history'
})
```

实现一个基础 Vue Router
=================

> 复习上面的路由的基础那么我们不如来写个Vue Router吧

实现的这个 Vue Router是基于 history模式

所有的步骤都放到代码的注释中，每一行都写个注释

这个简单的没有按照Vue Router源码来写主要是一些基础功能的实现

为后面的按照源码写打基础

1.注册全局Vue Router
----------------

> 首先就是先注册自己的 Vue Router
>
> 判断是否注册了组件
>
> 在Vue实例创建完成进行注册

```javascript
let _Vue = null


export default class MyVueRouter {


  static install(Vue) {

    if (MyVueRouter.install.installed) return

    MyVueRouter.install.installed = true

    _Vue = Vue

    _Vue.mixin({

      beforeCreate() {

        if (this.$options.router) {

          _Vue.prototype.$router = this.$options.router
        }
      },
    })
  }
}
```

2.实现 构造方法
---------

> **optoins** 保存传入的规则
>
> **routerMap** 确定地址和组件的关系
>
> **current** 表示当前的地址是响应式的之后渲染组件和它相关

```javascript
export default class MyVueRouter {
  ...

  constructor(optoins) {

    this.optoins = optoins

    this.routerMap = {}

    this.data = _Vue.observable({

      current: '/',
    })
  }
}
```

3.解析路由规则
--------

> 传入的路由规则拿到一个对象里 地址 和 组件一一匹配

```javascript
export default class MyVueRouter {
  ...

  createRouterMap() {

    this.optoins.routes.forEach((item) => {

      this.routerMap\[item.path\] = item.component
    })
  }
}
```

4.实现 router-link 组件
-------------------

> router-link就是页面上所展示的路由链接
>
> 因为一般使用的基本都是运行版的Vue 所以自己把组件转为 虚拟DOM
>
> 还有就是链接会刷新的问题
>
> 自己写个函数进行跳转阻止默认事件
>
> 还得注意对应的路由所要渲染的组件

```javascript
export default class MyVueRouter {
  ...

  initComponents(Vue) {

    Vue.component('router-link', {
      props: {

        to: String,
      },


      render(h) {

        return h(
          'a',

          {

            attrs: {
              href: this.to,
            },

            on: {

              click: this.myClick,
            },
          },

          \[this.$slots.default\]
        )
      },
      methods: {

        myClick(e) {



          history.pushState({}, '', this.to)


          this.$router.data.current = this.to

          e.preventDefault()
        },
      },
    })
```

5.实现 router-view 组件
-------------------

> 这里从之前解析的规则里面拿到当前的对应的组件进行转为虚拟DOM
>
> 最后`router-view`占位渲染到页面上

```javascript
export default class MyVueRouter {
  ...

  initComponents(Vue) {

    Vue.component('router-view', {
      render(h) {


        const component = this.$router.routerMap\[this.$router.data.current\]

        return h(component)
      },
    })
  }
}
```

6.前进和后退
-------

> 在完成之前的编写还是不够的，因为在浏览器点后退和前进虽然改变了浏览器的地址，但是组件却没有刷新，下面就来解决这个问题

```javascript
export default class MyVueRouter {
  ...

  initEvent() {

    window.addEventListener('popstate', () => {

      this.data.current = window.location.pathname
    })
  }
}
```

7.在router挂载后进行初始化
-----------------

> 最后写个函数进行初始化
>
> 在router注册到Vue之后进行 初始化

```javascript
export default class MyVueRouter {

  init() {

    this.createRouterMap()

    this.initComponents(_Vue)

    this.initEvent()
  }

  static install(Vue) {
    if (MyVueRouter.install.installed) return
    MyVueRouter.install.installed = true
    _Vue = Vue
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router

          this.$options.router.init()
        }
      },
    })
  }
  ...
}
```



8.放上完整的 index.js
----------------

```javascript
let _Vue = null

export default class MyVueRouter {


  static install(Vue) {

    if (MyVueRouter.install.installed) return

    MyVueRouter.install.installed = true

    _Vue = Vue

    _Vue.mixin({

      beforeCreate() {

        if (this.$options.router) {

          _Vue.prototype.$router = this.$options.router

          this.$options.router.init()
        }
      },
    })

  }

  constructor(optoins) {

    this.optoins = optoins

    this.routerMap = {}

    this.data = _Vue.observable({

      current: '/',
    })
  }

  createRouterMap() {

    this.optoins.routes.forEach((item) => {


      this.routerMap\[item.path\] = item.component
    })
  }

  initComponents(Vue) {

    Vue.component('router-link', {
      props: {

        to: String,
      },


      render(h) {

        return h(
          'a',

          {

            attrs: {
              href: this.to,
            },

            on: {

              click: this.myClick,
            },
          },



          \[this.$slots.default\]
        )
      },
      methods: {

        myClick(e) {



          history.pushState({}, '', this.to)


          this.$router.data.current = this.to

          e.preventDefault()
        },
      },
    })

    Vue.component('router-view', {
      render(h) {


        const component = this.$router.routerMap\[this.$router.data.current\]

        return h(component)
      },
    })
  }

  initEvent() {

    window.addEventListener('popstate', () => {

      this.data.current = window.location.pathname
    })
  }


  init() {

    this.createRouterMap()

    this.initComponents(_Vue)

    this.initEvent()
  }
}
```

到了这里基础的实现功能差不多了，上面的例子是为了下面打基础，所有的功能实现基本都是在一个文件下很不严谨，下面就严格按照**Vue Router** 源码来实现自己 **Vue Router**

Vue Router实现
============

> 经过上面简单的实现，现在我们按照Vue Router源码的方式进行编写

1.首先是Vue Router 构造
------------------

 ```javascript
export default class VueRouter {

  constructor(options) {

    this._options = options.routes || \[\]
  }

  init(Vue) {}
}
```

2.注册组件 install
--------------

> 在 **install.js** 对自己写的**Vue-Router**进行全局的注册
>
> 之后还会在这里创建 ** $r o u t e r * * * *$) route**
>
> 还有注册 **router-link****router-view**

 ```javascript
export let _Vue = null


export default function install(Vue) {

  _Vue = Vue

  _Vue.mixin({

    beforeCreate() {

      if (this.$options.router) {

        this._routerRoot = this

        this._router = this.$options.router

        this._router.init(this)
      } else {



        this.\_routerRoot = (this.$parent && this.$parent.\_routerRoot) || this
      }
    },
  })
}
```

然后在 `index.js`中导入**install** 进行为构造添加 **install**

```javascript
import install from './install'


export default class VueRouter {
	...
}


VueRouter.install = install
```

3.编写 create-route-map.js
------------------------

> 这个主要的作用就是用来解析传递过来的路由 需要导出然后在 `create-matcher.js`进行使用
>
> 具体的细节都写了注释

 ```javascript
\*
 \* @param {*} routes 路由规则
 \* @param {*} oldPathList 路由列表
 \* @param {*} oldPathMap 路由和组件的对应关系
 */
export default function createRouteMap(routes, oldPathList, oldPathMap) {

  const pathList = oldPathList || \[\]
  const pathMap = oldPathMap || \[\]


  routes.forEach((route) => {

    addRouteRecord(route, pathList, pathMap)
  })


  return {
    pathList,
    pathMap,
  }
}


 \*
 \* @param {*} route 路由规则
 \* @param {*} pathList 路由列表
 \* @param {*} pathMap 路由和组件之间的对应关系
 \* @param {*} parentRecord  父路由
 */
function addRouteRecord(route, pathList, pathMap, parentRecord) {

  const path = parentRecord ? `${parentRecord.path}/${route.path}` : route.path

  const record = {
    path,
    component: route.component,
    parent: parentRecord,
  }

  if (!pathList\[path\]) {

    pathList.push(path)

    pathMap\[path\] = record
  }

  if (route.children) {
    route.children.forEach((childRoute) => {

      addRouteRecord(childRoute, pathList, pathMap, record)
    })
  }
}
```

4.编写 create-matcher.js
----------------------

> 这个模块的意义也是解析路由不过这个是个指挥家，上面实现的是具体解析操作
>
> 在这个模块里进行调用上面的具体解析路由的方法就行了
>
> 有了上面面具体的路由解析，这个**create-matcher.js**就容易实现了，只需要简单的调用它即可
>
> 这个模块返回了两个方法
>
> *   **match** : 根据路由路径创建路由规则对象，之后就可以通过 规则对象获取到所有的路由信息然后拿到所有的组件进行创建
> *   **addRoutes** : 添加动态路由

 ```javascript
import createRouteMap from './create-route-map'


export default function createMatcher(router) {


  const { pathList, pathMap } = createRouteMap(router)

  function match(path) {

  }

  function addRoutes(router) {

    createRouteMap(router, pathList, pathMap)
  }

  return {
    match,
    addRoutes,
  }
}
```

> 然后在**index.js**也就是**Vue Router**的构造中使用 **createMatcher.** 使用**this.matcher**接收

```javascript
import install from './install'

import createMatcher from './create-matcher'


export default class VueRouter {

  constructor(options) {

    this._routes = options.routes || \[\]

    this.matcher = createMatcher(this._routes)
  }

  init(Vue) {}
}

VueRouter.install = install
```



5.编写 createMatcher
------------------

> 看见上面在 **createMatcher**中定义了 一个**match**了吗，
>
> **match**是 从**pathMap** 根据**path**获取 相应的路由记录
>
> 上面还没有去实现，现在来实现它
>
> 需要实现它的话还需要编写个 **createRoute** 方法，我这里写在 **uitl/route.js**模块里

 ```javascript
\*
 \* @param {*} record 传过来的记录
 \* @param {*} path 路由地址
 \* @returns
 */
export default function createRoute(record, path) {

  const matched = \[\]



  while (record) {

    matched.unshift(record)

    record = record.parent
  }

  return {
    path,
    matched,
  }
}
```

> 上面编写了 **createRoute**方法我们就可以在 **create-mathcer.js** 调用 来获取到记录了
>
> 然后再 **create-mathcer.js**中继续 完善 **match**方法

 ```javascript
import createRouteMap from './create-route-map'

import createRoute from './util/route'


export default function createMatcher(router) {


  const { pathList, pathMap } = createRouteMap(router)

  function match(path) {

    const record = pathMap\[path\]

    if (record) {
      return createRoute(record, path)
    }
    return createRoute(null, path)
  }

  function addRoutes(router) {

    createRouteMap(router, pathList, pathMap)
  }

  return {
    match,
    addRoutes,
  }
}
```

6.历史记录的处理 History
-----------------

> 在 **history**目录下新建一个 **base**模块用来编写 父类
>
> 这个父类有 **hash** 模式 和 **history**(html5) 模式共同的方法
>
> 这里就主要演示下 **hash** 模式的代码

 ```javascript
import createRoute from '../util/route'


export default class History {

  constructor(router) {

    this.router = router

    this.current = createRoute(null, '/')
  }


  transitionTo(path, onComplete) {



    this.current = this.router.matcher.match(path)

    onComplete && onComplete()
  }
}
```

> 编写 **HashHistory** 模式 继承 **History**

 ```javascript
import History from './base'


export default class HashHistory extends History {
  constructor(router) {
    super(router)

    ensuerSlash()
  }

  setUpListener() {

    window.addEventListener('hashchange', () => {

      this.transitionTo(this.getCurrentLocation())
    })
  }

  getCurrentLocation() {

    let href = window.location.href
    const index = href.indexOf('#')

    if (index < 0) return ''

    href = href.slice(index + 1)
    return href
  }
}


function ensuerSlash() {

  if (window.location.hash) {
    return
  }

  window.location.hash = '/'
}
```

> 关于 **html5**模式 这里 就没写了
>
> 然后回到 **index.js** 就是自己写的 **Vue Router**中继续编写模式判断
>
> 最后就是 初始化 init方法

 ```javascript
import install from './install'

import createMatcher from './create-matcher'

import HashHistory from './history/hash'

import HTML5History from './history/html5'


export default class VueRouter {

  constructor(options) {

    this._routes = options.routes || \[\]

    this.matcher = createMatcher(this._routes)

    this.mode = options.mode || 'hash'

    switch (this.mode) {
      case 'history':
        this.history = new HTML5History(this)
        break
      case 'hash':


        this.history = new HashHistory(this)
        break
      default:
        throw new Error('该模式不存在')
    }
  }

  init(Vue) {

    const history = this.history

    history.transitionTo(history.getCurrentLocation, () =>

      history.setUpListener()
    )
  }
}

VueRouter.install = install
```

7.定义一个响应值 _route
----------------

> 渲染不同路由页面有个前提的就是需要一个表示 当前路由 响应式的属性
>
> 所以我们来到 **install.js** 添加一个响应式的 属性**_route**
>
> 和这个无关的代码 `...`省略

 ```javascript
export let _Vue = null

export default function install(Vue) {
  _Vue = Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        ...



        Vue.util.defineReactive(this, '\_route', this.\_router.history.current)
      } else {
        ...
      }
    },
  })
}
```

> 然后得回到 **history**下面的 **base** 添加一个修改响应式 **_route**的值的回调 **this.cb**

 ```javascript
import createRoute from '../util/route'

export default class History {
  constructor(router) {
    ...

    this.cb = null
  }

  listen(cb) {
    this.cb = cb
  }

  transitionTo(path, onComplete) {
	...

    this.cb && this.cb(this.current)
	...
  }
}
```

> 最后在 **index.js** 的 **init** 调用 listen 方法 传入回调修改 响应式值**_route**

 ```javascript
...

export default class VueRouter {
  ...
  init(Vue) {
    ...

    history.listen((route) => {
      Vue._route = route
    })
  }
}
...
```



8.添加 `$router` 和 `$route`
-------------------------

> 我们知道在 **Vue Router** 提供了 **`$router`** (这个是路由对象是**`Vue Router`**的实例) 还有 **$route**(路由规则对象)
>
> 我们自己可以来到 `install.js` 中进行 添加这两个属性

 ```javascript
...
export default function install(Vue) {
  ...

  Object.defineProperty(Vue.prototype, '$router', {
    get() {


      return this.\_routerRoot.\_router
    },
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get() {

      return this.\_routerRoot.\_route
    },
  })
}
```

9.router-link
-------------

> 基本的介绍就不多说了，之前也是有介绍的。然后现在重新来实现下
>
> 在 **components** 文件下新建 **link.js**

 ```javascript
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },

  render(h) {

    return h(

      'a',

      {
        domProps: {
          href: '#' + this.to,
        },
      },

      \[this.$slots.default\]
    )
  },
}
```

10.router-view
--------------

> 在 **components** 文件下新建 **view.js** 具体步骤干了什么都写在注释里了

 ```javascript
export default {
  render(h) {

    const route = this.$route

    let depth = 0

    this.routerView = true

    let parent = this.$parent

    while (parent) {

      if (parent.routerView) {
        depth++
      }

      parent = parent.$parent
    }






    const record = route.matched\[depth\]

    if (!record) {
      return h()
    }

    const component = record.component

    return h(component)
  },
}
```



> 好了到了这里 **Vue Router**的第二次编写就完成了，虽然和官方的差距很大。。额，因为这里是简化写的

11.文件目录
-------

> 忘了最后贴上文件的目录

![image-20210723215447677](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3271178c386347b49ab772f2c088bf67~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 这个模拟**Vue Router**的**demo** 放在了 **github**,有需要的可以这里 [MyVueRouter](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FLianTianNo1%2Fmy_vue_router "https://github.com/LianTianNo1/my_vue_router")
>
> 到了这里也只是仅仅实现了 **VueRouter**的一小部分功能
>
> 但是大体上的功能都差不多实现了，嵌套路由 添加动态路由也实现了
>
> 其实我觉得到这里了也可以了,不过还是得继续加油学习
