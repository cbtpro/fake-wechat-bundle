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