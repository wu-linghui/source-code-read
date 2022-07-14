<h1 align="center"><samp>cac</samp></h1>

<p align="center"><a href="https://github.com/cacjs/cac"><img src="https://img.shields.io/badge/-Github-black.svg" /></a></p>

<p align="center"><samp>Simple yet powerful framework for building command-line apps.</samp></p>

### 用途

---

#### cac Readme.md初看

依照文档的小demo，来试试会得到什么

```js
// examples/basic-usage.js
const cli = require('cac')()

cli.option('--type <type>', 'Choose a project type', {
  default: 'node',
})

const parsed = cli.parse()

console.log(JSON.stringify(parsed, null, 2))
```

输出如下

```
{ args: [], options: { '--': [], type: 'none' } }
```

**[其它demo](https://github.com/cacjs/cac)**

> ​	文档其它demo告诉我们这个库应该是用来对输入的命令参数解析返回对象描述结果，并在输入对应命令时触发.action函数绑定的代码块。
>
> **是一个快速简洁构建自己的cli工具**
>
> 并且有类似与事件巴士一样的注册提交、命令触发

### cac源码目录结构解释

**[目录结构](./dict_struct.md)**

#### 1.入口

> **下面所有文件均在`src`目录下**

按照demo用法

```js
import cac from 'cac'
const cli = cac() // 可以传入 string 类型参数，该参数将成为此 cac 实例的 name
```

以及 `index.ts` 中得知，我们调用 cac 其实就是创建了一个新的 `CAC` 实例

```js
// index.ts
import CAC from './CAC'
import Command from './Command'

// 默认导入的 cac 是一个函数，该函数返回一个新的 CAC 实例
const cac = (name = '') => new CAC(name)

export default cac
export { cac, CAC, Command }
```

### 2. 主流程

CAC 此类的作用就是提供常规的方法，比如 `parse`、`command` 等

**为什么要继承 EventEmitter ——因为要在`.command`方法api时触发`.emit`绑定的事件**

```js
class CAC extends EventEmitter {
  // 此 cli 的名称
  name: string
  // 注册的 commands 列表，储存 Command 实例
  commands: Command[]
  // 注册的全局 Command
  globalCommand: GlobalCommand
  matchedCommand?: Command
  matchedCommandName?: string

  // 最原始的 args
  rawArgs: string[]

  // 转换后的 args
  args: ParsedArgv['args']

  // 转换后的 options，这里是 camelCase
  options: ParsedArgv['options']

  showHelpOnExit?: boolean
  showVersionOnExit?: boolean
}
```

**command**

```js
class CAC {
  /**
   * 添加一个子指令
   */
  command(rawName: string, description?: string, config?: CommandConfig) {
    // 创建一个 command 实例
    const command = new Command(rawName, description || '', config, this)
    // 将当前的全局 command 赋给此实例
    command.globalCommand = this.globalCommand
    // 将此实例添加到 commands 列表中
    this.commands.push(command)
    // 返回 command，实现链式调用
    return command
  }
}
```

**paese**

我们再来看看 `parse` 方法，毕竟有了这个就可以跑起来了

这个方法会非常长，所以我们注意看注释，可以分为几块来看

```js
class CAC {
  parse(argv = processArgs, { run = true, } = {}): ParsedArgv {
    // 获取 argv
    this.rawArgs = argv
    // 从 argv 中拿到名字
    if (!this.name)
      this.name = argv[1] ? getFileName(argv[1]) : 'cli'

    let shouldParse = true

    // 开始遍历自身储存的 commands
    for (const command of this.commands) {

      // 这里借助另一个函数来解析 argv
      const parsed = this.mri(argv.slice(2), command)

      const commandName = parsed.args[0]
      // 如果找到匹配的 command，那么就关掉 shouldParse
      if (command.isMatched(commandName)) {
        shouldParse = false
        const parsedInfo = {
          ...parsed,
          args: parsed.args.slice(1),
        }
        this.setParsedInfo(parsedInfo, command, commandName)

        // 注意，这里使用的 EventEmitter 中的 emit 方法
        // 触发了一个指令
        // 我们先有一个印象，在将 Command 类的时候，我们来重点讲解一下
        this.emit(`command:${commandName}`, command)
      }
    }

    if (shouldParse) {
      // 如果没有就去走默认指令，即指令名称是  [...xxx]
      for (const command of this.commands) {
        if (command.name === '') {
          shouldParse = false
          const parsed = this.mri(argv.slice(2), command)
          this.setParsedInfo(parsed, command)
          this.emit('command:!', command)
        }
      }
    }

    // 要是还没有找到匹配的呢，那么就最后再通过 mri parse 一遍
    if (shouldParse) {
      const parsed = this.mri(argv.slice(2))
      this.setParsedInfo(parsed)
    }

    if (this.options.help && this.showHelpOnExit) {
      this.outputHelp()
      run = false
      this.unsetMatchedCommand()
    }

    if (this.options.version && this.showVersionOnExit && this.matchedCommandName == null) {
      this.outputVersion()
      run = false
      this.unsetMatchedCommand()
    }

    const parsedArgv = { args: this.args, options: this.options }

    if (run)
      this.runMatchedCommand()

    if (!this.matchedCommand && this.args[0])
      this.emit('command:*')

    return parsedArgv
  }
}
```

**`parse`解析命令行输入携带的`process.argv`参数**

**命令输入参数`process.argv`**

```bash
node index.js -a --b c d
```

输出为：

```js
['node absolute path', 'index.js absolute path', '-a', '--b', 'c', 'd']
```

#### 3.Command类

Command类的主要功能是提供注册Command的能力

细分下command具有`option`方法，由`Option`类提供

#### 4.Option类

Option类为存储option



