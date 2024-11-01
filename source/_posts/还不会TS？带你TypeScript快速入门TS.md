---
title: 还不会TS？带你TypeScript快速入门TS
date: 2021-08-23 06:12:10
updated: 2021-08-23 06:12:10
tags: [TypeScript]
categories: [前端]
---
## 还不会TS？ 带你 TypeScript 快速入门TS

原文：https://juejin.cn/post/6999440503712251935

> 前言

TS 现在使用地越来越多，学计算机的就得不断的学习，才能更好的追逐这个时代，这是小浪以前学习TS时候的总结，能快速的帮助大家入门 TS，这里列举不是很全列举一些常用的，但是能满足平时的需求，具体的可以看官方的文档哈，这里只是简单的入门，希望能够帮助到大家

> 往期精彩：
>
> [快速上手Vuex 到 手写简易 Vuex](https://juejin.cn/post/6994337441314242590 "https://juejin.cn/post/6994337441314242590")
>
> [从了解到深入虚拟DOM和实现diff算法](https://juejin.cn/post/6990582632270528525 "https://juejin.cn/post/6990582632270528525")
>
> [手写一个简易vue响应式带你了解响应式原理](https://juejin.cn/post/6989106100582744072 "https://juejin.cn/post/6989106100582744072")
>
> [从使用到自己实现简单Vue Router看这个就行了](https://juejin.cn/post/6988316779818778631 "https://juejin.cn/post/6988316779818778631")
>
> [前端面试必不可少的基础知识，虽然少但是你不能不知道](https://juejin.cn/post/6983934602196811789 "https://juejin.cn/post/6983934602196811789")

1.安装
----

`TS` 的优点和缺点就不一一赘述了，下面直接进入正题

> 进行全局安装

```bash
npm install -g typescript
```

2.原始数据类型
--------

掘金代码高亮我觉得和主题有冲突，这里代码代码都是比较简单，我就直接截图了哈

> 我们在变量后面添加 `: 类型` 就可以规定数据的类型，设置其他类型就会报错
>
> 我们这里先来了解下基础的类型

### 1.字符串 `string`

> 双引号（`"`）或单引号（`'`）表示字符串

![image-20210809093951818](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41ea8b9ef5f1447a8a247fb03764c170~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 2.数字 `number`

> 支持 十/十六/二/八 进制

![image-20210809094238590](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55a20a97c3b6463ca7e278c7330620da~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 3.布尔 `boolean`

> 只能是 `true`/`false`

![image-20210809094357439](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68898b41d2a248aa9c6b6afa39fe8bad~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 4.`undefined`

> 用处不是很大

![image-20210809094430315](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4adbd43b75849fc9d01b4a6008e9da7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 5.`null`

> 用处不是很大

![image-20210809094458172](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16172c44cf944880b314d28b20470663~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 6.空 `void`

> 没有任何类型，函数的没用返回值的使用 `void` ,返回值为空（ `undefined` ）

![image-20210810194819203](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/534b91390cb1492bbc462b152d5682d7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 7.任意类型 `any`

> 这里当类型不确定的时候，就可以使用 `any` 任意类型，不到万不得已不使用
>
> `Unknow` 类型和 `any` 一样可以容纳任意类型比 `any` 安全
>
> 平时用的不多，就不介绍了

![image-20210809094624551](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdbd6793bacc4e9da6c199f3a312469f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 7.字面量

> 定义什么就只能赋值什么

![image-20210809154738126](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/678078f02de34b5fb5c56bd9eb06ca9c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![image-20210809154921672](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1d0fb316f0248bf872054508e89de4f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

3.复杂类型
------

### 1.数组 `array`

> 设置数组的类型 比如这个例子 `true` 这个就会报错，不属于`number`，数组的元素必须是规定好的类型 其他类型同理

![image-20210808213454745](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/689ff60c586342f9b8789a4e67eabf73~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 2.元组 `tuple`

> 学习过 `Python` 的同学应该不太陌生，其实可以把它看做一个数组，可以声明多个类型的数组，这样就能插入多个数据类型的数据，就是长度固定的数组

![image-20210808214401857](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cc91183e9954989b20f51d3a94d01f3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 3.接口 `interface`

> 它能很方便的帮我们定义 `Ojbect` 类型，它是非常的灵活可以描述对象的各种类型

与 `java` 的 `interface` 有些区别，下面简单了看下，具体的下面有介绍

![image-20210808215444817](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af7ba1b2e9a2457ca6838804c421dd97~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 在 `interface` 属性中添加 `？`可以**省略**

下面我们给 `height` 添加 `?`

![image-20210808215805574](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c096e986c2ad491280a6679cecadb753~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> `readonly` 不可改变的，定义完后就不能修改，是不是和 `const` 有点像，不过 `const` 是针对变量， `readonly` 是针对属性

下面我们把 `id` 添加上 `readonly`

![image-20210808220259826](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25cd6d6c64b14e21996955f12f45b33c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 4.函数 `funtion`

> 我们要规定函数的 **输入类型** 和 **返回类型**
>
> 在**形参后面**接冒号声明 形参的类型，在 `()后面`冒号声明 返回值类型

传入多余的参数会报错

![image-20210808221913660](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63e8e40c28bc46bc9921e922820f1126~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

我们也可以为函数添加**可选参数** 这里用 `?` 即可，这样我们就可以调用两个参数或者三个参数不报错

![image-20210808221628843](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faa3922132a24f9fba068c2c82019387~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可选参数之后不能再加规定类型的形参

![image-20210808222057869](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cabe6ec6e988433ebb31d567865ef40b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

我们可以把它添加个 `？`变为可选参数

![image-20210808222200172](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f52ec760d2e1416daa2fdd2fad66866d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

除了上面这种声明式写法还有一种表达式写法

![image-20210808222347710](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1083fbd7400e4e12a755bc472050e818~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 有了上面的了解后我们来说下 **定义函数类型** 的变量

这里这个函数还是上面那个

我们定义`mysum` 指定它 的类型 来接收 我们上面定义的函数

`()` 里面是输入的形参的 类型

`=>` 代表是 **返回值** 的类型

`:` 后面的都是声明类型，和代码逻辑没有什么关系

![image-20210808223036183](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6c6a8e940be4b32af49d561abf47f4c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 我们刚才说了 `interface` 可以描述各种类型，那么我们用 `interface` 来描述下函数类型

注意一点 之前用的 `=>` 来表示返回值类型

这里是在 `()`后 `: 返回值类型`

![image-20210808223626451](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43b0ca286db34783b0d0609b8083fbbd~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 5.联合类型 `union types`

> 但对于一个变量的类型可能是几种类型的时候我们可以使用 `any` ，但是 `any` 的范围是不是有点大了，不到**万不得已**不使用，
>
> 我们如果知道是其中的哪几种类型的话，我们就可以使用 **联合类型** 用 `|` 分隔

比如下面的例子，`haha` 可能是 `number` 或者 `string`

![image-20210809090557218](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0c6c42d49bf415290f1e4bf5be2263b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

**注意**：在没有赋值之前，只能访问**共同的方法、属性**，比如下面的例子,`number` 没有`length` 属性

![image-20210809091710353](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/200ea90d1743410c9234f98644aa7238~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 6.对象 `object`

> 我们 直接 `let a: object;` 是不是没有什么意义，因为 `js` 中对象太多了。。

我们可以这样来用

![image-20210809113126137](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8656e57cf2984664a4de36aa97e764f8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

属性必须在类型 `{ name: string; age: number; }` 中

4.断言 `type inference`
---------------------

> 当在上面联合类型的变量传入的时候，我们声明了这个类型为 `number | string` 它不能不能调用 `length` 方法
>
> 机器没法判断这个类型，但是我们比机器更了解这个类型，我们人为可以指定类型 `string` 这里我们就可以用到 **类型断言**

### 1.我们就用 `as` 来进行断言

![image-20210809093348502](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/763c3ce74ada44f98a4fd99b12e2ce02~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 2.还有一种写法 `<类型>` 两者的功能都是一样的

![image-20210809093854727](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f334abbe81545dd8830b65ad21a7bb0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

5.类型守卫 `type guard`
-------------------

> 遇到联合类型的时候，使用 类型守卫可以 缩小范围

实现以下和上面一样的方法

![image-20210809101137657](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4682cf9bc4ae407abd342a06a211bda4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

类型守卫 除了 `typeof` 之外 ，还有 `instanceof`、 `in`

6.类 `class`
-----------

在 `ES6` 中就有 类的概念了，在 `TS` 中对类添加一些功能，这里只说下几个常用的

> 先写个基础的 类

![image-20210809115531683](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4b2d90218ed46cbad97df2377f99170~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 我们先来说下 3个访问修饰符

`Public`:修饰的属性或方法是共有的 在 **任何地方** 都能访问

`Private`:修饰的属性或方法是私有的 只有 **本类** 中访问

`Protected`:修饰的属性或方法是受保护的 在 **本类** 和 **子类中** 能够访问

比如指定父类中 `money` 访问权限为 `private` ,只能在 `Parent` 访问，子类访问会出错

![image-20210809121311868](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2c9b4551ad74c868d8f0ac0207bc4b2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

我们可以设置访问权限为 `protected` ，这样子类就能访问

![image-20210809121140659](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fbf27f0252a40dc996c6d9c7d6c4bf9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 静态属性 `static`

上面的 `name``money` 这两个属性都是通过 实例 去访问的

使用 `static` 修饰的属性是通过 类 去访问，是每个实例共有的

同样 `static` 可以修饰 方法，用 `static` 修饰的方法称为 类方法，可以使用类直接调用

![image-20210809121921373](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1b4ced0010547dd8f6e1aa9218a001e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 只读 `readonly`

我们给属性添加上 `readonly` 就能保证该属性**只读**，**不能修改**，如果存在 `static` 修饰符，写在其后

![image-20210809122359082](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/262d1bbd34a24c2cb01a7b94e39450b6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 抽象类 `abstract`

`TS` 新增的抽象类，还是简单说下概念吧，我们写一个类的时候，不希望直接使用该类创建实例**（不能被new）**那么我们把它设置为抽象类，让它不能被实例化

只能被继承

在 `class` 前面 添加 `abstract` 修饰符，

在抽象类中 可以写 **抽象方法** ，抽象类没有方法体

举个例子：一个动物的抽象类，有个叫的方法，不可能 每个动物的叫声一样吧，我们可以把它设置为抽象方法，具体功能子类进行实现（该怎么叫就由子类来写）

![image-20210809124627979](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88c739a6e6854eab9ac07c5ec02bb356~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

属性的封装和 `java` 一样，这里就不说了...

7.接口 `interface`
----------------

> 为什么会出现接口

为了解决 继承 的困境(一个类只能继承另一个类不能实现多继承)

还有一种情况，**人**能够洗衣服，**洗衣机**也能洗衣服，洗衣机和人找不到一个共同的父类，我们可以把洗衣服这个功能抽离出来写成接口，**人** 和 **洗衣机** 去实现这个接口就行

> 我们可以用 `implements` 来实现接口

![image-20210809130103041](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78fa2ff70b50464b94b89b08797eae53~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 接口可以多实现

![image-20210809130403175](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cd58b7a85bd4d1a9b6bc26ff7e188a9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 接口之前可以继承

下面这个例子接口继承了另一个接口，这样人类只需实现一个接口就行

![image-20210809130537563](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44f273eeece14d24be94b6131b84d977~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

8.枚举 `enum`
-----------

> 常量是在项目中经常使用，虽然 `const` 可以声明常量，但是有的常量取值是在一个范围里的，这里我们就需要使用 `enum` 来进行处理

### 1.数字枚举

![image-20210809132958670](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63548257df9d4b21bae08e82b5799450~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 可以修改枚举中的初始值

![image-20210809133132496](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38e0a36b9d8145deba2e99edbe329911~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 2.字符串枚举

![image-20210809133851968](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be606dacb6ad4cbd8c6f72421222dfb6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 3.常量枚举

在 `enum` 前面添加一个 `const` 即可，它提高了性能

为什么这么说呢，我就把上面字符串枚举编译成 `js` 例子，和 常量枚举编译 贴出来对比一下

![image-20210809135017124](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26a0909e7ab940ae9dc280e3407d96ac~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

常量枚举直接找出 `Week.Tuesday` 上面一截都没了

9.泛型
----

> 泛型就像一个占位符一个变量，在使用的时候我们可以将定义好的类型像参数一样传入，原封不动的输出

比如这个例子我们就想返回一个值，在这里我写死是 `number`

![image-20210809140308402](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b1314d6d7704533bc7faa49c1a81fba~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在实际中，未必就是 `number`，我们就可以通过泛型来解决，定义好的类型传入进去，返回什么类型出来

> 泛型简单介绍

这里 `T` 是相当于一个占位符,在方法(变量，接口....等等)后面添加 `<T>`

![image-20210809140625111](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d74cce6b3334748a7fac4123d5682ac~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

是不是看起来这么简单，其实还真是

然后我在使用 getValue这个方法的时候 只需要在 **实参** 规定好类型，编译器它也不笨，能够知道我们的参数类型，并将它们赋值给 `T`

![image-20210809141357325](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f32f6b469fbf42888e7161cd3831df05~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 多个参数

![image-20210809141619617](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d526a01bd72840b99b9563aa289a972f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在使用的时候，聪明的就判断出 传入的类型，并修改了 `T`,`U`，真的很方便

![image-20210809141716507](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e322ee42d054492db39710761cda5f57~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 我们可以使用 `interface` 来约束 泛型

在 `T` 后面 `extends Ilen` ，定义 `Ilen` 里面代码表示，`T` 必须要有 `length` 属性

这样在 方法里面调用 `params.length` 就不会报错

![image-20210809151050324](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffcaa4d26f164af690b0a3ec35687bd2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 在 **类**使用泛型

![image-20210809152239297](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b956da6a7f504af2baaafa45be79a88c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 在 **接口** 使用泛型

![image-20210809152813026](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ba740d5d0d144f3b97581d308271fae~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

> 在 **数组** 使用泛型

![image-20210809153225159](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf14ea4ef16b42d3bf21186fb1245119~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

其实泛型还有很多很多使用方法，这里就简单地入门下

10.类型别名
-------

> 使用 `type` 给类型取别名

![image-20210809154354725](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/023c42358ecb40e995422df4febe9067~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

11.交叉类型
-------

> 用 `&` 进行连接

把类型都组合起来，变量赋值必须满足 交叉类型

![image-20210809155259634](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d117a98220c64842b191bfd52bc87b0a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

结语：
---

> 这篇文章是小浪3月多学TS时做的总结，写的不全面写的都是一些经常用到的，全面的话还得写很多很多。。。官方的文档 yyds ，不过大家可以通过这篇文章进行快速入门，，其实小浪用了TS一段时间了，感觉就是有些泛型写的很复杂，规范性很强，很多第三方库隐藏的类型搞不清楚，刚写的完全看不懂，每次写一个东西都要想着去定义类型，恨不得把电脑砸了...开玩笑的，还是得耐心

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a31f26491f7948689a2919d10e902e4a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

参考资料：[TS官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fwww.tslang.cn%2Fdocs%2Fhandbook%2Fbasic-types.html "https://www.tslang.cn/docs/handbook/basic-types.html")
