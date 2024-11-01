---
title: GitHub搜索技巧：快速找到你想要的代码
date: 2024-07-23 06:09:50
updated: 2022-01-10 16:50:00
tags: [GitHub, 代码搜索]
categories: [GitHub]
---
## GitHub搜索技巧🚀：快速找到你想要的代码

原文：https://juejin.cn/post/7386299931399110706

嘿，开发者朋友们！ 👋

你是否曾迷失在GitHub的浩瀚代码海洋中，苦苦寻找那份珍贵的代码片段或项目？ 😩 别担心，今天我将传授你GitHub搜索的Jedi秘诀，让你像一位搜索大师一样，轻松找到你想要的任何东西！ ✨

**基础功：关键词和过滤器**

首先，掌握基础语法就像学习魔法咒语一样重要。 🪄

*   **关键词:** 直接输入你想找的内容，例如 "python"、"machine learning"。
*   **文件类型:** 想找Python文件？加个 `extension:py` 就行啦！
*   **路径:** 只想知道"docs"文件夹里的文件？用 `path:docs` 就能精准定位！
*   **用户/组织:** 想看看某个大牛的项目？用 `user:username` 或 `org:organization` 就能找到！

**进阶技巧：运算符和特殊字符**

想要更精准地搜索？ 🎯 那就来点高级技巧吧！

*   **AND:** 用 `+` 或空格连接关键词，例如 `"machine learning" +python`，表示必须同时包含这两个关键词。
*   **OR:** 用 `|` 连接关键词，例如 `"machine learning" |"deep learning"`，表示只要包含其中一个关键词即可。
*   **NOT:** 用 `-` 排除关键词，例如 `"machine learning" -python`，表示不包含 "python" 的结果。
*   **括号:** 用括号分组关键词，例如 `(machine learning) +python`，可以更精确地控制搜索范围。
*   **通配符:** 用 `*` 匹配任意字符，例如 `machine*` 可以匹配 "machine learning"、"machine vision" 等。
*   **正则表达式:** 如果你是一位正则表达式高手，可以使用 `/regex/` 来进行更复杂的匹配。

**终极秘籍：高级选项**

想要像搜索大师一样，掌握更多秘密武器？ ⚔️

*   **stars:**`stars:>number` 可以找到星标数量大于指定数字的仓库，例如 `stars:>1000`。
*   **forks:**`forks:>number` 可以找到 Forks 数量大于指定数字的仓库，例如 `forks:>100`。
*   **language:**`language:language` 可以找到指定语言编写的代码，例如 `language:python`。
*   **created/pushed/size:** 还可以根据创建日期、最后更新日期和仓库大小进行筛选。

**案例分析：**

假设你想寻找一个使用 Python 编写的，关于机器学习的开源项目，并且希望它拥有超过 1000 个星标，你可以使用以下搜索语句：

```makefile
language:python machine learning stars:>1000
```

是不是很简单？ 🤩

**小贴士：**

*   GitHub 搜索帮助文档是你的好朋友，里面有更多高级选项和语法： [docs.github.com/en/search-g…](https://link.juejin.cn/?target=https%3A%2F%2Fdocs.github.com%2Fen%2Fsearch-github "https://docs.github.com/en/search-github")
*   善用代码搜索功能，可以更精准地查找代码片段。
*   Issue 和 Pull Request 搜索功能也能帮助你找到问题的讨论和代码修改请求。
*   不要害怕尝试不同的搜索语句，不断练习才能成为搜索大师！

GitHub搜索Jedi秘诀，速来学习！ 🚀 这份笔记记录了我的一些心得体会，希望能对大家有所帮助。
