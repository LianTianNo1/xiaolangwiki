---
title: 打印排版小技巧：pt、px、mm 之间的神秘转换 🪄
date: 2024-07-23 11:11:26
updated: 2024-07-23 11:11:26
tags: [打印排版, 单位转换]
categories: [前端]
---

## 打印排版小技巧：pt、px、mm 之间的神秘转换 🪄

原文：https://juejin.cn/post/7394652965908693043

大家好，我是小浪，前几天在修改一个打印功能的 bug 的时候，突然发现了一个有趣的问题：打印出来的文字宽度和预期不符，导致排版错乱，需要重新换行。

仔细查看代码，发现之前同事们是根据每个字符的类型手动设置了一个大概的宽度，这显然不够精确，尤其是在涉及到不同字体、不同字号的时候，这种方法很容易出现问题。

为了解决这个问题，我决定深入研究一下打印排版中常用的单位：**pt、px 和 mm**，以及它们之间的转换关系。

### pt、px、mm 是什么？ 🤔

- **pt (point)**：点，是印刷术语中常用的单位，1pt 等于 1/72 英寸。在网页设计中，pt 主要用于设置字体大小。
- **px (pixel)**：像素，是屏幕上最小的显示单元。在网页设计中，px 是最常用的长度单位，用于设置元素的宽度、高度、边距等。
- **mm (millimeter)**：毫米，是国际通用的长度单位。在打印设计中，mm 是常用的单位，用于设置纸张大小、边距等。

### 如何转换它们？ 🔄

在过去，我们需要知道设备的 **dpi (dots per inch)**，也就是每英寸的像素密度，才能准确地将 pt、px 和 mm 之间进行转换。

例如，如果设备的 dpi 是 300，那么 1pt 就等于 300 / 72 = 4.17 px。

但是，这种方法比较麻烦，而且需要根据不同的设备进行调整。

好在，我们可以利用浏览器提供的 API 来直接获取 pt、px 和 mm 之间的转换关系，省去了很多麻烦。

### 利用浏览器 API 实现转换 💻

我们可以利用 JavaScript 和 DOM API 来实现 pt、px 和 mm 之间的转换。

**1\. 获取每毫米的像素值**

首先，我们需要获取当前设备每毫米的像素值。我们可以创建一个 1mm 宽的 div 元素，插入到页面中，然后获取它的宽度，就可以得到每毫米的像素值。

```javascript
let cachedMmPx = null;

const getOneMmsPx = () => {
  if (cachedMmPx !== null) {
    return cachedMmPx;
  }

  const div = document.createElement("div");
  div.style.width = "1mm";
  document.body.appendChild(div);

  const { width } = div.getBoundingClientRect();
  const mm1 = Math.floor(width * 100) / 100;
  div.remove();

  cachedMmPx = mm1;
  return mm1;
};
```

**2\. 将 px 转换为 mm**

有了每毫米的像素值，我们就可以将 px 转换为 mm 了。

```javascript
const pxToMm = (px) => {
  const mmPerPx = 1 / getOneMmsPx();
  return px * mmPerPx;
};
```

**3\. 获取每 pt 的像素值**

类似地，我们可以创建一个 1pt 宽的 div 元素，获取它的宽度，就可以得到每 pt 的像素值。

```javascript
let cachedPtPx = null;

const getOnePtPx = () => {
  if (cachedPtPx !== null) {
    return cachedPtPx;
  }

  const div = document.createElement("div");
  div.style.width = "1pt";
  document.body.appendChild(div);

  const { width } = div.getBoundingClientRect();
  const pt1 = Math.floor(width * 100) / 100;
  div.remove();

  cachedPtPx = pt1;
  return pt1;
};
```

**4\. 将 pt 转换为 px**

有了每 pt 的像素值，我们就可以将 pt 转换为 px 了。

```javascript
const ptToPx = (pt) => {
  const pxPerPt = getOnePtPx();
  return pt * pxPerPt;
};
```

**5\. 我实际用到的代码获取指定字符的 mm 宽度**

```javascript
const getCharWidthInMm = (char, ptSize = 10.5, fontFamily = "宋体") => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return 0;
  }

  ctx.font = `${ptToPx(ptSize)}px ${fontFamily}`;
  const { width } = ctx.measureText(char);
  const mmWidth = pxToMm(width);

  canvas.remove();
  return Math.floor(mmWidth * 10000) / 10000;
};
```

### 解决打印排版问题 🚀

有了这些代码，我就可以轻松地将模板上的 pt 值转换为 mm，从而判断字符是否超出预设的范围，解决打印排版错乱的问题。

### 总结

在解决打印排版问题的时候，我在网上查询了 pt、px 和 mm 之间的转换关系，涉及到比值计算、DPI 等，认为无法对每个设备都适配，于是利用浏览器 API 实现了一套转换工具。

工作中经常会遇到一些看似复杂的问题，但通过深入研究和探索，往往可以找到简单有效的解决方案。希望我的经验能够帮助到大家，也希望大家在工作中遇到有趣的问题时，可以像我一样记录下来，并与大家分享！
