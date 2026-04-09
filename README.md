# My CodeFlicker Desktop

Myflicker 桌面端原型演示框架。

## 技术栈

- **Vite 5** — 构建工具
- **Vue 3** — Composition API + `<script setup>`
- **Pinia** — 状态管理

## 工程结构

```
src/
├── App.vue                  # 根组件（Desktop + 层叠管理）
├── main.js
├── stores/
│   ├── appStore.js          # 主窗口状态（显隐、最大化）
│   ├── sidebarStore.js      # 项目/对话列表、消息
│   └── docStore.js          # 文档窗口状态
├── composables/
│   └── useDraggable.js      # 通用窗口拖拽逻辑
├── styles/
│   ├── variables.css        # CSS 变量 + 全局重置
│   └── animations.css       # @keyframes
└── components/
    ├── MenuBar.vue           # macOS 顶部菜单栏（含时钟）
    ├── DesktopIcon.vue       # 桌面文件图标
    ├── Dock.vue              # 底部 Dock 栏
    ├── window/
    │   ├── MainWindow.vue    # 主 App 窗口（可拖拽/最大化）
    │   └── TrafficLights.vue # 交通灯按钮
    ├── sidebar/
    │   ├── Sidebar.vue
    │   ├── SidebarNav.vue
    │   ├── ProjectList.vue
    │   ├── ProjectItem.vue
    │   └── SidebarFooter.vue
    ├── chat/
    │   ├── ContentCard.vue
    │   ├── ChatMessages.vue
    │   ├── ChatInput.vue
    │   └── CtxMenu.vue
    ├── doc/
    │   ├── DocWindow.vue     # 浮动文档窗口（可拖拽/最大化）
    │   ├── DocNav.vue
    │   └── DocPage.vue
    └── sheet/
        └── NewProjectSheet.vue
```

## 核心功能演示

- macOS 窗口 Chrome（拖拽、缩放、交通灯按钮）
- Arc 风格侧边栏：项目（支持工作区绑定）+ 独立对话
- 对话框直接输入，无模式选择障碍
- Context pill 切换执行位置（本地工作区 / 云端 / 无项目）
- 新建项目 dialog（云端 or 本地工作区 + Git 检测）
- 浮动文档窗口（左右导航布局，可拖拽/最大化）

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:5173](http://localhost:5173) 即可预览。

## 构建

```bash
npm run build
```
