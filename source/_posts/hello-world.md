---
title: husky的原理是什么
tags: ["husky"]
categories: ["Git"]
date: 2022-01-09 16:06:04
updated: 2022-01-09 16:06:04
---

一个简化的代码示例,展示 husky 的基本实现原理。这个例子会展示 husky 如何拦截 Git hooks 并执行自定义脚本。请注意,这只是一个概念性的示例,真实的 husky 实现要复杂得多。

以下是一个简化的 JavaScript 代码示例,展示了 husky 的核心原理:

```javascript
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class SimpleHusky {
  constructor() {
    this.hooksDir = path.join(".git", "hooks");
    this.config = this.loadConfig();
  }

  // 加载husky配置
  loadConfig() {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    return packageJson.husky || {};
  }

  // 安装Git hooks
  install() {
    if (!fs.existsSync(this.hooksDir)) {
      fs.mkdirSync(this.hooksDir, { recursive: true });
    }

    Object.keys(this.config.hooks).forEach((hookName) => {
      const hookPath = path.join(this.hooksDir, hookName);
      const hookContent = this.generateHookScript(hookName);
      fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });
    });

    console.log("Husky hooks installed successfully!");
  }

  // 生成hook脚本
  generateHookScript(hookName) {
    return `#!/bin/sh
# Husky
# 运行配置的脚本
${this.config.hooks[hookName]}
`;
  }

  // 运行hook
  runHook(hookName) {
    const script = this.config.hooks[hookName];
    if (script) {
      try {
        console.log(`Running ${hookName} hook...`);
        execSync(script, { stdio: "inherit" });
        console.log(`${hookName} hook completed successfully.`);
      } catch (error) {
        console.error(`${hookName} hook failed. Git operation aborted.`);
        process.exit(1);
      }
    }
  }
}

// 使用示例
const husky = new SimpleHusky();
husky.install();

// 模拟触发pre-commit hook
husky.runHook("pre-commit");
```

这个简化的实现展示了 husky 的几个核心概念:

1. 配置加载: 从 package.json 文件中读取 husky 配置。
2. Hook 安装: 在.git/hooks 目录中创建对应的 hook 脚本文件。
3. Hook 脚本生成: 生成可执行的 shell 脚本,其中包含用户配置的命令。
4. Hook 执行: 当 Git 操作触发 hook 时,执行相应的脚本。
5. 错误处理: 如果脚本执行失败,则阻止 Git 操作继续进行。

使用这个简化版的 husky,你可以在 package.json 中添加类似这样的配置:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm test",
      "pre-push": "npm run build"
    }
  }
}
```

然后,当你尝试提交代码时,它会先运行 lint 和测试,只有在这些检查都通过后,提交才会成功。

请注意,实际的 husky 实现要复杂得多,包括更多的错误处理、跨平台兼容性、与不同版本的 Git 的兼容性等。这个示例仅用于说明基本原理。如果您需要在实际项目中使用,我强烈建议使用官方的 husky 包,因为它经过了充分的测试和优化。
