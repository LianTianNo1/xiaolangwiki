---
title: 手写一个简易vue响应式带你了解响应式原理
date: 2021-07-26 06:10:24
updated: 2021-07-26 06:10:24
tags: [Vue, 响应式原理]
categories: [前端]
---
## 手写一个简易vue响应式带你了解响应式原理

原文：https://juejin.cn/post/6989106100582744072

前言
==

> 这是小浪在学习**Vue**总结的一篇文章，在这篇文章我们来了解 **Vue2.X** 响应式原理，然后我们来实现一个 **vue** 响应式原理（写的内容简单）实现步骤和注释写的很清晰，大家有兴趣可以耐心观看，大家可以在评论多多交流，也希望大家能给 小浪一个 **赞**

Vue2.X响应式原理
===========

1.defineProperty 的应用
--------------------

在**Vue2.X** 响应式中使用到了 **defineProperty** 进行数据劫持，所以我们对它必须有一定的了解，那么我们先来了解它的使用方法把， 这里我们来使用 **defineProperty**来模拟 **Vue** 中的 **data**

```html
<body>
    <div id="app"></div>
    <script>

        let data = {
            msg: '',
        }

        let vm = {}

        Object.defineProperty(vm, 'msg', {

            get() {
                return data.msg
            },

            set(newValue) {

                if (newValue === data.msg) return

                data.msg = newValue
                document.querySelector('#app').textContent = data.msg
            },
        })

        vm.msg = '1234'
    </script>
</body>
```

![7](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ad4d2fcc15f47d9a3df0db8878ffba5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可以看见 上面 **vm.msg** 数据是**响应式**的

2.defineProperty修改多个参数为响应式
--------------------------

> 修改多个参数

看了上面的方法只能修改一个属性，实际上我们 **data** 中数据不可能只有一个,我们何不定义一个方法把**data**中的数据进行遍历都修改成响应式呢

```html
<body>
    <div id="app"></div>
	<script>

        let data = {
            msg: '哈哈',
            age: '18',
        }

        let vm = {}

        function proxyData() {

            Object.keys(data).forEach((key) => {

                Object.defineProperty(vm, key, {

                    enumerable: true,

                    configurable: true,

                    get() {
                        return data\[key\]
                    },

                    set(newValue) {

                        if (newValue === data\[key\]) return

                        data\[key\] = newValue
                        document.querySelector('#app').textContent = data\[key\]
                    },
                })
            })
        }

        proxyData(data)

	</script>
</body>
```

3.Proxy
-------

> 在**Vue3** 中使用 **Proxy** 来设置响应式的属性

先来了解下 **Proxy** 的两个参数

`new Proxy(target,handler)`

*   `target` ：要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
*   `handler`：一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 `p` 的行为

其实 和 Vue2.X实现的逻辑差不多，不过实现的方法不一样

那么就放上代码了

```javascript
<body>
    <div id="app"></div>
    <script>

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
    </script>
</body>
```

触发**set** 和 **get** 的方法

```javascript
vm.msg = 'haha'

console.log(vm.msg)
```

4.发布订阅模式
--------

> 在Vue 响应式中应用到了 发布订阅模式 我们先来了解下

首先来说简单介绍下 一共有三个角色

**发布者**、 **订阅者**、 **信号中心** 举个现实中例子 作者(发布者)写一篇文章 发到了掘金(信号中心) ,掘金可以处理文章然后推送到了首页，然后各自大佬(订阅者)就可以订阅文章

在Vue 中的例子 就是**EventBus**`$on``$emit`

> 那么我们就简单模仿一下 Vue 的事件总线吧

之前代码缩进4个单位有点宽，这里改成2个

```html
<body>
  <div id="app"></div>
  <script>
    class Vue {
      constructor() {


        this.subs = {}
      }

      $on(type, fn) {

        if (!this.subs\[type\]) {

          this.subs\[type\] = \[\]
        }

        this.subs\[type\].push(fn)
      }

      $emit(type) {

        if (this.subs\[type\]) {

          const args = Array.prototype.slice.call(arguments, 1)

          this.subs\[type\].forEach((fn) => fn(...args))
        }
      }
    }


    const eventHub = new Vue()

    eventHub.$on('sum', function () {
      let count = \[...arguments\].reduce((x, y) => x + y)
      console.log(count)
    })

    eventHub.$emit('sum', 1, 2, 4, 5, 6, 7, 8, 9, 10)
  </script>
</body>
```

5.观察者模式
-------

> 与 发布订阅 的差异

与发布订阅者不同 观察者中 发布者和订阅者(观察者)是相互依赖的 必须要求观察者订阅内容改变事件 ，而发布订阅者是由调度中心进行调度，那么看看观察者模式 是如何相互依赖，下面就举个简单例子

```html
<body>
  <div id="app"></div>
  <script>

    class Subject {
      constructor() {
        this.observerLists = \[\]
      }

      addObs(obs) {

        if (obs && obs.update) {

          this.observerLists.push(obs)
        }
      }

      notify() {
        this.observerLists.forEach((obs) => {

          obs.update()
        })
      }

      empty() {
        this.observerLists = \[\]
      }
    }

    class Observer {

      update() {

        console.log('目标更新了')
      }
    }



    let sub = new Subject()

    let obs1 = new Observer()
    let obs2 = new Observer()

    sub.addObs(obs1)
    sub.addObs(obs2)

    sub.notify()
  </script>
</body>
```

6.模拟Vue的响应式原理
-------------

> 这里来实现一个小型简单的 **Vue** 主要实现以下的功能

*   接收初始化的参数，这里只举几个简单的例子 **el****data****options**
*   通过私有方法 **_proxyData** 把**data** 注册到 **Vue** 中 转成**getter****setter**
*   使用 **observer** 把 **data** 中的属性转为 响应式 添加到 自身身上
*   使用 **observer** 方法监听 **data** 的所有属性变化来 通过观察者模式 更新视图
*   使用 **compiler** 编译元素节点上面指令 和 文本节点差值表达式

### 1.vue.js

在这里获取到 `el``data`

通过 **_proxyData** 把 **data**的属性 注册到**Vue** 并转成 **getter****setter**

 ```javascript
class Vue {
  constructor(options) {

    this.$options = options || {}

    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el

    this.$data = options.data || {}

    this._proxyData(this.$data)
  }

  _proxyData(data) {
    Object.keys(data).forEach((key) => {


      Object.defineProperty(this, key, {

        enumerable: true,

        configurable: true,

        get() {
          return data\[key\]
        },

        set(newValue) {

          if (newValue === data\[key\]) return

          data\[key\] = newValue
        },
      })
    })
  }
}
```

### 2.observer.js

在这里把 **data** 中的 属性变为响应式加在自身的身上，还有一个主要功能就是 观察者模式在 第 `4.dep.js` 会有详细的使用

 ```javascript
class Observer {
  constructor(data) {

    this.walk(data)
  }

  walk(data) {

    if (!data || typeof data !== 'object') return

    Object.keys(data).forEach((key) => {

      this.defineReactive(data, key, data\[key\])
    })
  }




  defineReactive(obj, key, value) {

    this.walk(value)

    const self = this
    Object.defineProperty(obj, key, {

      enumerable: true,

      configurable: true,

      get() {
        return value
      },

      set(newValue) {

        if (newValue === value) return

        value = newValue

        self.walk(newValue)
      },
    })
  }
}
```



在html中引入的话注意顺序

```html
<script src="./js/observer.js"></script>
<script src="./js/vue.js"></script>
```

然后在**vue.js** 中使用 **Observer**

 ```javascript
class Vue {
  constructor(options) {
    ...

    new Observer(this.$data)
  }

  _proxyData(data) {
   ...
  }
}
```



看到这里为什么做了两个重复性的操作呢？重复性两次把 **data**的属性转为响应式

在**obsever.js** 中是把 **data** 的所有属性 加到 **data** 自身 变为响应式 转成 **getter****setter**方式

在**vue.js** 中 也把 **data**的 的所有属性 加到 **Vue** 上,是为了以后方面操作可以用 **Vue** 的实例直接访问到 或者在 **Vue** 中使用 **this** 访问

> 使用例子

```html
<body>
    <div id="app"></div>
    <script src="./js/observer.js"></script>
    <script src="./js/vue.js"></script>
    <script>
      let vm = new Vue({
        el: '#app',
        data: {
          msg: '123',
          age: 21,
        },
      })
    </script>
  </body>
```

![image-20210725162744305](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/792a2a311f044c3a8d153c4fad2f0c46~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

这样在`Vue` 和 `$data` 中都存在了 所有的**data** 属性了 并且是响应式的

### 3.compiler.js

**comilper.js**在这个文件里实现对文本节点 和 元素节点指令编译 主要是为了举例子 当然这个写的很简单 指令主要实现 **v-text****v-model**

 ```javascript
class Compiler {

  constructor(vm) {

    this.vm = vm

    this.el = vm.$el

    this.compile(this.el)
  }

  compile(el) {

    let childNodes = \[...el.childNodes\]
    childNodes.forEach((node) => {


      if (this.isTextNode(node)) {

        this.compileText(node)
      } else if (this.isElementNode(node)) {

        this.compileElement(node)
      }

      if (node.childNodes && node.childNodes.length) {

        this.compile(node)
      }
    })
  }

  compileText(node) {


    let reg = /\\{\\{(.+?)\\}\\}/

    let val = node.textContent

    if (reg.test(val)) {

      let key = RegExp.$1.trim()

      node.textContent = val.replace(reg, this.vm\[key\])
    }
  }

  compileElement(node) {

    !\[...node.attributes\].forEach((attr) => {

      let attrName = attr.name

      if (this.isDirective(attrName)) {

        attrName = attrName.substr(2)


        let key = attr.value


        this.update(node, key, attrName)
      }
    })
  }

  update(node, key, attrName) {



    let updateFn = this\[attrName + 'Updater'\]

    updateFn && updateFn(node, key, this.vm\[key\])
  }


  textUpdater(node, key, value) {
    node.textContent = value
  }


  modelUpdater(node, key, value) {
    node.value = value
  }


  isDirective(attr) {
    return attr.startsWith('v-')
  }

  isElementNode(node) {
    return node.nodeType === 1
  }

  isTextNode(node) {
    return node.nodeType === 3
  }
}
```



### 4.dep.js

写一个**Dep**类 它相当于 观察者中的发布者 每个响应式属性都会创建这么一个 **Dep** 对象 ，负责收集该依赖属性的**Watcher**对象 （是在使用响应式数据的时候做的操作）

当我们对响应式属性在 **setter** 中进行更新的时候，会调用 **Dep** 中 **notify** 方法发送更新通知

然后去调用 **Watcher** 中的 **update** 实现视图的更新操作（是当数据发生变化的时候去通知观察者调用观察者的update更新视图）

总的来说 在**Dep**(这里指发布者) 中负责收集依赖 添加观察者(这里指**Wathcer**)，然后在 **setter** 数据更新的时候通知观察者

说的这么多重复的话，大家应该知道是在哪个阶段 收集依赖 哪个阶段 通知观察者了吧，下面就来实现一下吧

> 先写**Dep**类

 ```javascript
class Dep {
  constructor() {

    this.subs = \[\]
  }

  addSub(sub) {

    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }

  notify() {

    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
```



> 在 **obsever.js** 中使用**Dep**

在 **get** 中添加 **Dep.target** (观察者)

在 **set** 中 触发 **notify** (通知)

 ```javascript
class Observer {
  ...
  }

  walk(data) {
   ...
  }

  defineReactive(obj, key, value) {
	...

    let dep = new Dep()
    Object.defineProperty(obj, key, {
	  ...

      get() {

        Dep.target && dep.addSub(Dep.target)
        return value
      },

      set(newValue) {
        if (newValue === value) return
        value = newValue
        self.walk(newValue)

        dep.notify()
      },
    })
  }
}
```



### 5.watcher.js

\*\*watcher \*\*的作用 数据更新后 收到通知之后 调用 **update** 进行更新

 ```javascript
class Watcher {
  constructor(vm, key, cb) {

    this.vm = vm

    this.key = key

    this.cb = cb

    Dep.target = this



    this.oldValue = vm\[key\]

    Dep.target = null
  }

  update() {

    let newValue = this.vm\[this.key\]

    if (newValue === this.oldValue) return

    this.cb(newValue)
  }
}
```



那么去哪里创建 **Watcher** 呢？还记得在 **compiler.js**中 对文本节点的编译操作吗

在编译完文本节点后 在这里添加一个 **Watcher**

还有 **v-text****v-model** 指令 当编译的是元素节点 就添加一个 **Watcher**

 ```javascript
class Compiler {

  constructor(vm) {

    this.vm = vm

    this.el = vm.$el

    this.compile(this.el)
  }

  compile(el) {
    let childNodes = \[...el.childNodes\]
    childNodes.forEach((node) => {
      if (this.isTextNode(node)) {

        this.compileText(node)
      }
       ...
  }

  compileText(node) {
    let reg = /\\{\\{(.+)\\}\\}/
    let val = node.textContent
    if (reg.test(val)) {
      let key = RegExp.$1.trim()
      node.textContent = val.replace(reg, this.vm\[key\])

      new Watcher(this.vm, key, newValue => {
        node.textContent = newValue
      })
    }
  }
  ...

  textUpdater(node, key, value) {
    node.textContent = value

    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }

  modelUpdater(node, key, value) {
    node.value = value

    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })

    node.addEventListener('input', () => {
      this.vm\[key\] = node.value
    })
  }
}
```



当 我们改变 响应式属性的时候 触发了 **set()** 方法 ，然后里面 发布者 **dep.notify** 方法启动了，拿到了 所有的 观察者 **watcher** 实例去执行 **update** 方法调用了回调函数 **cb(newValue)** 方法并把 新值传递到了 **cb()** 当中 **cb**方法是的具体更新视图的方法 去更新视图

比如上面的例子里的第三个参数 **cb**方法

```javascript
new Watcher(this.vm, key, newValue => {
    node.textContent = newValue
})
```

还有一点要实现**v-model**的双向绑定

不仅要通过修改数据来触发更新视图，还得为**node**添加 **input** 事件 改变 **data**数据中的属性

来达到双向绑定的效果

7.测试下自己写的
---------

> 到了目前为止 响应式 和 双向绑定 都基本实现了 那么来写个例子测试下

```html
<body>
  <div id="app">
    {{msg}} <br />
    {{age}} <br />
    <div v-text="msg"></div>
    <input v-model="msg" type="text" />
  </div>
  <script src="./js/dep.js"></script>
  <script src="./js/watcher.js"></script>
  <script src="./js/compiler.js"></script>
  <script src="./js/observer.js"></script>
  <script src="./js/vue.js"></script>
  <script>
    let vm = new Vue({
      el: '#app',
      data: {
        msg: '123',
        age: 21,
      },
    })
  </script>
</body>
```

![8](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1e875a85d8845f7b6a92e98ba7d1f3a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

OK 基本实现了 通过 观察者模式 来 实现 响应式原理

8.五个文件代码
--------

这里直接把5个文件个代码贴出来 上面有的地方省略了,下面是完整的方便大家阅读

> vue.js

 ```javascript
class Vue {
  constructor(options) {

    this.$options = options || {}

    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el

    this.$data = options.data || {}

    this._proxyData(this.$data)

    new Observer(this.$data)

    new Compiler(this)
  }

  _proxyData(data) {
    Object.keys(data).forEach((key) => {


      Object.defineProperty(this, key, {

        enumerable: true,

        configurable: true,

        get() {
          return data\[key\]
        },

        set(newValue) {

          if (newValue === data\[key\]) return

          data\[key\] = newValue
        },
      })
    })
  }
}
```



> obsever.js

 ```javascript
class Observer {
  constructor(data) {

    this.walk(data)
  }

  walk(data) {

    if (!data || typeof data !== 'object') return

    Object.keys(data).forEach((key) => {

      this.defineReactive(data, key, data\[key\])
    })
  }




  defineReactive(obj, key, value) {

    this.walk(value)

    const self = this

    let dep = new Dep()
    Object.defineProperty(obj, key, {

      enumerable: true,

      configurable: true,


      get() {

        Dep.target && dep.addSub(Dep.target)
        return value
      },

      set(newValue) {

        if (newValue === value) return

        value = newValue

        self.walk(newValue)

        dep.notify()
      },
    })
  }
}
```



> compiler.js

 ```javascript
class Compiler {

  constructor(vm) {

    this.vm = vm

    this.el = vm.$el

    this.compile(this.el)
  }

  compile(el) {

    let childNodes = \[...el.childNodes\]
    childNodes.forEach((node) => {


      if (this.isTextNode(node)) {

        this.compileText(node)
      } else if (this.isElementNode(node)) {

        this.compileElement(node)
      }

      if (node.childNodes && node.childNodes.length) {

        this.compile(node)
      }
    })
  }

  compileText(node) {


    let reg = /\\{\\{(.+?)\\}\\}/

    let val = node.textContent

    if (reg.test(val)) {

      let key = RegExp.$1.trim()

      node.textContent = val.replace(reg, this.vm\[key\])

      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }

  compileElement(node) {

    !\[...node.attributes\].forEach((attr) => {

      let attrName = attr.name

      if (this.isDirective(attrName)) {

        attrName = attrName.substr(2)


        let key = attr.value


        this.update(node, key, attrName)
      }
    })
  }

  update(node, key, attrName) {



    let updateFn = this\[attrName + 'Updater'\]

    updateFn && updateFn.call(this, node, key, this.vm\[key\])
  }


  textUpdater(node, key, value) {
    node.textContent = value

    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }

  modelUpdater(node, key, value) {
    node.value = value

    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })

    node.addEventListener('input', () => {
      this.vm\[key\] = node.value
    })
  }


  isDirective(attr) {
    return attr.startsWith('v-')
  }

  isElementNode(node) {
    return node.nodeType === 1
  }

  isTextNode(node) {
    return node.nodeType === 3
  }
}
```



> dep.js

 ```javascript
class Dep {
  constructor() {

    this.subs = \[\]
  }

  addSub(sub) {

    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }

  notify() {

    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
```



> watcher.js

 ```javascript
class Watcher {
  constructor(vm, key, cb) {

    this.vm = vm

    this.key = key

    this.cb = cb

    Dep.target = this



    this.oldValue = vm\[key\]

    Dep.target = null
  }

  update() {

    let newValue = this.vm\[this.key\]

    if (newValue === this.oldValue) return

    this.cb(newValue)
  }
}
```
