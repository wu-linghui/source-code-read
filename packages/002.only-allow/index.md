<h1 align="center"><samp>only-allow</samp></h1>

<p align="center"><a href="https://github.com/pnpm/only-allow"><img src="https://img.shields.io/badge/-Github-black.svg" /></a></p>

<p align="center"><samp>Force a specific package manager to be used on a project</samp></p>

### 用途

----

only-allow README.md初看

如果你想强制规定只使用一种npm依赖包管理器如pnpm，在package.json加入

```bash
{
  "scripts": {
      "preinstall": "npx only-allow pnpm"
  }
}
```

该指令会在你运行`pnpm i`时先触发运行only-allow中的bin.js 并将`pnpm`作为参数带入校验

`preinstall`：为npm的命令钩子

```tex
依次执行
# install 之前执行这个脚本
preinstall
# 执行 install 脚本
install
# install 之后执行这个脚本
postinstall
```



### only-allow源码目录结构解析

[目录结构](./dict_struct.md)

---

#### 1.项目入口

通过package.json的`main`字段可以得出项目入口文件为bin.js



#### 2.代码运行逻辑

> 这个库的代码很精简只有30-40行，引用了2个三方库—`which-pm-runs`、`boxen`
>
> [`which-pm-runs`](https://github.com/sindresorhus/boxen)——用以获取到执行命令`script`的包管理器
>
> [`boxen`](https://github.com/sindresorhus/boxen)——美化console.log在终端输出的信息

**这里重点讲下`which-pm-runs`这个和代码逻辑关联的依赖库**

##### whic-pm-runs

````js
'use strict'

module.exports = function () {
  if (!process.env.npm_config_user_agent)
    return undefined

  return pmFromUserAgent(process.env.npm_config_user_agent)
}

function pmFromUserAgent(userAgent) {
  const pmSpec = userAgent.split(' ')[0]
  const separatorPos = pmSpec.lastIndexOf('/')
  const name = pmSpec.substring(0, separatorPos)
  return {
    name: name === 'npminstall' ? 'cnpm' : name,
    version: pmSpec.substring(separatorPos + 1)
  }
}

````

​	**阅读`whic-pm-runs`源码可以得出通过读取`process`对象上的`npm_config_user_agent`字段处理得到用户当前运行`script`命令的`agent`—包管理器**

**关于 `process` 对象可以查看 [阮一峰老师 process 对象](https://link.juejin.cn/?target=http%3A%2F%2Fjavascript.ruanyifeng.com%2Fnodejs%2Fprocess.html)**



> **对only-allow源码运行流程的理解注释**

```js
#!/usr/bin/env node
const whichPMRuns = require('which-pm-runs')
const boxen = require('boxen')

// 获取到命令行传入的参数
const argv = process.argv.slice(2)
if (argv.length === 0) {
  console.log('Please specify the wanted package manager: only-allow <npm|cnpm|pnpm|yarn>')
  process.exit(1)
}

// 得到规定的包管理器名称
const wantedPM = argv[0]

// 判断输入参数是否规范
if (wantedPM !== 'npm' && wantedPM !== 'cnpm' && wantedPM !== 'pnpm' && wantedPM !== 'yarn') {
  console.log(`"${wantedPM}" is not a valid package manager. Available package managers are: npm, cnpm, pnpm, or yarn.`)
  process.exit(1)
}

// 通过which-pm-runs依赖得到运行当前脚本的包管理器名称
const usedPM = whichPMRuns()

// 获取到全局process对象中的cwd信息—用以在后续判断是否已安装node_modules依赖
const cwd = process.env.INIT_CWD || process.cwd()
const isInstalledAsDependency = cwd.includes('node_modules')

// 在使用的包管理器和规定的不等和项目尚未初始化安装依赖时进入
if (usedPM && usedPM.name !== wantedPM && !isInstalledAsDependency) {
  // 美化console.log输出
  const boxenOpts = { borderColor: 'red', borderStyle: 'double', padding: 1 }
  // 根据传入的参数在终端输出对应的提示信息
  switch (wantedPM) {
    case 'npm':
      console.log(boxen('Use "npm install" for installation in this project', boxenOpts))
      break
    case 'cnpm':
      console.log(boxen('Use "cnpm install" for installation in this project', boxenOpts))
      break
    case 'pnpm':
      console.log(boxen(`Use "pnpm install" for installation in this project.

If you don't have pnpm, install it via "npm i -g pnpm".
For more details, go to https://pnpm.js.org/`, boxenOpts))
      break
    case 'yarn':
      console.log(boxen(`Use "yarn" for installation in this project.

If you don't have Yarn, install it via "npm i -g yarn".
For more details, go to https://yarnpkg.com/`, boxenOpts))
      break
  }
  // 中断命令运行
  process.exit(1)
}

```

