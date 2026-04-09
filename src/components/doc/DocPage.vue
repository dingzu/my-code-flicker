<template>
  <div class="doc-content">

    <!-- 概览 -->
    <template v-if="pageId === 'preface'">
      <div class="doc-hero-tag">OVERVIEW</div>
      <h1 class="doc-h1">Myflicker 产品文档</h1>
      <p class="doc-meta">一寒 · 2026 年 Q2</p>
      <hr class="doc-divider">
      <p class="doc-p">这是一份关于 Myflicker 的产品设计文档。</p>
      <p class="doc-p">Myflicker 是我们正在探索的下一代 AI 助手形态——它整合了 CodeFlicker 的深度工程能力与 Myflicker 的多端通用能力，以「项目」为中心，让用户不再需要在两个产品之间做选择。</p>
      <div class="doc-callout">
        📖 从左侧导航选择任意文档，开始阅读。
      </div>
      <h2 class="doc-h2">文档目录</h2>
      <div class="doc-toc">
        <div class="doc-toc-item" @click="docStore.switchPage('brief')">
          <div class="doc-toc-num">01</div>
          <div class="doc-toc-body">
            <div class="doc-toc-title">产品思路 · 融合方案</div>
            <div class="doc-toc-desc">能力版图、核心架构决策、项目模型、Agent 路由策略</div>
          </div>
          <div class="doc-toc-arrow">→</div>
        </div>
        <div class="doc-toc-item" @click="docStore.switchPage('arch')">
          <div class="doc-toc-num">02</div>
          <div class="doc-toc-body">
            <div class="doc-toc-title">融合方案 · 技术文档</div>
            <div class="doc-toc-desc">系统架构、模块设计、接口协议、数据模型、部署方案</div>
          </div>
          <div class="doc-toc-arrow">→</div>
        </div>
      </div>
    </template>

    <!-- 产品思路 -->
    <template v-if="pageId === 'brief'">
      <div class="doc-hero-tag">PRODUCT BRIEF · v2</div>
      <h1 class="doc-h1">Myflicker 融合方案</h1>
      <p class="doc-meta">一寒 · 2026 年 Q2</p>
      <hr class="doc-divider">

      <!-- ── 0. 问题陈述 ── -->
      <div class="doc-problem">
        <div class="doc-problem-label">我们要解决的问题</div>
        <p class="doc-problem-text">用户在开始工作前，不得不先想「我该用 CodeFlicker 还是 Myflicker」——而他们只是想完成一件事。</p>
      </div>

      <!-- ── 1. 能力版图 ── -->
      <h2 class="doc-h2">01 &nbsp; 两款产品的能力版图</h2>
      <p class="doc-p">两款产品技术栈不同，能力互补，目前相互割裂。</p>

      <div class="capability-map">
        <div class="cap-card cap-card-mf">
          <div class="cap-card-header">
            <div class="cap-card-dot cap-dot-mf"></div>
            <span class="cap-card-title">Myflicker</span>
            <span class="cap-card-sub">基于 OpenClaw</span>
          </div>
          <ul class="cap-list">
            <li><span class="cap-row-label">本地</span>Node + Gateway，完整 Agent 能力</li>
            <li><span class="cap-row-label">云端</span>云端 Gateway</li>
            <li><span class="cap-row-label">端</span>IM · Web · 桌面</li>
          </ul>
        </div>

        <div class="cap-vs">VS</div>

        <div class="cap-card cap-card-cf">
          <div class="cap-card-header">
            <div class="cap-card-dot cap-dot-cf"></div>
            <span class="cap-card-title">CodeFlicker</span>
          </div>
          <ul class="cap-list">
            <li><span class="cap-row-label">本地</span>IDE 编辑器 · Duet 并行</li>
            <li><span class="cap-row-label">云端</span>云端 IDE · Duet 并行</li>
            <li><span class="cap-row-label">端</span>桌面 IDE · 云端 IDE</li>
          </ul>
        </div>
      </div>

      <!-- ── 2. 核心架构决策 ── -->
      <h2 class="doc-h2">02 &nbsp; 核心架构决策</h2>

      <div class="decision-list">
        <div class="decision" v-for="d in decisions" :key="d.num">
          <div class="decision-num">{{ d.num }}</div>
          <div class="decision-body">
            <div class="decision-title">{{ d.title }}</div>
            <div class="decision-desc">{{ d.desc }}</div>
            <div class="decision-rationale" v-if="d.rationale">
              <span class="decision-r-label">理由</span>{{ d.rationale }}
            </div>
          </div>
        </div>
      </div>

      <!-- ── 3. 项目模型 ── -->
      <h2 class="doc-h2">03 &nbsp; 项目（Project）模型</h2>
      <p class="doc-p">项目是永久的工作容器，类比 GitHub repo——用户长期积累成果，不是用完即弃的临时会话。</p>

      <div class="project-model">
        <div class="pm-root">
          <div class="pm-root-icon">📁</div>
          <div class="pm-root-text">
            <div class="pm-root-title">项目（Project）</div>
            <div class="pm-root-sub">永久 · 类 GitHub repo</div>
          </div>
        </div>
        <div class="pm-branches">
          <div class="pm-branch">
            <div class="pm-branch-line"></div>
            <div class="pm-node pm-node-sessions">
              <div class="pm-node-icon">⚡</div>
              <div class="pm-node-title">Sessions</div>
              <div class="pm-node-sub">Duet 并行<br>Session 级 Agent 路由</div>
              <div class="pm-node-agents">
                <span class="pm-agent pm-agent-cf">CF Agent</span>
                <span class="pm-agent pm-agent-gw">Gateway</span>
              </div>
            </div>
          </div>
          <div class="pm-branch">
            <div class="pm-branch-line"></div>
            <div class="pm-node pm-node-outputs">
              <div class="pm-node-icon">📄</div>
              <div class="pm-node-title">Outputs</div>
              <div class="pm-node-sub">自动归档<br>Agent 提炼产出摘要</div>
              <div class="pm-node-tags">
                <span class="pm-output-tag">文件变更</span>
                <span class="pm-output-tag">产出报告</span>
              </div>
            </div>
          </div>
          <div class="pm-branch">
            <div class="pm-branch-line"></div>
            <div class="pm-node pm-node-assets">
              <div class="pm-node-icon">🗂</div>
              <div class="pm-node-title">Assets</div>
              <div class="pm-node-sub">项目关联资产</div>
              <div class="pm-node-tags">
                <span class="pm-output-tag">本地 Workspace</span>
                <span class="pm-output-tag">云端文件</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── 4. Session 级 Agent 路由 ── -->
      <h2 class="doc-h2">04 &nbsp; Session 级 Agent 路由</h2>
      <p class="doc-p">Agent 路由不在项目层决定，而在每次 session 启动时按需选择。同一个项目里的多个并行 session 可以使用不同的 Agent。</p>

      <div class="routing-diagram">
        <div class="rd-project">
          <div class="rd-project-label">同一个项目</div>
          <div class="rd-sessions">
            <div class="rd-session rd-session-cf">
              <div class="rd-session-label">Session A</div>
              <div class="rd-session-task">改代码 · 重构</div>
              <div class="rd-session-arrow">↓</div>
              <div class="rd-agent rd-agent-cf">CF Agent<div class="rd-agent-sub">本地 / 云端 IDE</div></div>
            </div>
            <div class="rd-session rd-session-gw">
              <div class="rd-session-label">Session B</div>
              <div class="rd-session-task">调研 · 文档分析</div>
              <div class="rd-session-arrow">↓</div>
              <div class="rd-agent rd-agent-gw">Gateway Agent<div class="rd-agent-sub">本地 Node / 云端</div></div>
            </div>
            <div class="rd-session rd-session-cf">
              <div class="rd-session-label">Session C</div>
              <div class="rd-session-task">另一个并行任务</div>
              <div class="rd-session-arrow">↓</div>
              <div class="rd-agent rd-agent-cf">CF Agent<div class="rd-agent-sub">本地 / 云端 IDE</div></div>
            </div>
          </div>
          <div class="rd-outputs-bar">
            <div class="rd-outputs-label">共享 /outputs/</div>
            <div class="rd-outputs-items">
              <span>Session A 产出</span>
              <span>Session B 产出</span>
              <span>Session C 产出</span>
            </div>
          </div>
        </div>
      </div>

      <div class="doc-callout">
        🤖 可做智能推断：根据用户第一句话的意图自动选择 Agent，保留手动覆盖能力。
      </div>

      <!-- ── 5. 上下文模型 ── -->
      <h2 class="doc-h2">05 &nbsp; 「文件夹」上下文模型</h2>
      <p class="doc-p">Session 之间是隔离的——各自独立运行，看不到彼此的对话上下文，但可以读取 <code>/outputs/</code> 里彼此的产出文件。这是一个异步协作模型，无实时状态共享。</p>

      <div class="context-model">
        <div class="cm-row cm-row-top">
          <div class="cm-session cm-session-a">
            <div class="cm-s-header">Session A</div>
            <div class="cm-s-agent cm-a-cf">CF Agent</div>
            <div class="cm-s-body">对话上下文<br><span class="cm-locked">🔒 仅自己可见</span></div>
            <div class="cm-s-output">产出 →</div>
          </div>
          <div class="cm-session cm-session-b">
            <div class="cm-s-header">Session B</div>
            <div class="cm-s-agent cm-a-gw">Gateway</div>
            <div class="cm-s-body">对话上下文<br><span class="cm-locked">🔒 仅自己可见</span></div>
            <div class="cm-s-output">产出 →</div>
          </div>
          <div class="cm-session cm-session-c">
            <div class="cm-s-header">Session C</div>
            <div class="cm-s-agent cm-a-cf">CF Agent</div>
            <div class="cm-s-body">对话上下文<br><span class="cm-locked">🔒 仅自己可见</span></div>
            <div class="cm-s-output">产出 →</div>
          </div>
        </div>
        <div class="cm-folder">
          <div class="cm-folder-header">
            <span class="cm-folder-icon">📁</span>
            <span class="cm-folder-title">/outputs/ &nbsp;·&nbsp; 所有 session 可读</span>
          </div>
          <div class="cm-folder-files">
            <div class="cm-file"><span class="cm-file-icon">📝</span>session-a/文件变更.diff</div>
            <div class="cm-file"><span class="cm-file-icon">📊</span>session-b/调研报告.md</div>
            <div class="cm-file"><span class="cm-file-icon">📝</span>session-c/重构方案.md</div>
          </div>
        </div>
      </div>

      <!-- CF vs OpenClaw 对比 -->
      <div class="context-diff">
        <div class="cd-col cd-col-cf">
          <div class="cd-label">CF Agent</div>
          <div class="cd-badge cd-badge-isolation">物理隔离</div>
          <ul class="cd-list">
            <li>访问边界 = workspace 文件夹</li>
            <li>文件夹即沙箱，边界清晰</li>
            <li>跨项目需切换工作区</li>
          </ul>
        </div>
        <div class="cd-col cd-col-gw">
          <div class="cd-label">Gateway / OpenClaw</div>
          <div class="cd-badge cd-badge-focus">上下文聚焦圈</div>
          <ul class="cd-list">
            <li>默认可访问全部云端文件</li>
            <li>项目资产自动注入为优先上下文</li>
            <li>用户指令可随时扩展边界</li>
            <li><strong>独有：</strong>跨项目直接引用</li>
          </ul>
        </div>
      </div>

      <div class="doc-callout">
        💡 OpenClaw 的全局访问不需要被限制，「项目」对它来说是<strong>上下文锚点</strong>而非沙箱。用户可以在 Session 里说「参考我在 XX 项目里做过的方案」，Agent 直接跨项目读取——这是 CF Agent 不具备的能力。
      </div>

      <!-- ── 6. 整体信息架构 ── -->
      <h2 class="doc-h2">06 &nbsp; 整体信息架构</h2>

      <div class="ia-diagram">
        <!-- Root -->
        <div class="ia-level ia-level-root">
          <div class="ia-node ia-root">
            <div class="ia-node-icon">✦</div>
            <div class="ia-node-name">Myflicker</div>
          </div>
        </div>
        <!-- L1 connector -->
        <div class="ia-connectors ia-conn-2">
          <div class="ia-conn-line"></div>
          <div class="ia-conn-line"></div>
        </div>
        <!-- L1 -->
        <div class="ia-level ia-level-l1">
          <div class="ia-node ia-l1-project">
            <div class="ia-node-icon">📁</div>
            <div class="ia-node-name">项目</div>
            <div class="ia-node-sub">永久 · 类 GitHub repo</div>
          </div>
          <div class="ia-node ia-l1-solo">
            <div class="ia-node-icon">💬</div>
            <div class="ia-node-name">独立对话</div>
            <div class="ia-node-sub">云端 · 轻量 · 可升级</div>
          </div>
        </div>
        <!-- L2 connector (under 项目) -->
        <div class="ia-connectors ia-conn-3">
          <div class="ia-conn-line"></div>
          <div class="ia-conn-line"></div>
          <div class="ia-conn-line"></div>
        </div>
        <!-- L2 (under 项目) -->
        <div class="ia-level ia-level-l2">
          <div class="ia-node ia-l2">
            <div class="ia-node-icon">⚡</div>
            <div class="ia-node-name">Sessions</div>
            <div class="ia-node-sub">Duet 并行<br>Session 级路由</div>
          </div>
          <div class="ia-node ia-l2">
            <div class="ia-node-icon">📄</div>
            <div class="ia-node-name">Outputs</div>
            <div class="ia-node-sub">自动归档<br>Agent 提炼摘要</div>
          </div>
          <div class="ia-node ia-l2">
            <div class="ia-node-icon">🗂</div>
            <div class="ia-node-name">Assets</div>
            <div class="ia-node-sub">Workspace<br>云端文件系统</div>
          </div>
        </div>
        <!-- L3 connector -->
        <div class="ia-connectors ia-conn-3">
          <div class="ia-conn-line"></div>
          <div class="ia-conn-line"></div>
          <div class="ia-conn-line"></div>
        </div>
        <!-- L3 agents -->
        <div class="ia-level ia-level-l3">
          <div class="ia-node ia-l3-cf">
            <div class="ia-node-name">CF Agent</div>
            <div class="ia-node-sub">本地 / 云端 IDE<br>物理隔离</div>
          </div>
          <div class="ia-node ia-l3-gw">
            <div class="ia-node-name">Gateway Agent</div>
            <div class="ia-node-sub">本地 Node / 云端<br>上下文聚焦圈</div>
          </div>
          <div class="ia-node ia-l3-out">
            <div class="ia-node-name">文件变更 · 摘要</div>
            <div class="ia-node-sub">diff 粒度归档<br>非对话内容</div>
          </div>
        </div>
      </div>

      <!-- ── 7. 进入路径 ── -->
      <h2 class="doc-h2">07 &nbsp; 降低项目创建门槛</h2>
      <p class="doc-p">项目是永久的，但不意味着用户每次都要先创建项目。三条路径覆盖不同场景：</p>

      <div class="entry-paths">
        <div class="ep-item" v-for="ep in entryPoints" :key="ep.label">
          <div class="ep-badge">{{ ep.label }}</div>
          <div class="ep-body">
            <div class="ep-title">{{ ep.title }}</div>
            <div class="ep-desc">{{ ep.desc }}</div>
          </div>
        </div>
      </div>

      <!-- ── 8. 待解决问题 ── -->
      <h2 class="doc-h2">08 &nbsp; 决策记录 &amp; 待解决问题</h2>

      <div class="decision-log">
        <div class="dl-section">
          <div class="dl-section-title">✅ 已确定</div>
          <div class="dl-items">
            <div class="dl-item" v-for="t in todoDone" :key="t">
              <span class="dl-check">✓</span>{{ t }}
            </div>
          </div>
        </div>
        <div class="dl-section">
          <div class="dl-section-title">🔵 进行中</div>
          <div class="dl-items">
            <div class="dl-item dl-item-doing" v-for="t in todoDoing" :key="t">
              <span class="dl-dot"></span>{{ t }}
            </div>
          </div>
        </div>
        <div class="dl-section">
          <div class="dl-section-title">⬜ 待定</div>
          <div class="dl-items">
            <div class="dl-item dl-item-open" v-for="t in todoOpen" :key="t">
              <span class="dl-open">?</span>{{ t }}
            </div>
          </div>
        </div>
      </div>

    </template>

    <!-- ── 融合方案 · 技术文档 ── -->
    <template v-if="pageId === 'arch'">
      <div class="doc-hero-tag">TECHNICAL SPEC</div>
      <h1 class="doc-h1">融合方案 · 技术文档</h1>
      <p class="doc-meta">一寒 · 2026 年 Q2 · 草稿</p>
      <hr class="doc-divider">

      <div class="doc-problem">
        <div class="doc-problem-label">设计目标</div>
        <p class="doc-problem-text">在不破坏 CodeFlicker 和 Myflicker 各自技术栈的前提下，通过统一的「项目层」抽象，让两套 Agent 体系（CF 自研 Agent / Gateway + OpenClaw）在同一产品界面内协同工作。</p>
      </div>

      <h2 class="doc-h2">01 &nbsp; 系统架构总览</h2>
      <div class="arch-diagram">
        <div class="arch-layer">
          <div class="arch-layer-label">客户端层</div>
          <div class="arch-layer-nodes">
            <div class="arch-node arch-node-client">桌面端<div class="arch-node-sub">Electron / Web</div></div>
            <div class="arch-node arch-node-client">IM 插件<div class="arch-node-sub">KIM Plugin</div></div>
            <div class="arch-node arch-node-client">Web 端<div class="arch-node-sub">Browser</div></div>
          </div>
        </div>
        <div class="arch-arrow-row">↓ &nbsp; 统一 UI 层（项目 / Session / Outputs）&nbsp; ↓</div>
        <div class="arch-layer arch-layer-highlight">
          <div class="arch-layer-label">项目层（新增）</div>
          <div class="arch-layer-nodes">
            <div class="arch-node arch-node-project">Project Service<div class="arch-node-sub">项目 CRUD · Assets · Outputs</div></div>
            <div class="arch-node arch-node-project">Session Orchestrator<div class="arch-node-sub">Duet 并行调度 · Agent 路由</div></div>
          </div>
        </div>
        <div class="arch-arrow-row">↓ &nbsp; Session 级 Agent 路由 &nbsp; ↓</div>
        <div class="arch-layer">
          <div class="arch-layer-label">Agent 层</div>
          <div class="arch-layer-nodes">
            <div class="arch-node arch-node-cf">CF Agent<div class="arch-node-sub">本地 IDE / 云端 IDE</div></div>
            <div class="arch-node arch-node-gw">Gateway Agent<div class="arch-node-sub">本地 Node / 云端</div></div>
          </div>
        </div>
        <div class="arch-arrow-row">↓ &nbsp; 执行层 &nbsp; ↓</div>
        <div class="arch-layer">
          <div class="arch-layer-label">执行层</div>
          <div class="arch-layer-nodes">
            <div class="arch-node arch-node-exec">本地 Workspace<div class="arch-node-sub">文件系统 · Git</div></div>
            <div class="arch-node arch-node-exec">云端 IDE<div class="arch-node-sub">Container</div></div>
            <div class="arch-node arch-node-exec">云端文件系统<div class="arch-node-sub">OpenClaw FS</div></div>
          </div>
        </div>
      </div>

      <h2 class="doc-h2">02 &nbsp; 核心模块设计</h2>
      <div class="decision-list">
        <div class="decision" v-for="m in modules" :key="m.name">
          <div class="decision-num" style="min-width:80px;font-size:10px">{{ m.name }}</div>
          <div class="decision-body">
            <div class="decision-title">{{ m.title }}</div>
            <div class="decision-desc">{{ m.desc }}</div>
            <div class="arch-props" v-if="m.props">
              <div class="arch-prop" v-for="p in m.props" :key="p.k">
                <span class="arch-prop-k">{{ p.k }}</span>
                <span class="arch-prop-v">{{ p.v }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 class="doc-h2">03 &nbsp; Session 统一接口协议</h2>
      <p class="doc-p">CF Agent 和 Gateway Agent 共用同一套 Session 协议，Project 层不感知底层实现差异。</p>
      <div class="code-block">
        <div class="code-block-header">SessionConfig · TypeScript Interface</div>
        <pre class="code-pre">interface SessionConfig {
  sessionId:   string
  projectId:   string
  agentType:   'cf-agent' | 'gateway-agent'   // session 级路由
  agentTarget: {
    // CF Agent
    workspacePath?: string   // 本地工作区路径
    cloudIdeUrl?:   string   // 云端 IDE 地址
    // Gateway Agent
    gatewayMode?:   'local-node' | 'cloud'
    focusScope?:    string[] // 上下文聚焦圈：项目关联资产路径列表
  }
  context: {
    projectAssets:  Asset[]  // 自动注入的项目资产
    outputsRef:     string   // /outputs/ 目录引用，供跨 session 读取
  }
}</pre>
      </div>
      <div class="code-block">
        <div class="code-block-header">OutputRecord · 产出归档结构</div>
        <pre class="code-pre">interface OutputRecord {
  sessionId:   string
  projectId:   string
  type:        'file-diff' | 'new-file' | 'report'
  content:     string       // diff / 文件内容 / 报告 markdown
  summary:     string       // Agent 自动提炼的一句话摘要
  createdAt:   number
  agentType:   'cf-agent' | 'gateway-agent'
}</pre>
      </div>

      <h2 class="doc-h2">04 &nbsp; 核心数据模型</h2>
      <div class="data-model">
        <div class="dm-entity" v-for="e in entities" :key="e.name">
          <div class="dm-entity-header">
            <span class="dm-entity-name">{{ e.name }}</span>
            <span class="dm-entity-desc">{{ e.desc }}</span>
          </div>
          <div class="dm-fields">
            <div class="dm-field" v-for="f in e.fields" :key="f.name">
              <span class="dm-field-name">{{ f.name }}</span>
              <span class="dm-field-type">{{ f.type }}</span>
              <span class="dm-field-note">{{ f.note }}</span>
            </div>
          </div>
        </div>
      </div>

      <h2 class="doc-h2">05 &nbsp; Agent 路由逻辑</h2>
      <p class="doc-p">路由在 Session 启动时执行，优先使用用户手动指定，否则走智能推断。</p>
      <div class="code-block">
        <div class="code-block-header">路由决策伪代码</div>
        <pre class="code-pre">function resolveAgent(userInput, project):
  // 1. 手动指定优先
  if userInput.agentOverride:
    return userInput.agentOverride

  // 2. 智能推断
  signals = extractSignals(userInput.firstMessage)

  if signals.hasLocalFileOp       → 'cf-agent'         // "修改这个文件"
  if signals.hasCodeRefactor      → 'cf-agent'         // "重构这段代码"
  if signals.hasIdeOperation      → 'cf-agent'         // "启动调试"
  if signals.hasWebSearch         → 'gateway-agent'    // "帮我搜索"
  if signals.hasDocAnalysis       → 'gateway-agent'    // "分析这份文档"
  if signals.hasCrossProjectRef   → 'gateway-agent'    // "参考另一个项目"

  // 3. 默认
  if project.defaultAgent: return project.defaultAgent
  return 'gateway-agent'  // 全局默认</pre>
      </div>

      <h2 class="doc-h2">06 &nbsp; 上下文注入策略</h2>
      <div class="context-inject">
        <div class="ci-col ci-col-cf">
          <div class="ci-label">CF Agent · 物理隔离</div>
          <ul class="ci-list">
            <li>MCP rootPath = workspace 绑定路径</li>
            <li>文件访问边界 = rootPath 内</li>
            <li>跨项目需切换 workspace</li>
            <li>自动注入 Git 状态、最近变更</li>
          </ul>
        </div>
        <div class="ci-col ci-col-gw">
          <div class="ci-label">Gateway Agent · 上下文聚焦圈</div>
          <ul class="ci-list">
            <li>System Prompt 注入项目 focusScope 资产列表</li>
            <li>优先检索 focusScope 内的文件</li>
            <li>用户指令触发时可扩展到全局</li>
            <li>跨项目引用：直接读取其他项目 /outputs/</li>
          </ul>
        </div>
      </div>

      <h2 class="doc-h2">07 &nbsp; 部署方案</h2>
      <div class="deploy-table">
        <div class="dt-header">
          <span>服务</span><span>部署形态</span><span>依赖</span>
        </div>
        <div class="dt-row" v-for="svc in services" :key="svc.name">
          <span class="dt-name">{{ svc.name }}</span>
          <span class="dt-deploy">{{ svc.deploy }}</span>
          <span class="dt-deps">{{ svc.deps }}</span>
        </div>
      </div>

      <h2 class="doc-h2">08 &nbsp; 待确认技术决策</h2>
      <div class="decision-log">
        <div class="dl-section">
          <div class="dl-items">
            <div class="dl-item dl-item-open" v-for="t in techTodos" :key="t">
              <span class="dl-open">?</span>{{ t }}
            </div>
          </div>
        </div>
      </div>

    </template>

  </div>
</template>

<script setup>
import { useDocStore } from '../../stores/docStore'

defineProps({ pageId: String })
const docStore = useDocStore()

const decisions = [
  {
    num: '决策 A',
    title: '双 Agent 共存，不强制统一底层',
    desc: 'CF 自研 Agent 和 Gateway Agent 各自保留特长，项目层不感知使用哪个。',
    rationale: '两套 Agent 能力差异是真实的（物理隔离 vs 全局访问），强行统一会损失能力，不如让用户按任务选择。'
  },
  {
    num: '决策 B',
    title: 'Agent 路由粒度 = Session 级',
    desc: '同一个项目里的不同 session 可以使用不同 Agent。路由在 session 启动时决定，不在项目层设置。',
    rationale: '用户发起一个 session 时，天然知道这次要做什么（写代码 vs 调研），路由粒度与用户行为粒度对齐。'
  },
  {
    num: '决策 C',
    title: '项目上下文模型 = 「文件夹」',
    desc: 'Session 之间隔离运行，通过共享 /outputs/ 目录异步传递产出，看不到彼此对话上下文。',
    rationale: '「文件夹」是用户已经理解的心智模型，工程复杂度可控，同时支撑 Duet 并行的核心价值。'
  },
  {
    num: '决策 D',
    title: 'Outputs 自动归档「产物」，不归档「内容」',
    desc: 'Agent 产出的文件变更、新建文档、执行报告自动归档；对话解释、中间推理不归档。',
    rationale: '防止 /outputs/ 成为垃圾桶，用产物粒度而非内容粒度控制信噪比。'
  },
  {
    num: '决策 E',
    title: '项目是永久的，类 GitHub repo',
    desc: '项目不是一次性工作台，而是长期积累工作成果的容器。',
    rationale: '用户已经理解 repo 的心智模型，降低学习成本；长期沉淀的 outputs 和 sessions 才有复用价值。'
  },
]

const entryPoints = [
  {
    label: 'A',
    title: '独立对话 → 升级为项目',
    desc: '先随便聊，觉得值得长期管理时一键「升级为项目」。历史对话自动迁移为项目的第一个 session，/outputs/ 同步归档。不强迫用户提前决策，降低启动摩擦。'
  },
  {
    label: 'B',
    title: '从模板创建项目',
    desc: '代码项目（预设 CF Agent + Git 绑定）/ 调研项目（预设 Gateway + 文档工具）/ 产品设计（预设 Gateway + 原型资产）/ 空白项目。带预设配置，减少首次启动的配置成本。'
  },
  {
    label: 'C',
    title: '直接新建空白项目',
    desc: '老用户路径，直接创建永久项目，手动配置执行环境和 Assets。'
  },
]

const todoDone = [
  '新建对话流程：以输入框为中心 + 轻量 context pill 选执行位置',
  '项目概念替换原有「分组」，支持工作区绑定',
  'Session 级 Agent 路由：双 Agent 共存，不强制统一',
  '「文件夹」上下文模型：session 隔离，通过 /outputs/ 共享产出',
  'CF Agent 物理隔离 vs OpenClaw 上下文聚焦圈的差异界定',
  '项目生命周期：永久，类 GitHub repo',
  '项目入口：模板创建 + 独立对话升级',
]

const todoDoing = [
  '桌面端 UI 原型（本文件即进行中产出）',
]

const todoOpen = [
  'Agent 统一接口层：CF Agent 和 Gateway Agent 如何共用同一套 session 协议？',
  'Outputs 视图 UI：如何清晰呈现多个并行 session 的产出，防止信噪比差？',
  '独立对话升级为项目的交互流程：触发时机、迁移逻辑、Assets 归属',
  'Duet 并行 session 的 UI 表达：多标签？分屏？如何感知并行状态？',
  '本地 workspace 权限模型：多端访问时如何安全隔离？',
]
const techTodos = [
  'Session Orchestrator 的高可用方案：展平还是哨兵模式？',
  '/outputs/ 存储层方案：云端对象存储 vs 文件服务 vs 数据库？',
  'CF Agent 和 Gateway Agent 的认证统一：如何共用同一套用户身份体系？',
  '本地 Workspace 多端访问与权限隔离方案',
  'Gateway 本地 Node 的安装/升级机制设计',
]

const modules = [
  {
    name: 'Project Service',
    title: '项目管理服务',
    desc: '负责项目的 CRUD、Assets 管理、Outputs 归档。是项目层的核心服务，CF Agent 和 Gateway Agent 均通过此服务读写项目数据。',
    props: [
      { k: '接口', v: 'REST + WebSocket（实时通知 Outputs 更新）' },
      { k: '存储', v: 'Projects / Sessions / Outputs 三张表' },
      { k: '归档触发', v: 'Agent 完成一个 checkpoint 后推送 OutputRecord' },
    ]
  },
  {
    name: 'Session Orchestrator',
    title: 'Duet 并行调度器',
    desc: '管理同一项目下多个并行 Session 的生命周期，执行 Agent 路由决策，分发任务给对应的 Agent Runtime。',
    props: [
      { k: 'Agent 路由', v: '手动指定 > 智能推断 > 项目默认 > 全局默认' },
      { k: '并行上限', v: '单项目最多 N 个并发 Session（待定）' },
      { k: '隔离保证', v: 'Session 间上下文完全隔离，仅通过 /outputs/ 异步共享' },
    ]
  },
  {
    name: 'CF Agent Runtime',
    title: 'CodeFlicker Agent 运行时',
    desc: '原有 CF 自研 Agent 的封装层，暴露统一 Session 协议接口。支持本地 IDE 和云端 IDE 两种执行模式。',
    props: [
      { k: '上下文边界', v: '物理隔离，MCP rootPath = workspace 路径' },
      { k: '产出归档', v: '文件变更转为 file-diff 类型 OutputRecord' },
      { k: '接入方式', v: '实现 IAgentRuntime 统一接口' },
    ]
  },
  {
    name: 'Gateway Runtime',
    title: 'Gateway Agent 运行时',
    desc: '原有 Gateway + OpenClaw 的封装层，暴露统一 Session 协议接口。支持本地 Node 和云端两种部署模式。',
    props: [
      { k: '上下文边界', v: '上下文聚焦圈，focusScope 注入 System Prompt' },
      { k: '产出归档', v: '生成文档/报告转为 new-file / report 类型 OutputRecord' },
      { k: '接入方式', v: '实现 IAgentRuntime 统一接口' },
    ]
  },
]

const entities = [
  {
    name: 'Project',
    desc: '项目',
    fields: [
      { name: 'id', type: 'string', note: 'UUID' },
      { name: 'name', type: 'string', note: '项目名称' },
      { name: 'ownerId', type: 'string', note: '创建者' },
      { name: 'defaultAgent', type: 'enum', note: 'cf-agent | gateway-agent | auto' },
      { name: 'workspacePath', type: 'string?', note: '本地 workspace 绑定路径（可选）' },
      { name: 'focusScope', type: 'string[]', note: 'Gateway 上下文聚焦圈资产列表' },
      { name: 'templateId', type: 'string?', note: '创建时使用的模板' },
      { name: 'createdAt', type: 'number', note: 'Unix timestamp' },
    ]
  },
  {
    name: 'Session',
    desc: '对话',
    fields: [
      { name: 'id', type: 'string', note: 'UUID' },
      { name: 'projectId', type: 'string?', note: '所属项目（独立对话为 null）' },
      { name: 'agentType', type: 'enum', note: 'cf-agent | gateway-agent' },
      { name: 'agentTarget', type: 'object', note: '路由参数（workspacePath / gatewayMode）' },
      { name: 'status', type: 'enum', note: 'idle | running | done | error' },
      { name: 'createdAt', type: 'number', note: 'Unix timestamp' },
    ]
  },
  {
    name: 'OutputRecord',
    desc: '产出归档',
    fields: [
      { name: 'id', type: 'string', note: 'UUID' },
      { name: 'sessionId', type: 'string', note: '来源 Session' },
      { name: 'projectId', type: 'string', note: '所属项目' },
      { name: 'type', type: 'enum', note: 'file-diff | new-file | report' },
      { name: 'content', type: 'string', note: 'diff / 文件内容 / markdown' },
      { name: 'summary', type: 'string', note: 'Agent 自动提炼的一句话摘要' },
      { name: 'agentType', type: 'enum', note: 'cf-agent | gateway-agent' },
      { name: 'createdAt', type: 'number', note: 'Unix timestamp' },
    ]
  },
]

const services = [
  { name: 'Myflicker Web/桌面端', deploy: 'frontend-cloud（静态）', deps: 'Project Service API' },
  { name: 'Project Service', deploy: 'K8s · Node.js', deps: 'DB, Auth Service' },
  { name: 'Session Orchestrator', deploy: 'K8s · Node.js', deps: 'Project Service, Agent Runtimes' },
  { name: 'CF Agent Runtime', deploy: '本地进程 / 云端 Container', deps: 'CF IDE, MCP' },
  { name: 'Gateway Runtime (云端)', deploy: 'K8s · Node.js', deps: 'OpenClaw, 云端文件系统' },
  { name: 'Gateway Runtime (本地)', deploy: '用户本地 Node 进程', deps: 'OpenClaw, 本地文件系统' },
]
</script>

<style>
.doc-content {
  max-width: 660px; margin: 0 auto;
  padding: 48px 32px 60px;
}

/* ── 基础排版 ── */
.doc-hero-tag {
  font-size: 10px; font-weight: 700; letter-spacing: 0.16em;
  color: #6366f1; text-transform: uppercase; margin-bottom: 14px;
}
.doc-h1 {
  font-size: 28px; font-weight: 700; color: #0f0f0f;
  letter-spacing: -0.03em; line-height: 1.2; margin: 0 0 10px;
}
.doc-meta { font-size: 12px; color: #aaa; margin: 0 0 28px; }
.doc-divider { border: none; border-top: 1px solid #ebebea; margin: 0 0 32px; }
.doc-h2 {
  font-size: 13px; font-weight: 700; color: #6366f1;
  letter-spacing: 0.02em; text-transform: uppercase;
  margin: 40px 0 14px; display: flex; align-items: center; gap: 6px;
}
.doc-p { font-size: 14px; line-height: 1.75; color: #3d3d3d; margin: 0 0 16px; }
.doc-callout {
  background: #f0f0ff; border-left: 3px solid #6366f1;
  border-radius: 0 8px 8px 0;
  padding: 12px 16px; font-size: 13.5px; color: #3730a3;
  line-height: 1.65; margin: 0 0 24px;
}
code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 12.5px; background: #f3f3f0; color: #6366f1;
  padding: 1px 5px; border-radius: 4px;
}

/* ── 概览 / TOC ── */
.doc-toc { display: flex; flex-direction: column; gap: 8px; }
.doc-toc-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; border-radius: 10px;
  background: #fff; border: 1px solid rgba(0,0,0,0.07);
  cursor: pointer; transition: box-shadow 0.15s, border-color 0.15s;
}
.doc-toc-item:hover { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
.doc-toc-num { font-size: 11px; font-weight: 800; color: #9ca3af; flex-shrink: 0; min-width: 18px; }
.doc-toc-body { flex: 1; }
.doc-toc-title { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 3px; }
.doc-toc-desc { font-size: 12.5px; color: #6b7280; line-height: 1.4; }
.doc-toc-arrow { color: #6366f1; font-size: 16px; }

/* ── 问题陈述 ── */
.doc-problem {
  background: #fef9ec; border: 1px solid #fde68a;
  border-radius: 10px; padding: 16px 18px; margin-bottom: 32px;
}
.doc-problem-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #b45309; text-transform: uppercase; margin-bottom: 8px; }
.doc-problem-text { font-size: 14.5px; color: #78350f; line-height: 1.65; font-weight: 500; margin: 0; }

/* ── 能力版图 ── */
.capability-map {
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px;
  align-items: start; margin-bottom: 20px;
}
.cap-vs {
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: #9ca3af;
  letter-spacing: 0.1em; padding-top: 36px;
}
.cap-card {
  border-radius: 12px; padding: 18px 20px;
  border: 1px solid rgba(0,0,0,0.07); background: #fff;
}
.cap-card-mf { border-left: 3px solid #6366f1; }
.cap-card-cf { border-left: 3px solid #16a34a; }
.cap-card-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 14px; }
.cap-card-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-bottom: 1px; }
.cap-dot-mf { background: #6366f1; }
.cap-dot-cf { background: #16a34a; }
.cap-card-title { font-size: 13px; font-weight: 700; color: #111; }
.cap-card-sub { font-size: 11px; color: #9ca3af; }
.cap-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.cap-list li { display: flex; align-items: baseline; gap: 10px; font-size: 13px; color: #374151; line-height: 1.5; }
.cap-row-label { font-size: 10.5px; font-weight: 600; color: #9ca3af; flex-shrink: 0; width: 28px; letter-spacing: 0.02em; }

/* ── 决策列表 ── */
.decision-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px; }
.decision {
  display: flex; gap: 14px;
  padding: 16px 18px; border-radius: 12px; background: #fff;
  border: 1px solid rgba(0,0,0,0.07);
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.decision-num {
  font-size: 10px; font-weight: 800; color: #6366f1; letter-spacing: 0.04em;
  white-space: nowrap; flex-shrink: 0; padding-top: 2px;
}
.decision-title { font-size: 14px; font-weight: 600; color: #0f0f0f; margin-bottom: 5px; }
.decision-desc { font-size: 13px; line-height: 1.6; color: #4b5563; margin-bottom: 6px; }
.decision-rationale { font-size: 12.5px; color: #6b7280; line-height: 1.5; }
.decision-r-label {
  display: inline-block; font-size: 10px; font-weight: 700; color: #9ca3af;
  letter-spacing: 0.06em; text-transform: uppercase; margin-right: 6px;
}

/* ── 项目模型 ── */
.project-model {
  background: #fff; border: 1px solid rgba(0,0,0,0.07);
  border-radius: 14px; padding: 24px; margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.pm-root {
  display: flex; align-items: center; gap: 12px;
  padding-bottom: 20px; margin-bottom: 20px;
  border-bottom: 1px dashed #e5e5e3;
}
.pm-root-icon { font-size: 28px; }
.pm-root-title { font-size: 16px; font-weight: 700; color: #0f0f0f; margin-bottom: 3px; }
.pm-root-sub { font-size: 12px; color: #9ca3af; }
.pm-branches { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.pm-branch { display: flex; flex-direction: column; align-items: center; gap: 0; }
.pm-branch-line { width: 1px; height: 16px; background: #d1d5db; }
.pm-node {
  width: 100%; border-radius: 10px; padding: 14px;
  text-align: center; border: 1.5px solid;
}
.pm-node-sessions { background: #f0f4ff; border-color: rgba(99,102,241,0.3); }
.pm-node-outputs  { background: #fef9ec; border-color: rgba(245,158,11,0.3); }
.pm-node-assets   { background: #f0fdf4; border-color: rgba(34,197,94,0.3); }
.pm-node-icon { font-size: 20px; margin-bottom: 6px; }
.pm-node-title { font-size: 13px; font-weight: 700; color: #0f0f0f; margin-bottom: 4px; }
.pm-node-sub { font-size: 11px; color: #6b7280; line-height: 1.4; margin-bottom: 8px; }
.pm-node-agents { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
.pm-agent { font-size: 10.5px; font-weight: 600; padding: 2px 7px; border-radius: 5px; }
.pm-agent-cf { background: #dcfce7; color: #15803d; }
.pm-agent-gw { background: #e0e7ff; color: #4338ca; }
.pm-node-tags { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
.pm-output-tag { font-size: 10.5px; background: rgba(0,0,0,0.05); color: #374151; padding: 2px 7px; border-radius: 5px; }

/* ── 路由图 ── */
.routing-diagram { background: #fafafa; border: 1px solid rgba(0,0,0,0.07); border-radius: 14px; padding: 20px; margin-bottom: 20px; }
.rd-project-label { font-size: 11px; font-weight: 700; color: #9ca3af; letter-spacing: 0.08em; text-transform: uppercase; text-align: center; margin-bottom: 16px; }
.rd-sessions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
.rd-session {
  border-radius: 10px; padding: 12px; text-align: center;
  border: 1.5px solid;
}
.rd-session-cf { background: #f0fdf4; border-color: rgba(22,163,74,0.2); }
.rd-session-gw { background: #f0f4ff; border-color: rgba(99,102,241,0.2); }
.rd-session-label { font-size: 10px; font-weight: 700; color: #9ca3af; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4px; }
.rd-session-task { font-size: 12px; color: #374151; margin-bottom: 8px; font-weight: 500; }
.rd-session-arrow { font-size: 14px; color: #d1d5db; margin-bottom: 8px; }
.rd-agent { font-size: 12px; font-weight: 700; padding: 6px 10px; border-radius: 7px; }
.rd-agent-sub { font-size: 10px; font-weight: 400; color: inherit; opacity: 0.75; margin-top: 2px; }
.rd-agent-cf { background: #dcfce7; color: #15803d; }
.rd-agent-gw { background: #e0e7ff; color: #4338ca; }
.rd-outputs-bar {
  background: #fff; border: 1px solid rgba(0,0,0,0.08);
  border-radius: 8px; padding: 10px 14px;
  display: flex; align-items: center; gap: 12px;
}
.rd-outputs-label { font-size: 11px; font-weight: 700; color: #6b7280; white-space: nowrap; }
.rd-outputs-items { display: flex; gap: 8px; flex-wrap: wrap; }
.rd-outputs-items span { font-size: 11px; color: #6b7280; background: #f3f4f6; padding: 2px 8px; border-radius: 5px; }

/* ── 上下文模型图 ── */
.context-model { margin-bottom: 16px; }
.cm-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 0; }
.cm-session {
  border-radius: 10px 10px 0 0; padding: 12px; text-align: center;
  border: 1.5px solid rgba(0,0,0,0.08); border-bottom: none;
}
.cm-session-a { background: #f0fdf4; }
.cm-session-b { background: #f0f4ff; }
.cm-session-c { background: #f0fdf4; }
.cm-s-header { font-size: 10px; font-weight: 800; color: #9ca3af; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 6px; }
.cm-s-agent { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 5px; display: inline-block; margin-bottom: 8px; }
.cm-a-cf { background: #dcfce7; color: #15803d; }
.cm-a-gw { background: #e0e7ff; color: #4338ca; }
.cm-s-body { font-size: 11.5px; color: #6b7280; line-height: 1.4; margin-bottom: 8px; }
.cm-locked { font-size: 11px; color: #9ca3af; }
.cm-s-output { font-size: 11px; color: #9ca3af; }
.cm-folder {
  background: #fff; border: 1.5px solid rgba(0,0,0,0.1);
  border-radius: 0 0 10px 10px; padding: 14px 16px;
  margin-bottom: 20px;
}
.cm-folder-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.cm-folder-icon { font-size: 16px; }
.cm-folder-title { font-size: 12.5px; font-weight: 700; color: #374151; }
.cm-folder-files { display: flex; flex-direction: column; gap: 6px; }
.cm-file { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #6b7280; }
.cm-file-icon { font-size: 13px; }

/* ── CF vs Gateway 对比 ── */
.context-diff { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
.cd-col { border-radius: 10px; padding: 16px; border: 1.5px solid rgba(0,0,0,0.07); }
.cd-col-cf { background: #f0fdf4; border-color: rgba(22,163,74,0.2); }
.cd-col-gw { background: #f0f4ff; border-color: rgba(99,102,241,0.2); }
.cd-label { font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px; }
.cd-col-cf .cd-label { color: #15803d; }
.cd-col-gw .cd-label { color: #4338ca; }
.cd-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 6px; display: inline-block; margin-bottom: 10px; }
.cd-badge-isolation { background: #dcfce7; color: #15803d; }
.cd-badge-focus { background: #e0e7ff; color: #4338ca; }
.cd-list { margin: 0; padding-left: 16px; font-size: 12.5px; color: #374151; line-height: 1.9; }

/* ── 信息架构图 ── */
.ia-diagram {
  background: #fff; border: 1px solid rgba(0,0,0,0.07);
  border-radius: 14px; padding: 28px 20px; margin-bottom: 20px;
  display: flex; flex-direction: column; align-items: center; gap: 0;
}
.ia-level { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.ia-level-root { margin-bottom: 0; }
.ia-level-l1 { }
.ia-level-l2 { }
.ia-level-l3 { }
.ia-connectors {
  display: flex; gap: 0; justify-content: center;
  height: 24px; position: relative; width: 100%;
  margin: 0;
}
.ia-conn-2 { }
.ia-conn-3 { }
.ia-conn-line {
  flex: 1; border-right: 1px dashed #d1d5db; height: 100%;
}
.ia-conn-line:last-child { border-right: none; }
.ia-node {
  border-radius: 10px; padding: 10px 16px; text-align: center;
  border: 1.5px solid rgba(0,0,0,0.08);
  display: flex; flex-direction: column; align-items: center; gap: 3px;
}
.ia-root {
  background: #0f0f0f; color: #fff; border-color: #0f0f0f;
  padding: 12px 28px; border-radius: 10px;
}
.ia-root .ia-node-icon { font-size: 16px; margin-bottom: 2px; }
.ia-root .ia-node-name { font-size: 15px; font-weight: 700; }
.ia-l1-project { background: #f0f4ff; border-color: rgba(99,102,241,0.3); min-width: 140px; }
.ia-l1-solo    { background: #fafafa; border-color: rgba(0,0,0,0.08); min-width: 140px; }
.ia-l2 { background: #fafafa; border-color: rgba(0,0,0,0.07); min-width: 120px; }
.ia-l3-cf  { background: #f0fdf4; border-color: rgba(22,163,74,0.25); min-width: 120px; }
.ia-l3-gw  { background: #f0f4ff; border-color: rgba(99,102,241,0.25); min-width: 120px; }
.ia-l3-out { background: #fef9ec; border-color: rgba(245,158,11,0.25); min-width: 120px; }
.ia-node-icon { font-size: 16px; }
.ia-node-name { font-size: 12.5px; font-weight: 600; color: #111; }
.ia-node-sub  { font-size: 10.5px; color: #9ca3af; line-height: 1.4; }

/* ── 进入路径 ── */
.entry-paths { display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px; }
.ep-item { display: flex; gap: 14px; align-items: flex-start; padding: 14px 16px; border-radius: 12px; background: #fff; border: 1px solid rgba(0,0,0,0.07); }
.ep-badge {
  width: 28px; height: 28px; border-radius: 8px; background: #6366f1; color: #fff;
  font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ep-title { font-size: 14px; font-weight: 600; color: #0f0f0f; margin-bottom: 5px; }
.ep-desc { font-size: 13px; line-height: 1.65; color: #4b5563; }

/* ── 决策记录 ── */
.decision-log { display: flex; flex-direction: column; gap: 16px; }
.dl-section { }
.dl-section-title { font-size: 12px; font-weight: 700; color: #6b7280; margin-bottom: 8px; }
.dl-items { display: flex; flex-direction: column; gap: 6px; }
.dl-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: #374151; line-height: 1.5; }
.dl-check { color: #16a34a; font-size: 13px; flex-shrink: 0; margin-top: 1px; }
.dl-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #6366f1;
  flex-shrink: 0; margin-top: 6px;
}
.dl-open {
  width: 16px; height: 16px; border-radius: 4px; background: #f3f4f6;
  font-size: 10px; font-weight: 800; color: #9ca3af;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 2px;
}
.dl-item-doing { color: #4338ca; }
.dl-item-open  { color: #6b7280; }

/* ── 架构图 ── */
.arch-diagram { display: flex; flex-direction: column; gap: 0; margin-bottom: 20px; }
.arch-layer {
  background: #fff; border: 1px solid rgba(0,0,0,0.07);
  border-radius: 10px; padding: 14px 16px;
}
.arch-layer-highlight { background: #f5f3ff; border-color: rgba(99,102,241,0.2); }
.arch-layer-label { font-size: 10px; font-weight: 700; color: #9ca3af; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px; }
.arch-layer-nodes { display: flex; gap: 10px; flex-wrap: wrap; }
.arch-node { padding: 8px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; text-align: center; border: 1px solid rgba(0,0,0,0.08); }
.arch-node-sub { font-size: 10.5px; font-weight: 400; color: #9ca3af; margin-top: 2px; }
.arch-node-client  { background: #f9fafb; color: #374151; }
.arch-node-project { background: #ede9fe; color: #5b21b6; border-color: rgba(139,92,246,0.2); }
.arch-node-cf      { background: #dcfce7; color: #15803d; border-color: rgba(22,163,74,0.2); }
.arch-node-gw      { background: #e0e7ff; color: #4338ca; border-color: rgba(99,102,241,0.2); }
.arch-node-exec    { background: #fafafa; color: #6b7280; }
.arch-arrow-row {
  text-align: center; font-size: 11.5px; color: #d1d5db;
  padding: 6px 0; letter-spacing: 0.02em;
}

/* ── arch props ── */
.arch-props { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
.arch-prop { display: flex; gap: 8px; font-size: 12.5px; }
.arch-prop-k { color: #9ca3af; flex-shrink: 0; min-width: 52px; }
.arch-prop-v { color: #374151; }

/* ── 代码块 ── */
.code-block { margin-bottom: 16px; border-radius: 10px; overflow: hidden; border: 1px solid rgba(0,0,0,0.07); }
.code-block-header { font-size: 11px; font-weight: 600; color: #6b7280; background: #f3f4f6; padding: 8px 14px; border-bottom: 1px solid rgba(0,0,0,0.06); letter-spacing: 0.03em; }
.code-pre {
  margin: 0; padding: 14px 16px;
  font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 12px; line-height: 1.7; color: #1f2937;
  background: #fff; overflow-x: auto;
  white-space: pre;
}

/* ── 数据模型 ── */
.data-model { display: flex; flex-direction: column; gap: 12px; margin-bottom: 8px; }
.dm-entity { border: 1px solid rgba(0,0,0,0.07); border-radius: 10px; overflow: hidden; }
.dm-entity-header { display: flex; align-items: baseline; gap: 10px; padding: 10px 14px; background: #f9fafb; border-bottom: 1px solid rgba(0,0,0,0.06); }
.dm-entity-name { font-size: 13px; font-weight: 700; color: #111; font-family: 'SF Mono', monospace; }
.dm-entity-desc { font-size: 11.5px; color: #9ca3af; }
.dm-fields { display: flex; flex-direction: column; }
.dm-field { display: grid; grid-template-columns: 140px 120px 1fr; gap: 8px; padding: 7px 14px; font-size: 12px; border-bottom: 1px solid rgba(0,0,0,0.04); align-items: baseline; }
.dm-field:last-child { border-bottom: none; }
.dm-field-name { font-family: 'SF Mono', monospace; color: #374151; font-weight: 500; }
.dm-field-type { color: #6366f1; font-family: 'SF Mono', monospace; font-size: 11px; }
.dm-field-note { color: #9ca3af; font-size: 11.5px; }

/* ── 上下文注入 ── */
.context-inject { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
.ci-col { border-radius: 10px; padding: 16px; border: 1.5px solid rgba(0,0,0,0.07); }
.ci-col-cf { background: #f0fdf4; border-color: rgba(22,163,74,0.2); }
.ci-col-gw { background: #f0f4ff; border-color: rgba(99,102,241,0.2); }
.ci-label { font-size: 11px; font-weight: 700; margin-bottom: 10px; }
.ci-col-cf .ci-label { color: #15803d; }
.ci-col-gw .ci-label { color: #4338ca; }
.ci-list { margin: 0; padding-left: 16px; font-size: 12.5px; color: #374151; line-height: 1.9; }

/* ── 部署表格 ── */
.deploy-table { border: 1px solid rgba(0,0,0,0.07); border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
.dt-header { display: grid; grid-template-columns: 1.6fr 1.2fr 1.4fr; gap: 8px; padding: 8px 14px; background: #f3f4f6; font-size: 10.5px; font-weight: 700; color: #9ca3af; letter-spacing: 0.06em; text-transform: uppercase; }
.dt-row { display: grid; grid-template-columns: 1.6fr 1.2fr 1.4fr; gap: 8px; padding: 9px 14px; font-size: 12.5px; border-top: 1px solid rgba(0,0,0,0.05); align-items: center; }
.dt-row:hover { background: #fafafa; }
.dt-name { color: #111; font-weight: 500; }
.dt-deploy { color: #374151; }
.dt-deps { color: #6b7280; font-size: 11.5px; }
</style>
