---
title: 还不会Vue3？一篇笔记带你快速入门
date: 2021-09-11 09:11:12
updated: 2021-09-11 09:11:12
categories: [前端]
tags: [Vue3, Composition API]
---
## 还不会Vue3？一篇笔记带你快速入门

原文：https://juejin.cn/post/7006518993385160711

> 前言：

一直都没有去接触 Vue3，在之前暑假的时间，就趁这个机会去好好的学习一下，这篇文章就是我之前学习 Vue3 做的笔记，做笔记一方面让自己更加理解和掌握新的特性这些知识点，另一方面也希望能让大家入门Vue3，自己学到了才是赚到了，结语注明参考资料

Vue3简介
------

**面临的问题**：随着功能的增长，复杂组件的代码变得难以维护，`Vue3` 就随之而来，`TypeScript` 使用的越来越多，`Vue3`就是 `TS` 写的所以能够更好的支持 `TypeScript`

在这里介绍就这么简单

`vue2` 的绝大多数的特性 在 `Vue3` 都能使用，毕竟 `Vue` 是渐进式的

响应式原理进行使用 `Proxy` 实现，`v-model` 可以传参了等等新特性

基础工作
----

使用`Vue3`的话，那么必须通过使用构建工具创建一个 `Vue3` 项目

### 安装 vue-cli

```bash
npm install -g @vue/cli

yarn global add @vue/cli
```

### 创建一个项目

使用 `create` 命令行创建 或者 用 `ui` 可视化创建

大家用 `Vue` 都用了这么久，我就不一一说怎么去创建了

```bash
vue create 项目名

vue ui
```

当然也可以选择 `vite` ，`vite` 创建的速度比 上面的方法快了一些

```bash
npm init vite-app 项目名
cd 项目名
npm install
npm run dev
```

Vue3入门
------

### `Composition API`

> `Vue3` 提出了 `Composition API`

在 **Vue2.X** 我们使用的是 **OptionAPI** 里面有我们熟悉的 `data`、`computed`、`methods`、`watch`...

在 `Vue3` 中，我们依旧可以使用 **OptionAPI**当然不建议 和 `Vue3` 混用

在 `Vue2` 中，我们实现一个功能得分到不同的地方，把数据放在 `data` ,`computed` 方法放在 `methods` 里面，分开的太散乱了，几个功能还好，几十个上百个，那就有点...

所以 `Vue3` 提出了 **Composition API** ，它可以把 `一个逻辑的代码都收集在一起` 单独写个`hook`,然后再引入，这样就不到处分布，显得很乱了

### `Fragment`

> 在 `template` 中不再需要一个根元素包裹

```html
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
</template>
```

实际上内部会将多个标签包含在一个`Fragment`虚拟元素中

好处: 减少标签层级, 减小内存占用

### `script` 差异

> 来看看 `script` 和 `Vue2` 的区别

```js
<script lang="ts">
import { defineComponent} from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    return {

    }
  },
})
</script>
```

*   可以再 `script` 使用 `ts` 只需 设置 `lang` 即可
*   `defineComponent` 方法创建一个组件
*   `export default` 直接导出一个组件

### `setup`

> `setup` 是 `Composition API`的入口

#### `setup` 执行顺序

它在`beforeCreate`**之前执行一次**，`beforeCreate`这个钩子 的任务就是初始化，在它之前执行，那么 `this` 就没有被初始化 `this = undefined` 这样就不能通过 `this` 来调用方法 和 获取属性

![image-20210811132514039](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b06890efbd304516b23df723ad9352dd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### `setup` 返回值

`setup` 返回的是一个**对象**，这个对象的属性会与组件中 `data` 函数返回的对象进行**合并**，返回的方法和 `methods` 合并，合并之后直接可以在模板中使用，如果有重名的情况，会使用 `setup` 返回的**属性**和**方法**，`methods` 和 `data` 能够拿到 `setup` 中的方法应该进行了合并，反之 `setup` 不能拿到它们的属性和方法，因为这个时候 `this` = `undefined`

![image-20210811134028917](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8635a4c729ac41d281020edc5c9569e9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### `Suspense` 组件

> `setup` 使用 `async`/`await`

我们需要 `setup` 返回数据那么它肯定就不能使用 `async` 修饰，这样返回 `promise` 是我们不想看见情况，如果我们硬要用 `async` 修饰，我们就得用的在它的父组件外层需要嵌套一个`suspense`(不确定)内置组件，里面放置一些不确定的操作，比如我们就可以把异步组件放入进去

##### 1.子组件

```html
<template>
  {{ res }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Son',
  async setup() {
    const res = await axios.get('地址')
    return {
      res,
    }
  },
})
</script>
```

##### 2.父组件

```html
<template>
    <Suspense>

        <Son></Son>
    </Suspense>
</template>
```

#### `setup` 参数

> `setup`(`props`, `context`)

`setup` 函数中的第一个参数是 `props`。它接收父组件传递的值，是的就是父子组件信息传递的 `props`

第二个参数是 `context` 里面包含3个属性 `{ attrs, slots, emit }`，这三个属性大家看名字就应该知道是什么吧 分别对应 `this.$attrs`，`this.$slots`，`this.$emit`

*   `attrs`: 除了 `props` 中的其他属性
*   `slots`: 父组件传入插槽内容的对象
*   `emit`: 和用于父子组件通信

### `ref`

> 定义/转为 响应式

在上面 `setup` 写的数据都**不是响应式的**，修改了数据，视图并不会更新

在 `Vue3` 中提供了两种方式定义响应式数据，先来介绍下 `ref`

导入 `ref` 方法

```js
import { defineComponent, ref } from 'vue'
```

*   你可以先声明一个**基本类型**变量后再当做 `ref` 的形参穿进去
*   或者直接在 `ref` 中传入

 ```js
setup() {

    let number1 = ref(10)
    let num = 0

    let number2 = ref(num)
    return {}
  },
```

来查看一下 `number1` 是什么吧

![image-20210811183344632](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6225b7f5b79d4f4cb1431c64518be657~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看见的是 `number1` 是一个 `Ref` 对象，我们设置的 `10` 这个值在这个对象的 `value` 属性上

也就是说我们修改的时候必须要修改的是 `number1.value`

通过给`value`属性添加 `getter`/`setter` 来实现对数据的劫持

但是在模板上使用的时候 不用写 `number1.value` 直接写 `number1` 即可

在模板编译的时候回自动加上 `value`

```html
<template>
  {{ number1 }}
  <button @click="updateNum">+</button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Son',
  setup() {
    let number1 = ref(10)


    function updateNum() {
      number1.value++
    }
    return {
      number1,
      updateNum,
    }
  },
})
</script>
```

![35](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5b9e88c52c84261aa28e6cc5cd74bf5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

使用起来完全没有问题

刚才强调了说 `ref` 接收 基本类型的数据，那么它可以接收 复杂类型吗，`object` 类型等，当然可以

给 `ref` 传入复杂类型，其实它是调用 `reactive` 来实现的

`reactive` 下面会提到

### `ref` 获取元素

同样的 `ref` 还可以用了获取元素

大家在 `Vue2.X` 中是怎么获取的呢，先在 标签上定义 `:ref='XXX'` 然后 `this.$refs.XXX` 来获取

在 `Vue3` 上获取元素就有些许不同了

> 1.首先在 模板元素上 `ref='XXX'` 这里不用 `v-bind`

```html
<template>
  <div id="haha" ref="haha"></div>
</template>
```

> 2.在 `setup` 中

得给 `ref` 指定类型 `HTMLElement`

```js
setup() {
  let haha = ref<HTMLElement|null>(null)
  console.log(haha)

  return {
    haha,
  }
},
```

如果在组件中需要使用到 `haha` ，就必须把 `haha``return` 出去合并 `data`

我们来看看打印的是什么

![image-20210811230220185](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c17d2e13f4941d7a37281eef673cfcf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看见的是 `haha` 是个 `Ref` 对象，`value` 值就是我们想要获取到的元素

然后我们可以对 `haha` 这个 `DOM` 元素进行操作，比如这个

```js
haha.style.fontSize = '20px'
```

### `reactive`

`reactive` 接收一个普通对象然后返回该普通对象的响应式`代理对象`

没错 它的底层就是使用 `Proxy` 进行代理

> 简单写个Vue3响应式例子来说下 `Proxy`

`new Proxy(target, handler)`

*   `target` ：要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
*   `handler`：一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 `p`

```js
let data = {
    msg: '',
    age: '',
}


let vm = new Proxy(data, {



    get(target, key) {
        return target\[key\]
    },


    set(target, key, newValue) {

        if (target\[key\] === newValue) return

        target\[key\] = newValue
        document.querySelector('#app').textContent = target\[key\]
    },
})
```

> `reactive` 基础用法

导入，当然写的时候，`vscode` 会自动帮你引入

```js
import { defineComponent, reactive } from 'vue'
```

简单使用

```js
setup() {
    let obj = reactive({
        name: '小浪',
        age: 21,
    })
    return {
        obj,
    }
}
```

来看看返回的 `Proxy` 对象吧

![image-20210811191209064](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/596efb4256c74cc19feb6f6b365bdb90~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

数据都在 `target` 中，

在模板使用直接 `{{obj.name}}` 即可

修改直接修改 `obj\[name\]``=``‘xxx’`

操作代理对象,obj中的数据也会随之变化，同时如果想要在操作数据的时候,界面也要跟着重新更新渲染,那么也是操作代理对象

> 响应式的数据是深层次的（递归深度响应式）

对于多层嵌套的数据也是响应式的

```js
setup() {
    let obj = reactive({
        name: '小浪',
        age: 21,
        phone: {
            p_name: '小米',
            p_apps: {
                app_name: '小米运动',
            },
        },
    })
    function upadateName() {
        obj.phone.p\_apps.app\_name = '掘金'
    }
    console.log(obj)

    return {
        obj,
        upadateName,
    }
},
```

![36](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa30d692e14e40cf962235006245e4c5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> `shallowReactive`

它是一个简单的 reactive ，只把第一层的对象改为响应式，这里就不多说了

> 使用 `ref` 传入对象

```js
setup() {
    let obj = ref({
        name: '小浪',
        age: 21,
    })
    console.log(obj)

    return {
        obj,
    }
}
```

![image-20210811191739873](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/782b587ab1384163a505b3694b4eaab8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

实际上是 `ref` 使用 `reactive` 来进行操作的

### `toRefs`

这个方法可以把 `reactive` 响应式对象，转化为 普通对象，普通对象的每个属性都是 `Ref` 对象，这样的话保证了 `reactive` 的每个属性还是响应式的，我们还可以把每个属性进行分解使用，这样在组件就不用 **obj\[属性\]**，代码量减轻了，yyds

```js
setup() {
  const user = reactive({
    name: '小浪',
    age: 21,
  })

  let userObj = toRefs(user)
  console.log(userObj)

  return {}
}
```

![image-20210811223510320](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d44ff7b5950843c781ead5e0d1d64f2b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看见 `name` 和 `age` 已经变成了 `Ref` 对象

我们可以解构 出 `name` 和 `age` 单独使用

```js
setup() {
  const user = reactive({
    name: '小浪',
    age: 21,
  })

  let userObj = toRefs(user)

  return {
    ...userObj,
  }
}
```

### `toRef`

还有一个 `toRef` 方法，它的作用和 `toRefs` 差不多，但是它只能把响应式对象/普通对象的**某一个**属性变为 `Ref` 对象

> 可以用来为源响应式对象上的 `property` 性创建一个 `ref`。然后可以将 `ref` 传递出去，从而保持对其源 `property` 的响应式连接。

```js
export default {
  setup(props) {
    useSomeFeature(toRef(props, 'foo'))
  }
}

function useSomeFeature(foo: Ref) {

}
```

拷贝了一份新的数据值单独操作, 更新时相互不影响

当您要将 `prop` 的 `ref` 传递给复合函数时，`toRef` 很有用

可以从官方文档看出，用于在于组件之前的传递数据 从 `props` 拿出 `'foo'` 属性给复合函数，复合函数 `useSomeFeature`，接收的参数 `foo` 为 `Ref` 类型，刚好可以使用`toRef` 来进行转化

### 判断响应式

> 几个判断是否哪种响应式创建的方法

1.`isRef`: 检查一个值是否为一个 ref 对象

```js
let ref1 = ref(1)
console.log(isRef(ref1))
```



2.`isReactive`: 检查一个对象是否是由 `reactive` 创建的响应式代理

```js
let ref2 = reactive({name: '小浪'})
console.log(isReactive(ref2))
```



3.`isReadonly`: 检查一个对象是否是由 `readonly` 创建的只读代理

```js
let ref3 = readonly({name: '小浪'})
console.log(isReadonly(ref3))
```



4.`isProxy`: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理

```js
let ref2 = reactive({name: '小浪'})
console.log(isProxy(ref2))
let ref3 = readonly({name: '小浪'})
console.log(isProxy(ref3))
```



### `customRef`

上面提到了这么多的 `Ref` 都是 Vue 帮我们内置的，

我们可以通过 `customRef` 实现我们自己的 `Ref`

> 创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。它需要一个工厂函数，该函数接收 `track` 和 `trigger` 函数作为参数，并应返回一个带有 `get` 和 `set` 的对象。

官方文档给了一个防抖的例子，我们也写个来看

```js
<template>
  <h2>App</h2>
  <input v-model="keyword"/>
  <p>{{keyword}}</p>
</template>

<script lang="ts">
import {
  customRef
} from 'vue'


function useDebouncedRef<T>(value: T, delay = 200) {

  let timeout: number
  return customRef((track, trigger) => {
    return {
      get() {

        track()
        return value
      },
      set(newValue: T) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue

          trigger()
        }, delay)
      }
    }
  })
}

export default {
  setup () {
    const keyword = useDebouncedRef('')
    return {
      keyword
    }
  },
}
</script>
```



### `shallowRef` 和 `shallowReactive`

浅的响应式，一般用的不多，我们使用 `ref` 和 `reactive` 比较多

> `shallowReactive`

对象结构多层嵌套，但是我们的需求只需要修改最外层的数据，就不用把里面的嵌套结构都转为响应式，这样使用浅的响应式提高性能，只有最外一层是响应式

比较容易理解，我这就里就不举例子了

> `shallowRef`

我们之前说过 `ref` 也能传入一个对象，实际上还是调用 `reactive` 返回 `Proxy` 代理对象，如果内层还有对象，还是使用 `reactive` 进行处理

```js
ref({ name: '小明' })

reactive({ value: { name: '小明' } })
```

同样的 `shallowRef` 处理 对象类型，是交给 `shallowReactive` 去完成

```js
shallowRef({ name: '小明' })

shallowReactive({ value: { name: '小明' } })
```

这样子我们就明白了，为啥 只处理了 `value` 的响应式，不进行对象的 `reactive`处理，适用于会被替换的数据

`【注意】`：`shallowRef` 创建一个 `ref` ，将会追踪它的 `value` 更改操作，但是并不会对变更后的 `value` 做响应式代理转换

```js
setup() {
  let info1 = ref({
    name: '小浪',
    notebook: {
      name: '小米笔记本',
    },
  })
  let info2 = shallowRef({
    name: '小明',
    notebook: {
      name: '小米笔记本',
    },
  })

  console.log(info1, info2)
  return {
    info1,
    info2,
  }
},
```

我们来打印下两个对象

![image-20210812113721281](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d3bce8ea859452dbea0388766f8308c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看见的是 `Ref` 的 `value` 值是用 `reactive` 返回的 `Proxy` 对象，

`shallowRef` 的 `value` 是普通对象

### `readonly` 和 `shallowReadonly`

> `readonly` 深度只读

设置普通对象或者是响应式对象为只读，不能进行修改，看上面的名字就知道是深度的，深度是什么概念大家差不多都清楚，递归把内层的每一个属性都设置为只读，进行修改操作就会报错，提高了安全性

基本使用：

用什么就导入什么

```js
import { defineComponent, readonly } from 'vue'
```

果然在编译之前就报错了 `Error`: `无法分配到 "name" ，因为它是只读属性`

无论是内层还是外层都只读，是深度检测的

![image-20210812121429275](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44875ed772764e8c9ccbf2eefc863c0e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> `shallowReadonly` 浅度只读

浅度的话只针对最外面一层不关心 内层

可以看下面的例子 只有外层的 `name` 报错，修改内层没有错误

![image-20210812121747662](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6262c6d96b44fcdb7012bd7f8da863e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### `toRaw` 和 `markRaw`

> 这两个用的还是比较少

我这里就简单的过一下

> `toRaw`: 将一个响应式对象转为普通对象

简单使用：

```js
setup() {
  let info1 = reactive({
    name: '小浪',
    notebook: {
      name: '小米笔记本',
    },
  })
  const rawInfo = toRaw(info1)
  console.log(info1)
  console.log(rawInfo)

  return {}
},
```

![image-20210812123328497](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d99a9bfaa684c269495f99a48945ae7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

两个打印出来，一个是响应式对象，通过 `toRaw` 后变成了普通对象

> `markRaw`: 标记一个对象，让它永远不会转为响应式对象，返回值是本身

比如： 一些不变的数据死数据，还有一些第三方类实例，不用转为响应式对象，提高性能

简单使用：

这里使用 两个一样的对象，一个进行 `markRaw` 处理，一个不进行 `markRaw` 处理

然后同样使用 `reactive` 转为 响应式

```js
setup() {
  let obj = {
    name: '小浪',
    notebook: {
      name: '小米笔记本',
    },
  }

  let markRawObj = markRaw(obj)

  let reactObj = reactive(markRawObj)

  let obj2 = {
    name: '小浪',
    notebook: {
      name: '小米笔记本',
    },
  }

  let reactObj2 = reactive(obj2)

  console.log(reactObj)
  console.log(reactObj2)

  return {}
}
```

可以看看打印的，被标记过的 `obj` 并没有转为 `Proxy` 响应式代理对象

![image-20210812124720404](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04c6d80e6fb74a4d81b5e3167010ef79~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### `computed` 计算属性

在`Vue3`中使用`computed` 和`Vue2.X` 有些不同，这里 `computed`是一个方法

> 首先还是得导入 `computed` 方法

```js
import { defineComponent, computed } from 'vue'
```

> 参数为一个回调 默认为 `get`

```html
<template>
  <div class="box">
    <input type="text" v-model="name" />
    <br />
    <input type="text" v-model="age" />
    <br />
    <input type="text" v-model="getInfo" />
  </div>
</template>
```

```js
setup() {
    let name = ref('小浪')
    let age = ref(21)


    let getInfo = computed(() => {
        return `我的名字：${name.value},今年${age.value}，请多多指教`
    })
    return {
        name,
        age,
        getInfo,
    }
}
```

![37](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/336f33d348ed4e908e016a8c9eacb796~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这里没有实现 `set` 方法，所以修改下面没有用

> 参数为一个**对象** 在这里写 `get``set`

模板和上面一样

```js
setup() {
    let name = ref('小浪')
    let age = ref(21)

    let getInfo = computed({

        get() {
            return `${name.value},${age.value}`
        },

        set(val: string) {
            let arr = val.split(',')
            name.value = arr\[0\]
            age.value = parseInt(arr\[1\])
        },
    })
    return {
        name,
        age,
        getInfo,
    }
```

![38](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb1487dddb3f425e9d9aa2460d202b5c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### `watch` 侦听器

和 Vue2.X 的 Watch 使用方法差不多

> 介绍

watch(data,handler,object)

1.  `data`：可以是返回值的 `getter` 函数，也可以是 `ref`
2.  `handler`：回调函数
3.  `object`：可选配置项 `{ immediate: true }`

> 引入

```js
import { defineComponent, watch } from 'vue'
```

> `data` 为一个 `ref`

回调函数的参数是 (新值,旧值)

```js
setup() {
    let name = ref('小浪')
    let age = ref(21)

    let watchName = ref('')
    watch(name, (newName, oldName) => {
        watchName.value = `我是新姓名${newName}
		我是老姓名${oldName}`
    })
    return {
        name,
        age,
        watchName,
    }
},
```

![image-20210811204502523](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7d69bf6172f4f68be61571853880c41~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看见页面第三栏没有显示，因为 `name` 值没有变化，所以就不用改变，`watch`的第三个参数是 配置对象，我们在里面可以设置 立即执行 `{ immediate: true }`

就会执行一次 当然这个时候 `oldName` 为 `undefined`

```js
watch(
  name,
  (newName, oldName) => {
    watchName.value = `我是新姓名${newName}
  我是老姓名${oldName}`
  },
  { immediate: true }
)
```

![39](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e35c8ce9360449e9edaa4bbaa00336a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> `data` 为一个 `getter`

```js
watch(()=>haha,(newName, oldName)=>{

})
```

`()=\> haha` 直接返回一个值，相当于 `getter` 简写,`haha`可以不是响应式数据

> `data` 为多个 `ref`

模板还是之前那个

```html
<template>
  <div class="box">
    <input type="text" v-model="name" />
    <br />
    <input type="text" v-model="age" />
    <br />
    <input type="text" v-model="getInfo" />
  </div>
</template>
```

我们可以把多个 `ref` 放进一个数组里面

`newNameAndAge`，`oldNameAndAge`为一个数组保存着 新 和 旧的 \[name,age\]

```js
setup() {
    let name = ref('小浪')
    let age = ref(21)

    let watchName = ref('')
    watch(
      \[name, age\],
      (newNameAndAge, oldNameAndAge) => {
        watchName.value = `new: ${newNameAndAge}
        old: ${oldNameAndAge}`
      },
      { immediate: true }
    )
    return {
        name,
        age,
        watchName,
    }
},
```

![40](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60adfa12c0dc42239985d630a0a9e46d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> `data` 为 `reactive`

```js
setup() {
  let user = reactive({
    name: '小浪',
    age: 21,
  })

  let watchInfo = ref('')
  watch(
    user,
    (newInfo, oldInfo) => {
      console.log(newInfo === oldInfo)
    }
  )
}
```

这里是对象 会出现问题，立即执行后，

如果加上 立即执行 除了第一次 `newInfo`为 `{name: '小浪',age: 21}`

`oldInfo` 为 `undefined` ，之后**始终返回该对象的当前值**

所以 `newInfo` = `oldInfo`

对于这个问题，我们得加上配置对象 `{deep: true}`进行深度检测

深度检测还可以判断多重嵌套

```js
watch(
  user,
  (newInfo, oldInfo) => {
    console.log(newInfo === oldInfo)
  },
  { deep: true }
)
```

### `watchEffect`

这个也是用来监听数据变化，默认就会执行一次所以这里就不需要配置，而且不用指定 `data`,使用哪些响应式数据就监听哪些

```js
let user = reactive({
    name: '小浪',
    age: 21,
})

watchEffect(() => {
    console.log(user.name)
});
```

### provide / inject

提供 和 注入 是很简单理解的

> 实现跨层级组件(祖孙)间通信

在多层嵌套组件中使用，不需要将数据一层一层地向下传递

可以实现 跨层级组件 通信

在 父组件中

```js
setup() {
    const info = reactive({
        title: 'Vue3学习'
        date: '2021/7/23'
    })

    provide('info', info)

    return {
        info
    }
}
```

在 子孙 层级组件使用注入就能够获取到了

```js
setup() {

    const color = inject('info')

    return {
        info
    }
}
```

### `Teleport` 传送组件

这个组件特别有趣，可以把组件进行传送

```html
<teleport v-if="flag" to=".test">
    <div class="dog">狗子</div>
</teleport>
```

`to` 是目标的地址 `body` , `#XXX` , `.XXX` 这些都是 `css` 选择器

下面写个例子大家看下就明白了

> 模板

```html
<template>
  <ul>
    <li class="li_1"></li>
    <li class="li_2"></li>
    <li class="li_3"></li>
  </ul>
  <teleport :to="target">
    <img src="https://img0.baidu.com/it/u=3077713857,1222307962&fm=26&fmt=auto&gp=0.jpg" />
  </teleport>
  <div class="btnGroup">
    <button @click="target = '.li_1'">传送1</button>
    <button @click="target = '.li_2'">传送2</button>
    <button @click="target = '.li_3'">传送3</button>
  </div>
</template>
```

> setup

```js
setup() {

  let target = ref('.li_1')
  return {
    target,
  }
},
```

利用 按钮 点击来控制 `teleport` 是否显示， `teleport` 一渲染，就会跑到 `li` 下面

![42](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/083b7f7bcd8b46179188e4a5cfc31454~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### `Vue3` 生命周期

> `Vue2.X` 对应 `Vue3`组合API

| `Vue2.X` | `Vue3` |
| --- | --- |
| beforeCreate | ---> | `setup()` |
| created | ---> | `setup()` |
| beforeMount | ---> | onBeforeMount |
| mounted | ---> | onMounted |
| beforeUpdate | ---> | onBeforeUpdate |
| updated | ---> | onUpdated |
| beforeDestroy | ---> | `onBeforeUnmount` |
| destroyed | ---> | `onUnmounted` |
| activated | ---> | onActivated |
| deactivated | ---> | onDeactivated |
| errorCaptured | ---> | onErrorCaptured |
| onRenderTriggered |
| onRenderTracked |

可以看出

`beforeCreate` 和 `created` 在Vu3还是能正常使用，在Vue3我们可以用更好更快的 `setup` 代替

`on`开头的 生命周期需要 通过 `import` 导入，在 `setup` 函数中使用

`Vue3` 的生命周期 比 `Vue2.X` 的生命周期快

举个例子: `onBeforeMount` 比 `beforeMount` 快 其他同理

还多个两个钩子:

*   `onRenderTriggered` 跟踪虚拟 DOM 重新渲染时调用
*   `onRenderTracked` 当虚拟 DOM 重新渲染被触发时调用

### 全局`API` 转移

`Vue2.X` 中 `Vue` 上面的全局API ，比如自定义指令 `Vue.directive`，全局组件 `Vue.component` 在Vue3都进行改变，不再提供 `Vue` ，而是提供 `app`

具体改变可以看下面

| Vue2.X | Vue3 |
| --- | --- |
| Vue.config | app.config |
| Vue.config.productionTip | 移除 |
| Vue.config.ignoredElements | app.config.isCustomElement |
| Vue.component | app.component |
| Vue.directive | app.directive |
| Vue.mixin | app.mixin |
| Vue.use | app.use |
| Vue.prototype | app.config.globalProperties |
| new Vue().$mount('#app') | createApp(App).mount('#app') |

结语
--

到了这里我们基本都了解了 `Vue3` 的一些特性

*   新的脚手架工具`vite`
*   在 `Vue3` 仍然支持 `Vue2` 中的大多数特性
*   `Vue` 组合`APi`代替了`Vue2`中的`option API` ，同一逻辑集中起来，复用性更强了
*   `Vue3` 使用 `TS` 编写更好的支持TS
*   `Vue3` 使用`Proxy` 代替了`Vue2`中`Object.defineProperty()` 实现响应式原理
*   介绍了新的组件: `Fragment``Teleport``Suspense`

这里还没有提到的 `Vue3` 重写了 **虚拟DOM** ，提高了性能

希望这篇笔记能够帮助到大家，如果我写的不清楚，具体的还得看 `官方文档` yyds，最近开学了，学校里面的事情也多了...

(o゜▽゜)o☆

> 参考资料：

[Vue3官网文档](https://link.juejin.cn/?target=https%3A%2F%2Fvue3js.cn%2Fdocs%2Fzh "https://vue3js.cn/docs/zh")

[B站资料](https://link.juejin.cn/?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1Zy4y1K7SH%3Fp%3D156 "https://www.bilibili.com/video/BV1Zy4y1K7SH?p=156")
