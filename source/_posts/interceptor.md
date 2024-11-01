---
title: 一个基本的拦截器实现示例：Axios 拦截器
tags: ["axios", "interceptor"]
categories: [前端]
date: 2022-01-12 11:01:14
updated: 2022-01-12 11:01:14
---
## 一个基本的拦截器实现示例：
```javascript
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected
    });
    return this.handlers.length - 1;
  }

  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
}

class Axios {
  constructor() {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }

  request(config) {
    // 创建 Promise 链
    let chain = [
      (config) => {
        console.log('Sending Request:', config);
        return config;
      },
      undefined
    ];

    // 添加请求拦截器
    this.interceptors.request.handlers.forEach((interceptor) => {
      if (interceptor !== null) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      }
    });

    // 添加响应拦截器
    this.interceptors.response.handlers.forEach((interceptor) => {
      if (interceptor !== null) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      }
    });

    // 执行 Promise 链
    let promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }
}

// 使用示例
const axios = new Axios();

// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    console.log('Request Interceptor 1');
    config.headers = { 'X-Custom-Header': 'foo' };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    console.log('Response Interceptor 1');
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 发送请求
axios.request({ url: 'https://api.example.com/data' })
  .then(response => console.log('Final Response:', response))
  .catch(error => console.error('Error:', error));
```

这个简化版本包含了以下关键部分：

1. `InterceptorManager` 类：管理拦截器的添加和移除。
2. `Axios` 类：包含请求方法和拦截器管理。
3. `request` 方法：
    - 创建一个包含实际请求处理函数的初始 Promise 链。
    - 将请求拦截器添加到链的开头。
    - 将响应拦截器添加到链的末尾。
    - 使用 `while` 循环执行整个 Promise 链。
4. 使用示例：展示了如何添加拦截器和发送请求。

这个实现展示了拦截器的基本工作原理：

+ 拦截器被存储在数组中。
+ 请求时，创建一个 Promise 链，包含所有拦截器和实际的请求处理。
+ Promise 链按顺序执行，允许每个拦截器修改请求或响应。

实际的 Axios 库更加复杂



## 拦截器实现的核心
```javascript
let promise = Promise.resolve(config);
while (chain.length) {
  promise = promise.then(chain.shift(), chain.shift());
}
```

这段代码是拦截器实现的核心，它创建了一个 Promise 链来依次执行所有的拦截器和实际的请求。让我们逐步分析：

1. `let promise = Promise.resolve(config);`
    - 这行创建了一个立即解决（resolve）的 Promise，初始值是 config 对象。
    - 这个 Promise 将作为整个链的起点。
2. `while (chain.length) { ... }`
    - 这个循环会一直执行，直到 chain 数组为空。
    - chain 数组包含了所有的拦截器函数和实际的请求处理函数。
3. `promise = promise.then(chain.shift(), chain.shift());`
    - `chain.shift()` 移除并返回数组的第一个元素。
    - 这里每次调用 `shift()` 两次，分别获取成功回调和失败回调。
    - `promise.then()` 将这两个回调添加到当前 Promise 的后面，形成一个新的 Promise。
    - 新的 Promise 被赋值回 `promise` 变量，准备下一次循环。

工作流程示例：

假设我们有以下拦截器和请求处理函数：

+ 请求拦截器 1: requestInterceptor1
+ 请求拦截器 2: requestInterceptor2
+ 实际请求处理: sendRequest
+ 响应拦截器 1: responseInterceptor1
+ 响应拦截器 2: responseInterceptor2

初始的 chain 数组可能如下：

```javascript
[
  requestInterceptor2, errorHandler2,
  requestInterceptor1, errorHandler1,
  sendRequest, undefined,
  responseInterceptor1, errorHandler3,
  responseInterceptor2, errorHandler4
]
```

循环执行过程：

1. 第一次循环：`promise.then(requestInterceptor2, errorHandler2)`
2. 第二次循环：`promise.then(requestInterceptor1, errorHandler1)`
3. 第三次循环：`promise.then(sendRequest, undefined)`
4. 第四次循环：`promise.then(responseInterceptor1, errorHandler3)`
5. 第五次循环：`promise.then(responseInterceptor2, errorHandler4)`

这样，通过不断地将拦截器和请求处理函数添加到 Promise 链中，我们创建了一个完整的执行序列，确保了所有操作按照正确的顺序执行。

这种实现方式的优点是：

1. 灵活性：可以轻松添加或移除拦截器。
2. 异步支持：每个拦截器都可以是异步的。
3. 错误处理：每个步骤都有相应的错误处理机制。



