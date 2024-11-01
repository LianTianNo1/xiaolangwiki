---
title: React 无缝滚动跑马灯组件
tags: ["React", "跑马灯"]
categories: ["前端"]
date: 2022-02-16 10:16:14
updated: 2022-02-16 10:16:14
---
##  React 无缝滚动跑马灯组件

最近在做一个电商平台的项目，其中一个需求是在首页顶部展示一些重要的通知公告，比如物流赔付信息、促销活动预告等。为了吸引用户的注意力，UI决定采用跑马灯的形式来展示这些信息，并且要实现无缝滚动，避免出现停顿或跳跃的视觉效果。

由于公司老项目限制，我们没有采用现成的轮播图组件，于是决定自己动手开发一个 React 无缝滚动跑马灯组件。

### 需求分析

我们的跑马灯组件需要满足以下几个需求：

1. **无缝滚动**: 文案滚动流畅，首尾衔接自然，没有明显的停顿或跳跃。
2. **可配置**: 可以自定义滚动速度、文案内容、字体颜色等样式。
3. **易用**: 使用简单，只需要传入文案数组即可。

### 组件设计与实现

#### 核心思路

实现无缝滚动的关键在于复制第一条文案到最后一条，形成一个循环。当滚动到最后一条文案时，瞬间回到第一条文案，由于视觉上第一条文案已经在最后一条文案后面，所以看起来像是继续滚动，从而达到无缝衔接的效果。

#### 代码实现

首先，我们定义了组件的 Props 和 State：

```typescript
interface SeamlessMarqueeProps {
    texts: string[]; // 轮播文案
    interval?: number; // 轮播间隔，单位毫秒，默认1000毫秒（每秒滚动一组文案）
}

interface SeamlessMarqueeState {
    translateY: number; // 滚动距离
    currentTextIndex: number; // 当前显示的文案索引
}
```

然后，在组件的 `componentDidMount` 生命周期方法中启动定时器，开始滚动：

```typescript
componentDidMount () {
    // 开始滚动
    this.startMarquee();
}
```

在 `startMarquee` 方法中，我们使用 `setInterval` 定时调用 `rollAnimation` 方法，实现滚动动画：

```typescript
rollAnimation = () => {
    // ... 动画逻辑
}

startMarquee = () => {
    const { interval = 1000 } = this.props;
    this.marqueeInterval = window.setInterval(this.rollAnimation.bind(this), interval);
};
```

`rollAnimation` 方法中，我们首先复制第一条文案到最后一条，然后计算下一个文案索引和滚动距离，最后更新组件的 State，触发重新渲染：

```typescript
rollAnimation = () => {
    // ... 复制文案、计算索引和滚动距离

    this.setState({
        translateY: nextTranslateY,
        currentTextIndex: nextTextIndex,
    });
}
```

最后，在 `render` 方法中，我们使用 `ul` 元素来包裹文案列表，并通过 `transform: translateY` 来实现滚动效果：

```tsx
<ul
    className="marquee-content"
    style={{
        transform: `translateY(${translateY}px)`
    }}
>
    {textsWithFirst.map((text, index) => (
        <li key={index} className="marquee-item">
            {text}
        </li>
    ))}
</ul>
```

为了让滚动效果更加自然，我们还添加了一个渐变遮罩，遮挡住文案列表的上下边缘：

```sass
.marquee-mask {
    background-image: linear-gradient(to bottom, #fff 0%, transparent 50%, transparent 50%, #fff 100%);
}
```

### 组件使用

使用起来非常简单，只需要传入文案数组即可：

```tsx
<SeamlessMarquee texts={warningArr} interval={3000} />
```

### 源码全览

**SeamlessMarquee.tsx:**

```tsx
import React, { Component } from 'react';
import './index.scss';

interface SeamlessMarqueeProps {
    texts: string[]; // 轮播文案
    interval?: number; // 轮播间隔，单位毫秒，默认1000毫秒（每秒滚动一组文案）
}

interface SeamlessMarqueeState {
    translateY: number; // 滚动距离
    currentTextIndex: number; // 当前显示的文案索引
}

class SeamlessMarquee extends Component<
    SeamlessMarqueeProps,
    SeamlessMarqueeState
> {
    // 滚动容器
    private setMarqueeContentRef: any = null;
    private marqueeInterval: any = null;

    constructor (props: SeamlessMarqueeProps) {
        super(props);
        this.state = {
            translateY: 0,
            currentTextIndex: 0,
        };
    }

    componentDidMount () {
        // 开始滚动
        this.startMarquee();
    }

    componentWillUnmount () {
        // 停止滚动
        window.clearInterval(this.marqueeInterval);
    }

    /**
     * desc 动画逻辑抽离
     * @author Lang
     * @date 2024-06-04 16:24:17
     */
    rollAnimation = () => {
        const { texts } = this.props;

        // 复制第一个文案到最后一个，实现无缝衔接
        const textsWithFirst = [...texts, texts[0]];

        const { currentTextIndex } = this.state;
        // 计算下一个文案索引
        const nextTextIndex = (currentTextIndex + 1) % textsWithFirst.length;

        // 计算滚动距离
        const nextTranslateY = nextTextIndex * -36;

        // 如果滚动到最后一个文案，需要瞬间回到第一个文案
        if (currentTextIndex === textsWithFirst.length - 1) {
            // 瞬间回到第一个文案 - 关闭过渡动画
            this.setMarqueeContentRef.style.transition = 'none';
            this.setMarqueeContentRef.style.transform = 'translateY(0)';

            // 等待回到第一个文案后，再开启过渡动画
            // window.setTimeout 的作用是确保在 translateY 设置为 0 之后，再开启过渡动画，避免视觉上“回拉”的感觉
            window.setTimeout(() => {
                // 第一个文案在最后一个文案的后面，所以在视觉上已经是第二个文案了
                // 设置第二个文案为当前文案，用于过渡动画
                this.setState({
                    translateY: -36,
                    currentTextIndex: 1,
                }, () => {
                    this.setMarqueeContentRef.style.transition = 'transform 0.5s';
                });
            }, 0);
            return;
        }
        this.setState({
            translateY: nextTranslateY,
            currentTextIndex: nextTextIndex,
        });
    }

    // 开始滚动
    startMarquee = () => {
        const { interval = 1000 } = this.props;
        this.marqueeInterval = window.setInterval(this.rollAnimation.bind(this), interval);
    };

    render () {
        const { texts } = this.props;
        const { translateY } = this.state;

        // 复制第一个文案到最后一个，实现无缝衔接
        const textsWithFirst = [...texts, texts[0]];

        return (
            <div className="seamless-marquee">
                <div className="marquee-mask"></div>
                <ul
                    className="marquee-content"
                    ref={ref => {
                        this.setMarqueeContentRef = ref;
                    }}
                    style={{
                        transform: `translateY(${translateY}px)`
                    }}
                >
                    {textsWithFirst.map((text, index) => (
                        <li key={index} className="marquee-item">
                            {text}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default SeamlessMarquee;
```

**SeamlessMarquee.scss:**

```sass
.seamless-marquee {
    width: 380px;
    height: 36px;
    overflow: hidden;
    position: relative;
    font-size: 12px;

    .marquee-mask {
        position: absolute;
        left: 0;
        top: 0;
        content: '';
        display: block;
        background-image: linear-gradient(to bottom, #fff 0%, transparent 50%, transparent 50%, #fff 100%);
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .marquee-content {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: auto;
        transition: transform .5s;

        .marquee-item {
            display: flex;
            align-items: center;
            height: 36px;
            line-height: 36px;
            color: #FF4D4A;
            font-size: 12px;
        }
    }
}
```

### 总结

通过以上步骤，我们成功开发了一个 React 无缝滚动跑马灯组件，满足了项目的需求，并且代码简洁易懂，方便维护。在实际项目中，我们可以根据具体需求，对组件进行进一步的扩展和优化，比如添加自定义样式、暂停/继续滚动等功能。


