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
      <p class="doc-meta">一寒 · 2026 年 Q2 · 设计草稿 v2</p>
      <hr class="doc-divider">

      <h2 class="doc-h2">能力版图</h2>
      <p class="doc-p">两款产品能力互补，底层技术栈不同：</p>
      <div class="doc-compare">
        <div class="doc-compare-col doc-col-mf">
          <div class="doc-compare-label">Myflicker + OpenClaw</div>
          <ul class="doc-list">
            <li>本地：Node + Gateway（有完整 Agent 能力）</li>
            <li>云端：云端 Gateway</li>
            <li>IM / Web / 桌面客户端均可用</li>
            <li>访问云端文件系统</li>
          </ul>
        </div>
        <div class="doc-compare-col doc-col-cf">
          <div class="doc-compare-label">CodeFlicker</div>
          <ul class="doc-list">
            <li>本地：IDE 编辑器 + Duet（一个工作区下并行多个 Agent）</li>
            <li>云端：IDE 编辑器（云端）+ Duet</li>
            <li>自研 Agent，深度代码理解</li>
            <li>Duet = 多个独立 session 同时跑，共享工作区</li>
          </ul>
        </div>
      </div>

      <div class="doc-callout">
        💡 Gateway 本身有完整的 Agent 能力（任务调度 + 上下文管理 + 工具调用），与 CF 自研 Agent 在能力维度对等，区别在于开源 vs 自研、优化方向不同。
      </div>

      <h2 class="doc-h2">核心设计决策</h2>
      <div class="doc-steps">
        <div class="doc-step" v-for="step in steps" :key="step.num">
          <div class="doc-step-num">{{ step.num }}</div>
          <div class="doc-step-body">
            <div class="doc-step-title">{{ step.title }}</div>
            <p class="doc-step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <h2 class="doc-h2">项目（Project）模型</h2>
      <p class="doc-p">项目是永久的，类比 GitHub repo——用户可以长期积累和管理工作成果。</p>
      <div class="doc-ia">
        <div class="doc-ia-row">
          <div class="doc-ia-node doc-ia-node-root">项目（永久，类 GitHub repo）</div>
        </div>
        <div class="doc-ia-row">
          <div class="doc-ia-node doc-ia-node-mid">Sessions<div class="doc-ia-sub">Duet 并行，session 级 Agent 路由</div></div>
          <div class="doc-ia-node doc-ia-node-mid">Outputs<div class="doc-ia-sub">自动归档 · Agent 提炼产出摘要</div></div>
          <div class="doc-ia-node doc-ia-node-mid">Assets<div class="doc-ia-sub">本地 workspace + 云端文件系统</div></div>
        </div>
        <div class="doc-ia-row">
          <div class="doc-ia-node doc-ia-node-leaf">CF Agent<div class="doc-ia-sub">本地 / 云端 IDE</div></div>
          <div class="doc-ia-node doc-ia-node-leaf">Gateway Agent<div class="doc-ia-sub">本地 Node / 云端</div></div>
          <div class="doc-ia-node doc-ia-node-leaf">文件变更<div class="doc-ia-sub">+ Agent 摘要</div></div>
        </div>
      </div>

      <h2 class="doc-h2">Session 级 Agent 路由</h2>
      <p class="doc-p">Agent 路由不在项目层决定，而在每个 session 启动时按需选择——用户知道这次任务要做什么，让路由粒度与用户行为粒度对齐。</p>
      <div class="doc-compare">
        <div class="doc-compare-col doc-col-cf">
          <div class="doc-compare-label">CF Agent（选此项时）</div>
          <ul class="doc-list">
            <li>需要修改本地/云端 IDE 文件</li>
            <li>需要启动本地 IDE 工具</li>
            <li>深度代码理解与重构</li>
          </ul>
        </div>
        <div class="doc-compare-col doc-col-mf">
          <div class="doc-compare-label">Gateway Agent（选此项时）</div>
          <ul class="doc-list">
            <li>快速问答、文档分析</li>
            <li>云端文件读写</li>
            <li>跨端访问（IM / Web）</li>
          </ul>
        </div>
      </div>
      <div class="doc-callout">
        🤖 可做智能推断：用户第一句话隐含意图 → 自动选 Agent，保留手动覆盖能力。
      </div>

      <h2 class="doc-h2">Outputs：「文件夹」上下文模型</h2>
      <p class="doc-p">同一项目下并行的 session 之间是隔离的——各自独立运行，看不到彼此的对话上下文，但能看到彼此产出的文件。上下文模型是「文件夹」。</p>
      <p class="doc-p">两种 Agent 对「文件夹」的实现方式不同：</p>
      <div class="doc-compare">
        <div class="doc-compare-col doc-col-cf">
          <div class="doc-compare-label">CF Agent</div>
          <ul class="doc-list">
            <li><strong>物理隔离</strong>：访问边界 = workspace 文件夹</li>
            <li>跨出项目需要切换工作区</li>
            <li>文件夹即沙箱，边界清晰</li>
          </ul>
        </div>
        <div class="doc-compare-col doc-col-mf">
          <div class="doc-compare-label">Gateway / OpenClaw</div>
          <ul class="doc-list">
            <li><strong>上下文聚焦圈</strong>：默认访问全部云端文件</li>
            <li>项目资产自动注入为优先上下文</li>
            <li>用户指令可随时临时扩展边界</li>
          </ul>
        </div>
      </div>
      <div class="doc-callout">
        💡 OpenClaw 的全局访问能力不需要被限制，「项目」对它来说是上下文锚点而非沙箱。这也带来了 CF Agent 不具备的跨项目引用能力：在一个 session 里可以直接说「参考我在 XX 项目里做过的方案」，Agent 直接跨项目读取。
      </div>
      <div class="doc-ia">
        <div class="doc-ia-row">
          <div class="doc-ia-node doc-ia-node-root">项目 /outputs/</div>
        </div>
        <div class="doc-ia-row">
          <div class="doc-ia-node doc-ia-node-mid">文件变更<div class="doc-ia-sub">diff 粒度，类 git commit</div></div>
          <div class="doc-ia-node doc-ia-node-mid">产出摘要<div class="doc-ia-sub">Agent 自动提炼</div></div>
        </div>
        <div class="doc-ia-row">
          <div class="doc-ia-node doc-ia-node-leaf">Session A 产出</div>
          <div class="doc-ia-node doc-ia-node-leaf">Session B 产出</div>
          <div class="doc-ia-node doc-ia-node-leaf">Session C 产出</div>
        </div>
      </div>
      <p class="doc-p" style="margin-top:8px">归档的是「产物」而非「内容」：文件变更 ✅、新建文档 ✅、执行报告 ✅；对话解释 ❌、中间推理 ❌。</p>

      <h2 class="doc-h2">整体信息架构</h2>
      <div class="doc-ia">
        <div class="doc-ia-row doc-ia-root">
          <div class="doc-ia-node doc-ia-node-root">Myflicker</div>
        </div>
        <div class="doc-ia-row">
          <div class="doc-ia-node doc-ia-node-mid">项目<div class="doc-ia-sub">永久，类 GitHub repo</div></div>
          <div class="doc-ia-node doc-ia-node-mid">独立对话<div class="doc-ia-sub">云端，无项目上下文，可升级</div></div>
        </div>
        <div class="doc-ia-row">
          <div class="doc-ia-node doc-ia-node-leaf">本地工作区<div class="doc-ia-sub">CF Agent</div></div>
          <div class="doc-ia-node doc-ia-node-leaf">云端工作区<div class="doc-ia-sub">CF Remote Agent</div></div>
          <div class="doc-ia-node doc-ia-node-leaf">云端<div class="doc-ia-sub">Gateway Agent</div></div>
        </div>
      </div>

      <h2 class="doc-h2">降低项目创建门槛</h2>
      <div class="doc-steps">
        <div class="doc-step" v-for="ep in entryPoints" :key="ep.num">
          <div class="doc-step-num">{{ ep.num }}</div>
          <div class="doc-step-body">
            <div class="doc-step-title">{{ ep.title }}</div>
            <p class="doc-step-desc">{{ ep.desc }}</p>
          </div>
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
  {
    num: '01',
    title: '双 Agent 共存，不强制统一',
    desc: 'CF 自研 Agent 和 Gateway Agent 各自保留特长，不做底层合并。项目层不感知用哪个，由每个 session 在启动时路由，保持各自能力不妥协。'
  },
  {
    num: '02',
    title: 'Session 级 Agent 路由',
    desc: '路由粒度细化到单次 session。同一个项目里，Session A 可以跑 CF Agent 改代码，Session B 同时跑 Gateway Agent 做调研——Duet 的并行价值得以真正释放。'
  },
  {
    num: '03',
    title: '项目 = 「文件夹」上下文模型',
    desc: '并行 session 之间隔离运行，通过共享 /outputs/ 目录看到彼此产出。Agent 产出自动归档，用户在项目产出视图里看到所有 session 沉淀的成果，而非聊天记录。'
  },
  {
    num: '04',
    title: '对话框零摩擦启动',
    desc: '进入 Myflicker 直接就是输入框。执行位置通过输入框上方的轻量 context pill 选择，不做强制引导。独立对话默认云端；项目内的对话继承项目配置。'
  },
]

const entryPoints = [
  {
    num: 'A',
    title: '独立对话 → 升级为项目',
    desc: '先随便聊，觉得值得长期管理时一键「升级为项目」。历史对话自动迁移为项目的第一个 session，/outputs/ 同步归档。不强迫用户提前决策。'
  },
  {
    num: 'B',
    title: '从模板创建项目',
    desc: '代码项目（预设 CF Agent + Git 绑定）、调研项目（预设 Gateway + 文档工具）、产品设计（预设 Gateway + 原型资产）、空白项目。降低配置成本。'
  },
  {
    num: 'C',
    title: '直接新建空白项目',
    desc: '老用户路径，直接创建永久项目，手动配置执行环境和 Assets。'
  },
]

const todos = [
  { tag: '待定', tagClass: 'doc-tag-todo', text: 'Agent 统一接口层设计：如何让 CF Agent 和 Gateway Agent 共用同一套 session 协议？' },
  { tag: '待定', tagClass: 'doc-tag-todo', text: 'Outputs 视图 UI 设计：如何清晰呈现多个并行 session 的产出？防止信噪比差。' },
  { tag: '待定', tagClass: 'doc-tag-todo', text: '独立对话升级为项目的交互流程：触发时机、迁移逻辑、Assets 归属。' },
  { tag: '待定', tagClass: 'doc-tag-todo', text: 'Duet 并行 session 的 UI 表达：多标签？分屏？怎么切换和感知并行状态？' },
  { tag: '待定', tagClass: 'doc-tag-todo', text: '本地 workspace 权限模型：多端访问时如何安全隔离？' },
  { tag: '进行中', tagClass: 'doc-tag-doing', text: '桌面端 UI 原型（本文件即产出）' },
  { tag: '完成', tagClass: 'doc-tag-done', text: '新建对话流程设计：以输入为中心 + 轻量 context pill' },
  { tag: '完成', tagClass: 'doc-tag-done', text: '项目概念替换原有「分组」，支持工作区绑定' },
  { tag: '完成', tagClass: 'doc-tag-done', text: 'Session 级 Agent 路由方向确定：双 Agent 共存，不强制统一' },
  { tag: '完成', tagClass: 'doc-tag-done', text: '「文件夹」上下文模型确定：session 隔离，通过 /outputs/ 共享产出' },
  { tag: '完成', tagClass: 'doc-tag-done', text: '项目生命周期确定：永久，类 GitHub repo' },
  { tag: '完成', tagClass: 'doc-tag-done', text: '项目入口确定：模板创建 + 独立对话升级' },
]
</script>

<style>
.doc-content {
  max-width: 640px; margin: 0 auto;
  padding: 48px 32px 40px;
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
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
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
