import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  // 团队列表
  const teams = ref([
    { id: 'personal', name: '个人空间', color: '#9ca3af' },
    { id: 't1', name: 'Design', color: '#f59e0b', members: 8 },
    { id: 't2', name: 'Engineering', color: '#3b82f6', members: 24 },
    { id: 't3', name: 'Product', color: '#10b981', members: 6 },
  ])

  const projects = ref([
    {
      id: 'proj1',
      name: 'dz-s-agent-hiro',
      hasWorkspace: true,
      expanded: true,
      teamId: 'personal', // 所属团队
      sessions: [
        { id: 's1', name: '重构 PRD 管理平台' },
        { id: 's2', name: '分析用户留存数据' },
      ],
    },
    {
      id: 'proj2',
      name: '产品设计探索',
      hasWorkspace: false,
      expanded: false,
      teamId: 't1', // 所属 Design 团队
      sessions: [
        { id: 's3', name: '构建 MyFlicker 世界' },
      ],
    },
  ])

  const standaloneConversations = ref([
    { id: 'solo1', name: '如何设计一个好的 onboarding' },
  ])

  const activeSessionId = ref('s1')

  // 当前选中的团队（用于资产面板筛选）
  const activeTeamId = ref('personal')

  // 项目筛选状态：'all' | 'personal' | 具体团队ID
  const projectFilterType = ref('all')
  const projectFilterTeamId = ref(null)

  // 根据筛选条件过滤的项目列表
  const filteredProjects = computed(() => {
    if (projectFilterType.value === 'all') {
      return projects.value
    }
    if (projectFilterType.value === 'personal') {
      return projects.value.filter(p => p.teamId === 'personal')
    }
    // 团队筛选
    if (projectFilterType.value === 'team' && projectFilterTeamId.value) {
      return projects.value.filter(p => p.teamId === projectFilterTeamId.value)
    }
    return projects.value
  })

  // 当前激活会话的元信息（名称）
  const activeSessionName = computed(() => {
    for (const proj of projects.value) {
      const found = proj.sessions.find(s => s.id === activeSessionId.value)
      if (found) return found.name
    }
    const solo = standaloneConversations.value.find(s => s.id === activeSessionId.value)
    return solo ? solo.name : '新对话'
  })

  // 当前激活会话所属项目
  const activeProject = computed(() => {
    for (const proj of projects.value) {
      const found = proj.sessions.find(s => s.id === activeSessionId.value)
      if (found) return proj
    }
    return null
  })

  // 消息记录，按 sessionId 存储
  const messages = ref({
    s1: [
      { role: 'user', text: '帮我把 PRD 管理平台重构一下，现在维护起来太痛苦了，逻辑全耦合在一起', id: 1 },
      { role: 'agent', text: '好的，我先看一下现有的代码结构。\n\n初步扫描了一遍，目前主要问题集中在三块：\n\n1. **数据层和视图层耦合**：PRD 的增删改逻辑直接写在组件里，复用性差\n2. **状态管理混乱**：部分状态用 props 传递，部分用全局变量，没有统一入口\n3. **缺少类型约束**：PRD 对象的字段在多处被随意扩展\n\n建议重构方向：\n- 抽出 `prdStore` 统一管理 PRD 数据\n- 把 PRD 详情页拆成 `PrdHeader` / `PrdBody` / `PrdComments` 三个子组件\n- 用 TypeScript interface 定义 PRD 数据结构\n\n要我先出一个详细的重构方案文档吗？', id: 2 },
      { role: 'user', text: '先出方案，我确认了再动手', id: 3 },
      { role: 'agent', text: '好，我来起草重构方案。\n\n---\n\n## PRD 管理平台重构方案 v0.1\n\n### 目标\n将现有 PRD 管理平台从"组件驱动"改为"数据驱动"架构，降低维护成本，提升可扩展性。\n\n### 新目录结构\n```\nsrc/\n  stores/\n    prdStore.ts\n    commentStore.ts\n  types/\n    prd.ts\n  components/prd/\n    PrdList.vue\n    PrdDetail.vue\n    PrdHeader.vue\n    PrdBody.vue\n    PrdComments.vue\n```\n\n### 核心类型定义\n```typescript\ninterface PRD {\n  id: string\n  title: string\n  status: "draft" | "review" | "approved" | "archived"\n  ownerId: string\n  createdAt: number\n  updatedAt: number\n  content: string\n  tags: string[]\n}\n```\n\n分 3 个 Sprint 完成，渐进替换不影响线上功能。你看方向 OK 吗？', id: 4 },
    ],
    s2: [
      { role: 'user', text: '帮我分析一下用户留存数据，看看第 7 天和第 30 天的留存为什么这么低', id: 10 },
      { role: 'agent', text: '收到，你有现成的留存数据表吗？还是需要我帮你写查询 SQL？', id: 11 },
      { role: 'user', text: '日期\t新用户\tD1留存\tD7留存\tD30留存\n2025-03-01\t1243\t42.3%\t18.7%\t6.2%\n2025-03-08\t987\t39.1%\t16.4%\t5.8%\n2025-03-15\t1456\t44.8%\t19.2%\t7.1%', id: 12 },
      { role: 'agent', text: '看完了，给你几个初步判断：\n\n**D7 留存低（约 18%）的可能原因：**\n- 新用户 onboarding 流程太长，用户在第 2-4 天卡住放弃\n- 核心功能曝光不足，用户没有体验到产品价值\n- 缺少"习惯养成"触点（第 3 天 push、任务提醒等）\n\n**D30 留存低（约 6%）的可能原因：**\n- 内容消耗完后没有新鲜感\n- 缺乏社交/协作维度，单人使用动力不足\n- 竞品在关键节点做了更强的召回\n\n**建议下一步：**\n1. 拉一下 D1→D7 流失用户的行为路径，看他们最后一次操作是什么\n2. 对比留存 vs 流失用户的功能使用频次差异\n\n要我帮你写这两个分析的 SQL 吗？', id: 13 },
    ],
    s3: [
      { role: 'user', text: '我想构建一个"MyFlicker"的虚拟世界，每个用户都有自己的 AI 分身，他们可以在这个世界里自由探索、交互、成长', id: 30 },
      { role: 'agent', text: '这个想法很有意思！让我理解一下你的愿景：\n\n**核心概念拆解：**\n\n1. **AI 分身**：每个用户的数字化身，具有独立人格和记忆\n2. **虚拟世界**：一个可探索的空间，有场景、物品、NPC\n3. **交互与成长**：用户与世界、与其他分身的互动会积累经验\n\n**几个关键问题需要明确：**\n\n- 分身的"人格"从哪里来？用户自定义还是系统学习？\n- 世界是统一的还是每人有自己的私人空间？\n- 成长体系要多复杂？等级、技能树、成就？\n\n你希望从哪个方向先深入聊？', id: 31 },
      { role: 'user', text: '我倾向于：分身人格是系统学习用户的行为和偏好自动形成的，世界是共享的但每个人有自己的"家"，成长体系先做简单的——对话经验值 + 解锁新技能', id: 32 },
      { role: 'agent', text: '明白了，这是一个**共享世界 + 私人空间**的混合架构，很像"动物森友会"的思路。\n\n**我来帮你梳理产品框架：**\n\n---\n\n## MyFlicker 世界观设计 v0.1\n\n### 空间结构\n```\n🌍 Flicker World（共享大世界）\n├── 🏠 Home（每人私有，装修自定义）\n├── 🏛️ Plaza（公共广场，遇见其他分身）\n├── 📚 Library（知识探索区）\n└── 🎮 Arena（挑战/游戏区）\n```\n\n### 分身成长体系\n- **经验来源**：对话深度 × 话题广度 × 互动频率\n- **等级奖励**：每 5 级解锁一个新技能（如"总结"、"画图"、"角色扮演"）\n- **成就系统**：探索成就、社交成就、创作成就\n\n### 人格学习机制\n- 初期采集：首次 10 轮对话建立基础画像\n- 持续学习：偏好权重动态调整\n- 用户可修正：不喜欢的特质可以手动关闭\n\n---\n\n要我继续细化哪个模块？还是先出一个 MVP 功能清单？', id: 33 },
      { role: 'user', text: '先出 MVP 清单，我想尽快做个可玩的 demo', id: 34 },
      { role: 'agent', text: '好，精简到最核心体验：\n\n---\n\n## MyFlicker MVP 功能清单\n\n### P0 必做（首版 Demo）\n\n| 模块 | 功能 | 说明 |\n|------|------|------|\n| 分身 | 创建分身 | 取名 + 选形象 + 填 3 句自我介绍 |\n| 分身 | 基础对话 | 能聊天，有记忆 |\n| 空间 | 我的房间 | 简单的 2D 场景，可放 3 件家具 |\n| 成长 | 经验值 | 每次对话 +10 exp，满 100 升级 |\n| 成长 | 技能解锁 | Lv2 解锁"总结"，Lv3 解锁"待办提取" |\n\n### P1 增强（验证后迭代）\n\n- 公共广场（看到其他人的分身）\n- 房间访客功能\n- 更多家具和装饰\n- 成就徽章\n\n### P2 远期\n\n- 分身之间可以对话\n- 小游戏/挑战\n- 创作者工具（自制家具）\n\n---\n\n**预估工作量**：P0 约 2-3 周可出 demo\n\n要我帮你画一个交互原型图吗？', id: 35 },
    ],
    solo1: [
      { role: 'user', text: '我在思考如何设计一个好的 onboarding，现在新用户激活率只有 23%，感觉很低', id: 20 },
      { role: 'agent', text: '23% 确实偏低，SaaS 工具一般在 35-50%。\n\n先问几个问题：\n1. 你们的"激活"怎么定义？\n2. 用户主要从哪个渠道来？\n3. 现在 onboarding 是几步？', id: 21 },
      { role: 'user', text: '激活 = 注册后 24h 内发起第一个 AI 对话。自然流量为主。现在 4 步：填资料→选场景→建项目→开始对话，可以跳过', id: 22 },
      { role: 'agent', text: '找到问题了。**路径太长 + 价值前置不足。**\n\n用户注册后最想做的是"马上感受到魔法"，但你现在让他先付出三步才有收获。\n\n**改进方向：**\n\n① **压缩到 1 步**：注册完直接进对话界面，填资料全部后置\n\n② **用模板替代"建项目"**：给 3 张场景卡片（产品设计 / 代码开发 / 数据分析），点一下直接进入预设对话\n\n③ **第一条 Agent 回复要有"哇塞"感**：这是关键转化点，回复要足够聪明和具体\n\n要我帮你拆解 Notion 或 Linear 的 onboarding 做对比参考吗？', id: 23 },
    ],
  })


  function getMessages(sessionId) {
    if (!messages.value[sessionId]) messages.value[sessionId] = []
    return messages.value[sessionId]
  }

  function sendMessage(sessionId, text) {
    if (!messages.value[sessionId]) messages.value[sessionId] = []
    messages.value[sessionId].push({ role: 'user', text, id: Date.now() })
    // 模拟 Agent 回复
    setTimeout(() => {
      messages.value[sessionId].push({
        role: 'agent',
        text: `好的，我正在处理「${text}」，稍等片刻…`,
        id: Date.now() + 1,
      })
    }, 600)
  }

  function openSession(sessionId) {
    activeSessionId.value = sessionId
    // 自动切换到对应项目的团队
    const proj = projects.value.find(p => p.sessions.some(s => s.id === sessionId))
    if (proj && proj.teamId) {
      activeTeamId.value = proj.teamId
    }
  }

  function openNewChat(name = '新对话') {
    const id = 'solo_' + Date.now()
    standaloneConversations.value.push({ id, name })
    activeSessionId.value = id
  }

  function newChatInProject(projId) {
    const id = 'chat_' + Date.now()
    const proj = projects.value.find(p => p.id === projId)
    if (proj) {
      proj.sessions.push({ id, name: '新对话' })
      proj.expanded = true
    }
    activeSessionId.value = id
  }

  function toggleProject(projId) {
    const proj = projects.value.find(p => p.id === projId)
    if (proj) proj.expanded = !proj.expanded
  }

  function createProject(name, mode) {
    const id = 'proj_' + Date.now()
    projects.value.push({
      id,
      name,
      hasWorkspace: mode === 'workspace',
      expanded: true,
      teamId: activeTeamId.value, // 使用当前选中的团队
      sessions: [],
    })
    newChatInProject(id)
  }

  function setActiveTeam(teamId) {
    activeTeamId.value = teamId
  }

  function setProjectFilter(type, teamId = null) {
    projectFilterType.value = type
    projectFilterTeamId.value = teamId
  }

  return {
    teams,
    projects,
    filteredProjects,
    projectFilterType,
    projectFilterTeamId,
    standaloneConversations,
    activeSessionId,
    activeSessionName,
    activeProject,
    activeTeamId,
    messages,
    getMessages,
    sendMessage,
    openSession,
    openNewChat,
    newChatInProject,
    toggleProject,
    createProject,
    setActiveTeam,
    setProjectFilter,
  }
})
