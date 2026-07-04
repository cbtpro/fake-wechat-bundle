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

```shell
# 初始化所有 submodule（首次克隆后需要执行）
git submodule init

# 更新所有 submodule 到父项目中记录的 commit 版本
git submodule update

# 更新所有 submodule 到各自远程仓库的最新提交
git submodule update --remote

# 更新单个 submodule（例如 fake-wechat-server）
git submodule update --remote fake-wechat-server

# 递归更新所有 submodule（推荐）
git submodule update --init --recursive

# 更新后提交变更
git add .
git commit -m "Update submodules to latest versions"
```

参考文档

https://git-scm.com/book/zh/v2/Git-%e5%b7%a5%e5%85%b7-%e5%ad%90%e6%a8%a1%e5%9d%97