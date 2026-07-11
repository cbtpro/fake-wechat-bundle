# fake-wechat-bundle

项目包含以下子项目：
- fake-wechat-server：NestJS 后端服务（Git Submodule）
- fake-wechat：Vue 3 + Vant 前端应用（Git Submodule）
- admin：后台管理系统，基于 [vue-vben-admin v5](https://github.com/vbenjs/vue-vben-admin) 初始化（独立 pnpm workspace）

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
| `pnpm install:admin` | 仅安装后台管理系统依赖（admin 内部为独立 workspace，需 Node>=22.18、pnpm>=11） |
| `pnpm dev` | 同时启动服务端和客户端（并行模式） |
| `pnpm dev:server` | 仅启动服务端开发模式 |
| `pnpm dev:client` | 仅启动客户端开发模式 |
| `pnpm dev:admin` | 仅启动后台管理系统（默认 Ant Design Vue 版本） |
| `pnpm build` | 构建所有项目 |
| `pnpm build:server` | 仅构建服务端 |
| `pnpm build:client` | 仅构建客户端 |
| `pnpm build:admin` | 仅构建后台管理系统 |
| `pnpm start` | 启动服务端（生产模式） |
| `pnpm lint` | 运行所有项目的 lint |
| `pnpm lint:server` | 仅运行服务端的 lint |
| `pnpm lint:client` | 仅运行客户端的 lint |
| `pnpm lint:admin` | 仅运行后台管理系统的 lint |
| `pnpm format` | 格式化所有项目代码 |
| `pnpm format:server` | 仅格式化服务端代码 |
| `pnpm format:client` | 仅格式化客户端代码 |
| `pnpm clean` | 清理所有项目的 node_modules |

### 关于 admin（后台管理系统）

`admin` 目录基于 [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin) v5 初始化，是一个**独立的 pnpm workspace**（内部含 `pnpm-workspace.yaml` 和 `turbo.json`），因此：

- **不**纳入外层 `pnpm-workspace.yaml`，避免 workspace 嵌套冲突
- **环境要求独立**：Node >= 22.18、pnpm >= 11（外层为 pnpm 9，可在 admin 目录单独使用更高版本）
- admin 的 `pnpm-lock.yaml` 不纳入版本控制（已在 `.gitignore` 忽略），各开发者本地生成
- admin 内置多个 UI 框架版本（`apps/web-antd`、`apps/web-ele`、`apps/web-naive`、`apps/web-tdesign`），根脚本默认使用 `web-antd`，如需切换可进入 `admin` 目录执行对应命令（如 `pnpm dev:ele`）

如需在 admin 目录单独开发：

```shell
cd admin
pnpm install
pnpm dev:antd   # 或 dev:ele / dev:naive / dev:tdesign
```

### 单独开发子模块

子模块仍然可以作为独立项目开发：

```shell
# 进入子模块目录
cd fake-wechat-server

# 使用 pnpm 安装依赖（子模块独立模式）
pnpm install

# 启动开发
pnpm run start:dev
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

## 提交 Submodule 代码

### 开发流程

```shell
# 1. 进入 submodule 目录
cd fake-wechat

# 2. 确保在分支上（不是 detached HEAD）
git checkout main

# 3. 拉取最新代码
git pull origin main

# 4. 进行开发...

# 5. 提交并推送
git add .
git commit -m "Your commit message"
git push origin main

# 6. 更新父仓库的 submodule 指针
cd ..
git add fake-wechat
git commit -m "Update fake-wechat submodule"
git push
```

### 处理 HEAD detached 问题

当通过 `git submodule update` 更新后，submodule 可能处于 **HEAD detached**（游离 HEAD）状态，此时无法 push 代码：

```shell
# 查看当前状态
git status  # 如果显示 HEAD detached at <commit>，说明处于游离状态

# 查看可用分支
git branch -a

# 切换到开发分支
git checkout main

# 如果之前在游离状态有未提交的修改，需要先创建临时分支保存
git branch temp <commit-hash>
git checkout main
git cherry-pick <commit-hash>

# 推送到远程
git push origin main
```

### 推送代码步骤总结

| 步骤 | 命令 | 说明 |
|------|------|------|
| 1 | `cd fake-wechat` | 进入 submodule 目录 |
| 2 | `git checkout main` | 切换到开发分支 |
| 3 | `git pull origin main` | 拉取最新代码 |
| 4 | `git add .` | 暂存修改 |
| 5 | `git commit -m "msg"` | 提交代码 |
| 6 | `git push origin main` | 推送到远程 |
| 7 | `cd ..` | 返回父仓库 |
| 8 | `git add fake-wechat` | 暂存 submodule 指针变更 |
| 9 | `git commit -m "Update submodule"` | 提交父仓库 |
| 10 | `git push` | 推送父仓库 |

## 开发环境 HTTPS 证书

前端项目 `fake-wechat` 在开发环境启用 HTTPS，需要生成本地自签名证书并让系统信任。证书文件存放在 `fake-wechat/certs/` 目录下，Vite 配置位于 [fake-wechat/vite.config.ts](fake-wechat/vite.config.ts#L34-L37)。

### 证书文件说明

| 文件 | 说明 |
|------|------|
| `fake-wechat/certs/key.pem` | 私钥文件 |
| `fake-wechat/certs/cert.pem` | 自签名证书文件 |
| `fake-wechat/certs/openssl.cnf` | OpenSSL 证书生成配置文件 |

证书包含完整的 X.509 v3 扩展（Version 3），现代浏览器要求证书必须包含 `subjectAltName`（SAN）扩展，否则会提示"此站点不安全"。

### 生成证书

#### 1. 创建 OpenSSL 配置文件

在 `fake-wechat/certs/` 目录下创建 `openssl.cnf`：

```ini
[req]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn

[dn]
CN = localhost

[req_ext]
subjectAltName = @alt_names
keyUsage = digitalSignature, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth, clientAuth
basicConstraints = CA:TRUE
subjectKeyIdentifier = hash

[alt_names]
DNS.1 = localhost
DNS.2 = 127.0.0.1
IP.1 = 127.0.0.1
IP.2 = ::1
```

#### 2. 生成私钥和证书签名请求（CSR）

```shell
cd fake-wechat/certs

# 生成 RSA 2048 私钥和 CSR
openssl req -new -newkey rsa:2048 -nodes -keyout key.pem -out csr.pem -config openssl.cnf
```

#### 3. 自签名生成证书

```shell
# 使用私钥对 CSR 进行自签名，生成有效期 365 天的证书
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem -extensions req_ext -extfile openssl.cnf
```

#### 4. 验证证书

```shell
# 查看证书信息，确认 Version: 3 且包含 SAN 扩展
openssl x509 -in cert.pem -text -noout | grep -A5 "X509v3"
```

预期输出应包含：

```
Version: 3 (0x2)
X509v3 Subject Alternative Name:
    DNS:localhost, DNS:127.0.0.1, IP Address:127.0.0.1, IP Address:0:0:0:0:0:0:0:1
X509v3 Key Usage:
    Digital Signature, Key Encipherment, Data Encipherment
X509v3 Extended Key Usage:
    TLS Web Server Authentication, TLS Web Client Authentication
X509v3 Basic Constraints:
    CA:TRUE
```

#### 5. 一键生成证书（完整命令）

```shell
cd fake-wechat/certs

# 生成 CSR
openssl req -new -newkey rsa:2048 -nodes -keyout key.pem -out csr.pem -config openssl.cnf

# 自签名生成证书
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem -extensions req_ext -extfile openssl.cnf

# 清理 CSR 文件
rm csr.pem
```

### 信任证书（macOS）

生成证书后，需要将其添加到 macOS 钥匙串并设为信任，否则浏览器会提示"此站点不安全"。

#### 添加证书到钥匙串并信任

```shell
# 添加证书到用户登录钥匙串并设置为信任根证书
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db fake-wechat/certs/cert.pem
```

#### 更新已过期的证书

```shell
# 1. 删除旧证书
security delete-certificate -c "localhost" ~/Library/Keychains/login.keychain-db

# 2. 添加新证书
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db fake-wechat/certs/cert.pem
```

#### 查看钥匙串中的证书

```shell
# 查看钥匙串中的 localhost 证书
security find-certificate -c "localhost" -a -Z
```

#### 在"钥匙串访问"应用中手动信任

如果命令行方式不生效，可以通过图形界面操作：

1. 打开"钥匙串访问"应用（Keychain Access）
2. 在左侧选择"登录"（login）钥匙串
3. 在上方标签选择"证书"（Certificates）
4. 找到 `localhost` 证书，双击打开
5. 展开"信任"（Trust）选项
6. 将"使用此证书时"设置为"始终信任"（Always Trust）
7. 关闭窗口，输入系统密码确认

### 浏览器访问

证书配置完成后，访问 `https://localhost:5173`：

- **首次访问**：浏览器可能仍显示安全警告
  - **Chrome**：点击"高级" → "继续访问localhost（不安全）"
  - **Safari**：点击"显示详细信息" → "访问此网站"
- **后续访问**：证书被信任后将不再提示

### 常见问题

#### Q: 浏览器提示"使用不受支持的协议"

**原因**：证书缺少 `subjectAltName` 扩展，或证书版本为 Version 1。

**解决**：使用上述配置文件重新生成 Version 3 证书，确保证书包含 SAN 扩展。

#### Q: 浏览器仍提示证书不安全

**原因**：证书未被系统信任。

**解决**：
1. 确认已执行 `security add-trusted-cert` 命令
2. 在"钥匙串访问"应用中检查证书信任设置
3. 重启浏览器后重试
4. 清除浏览器缓存和 Cookie

#### Q: curl 可以访问但浏览器无法访问

**原因**：浏览器使用系统钥匙串验证证书，而 curl 默认不验证或使用不同的证书库。

**解决**：确保证书已添加到系统钥匙串并设置为"始终信任"。

### Vite HTTPS 配置

证书生成后，在 [fake-wechat/vite.config.ts](fake-wechat/vite.config.ts#L31-L37) 中配置 HTTPS：

```typescript
import * as path from 'path';

export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    server: {
      host: true,
      port: 5173,
      https: {
        key: path.resolve(__dirname, './certs/key.pem'),
        cert: path.resolve(__dirname, './certs/cert.pem'),
      },
      // ...其他配置
    },
  };
});
```

> **注意**：使用 `path.resolve(__dirname, ...)` 而非相对路径 `'./certs/key.pem'`，避免因工作目录不同导致证书加载失败。

### 安全提示

- 自签名证书仅用于开发环境，**切勿**在生产环境使用
- 证书文件 `key.pem` 是私钥，不应提交到公开仓库（建议在 `.gitignore` 中忽略）
- 证书有效期为 365 天，过期后需要重新生成并更新钥匙串信任

## 参考文档

- [Git 工具 - 子模块](https://git-scm.com/book/zh/v2/Git-%e5%b7%a5%e5%85%b7-%e5%ad%90%e6%a8%a1%e5%9d%97)
- [OpenSSL 文档](https://www.openssl.org/docs/)
- [Vite Server HTTPS 配置](https://vitejs.dev/config/server-options.html#server-https)