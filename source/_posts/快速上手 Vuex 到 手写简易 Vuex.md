---
title: 快速上手 Vuex 到 手写简易 Vuex
date: 2021-08-09 02:11:14
updated: 2021-08-09 02:11:14
tags: [Vue, Vuex]
categories: [前端]
---

## 快速上手 Vuex 到 手写简易 Vuex

原文：https://juejin.cn/post/6994337441314242590

> 前言

首先感谢各位这段时间对小浪的支持，小浪会继续努力的

今天本篇文章是关于 `Vuex`，大家使用 `Vue` 不会陌生吧

今天我们先对 `Vuex` 进行了解，然后讲下基本的用法，然后我们自己实现一个简易的 `Vuex`

最后希望大家能给小浪一个 **赞**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59bed0b088244e09ac9f88194d1dd7d0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 往期精彩：
>
> [从了解到深入虚拟 DOM 和实现 diff 算法](https://juejin.cn/post/6990582632270528525 "https://juejin.cn/post/6990582632270528525")
>
> [手写一个简易 vue 响应式带你了解响应式原理](https://juejin.cn/post/6989106100582744072 "https://juejin.cn/post/6989106100582744072")
>
> [从使用到自己实现简单 Vue Router 看这个就行了](https://juejin.cn/post/6988316779818778631 "https://juejin.cn/post/6988316779818778631")
>
> [前端面试必不可少的基础知识，虽然少但是你不能不知道](https://juejin.cn/post/6983934602196811789 "https://juejin.cn/post/6983934602196811789")

## 1.简介

> **Vuex** 状态管理插件

在`Vue` 最重要就是 **数据驱动** 和 **组件化**，每个 组件都有自己 `data` ,`template` 和 `methods`, `data`是数据，我们也叫做状态，通过`methods`中方法改变 状态来更新视图，在单个组件中修改状态更新视图是很方便的，但是实际开发中是多个组件（还有多层组件嵌套）共享同一个状态时，这个时候传参就会很繁琐，我们这里就引进 `Vuex` 来进行状态管理，负责组件中的通信，方便维护代码

> Vuex 主要解决的问题

- 多个视图依赖同一个状态
- 来自不同视图的行为需要变更同一个状态

> 使用 Vuex 的好处

- 能够在 `vuex` 中集中管理共享的数据，易于开发和后期维护
- 能够高效地实现组件之间的数据共享，提高开发效率
- 在 `vuex` 中的数据都是响应式的

## 2.Vuex 基础使用

> 首先在 Vue 中添加 Vuex 插件

通过 `vue-cli` 添加了 `Vuex` 后，在项目的 `src` 目录下会多出一个 `store` 目录，目录下会有个 `index.js`

当然也通过 `npm` 进行安装 `Vuex`

```bash
npm install vuex --save
```

> 在开发环境开启严格模式 这样修改数据 就必须通过 mutation 来处理

在 package.json 文件 scripts 中可以设置环境，当我们处于开发环境时，可以开启严格模式

开启严格模式的方式也是很简单的一行代码就可以

`strict:products.env.NODE_ENV !== 'production'`

```java
import Vue from 'vue'

import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({

 strict:products.env.NODE_ENV !== 'production',

 state: {
 },

 mutations: {
 },

 actions: {
 },

 modules: {
 }
})
```

> 要使用 store 就在把 store 挂载到 Vue 中

把 store 挂载到 Vue 之后 ，所有的组件就可以直接从 store 中获取全局数据了

```javascript
import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
```

### 1.state

> 在 state 中添加数据

我们需要共享的状态都放在写在 state 对象里面

```js
import Vue from "vue";

import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: "张三",
    age: 21,
  },
  mutations: {},
  actions: {},
  modules: {},
});
```

> 组件中获取 state 中的数据

获取到 `state` 有两种方式

#### 1.直接使用 `this.$store.state\[属性\]` ，（`this` 可以省略）

```js
<template>
  <div id="app">
    {{ this.$store.state.name }}
    {{ this.$store.state.age }}
  </div>
</template>
```

#### 2.使用 `mapState`

通过 `mapState`把 `store` 映射到 组件的计算属性，就相当于组件内部有了 `state` 里的属性

知道这里为啥要用 `...`展开吗，到时候实现 `mapState` 时就知道了

```js
<template>
  <div id="app">
    {{ name }}
    {{ age }}
  </div>
</template>

<script>


import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {

    ...mapState(\['name', 'age'\])
  }
}
</script>

<style  scoped>
</style>
```

> 注意

当 store 中的值 和 当前组件有相同的状态，我们可以在 mapState 方法里传递一个对象 而不是一个数组，在对象中给状态起别名

```js
computed: {

    ...mapState({ name2: 'name', age2: 'age'}\])
}
```

### 2.Mutation

`Store` 中的状态不能直接对其进行操作，我们得使用 `Mutation` 来对 `Store` 中的状态进行修改，虽然看起来有些繁琐，但是方便集中监控数据的变化

`state` 的更新必须是 `Mutation` 来处理

> 我们现在 mutaions 里定义个方法

如果想要定义的方法能够修改 `Store` 中的状态，需要参数就是 `state`

```js
import Vue from 'vue'

import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
 state: {
   name: '张三',
   age: 21,
 },
 mutations: {


    \*
    \* @param {*} state 第一个参数是 Store 中的状态(必须传递)
    \* @param {*} newName 传入的参数 后面是多个
    */
   changeName(state, newName) {

     state.name = newName
   },
 },
 actions: {},
 modules: {},
})
```

> 在组件中使用 mutations 中的方法

同样有两种方法在组件触发 `mutations` 中的方法

#### 1.this.$store.commit() 触发

在 `methods` 中定义一个方法，在这个方法里面进行触发 `mutations` 中的方法

```js
<template>
  <div id="app">
    <button @click="handleClick">方式1 按钮使用 mutation 中方法</button>
    {{ name }}
  </div>
</template>

<script>


import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {

    ...mapState(\['name', 'age'\])
  },
  methods: {
    handleClick() {

      this.$store.commit('changeName', '小浪')
    }
  },
}
</script>

<style  scoped>
</style>
```

#### 2.使用 `mapMutations`

```js
<template>
  <div id="app">
    <button @click="changeName('小浪')">方式2 按钮使用 mutation 中方法</button>
    {{ name }}
  </div>
</template>

<script>


import { mapState, mapMutations } from 'vuex'
export default {
  name: 'App',
  computed: {

    ...mapState(\['name', 'age'\])
  },
  methods: {

    ...mapMutations(\['changeName'\])
  },
}
</script>

<style  scoped>
</style>
```

### 3.Action

> `Action` 和 `Mutation` 区别

`Action` 同样也是用来处理任务，不过它处理的是异步任务，异步任务必须要使用 `Action`，通过 `Action` 触发 `Mutation` 间接改变状态，不能直接使用 `Mutation` 直接对异步任务进行修改

> 先在 `Action` 中定义一个异步方法来调用 `Mutation` 中的方法

```js
import Vue from 'vue'

import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
 state: {
   name: '张三',
   age: 21,
 },
 mutations: {


    \*
    \* @param {*} state 第一个参数是 Store 中的状态(必须传递)
    \* @param {*} newName 传入的参数 后面是多个
    */
   changeName(state, newName) {

     state.name = newName
   },
 },
 actions: {

    \*
    \* @param {*} context 上下文默认传递的参数
    \* @param {*} newName 自己传递的参数
    */

   changeNameAsync(context, newName) {

     setTimeout(() => {

       context.commit('changeName', newName)
     }, 2000)
   },
 },
 modules: {},
})
```

在组件中是 Action 中的异步方法也是有两种方式

#### 1.`this.$store.dispatch()`

```js
<template>
  <div id="app">
    <button @click="changeName2('小浪')">方式1 按钮使用 action 中方法</button>
    {{ name }}
  </div>
</template>

<script>


import { mapState, mapMutations } from 'vuex'
export default {
  name: 'App',
  computed: {

    ...mapState(\['name', 'age'\])
  },
  methods: {
    changeName2(newName) {

      this.$store.dispatch('changeNameAsync', newName)
    }
  },
}
</script>

<style  scoped>
</style>
```

#### 2.使用 `mapActions`

```js
<template>
  <div id="app">
    <button @click="changeNameAsync('小浪')">
      方式2 按钮使用 action 中方法
    </button>
    {{ name }}
  </div>
</template>

<script>


import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'App',
  computed: {

    ...mapState(\['name', 'age'\])
  },
  methods: {

    ...mapActions(\['changeNameAsync'\])
  },
}
</script>

<style  scoped>
</style>
```

### 4.Getter

> 简介

`Getter` 类似于计算属性，但是我们的数据来源是 `Vuex` 中的 `state` ,所以就使用 `Vuex` 中的 `Getter` 来完成

> 应用场景

需要对 `state` 做一些包装简单性处理 展示到视图当中

> 先来写个 Getter

```js
import Vue from 'vue'

import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
 state: {
   name: '张三',
   age: 21,
 },
 getters: {


    \*
    \* @param {*} state 状态 如果要使用 state 里面的数据，第一个参数默认就是 state ，名字随便取
    \* @returns
    */
   decorationName(state) {
     return `大家好我的名字叫${state.name}今年${state.age}岁`
   },
 },
})
```

当然 `Getter` 也有两种方式导入

#### 1.`this.$store.getters\[名称\]`

```js
<template>
  <div id="app">
    {{ this.$store.getters.decorationName }}
  </div>
</template>
```

#### 2.使用 `mapGetters`

```js
<template>
  <div id="app">
    {{ decorationName }}
  </div>
</template>

<script>


import { mapGetters } from 'vuex'
export default {
  name: 'App',
  computed: {

    ...mapGetters(\['decorationName'\])
  },
}
</script>
```

### 5.Module

为了避免在一个复杂的项目 `state` 中的数据变得臃肿，`Vuex` 允许将 `Store` 分成不同的模块，每个模块都有属于自己的 `state`，`getter`，`action`，`mutation`

> 我们这里新建一个 `animal.js` 文件

```js
const state = {
  animalName: "狮子",
};
const mutations = {
  setName(state, newName) {
    state.animalName = newName;
  },
};

export default {
  state,
  mutations,
};
```

> 在 `store/index.js`中的 `modules` 进行挂载这个模块

```js
import Vue from "vue";

import Vuex from "vuex";

import animal from "./animal";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    animal,
  },
});
```

> 然后我们就可以在组件中使用了

```js
<template>
  <div id="app">
    {{ this.$store.state.animal.animalName }}
    <button @click="$store.commit('setName', '老虎')">改名</button>
  </div>
</template>
```

`$store.state\[在module中挂载的模块名\]\[挂载的模块里的属性\]`

是不是觉得这种模式很复杂

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2984822b759a4bb8a8c04c4748c5f9f2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 添加命名空间

其实也可以使用 `mapXXX` 方法进行映射，不过写法有些许不同，先在导出的添加一个**命名空间**`namespaced: true`

```js
const state = {
  animalName: "狮子",
};
const mutations = {
  setName(state, newName) {
    state.animalName = newName;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
```

> 方式 2

```js
<template>
  <div id="app">
    {{ animalName }}
    <button @click="setName('老鹰')">改名</button>
  </div>
</template>

<script>


import { mapState, mapMutations } from 'vuex'
export default {
  name: 'App',
  computed: {


    ...mapState('animal', \['animalName'\])
  },
  methods: {


    ...mapMutations('animal', \['setName'\])
  },
}
</script>
```

## 3.模拟一个简单的 Vuex

上面我们已经介绍了 `Vuex` 的基本使用，现在我们来自己动手写个简单 `Vuex`

代码我都会写满注释方便大家观看，代码很少，有兴趣，大家耐心观看 ヽ(￣ ▽ ￣)ﾉ

### 1.index.js

> 先搭个基本的架子

我们在 `src` 目录下 建立一个属于我们自己的 `Vuex` 的文件夹，并且在这个目录下添加一个 `index.js` 文件，我们要模拟的这个 `Vuex` 就会放在这里面

```js
let _Vue = null;

class Store {
  constructor(options) {}
}

function install(Vue) {}

export default {
  install,
  Store,
};
```

### 2.install 方法

> 因为 Vuex 插件 需要 Vue.use() 安装，所以我们必须要有个 install 方法，第一个参数 传入 Vue

```js
function install(Vue) {
  _Vue = Vue;

  _Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        _Vue.prototype.$store = this.$options.store;
      }
    },
  });
}
```

> 3.我们继续来实现 `Store` 类

先完成基础的 构造方法

```js
let _Vue = null


class Store {

 constructor(options) {

   const state = options.state || {}
   const mutations = options.mutations || {}
   const actions = options.actions || {}
   const getters = options.getters || {}
}
```

接着，我们来实现 `state`,`getters`,`mutations`,`actions`,`commit`,`dispatch` 吧

( ﾟ ▽ ﾟ)/

### 3.state

是不是超简单，直接调用 `Vue` 的 `observable` 把 `state` 变成响应式

```js
class Store {
  constructor(options) {
    this.state = _Vue.observable(state);
  }
}
```

### 4.getters

为每一个 `getters` 里面的 方法添加了一个 `get`

```js
class Store {
 constructor(options) {



   this.getters = Object.create(null)


   Object.keys(getters).forEach((key) => {


     Object.defineProperty(this.getters, key, {

       get: () => {

         return getters\[key\].call(this, this.state)
       },
     })
   })
 }
}
```

### 5.mutations

这里改变 `this` 指向

```js
class Store {
 constructor(options) {



   this.mutations = {}
   Object.keys(mutations).forEach((key) => {
     this.mutations\[key\] = (params) => {

       mutations\[key\].call(this, this.state, params)
     }
   })
 }
}
```

### 6.actions

其实呢，和上面的 `mutations` 处理方式差不多，不过参数 传递的不一样，需要传递 上下文 `context` 也就是 `Store` 的一个实例，这里就是 `this`

```js
class Store {
 constructor(options) {



   this.actions = {}
   Object.keys(actions).forEach((key) => {
     this.actions\[key\] = (params) => {

       actions\[key\].call(this, this, params)
     }
   })
 }
}
```

### 7.commit

```js
class Store {
 constructor(options) {

 }



 commit = (eventName, params) => {
   this.mutations\[eventName\](params)
 }
}
```

### 8.dispatch

`dispatch` 和 `commit` 实现差不多

```js
class Store {
 constructor(options) {

 }



 dispatch = (eventName, params) => {
   this.actions\[eventName\](params)
 }
}
```

好了，到了这里差不多，一个丐版的 `Vuex` 就这样诞生了，我们写个例子去测试下吧

### 9.测试例子

> 先导入我们自己写的 `Vuex`

```js
import Vue from "vue";

import Vuex from "../my-vuex/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: "张三",
    age: 21,
  },
  mutations: {
    changeName(state, newName) {
      state.name = newName;
    },
  },
  actions: {
    changeNameAsync(context, newName) {
      setTimeout(() => {
        context.commit("changeName", newName);
      }, 2000);
    },
  },
  getters: {
    decorationName(state) {
      return `大家好我的名字叫${state.name}今年${state.age}岁`;
    },
  },
});
```

> 一个简单的 `vue` 组件

```js
<template>
  <div id="app">
    <h1>我是 state 测试：{{ this.$store.state.name }}</h1>
    <h1>我是 getters 测试:{{ this.$store.getters.decorationName }}</h1>
    <button @click="$store.commit('changeName', 'mutations 按钮')">
      mutations 按钮
    </button>
    <button @click="$store.dispatch('changeNameAsync', 'actions 按钮')">
      actions 按钮
    </button>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style  scoped>

</style>
```

> 在 mian.js 还是之前一样的挂载没改

```js
import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
```

> 例子预览

![27](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cd6338c699643dc9ca1b853d7749170~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

到了这里并不是结束了，不如简单实现一下 几个 `mapXXX` ,实现起来都差不多

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df85a4edd845442292c66c3fc9fff38d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 10.mapSate

`...mapSate(\['age',\['name'\]\])` ,最后 `computed` 得到的就是 `age`: `21`, `name` : `'张三'` 这样，就可以在 组件中直接使用了

```js
const mapState = (params) => {

  if (!Array.isArray(params))
    throw new Error('抱歉，当前是丐版的Vuex，只支持数组参数')

  let obj = {}


  params.forEach((item) => {
    obj\[item\] = function() {
      return this.$store.state\[item\]
    }
  })
  return obj
}
```

### 11.mapMutations

```js
const mapMutations = (params) => {

  if (!Array.isArray(params))
    throw new Error('抱歉，当前是丐版的Vuex，只支持数组参数')

  let obj = {}


  params.forEach((item) => {
    obj\[item\] = function(params) {
      return this.$store.commit(item, params)
    }
  })
  return obj
}
```

### 12.mapActions

```js
const mapActions = (params) => {

  if (!Array.isArray(params))
    throw new Error('抱歉，当前是丐版的Vuex，只支持数组参数')

  let obj = {}


  params.forEach((item) => {
    obj\[item\] = function(params) {
      return this.$store.dispatch(item, params)
    }
  })
  return obj
}
```

### 13.mapGetters

```js
const mapGetters = (params) => {

  if (!Array.isArray(params))
    throw new Error('抱歉，当前是丐版的Vuex，只支持数组参数')

  let obj = {}


  params.forEach((item) => {
    obj\[item\] = function() {
      return this.$store.getters\[item\]
    }
  })
  return obj
}
```

### 14.导出和使用

> 最后就是导出

```js
export { mapState, mapMutations, mapActions, mapGetters };
```

> 使用方法和之前一样

```js
<template>
  <div id="app">
    <button @click="changeName('狗子')">mapMutations</button>
    <button @click="changeNameAsync('狗2子')">mapMutations</button>
    {{ decorationName }}
    {{ age }}
  </div>
</template>

<script>

import { mapState, mapMutations, mapActions, mapGetters } from './my-vuex/index'

export default {
  name: 'App',
  computed: {
    ...mapState(\['age'\]),
    ...mapGetters(\['decorationName'\])
  },
  methods: {
    ...mapMutations(\['changeName'\]),
    ...mapActions(\['changeNameAsync'\])
  },
}
</script>
...
</style>
```

## 3.结语

好了到了这里，关于 `Vuex` 本文就结束了，我们从 `Vuex` 是啥，怎么使用，动手实现一个简单 `Vuex` 我们都完成了，希望大家有所收获

下面把完成的我们模拟的 `Vuex` 代码贴出，欢迎大家，多多交流，有什么写错的地方，请大家指出

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7625b7e187b4616bb13da4653decfef~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 模拟 `Vuex` 完整代码

```js
let _Vue = null


class Store {

 constructor(options) {

   const state = options.state || {}
   const mutations = options.mutations || {}
   const actions = options.actions || {}
   const getters = options.getters || {}

   this.state = _Vue.observable(state)



   this.getters = Object.create(null)


   Object.keys(getters).forEach((key) => {


     Object.defineProperty(this.getters, key, {

       get: () => {

         return getters\[key\].call(this, this.state)
       },
     })
   })



   this.mutations = {}
   Object.keys(mutations).forEach((key) => {
     this.mutations\[key\] = (params) => {

       mutations\[key\].call(this, this.state, params)
     }
   })



   this.actions = {}
   Object.keys(actions).forEach((key) => {
     this.actions\[key\] = (params) => {

       actions\[key\].call(this, this, params)
     }
   })
 }




 commit = (eventName, params) => {
   this.mutations\[eventName\](params)
 }




 dispatch = (eventName, params) => {
   this.actions\[eventName\](params)
 }
}



function install(Vue) {

 _Vue = Vue

 _Vue.mixin({


   beforeCreate() {


     if (this.$options.store) {

       _Vue.prototype.$store = this.$options.store
     }
   },
 })
}


const mapState = (params) => {

 if (!Array.isArray(params))
   throw new Error('抱歉，当前是丐版的Vuex，只支持数组参数')

 let obj = {}


 params.forEach((item) => {
   obj\[item\] = function() {
     return this.$store.state\[item\]
   }
 })
 return obj
}


const mapMutations = (params) => {

 if (!Array.isArray(params))
   throw new Error('抱歉，当前是丐版的Vuex，只支持数组参数')

 let obj = {}


 params.forEach((item) => {
   obj\[item\] = function(params) {
     return this.$store.commit(item, params)
   }
 })
 return obj
}


const mapActions = (params) => {

 if (!Array.isArray(params))
   throw new Error('抱歉，当前是丐版的Vuex，只支持数组参数')

 let obj = {}


 params.forEach((item) => {
   obj\[item\] = function(params) {
     return this.$store.dispatch(item, params)
   }
 })
 return obj
}


const mapGetters = (params) => {

 if (!Array.isArray(params))
   throw new Error('抱歉，当前是丐版的Vuex，只支持数组参数')

 let obj = {}


 params.forEach((item) => {
   obj\[item\] = function() {
     return this.$store.getters\[item\]
   }
 })
 return obj
}

export { mapState, mapMutations, mapActions, mapGetters }


export default {
 install,
 Store,
}
```
