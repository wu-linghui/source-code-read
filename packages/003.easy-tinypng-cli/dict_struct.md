### easy-tinypng-cli目录结构解析(A Monorepo Project)

```
easy-tinypng-cli
├─ .changeset
│    ├─ README.md
│    └─ config.json
├─ .eslintrc
├─ .github
│    ├─ FUNDING.yml
│    └─ workflows
├─ .gitignore
├─ .npmrc
├─ .vscode
│    ├─ launch.json
│    └─ settings.json
├─ LICENSE
├─ README.md
├─ package.json
├─ packages // 项目代码所在目录
│    ├─ client // 测试示例
│    └─ easy-tinypng-cli // core-code
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml // 根据此文件看出该仓库用了pnpm自带的monorepo模式来管理运行项目
└─ turbo.json
```

\- [`.changesets`](https://juejin.cn/post/7024827345059971080)：引入**@changesets/cli**依赖通过script命令changeset—changeset add、version、publish 更新packages目录下的项目版本并在子项目下生成CHANGELOG.md的更新日志，发版到npm

\- [`.eslintrc`](https://github.com/wu-linghui/learn-ESlint)作者是引入自己个人的ESlint规则包来规范代码

\- .github：github配置文件

- workflows: 该项目的ci集成工作流发布到npm上
- `FUNDING.yml`: github赞助配置文件

\- [`.gitignore`](https://file+.vscode-resource.vscode-cdn.net/d%3A/100-node-env-libs/common/files/gitignore.md)

\- [`.prettierrc`](https://file+.vscode-resource.vscode-cdn.net/d%3A/100-node-env-libs/common/files/prettierrc.md)

\- [`LICENSE`](https://file+.vscode-resource.vscode-cdn.net/d%3A/100-node-env-libs/common/files/license.md)

\- README：项目介绍文件

\- [`package.json`](https://file+.vscode-resource.vscode-cdn.net/d%3A/100-node-env-libs/common/files/package_json.md)

\-packages: 项目代码所在目录

\- yarn.lock: yarn 的依赖锁文件

\-[`pnpm-workspace.yaml`](https://juejin.cn/post/7098609682519949325)根据此文件看出该仓库用了pnpm自带的monorepo模式来管理运行项目

\-[`turbo.json`](https://juejin.cn/post/7048234698048274469)一个基于Go写的项目构建工具、具有缓存构建项目、和云缓存—这是它的配置文件



---



### easy-tinypng-cli (core)—该项目core_code

```
easy-tinypng-cli
├─ CHANGELOG.md
├─ README.md
├─ bin
│    └─ optimize.js
├─ build.config.ts
├─ dist
│    ├─ index.d.ts
│    ├─ index.js
│    ├─ types.d.ts
│    ├─ types.js
│    ├─ utils.d.ts
│    └─ utils.js
├─ package.json
├─ src
│    ├─ hello.json
│    ├─ index.ts
│    ├─ types.ts
│    └─ utils.ts
├─ test
│    ├─ __snapshots__
│    ├─ _src
│    ├─ index.test.ts
│    └─ record.json
└─ tsconfig.json
```



\-[`CHANGELOG.md`]：**changeset version**执行后将add命令配置的版本信息写入该文件

\-README.md: 项目介绍文件

\-bin

- optimize.js：指向dist下的index.js

\-dist: 项目打包产物

\-src：项目代码目录

- hello.json：
- index.ts：项目入口、出口文件
- type.ts：类型声明文件
- utils.ts: 项目核心代码

\-test：测试文件脚本目录

\-[`tsconfig.json`]([`中文解析`](www.patrickzhong.com/TypeScript/zh/project-config/compiler-options.html#编译选项-1))typescript配置文件[`中文解析`](www.patrickzhong.com/TypeScript/zh/project-config/compiler-options.html#编译选项-1)

