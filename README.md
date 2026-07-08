# fake-wechat-bundle

项目包含两个 submodule：
- fake-wechat-server
- fake-wechat

## 克隆项目

```shell
# 克隆项目时同时初始化并更新所有 submodule（推荐）
git clone --recursive git@github.com:cbtpro/fake-wechat-bundle.git
```

## 添加 Submodule

```shell
git submodule add git@github.com:cbtpro/fake-wechat-server.git
git submodule add git@github.com:cbtpro/fake-wechat.git
```

默认情况下，子模块会将子项目放到一个与仓库同名的目录中，例如 `fake-wechat-server` 和 `fake-wechat`。

## Monorepo 开发模式

项目支持使用 pnpm monorepo 模式进行开发，同时保持子模块可以单独开发。

### 环境要求

- Node.js >= 18
- pnpm >= 9.14.0

### Script 命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装所有子项目依赖 |
| `pnpm install:all` | 安装所有子项目依赖（等同于 install） |
| `pnpm install:server` | 仅安装服务端依赖 |
| `pnpm install:client` | 仅安装客户端依赖 |
| `pnpm dev` | 同时启动服务端和客户端（并行模式） |
| `pnpm dev:server` | 仅启动服务端开发模式 |
| `pnpm dev:client` | 仅启动客户端开发模式 |
| `pnpm build` | 构建所有项目 |
| `pnpm build:server` | 仅构建服务端 |
| `pnpm build:client` | 仅构建客户端 |
| `pnpm start` | 启动服务端（生产模式） |
| `pnpm lint` | 运行所有项目的 lint |
| `pnpm lint:server` | 仅运行服务端的 lint |
| `pnpm lint:client` | 仅运行客户端的 lint |
| `pnpm format` | 格式化所有项目代码 |
| `pnpm format:server` | 仅格式化服务端代码 |
| `pnpm format:client` | 仅格式化客户端代码 |
| `pnpm clean` | 清理所有项目的 node_modules |

### 单独开发子模块

子模块仍然可以作为独立项目开发：

```shell
# 进入子模块目录
cd fake-wechat-server

# 使用 npm 安装依赖（子模块独立模式）
npm install

# 启动开发
npm run start:dev
```

## 更新 Submodule

### 初始化与基础更新

```shell
# 初始化所有 submodule（首次克隆后需要执行）
git submodule init

# 更新所有 submodule 到父项目中记录的 commit 版本
git submodule update

# 递归更新所有 submodule（推荐，包含初始化）
git submodule update --init --recursive
```

### 拉取远程最新代码

当 submodule 的远程仓库有新代码提交时，使用以下命令拉取最新代码：

```shell
# 更新所有 submodule 到各自远程仓库的最新提交
git submodule update --remote

# 更新单个 submodule（例如 fake-wechat-server）
git submodule update --remote fake-wechat-server
```

### 手动进入 submodule 目录拉取

```shell
# 进入 submodule 目录
cd fake-wechat-server

# 拉取最新代码
git pull origin main

# 返回父项目
cd ..
```

### 更新后提交变更

更新完成后，父项目的 gitlink 引用会发生变化，需要提交：

```shell
# 更新到远程最新版本
git submodule update --remote

# 查看变更
git status

# 提交 submodule 引用的变更
git add .
git commit -m "Update submodules to latest versions"
```

参考文档

https://git-scm.com/book/zh/v2/Git-%e5%b7%a5%e5%85%b7-%e5%ad%90%e6%a8%a1%e5%9d%97