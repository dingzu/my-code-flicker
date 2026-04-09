# My CodeFlicker Desktop 启动指南

## 项目概述
Myflicker 桌面端原型演示框架，单文件 HTML，无需构建工具，直接浏览器打开即可预览。

## myflicker-desktop.html - My CodeFlicker Desktop

### 快速启动

该项目为纯静态 HTML 文件，无需安装依赖或运行构建命令。

**方式一：直接用浏览器打开**

```bash
open myflicker-desktop.html
```

**方式二：使用本地静态服务器（推荐，支持热重载）**

```bash
npx serve .
```

**启动后访问**：直接打开 `myflicker-desktop.html` 或访问 http://localhost:3000

```yaml
subProjectPath: .
command: open myflicker-desktop.html
cwd: .
port: null
previewUrl: null
description: Myflicker 桌面端原型演示，单文件 HTML，无需构建，直接浏览器打开即可
```
