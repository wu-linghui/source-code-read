### only-allow源码目录分析
```
only-allow-main
├─ LICENSE
├─ README.md
├─ __fixtures__
│    ├─ npm
│    │    ├─ package.json
│    │    └─ pnpm-debug.log
│    ├─ pnpm
│    │    └─ package.json
│    └─ yarn
│           ├─ package.json
│           └─ pnpm-debug.log
├─ bin.js
├─ package.json
└─ pnpm-lock.yaml
```

-  [`LICENSE`](https://file+.vscode-resource.vscode-cdn.net/d%3A/100-node-env-libs/common/files/license.md)
-  README.md：项目介绍文件 
-  [`package.json`](https://file+.vscode-resource.vscode-cdn.net/d%3A/100-node-env-libs/common/files/package_json.md)
- __fixtures__: 测试用例，包含npm、yarn、pnpm三种包管理器的测试方案—使用npm命令钩子—preinstall
-  bin.js: 项目主入口文件、也是核心代码逻辑
-  pnpm-lock. yaml: pnpm 的依赖锁文件 
