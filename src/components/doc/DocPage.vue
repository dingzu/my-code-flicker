<template>
  <div class="doc-content">

    <!-- 序 -->
    <template v-if="pageId === 'preface'">
      <div class="doc-hero-tag">PREFACE</div>
      <h1 class="doc-h1">序</h1>
      <p class="doc-meta">一寒 · 2026 年 Q2</p>
      <hr class="doc-divider">
      <p class="doc-p">这是一份关于 Myflicker 的产品文档集合。</p>
      <p class="doc-p">Myflicker 是我们正在探索的下一代 AI 助手形态——它既能在 IDE 里深度协作，也能在任意场景轻量对话。这里记录了设计过程中的思考、决策和待解问题。</p>
      <div class="doc-callout">
        📖 从左侧导航选择任意文档，开始阅读。
      </div>
      <h2 class="doc-h2">目录</h2>
      <div class="doc-steps">
        <div class="doc-step" style="cursor:pointer" @click="docStore.switchPage('brief')">
          <div class="doc-step-num">01</div>
          <div class="doc-step-body">
            <div class="doc-step-title">产品思路 · 融合方案</div>
            <p class="doc-step-desc">如何打通 CodeFlicker 与 Myflicker，以「项目」为中心整合两套 Agent 体系。</p>
          </div>
        </div>
      </div>
    </template>

    <!-- 产品思路 -->
    <template v-if="pageId === 'brief'">
      <div class="doc-hero-tag">PRODUCT BRIEF</div>
      <h1 class="doc-h1">Myflicker：打通 AI IDE 与 AI 通用助手</h1>
      <p class="doc-meta">一寒 · 2026 年 Q2 · 设计草稿</p>
      <hr class="doc-divider">

      <h2 class="doc-h2">背景</h2>
      <p class="doc-p">我们有两款成熟产品，能力互补但相互割裂：</p>
      <div class="doc-compare">
        <div class="doc-compare-col doc-col-cf">
          <div class="doc-compare-label">CodeFlicker</div>
          <ul class="doc-list">
            <li>绑定本地 workspace（文件夹 + Git）</li>
            <li>并行多对话，支持启动本地 IDE</li>
            <li>自研 Agent，深度代码理解</li>
            <li><strong>短板：</strong>只能本地/云服务，IM 无法用</li>
          </ul>
        </div>
        <div class="doc-compare-col doc-col-mf">
          <div class="doc-compare-label">Myflicker</div>
          <ul class="doc-list">
            <li>IM 内对话、Web、本地客户端均可用</li>
            <li>访问云端文件系统</li>
            <li>对话分组，底层 OpenClaw</li>
            <li><strong>短板：</strong>无工作区感知，无本地执行能力</li>
          </ul>
        </div>
      </div>

      <h2 class="doc-h2">融合思路</h2>
      <p class="doc-p">核心原则：<strong>以「项目」为中心</strong>，而非以「模式」为入口。</p>
      <div class="doc-callout">
        💡 用户不应该在开始工作前先想"我该用 CodeFlicker 还是 Myflicker"——他们只是想完成一件事。
      </div>
      <div class="doc-steps">
        <div class="doc-step" v-for="step in steps" :key="step.num">
          <div class="doc-step-num">{{ step.num }}</div>
          <div class="doc-step-body">
            <div class="doc-step-title">{{ step.title }}</div>
            <p class="doc-step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <h2 class="doc-h2">信息架构</h2>
      <div class="doc-ia">
        <div class="doc-ia-row doc-ia-root">
          <div class="doc-ia-node doc-ia-node-root">Myflicker</div>
        </div>
        <div class="doc-ia-row">
          <div class="doc-ia-node doc-ia-node-mid">项目<div class="doc-ia-sub">可选绑定工作区</div></div>
          <div class="doc-ia-node doc-ia-node-mid">独立对话<div class="doc-ia-sub">云端，无项目上下文</div></div>
        </div>
        <div class="doc-ia-row">
          <div class="doc-ia-node doc-ia-node-leaf">本地工作区<div class="doc-ia-sub">CodeFlicker Agent</div></div>
          <div class="doc-ia-node doc-ia-node-leaf">云端工作区<div class="doc-ia-sub">CodeFlicker Remote Agent</div></div>
          <div class="doc-ia-node doc-ia-node-leaf">云端<div class="doc-ia-sub">OpenClaw</div></div>
        </div>
      </div>

      <h2 class="doc-h2">待解决问题</h2>
      <div class="doc-todo-list">
        <div class="doc-todo" v-for="todo in todos" :key="todo.text">
          <span class="doc-todo-tag" :class="todo.tagClass">{{ todo.tag }}</span>
          {{ todo.text }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useDocStore } from '../../stores/docStore'

defineProps({ pageId: String })
const docStore = useDocStore()

const steps = [
  { num: '01', title: '统一「项目」概念', desc: '项目 = 工作上下文容器。可绑定本地工作区（CodeFlicker 模式），也可只用云端（Myflicker 模式）。这个选择在创建项目时做一次，后续对话自动继承，不再重复选。' },
  { num: '02', title: '对话框零摩擦启动', desc: '打开 Myflicker，直接就是输入框。执行位置通过输入框上方的轻量 pill 选择，不做强制引导。独立对话默认云端；在项目内的对话自动继承项目执行环境。' },
  { num: '03', title: '统一 Agent 调度层', desc: '底层根据执行位置路由：本地工作区 → CodeFlicker Agent（本地运行）；云端 → OpenClaw（云端运行）。UI 层不感知差异，用户只需关注「任务」而非「引擎」。' },
  { num: '04', title: '多端一致体验', desc: 'IM 插件、Web、桌面客户端共享同一个项目/对话数据。桌面端额外支持本地工作区绑定和 IDE 联动，IM/Web 端自动降级为云端模式，数据不丢失。' },
]

const todos = [
  { tag: '待定', tagClass: 'doc-tag-todo', text: 'Agent 调度层 API 设计：如何让两套 Agent 共用统一接口？' },
  { tag: '待定', tagClass: 'doc-tag-todo', text: '本地 workspace 的权限模型：多端访问时如何安全隔离？' },
  { tag: '进行中', tagClass: 'doc-tag-doing', text: '桌面端 UI 原型（本文件即产出）' },
  { tag: '完成', tagClass: 'doc-tag-done', text: '新建对话流程设计：以输入为中心 + 轻量 context pill' },
  { tag: '完成', tagClass: 'doc-tag-done', text: '项目概念替换原有「分组」，支持工作区绑定' },
]
</script>

<style>
.doc-content {
  max-width: 640px; margin: 0 auto;
  padding: 48px 32px 0;
}
.doc-hero-tag {
  font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
  color: #3b82f6; text-transform: uppercase; margin-bottom: 12px;
}
.doc-h1 {
  font-size: 26px; font-weight: 700; color: #111;
  letter-spacing: -0.03em; line-height: 1.25; margin: 0 0 10px;
}
.doc-meta { font-size: 12.5px; color: #aaa; margin: 0 0 28px; }
.doc-divider { border: none; border-top: 1px solid #e5e5e3; margin: 0 0 28px; }
.doc-h2 {
  font-size: 15px; font-weight: 600; color: #1a1a1a;
  letter-spacing: -0.02em; margin: 32px 0 10px;
}
.doc-p { font-size: 14px; line-height: 1.7; color: #374151; margin: 0 0 14px; }
.doc-callout {
  background: #eff6ff; border-left: 3px solid #3b82f6;
  border-radius: 0 8px 8px 0;
  padding: 12px 16px; font-size: 13.5px; color: #1e40af;
  line-height: 1.6; margin: 0 0 20px;
}
.doc-compare {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;
}
.doc-compare-col {
  border-radius: 10px; padding: 14px 16px;
  border: 1.5px solid rgba(0,0,0,0.07);
}
.doc-col-cf { background: #f0fdf4; border-color: rgba(22,163,74,0.2); }
.doc-col-mf { background: #eff6ff; border-color: rgba(59,130,246,0.2); }
.doc-compare-label {
  font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
  text-transform: uppercase; margin-bottom: 10px;
}
.doc-col-cf .doc-compare-label { color: #15803d; }
.doc-col-mf .doc-compare-label { color: #1d4ed8; }
.doc-list { margin: 0; padding-left: 16px; font-size: 13px; color: #374151; line-height: 1.8; }
.doc-steps { display: flex; flex-direction: column; gap: 12px; margin-bottom: 8px; }
.doc-step {
  display: flex; gap: 14px; align-items: flex-start;
  padding: 14px 16px; border-radius: 10px; background: #fff;
  border: 1px solid rgba(0,0,0,0.07);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.doc-step-num {
  font-size: 11px; font-weight: 800; letter-spacing: 0.04em;
  color: #9ca3af; padding-top: 1px; flex-shrink: 0; min-width: 20px;
}
.doc-step-title { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 5px; }
.doc-step-desc { font-size: 13px; line-height: 1.65; color: #4b5563; margin: 0; }
.doc-ia {
  display: flex; flex-direction: column; align-items: center; gap: 0;
  margin: 12px 0 20px; padding: 20px;
  background: #fff; border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.07);
}
.doc-ia-row {
  display: flex; gap: 12px; justify-content: center;
}
.doc-ia-row + .doc-ia-row { margin-top: 10px; }
.doc-ia-node {
  padding: 8px 14px; border-radius: 8px;
  font-size: 12.5px; font-weight: 500; color: #374151;
  border: 1.5px solid rgba(0,0,0,0.1);
  text-align: center; line-height: 1.3;
}
.doc-ia-node-root { background: #1a1a1a; color: #fff; border-color: #1a1a1a; font-weight: 700; }
.doc-ia-node-mid  { background: #f3f4f6; min-width: 130px; }
.doc-ia-node-leaf { background: #fafafa; font-size: 11.5px; min-width: 110px; }
.doc-ia-sub { font-size: 10.5px; color: #9ca3af; margin-top: 3px; font-weight: 400; }
.doc-todo-list { display: flex; flex-direction: column; gap: 8px; }
.doc-todo {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 13.5px; color: #374151; line-height: 1.5; padding: 2px 0;
}
.doc-todo-tag {
  font-size: 10.5px; font-weight: 600; padding: 2px 7px; border-radius: 5px;
  flex-shrink: 0; margin-top: 1px;
}
.doc-tag-todo  { background: #fef3c7; color: #92400e; }
.doc-tag-doing { background: #dbeafe; color: #1e40af; }
.doc-tag-done  { background: #dcfce7; color: #166534; }
</style>
