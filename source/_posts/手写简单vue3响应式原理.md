---
title: 手写简单vue3响应式原理
date: 2022-08-21 09:06:24
updated: 2022-08-21 09:06:24
tags: [vue3, 响应式原理]
categories: [前端]
---

## 手写简单 vue3 响应式原理

原文：https://juejin.cn/post/7134281691295645732

> 在之前的文章里小浪介绍过[Vue2 的响应式原理](https://juejin.cn/post/6989106100582744072 "https://juejin.cn/post/6989106100582744072")，评论中有掘友评论想让我介绍 Vue3 的响应式原理，那么在这篇文章中小浪来带大家来简单手写一下 Vue3 中的几个响应式 api

## Proxy

> 首先得先来介绍一下 Proxy 这个强大的 API：
>
> 在 Vue3 中使用 Proxy 对象来代替 Vue 2 中基于 Object.defineProperty，消除了 Vue 2 中基于 Object.defineProperty 所存在的一些局限，比如无法监听数组索引，length 属性等等
>
> 在 Proxy 中默认监听动态添加属性和属性的删除操作，就很方便

**Proxy**配合**Reflect**使用，**Reflect**是**ES6**出现的新特性，代码运行期间用来设置或获取对象成员（操作对象成员），**Reflect**没有出现前使用**Object**的一些方法比如 `Object.getPrototypeOf,`**Reflect**也有对应的方法 `Reflect.getPrototypeOf`,两者都是一样的，不过**Reflect**更有语义。

下面来看一下基本的使用

```js
const target = {
  name: "小浪",
  age: 22,
};

const handler = {
  get(target, key, receiver) {
    console.log(`获取对象属性${key}值`);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log(`设置对象属性${key}值`);
    return Reflect.set(target, key, value, receiver);
  },
  deleteProperty(target, key) {
    console.log(`删除对象属性${key}值`);
    return Reflect.deleteProperty(target, key);
  },
};

const proxy = new Proxy(target, handler);
console.log(proxy.age);
proxy.age = 21;
console.log(delete proxy.age);
```

输出

```bash
获取对象属性age值
22
设置对象属性age值
删除对象属性age值
true
```

> target：参数表示所要拦截的目标对象
>
> handler：参数也是一个对象，用来定制拦截行为

注意：

- **this** 关键字表示的是代理的 handler 对象，**所以不能使用 this 而是要用 receiver 传递**，`receiver`代表当前 proxy 对象 或者 继承 proxy 的对象，它保证传递正确的 this 给 getter，setter
- `set` 和 `deleteProperty` 也需要返回（添加`return` ），返回的是一个布尔值，设置/删除成功返回 true，反之返回 false

## reactive

了解了上面的 Proxy 和 Reflect，我们来看一下 reactive 的实现，reactive，返回 proxy 对象，这个 reactive 可以深层次递归，如果发现子元素存在引用类型，递归处理。

```js
const isObject = (val) => val !== null && typeof val === "object";

const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);

export function reactive(target) {
  if (!isObject(target)) return target;

  const handler = {
    get(target, key, receiver) {
      console.log(`获取对象属性${key}值`);

      const result = Reflect.get(target, key, receiver);

      if (isObject(result)) {
        return reactive(result);
      }
      return result;
    },

    set(target, key, value, receiver) {
      console.log(`设置对象属性${key}值`);

      const oldValue = Reflect.get(target, key, reactive);

      let result = true;

      if (oldValue !== value) {
        result = Reflect.set(target, key, value, receiver);
      }
      return result;
    },

    deleteProperty(target, key) {
      console.log(`删除对象属性${key}值`);

      const hadKey = hasOwn(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hadKey && result) {
      }

      return result;
    },
  };
  return new Proxy(target, handler);
}
```

测试

```html
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title></title>
  </head>
  <body>
    <script type="module">
      import { reactive } from "../src/reactive.js";

      const obj = {
        name: "小浪",
        age: 22,
        test: {
          test1: {
            test2: 21,
          },
        },
      };

      const proxy = reactive(obj);
      console.log(proxy.age);
      proxy.test.test1.test2 = 22;
      console.log(delete proxy.age);
    </script>
  </body>
</html>
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55627152ac1843feb5bec13dc3641bb0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 收集依赖/触发更新

上面我们还有 get 中收集依赖没有完成，收集依赖涉及道 track , effect 还有依赖地图，下面我给出一张图先介绍一下 effect 和 track 是如何收集依赖的

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faf059ee41664a69a4fcd89f471c20f8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

响应式顺序：effect > track > trigger > effect

在组件渲染过程中，一个 effect 会会触发 get，从而对值进行 track，当值发生改变，就会进行 trigge，执行 effect 来完成一个响应

那么先来实现 effect

### effect

> effect 的实现很简单

```js
let activeEffect = null;
export function effect(callback) {
  activeEffect = callback;
  callback();
  activeEffect = null;
}
```

### track

> 然后就是对 track 的实现

```js
let targetMap = new WeakMap();

export function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);

  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}
```

> 最后添加到 hander 里 get 中

```js
get(target, key, receiver) {


    track(target, key)


},
```

### 触发更新

通过上面的图，我们知道在 set 中使用 trigger 函数来触发更新，我们来实现一下吧

```js
export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  const dep = depsMap.get(key);

  if (dep) {
    dep.forEach((effect) => {
      effect();
    });
  }
}
```

> 最后添加到 hander 的 set 和 deleteProperty 中

```js
set(target, key, value, receiver) {

    if (oldValue !== value) {
        result = Reflect.set(target, key, value, receiver)
        trigger(target, key)
    }

},

deleteProperty(target, key) {

    if (hadKey && result) {

        trigger(target, key)
    }

}
```

## ref

把一个基础类型包装成一个有 value 响应式对象（这里是使用`get/set` 存取器，来进行追踪和触发），如果是普通对象就调用 reactive 来创建响应式对象

```js
const convert = val => (isObject(val) ? reactive(val) : val)

class RefImpl {
    constructor(_rawValue) {
        this.\_rawValue = \_rawValue
        this.\_\_v\_isRef = true



        this.\_value = convert(\_rawValue)
    }

    get value() {

        track(this, 'value')

        return this._value
    }
    set value(newValue) {

        if (newValue !== this._value) {
            this._rawValue = newValue

            this.\_value = convert(this.\_rawValue)

            trigger(this, 'value')
        }
    }
}

export function ref(rawValue) {

    if (isObject(rawValue) && rawValue.\_\_v\_isRef) return rawValue

    return new RefImpl(rawValue)
}
```

## toRef

> `toRef`传入两个参数，**目标对象**，**对象当中的属性名**，它的返回结果就是**属性名**的可响应式数据，就是将对象中的某个值转化为响应式数据 toRef(obj,key)
>
> 那么简单来实现一下

```js
class ObjectRefImpl {
    constructor(proxy, _key) {
        this._proxy = proxy
        this.\_key = \_key

        this.\_\_v\_isRef = true
    }
    get value() {


        return this.\_proxy\[this.\_key\]
    }
    set value(newVal) {


        this.\_proxy\[this.\_key\] = newVal
    }
}


export function toRef(proxy, key) {
    return new ObjectRefImpl(proxy, key)
}
```

> 测试

```js
import { ref, effect, toRef, reactive } from "../src/reactive.js";
const obj = reactive({
  name: "小浪",
});
const age = toRef(obj, "age");
age.value = 21;
console.log(obj);
effect(() => {
  age.value = 22;
});
console.log(obj);
```

> 原来的 obj 对象没有 age 属性，使用 toRef 添加了 age， 并且是响应式的

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee07b1e766e64986b287d07acffb96e3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> **区别于 ref:**

ref 是对原始数据的拷贝，当修改 ref 数据时，模板中的视图会发生改变，但是原始数据并不会改变。 toRef 是对原始数据的引用，修改 toRef 数据时，原始数据也会发生改变，但是视图并不会更新。

## toRefs

> 想必这个大家经常使用吧，平时如果使用 reactive 创建对象，我们不能直接进行解构，我们要使用 toRefs 帮助我们进行解构， 把整个 reactive 创建的对象变成 普通对象， 然后把每个属性变成 ref 响应式对象。那么直接上手写一下吧， 其实它的核心还是使用了 toRef

```js
export function toRefs(proxy) {

    const ret = proxy instanceof Array ? new Array(proxy.length) : {}

    for (const key in proxy) {

        ret\[key\] = toRef(proxy, key)
    }

    return ret
}
```

> 测试

```js
import { reactive, toRefs } from "../src/reactive.js";
const obj = reactive({
  name: "小浪",
  age: 22,
});

const { name, age } = toRefs(obj);
console.log(obj);
name.value = "小云";
age.value = 21;
console.log(obj);
```

> 测试成功，toRefs 解构后的属性也是响应式

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd0857b0aa1341b590f7632cdeed8e64~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 代码

[github](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FLianTianNo1%2Fvue3_reactive_demo "https://github.com/LianTianNo1/vue3_reactive_demo")

> 结语: 身边的小伙伴们都在准备秋招，这段时间除了实习之外的时间我也在慢慢准备，好久没更文了，感谢大家一直以来对小浪的支持，继续加油努力学习！！！
