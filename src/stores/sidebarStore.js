import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const projects = ref([
    {
      id: 'proj1',
      name: 'dz-s-agent-hiro',
      hasWorkspace: true,
      expanded: true,
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
      sessions: [
        { id: 's3', name: '构建 MyFlicker 世界' },
      ],
    },
  ])

  const standaloneConversations = ref([
    { id: 'solo1', name: '如何设计一个好的 onboarding' },
  ])

  const activeSessionId = ref('s1')

  // 当前激活会话的元信息（名称）
  const activeSessionName = computed(() => {
    for (const proj of projects.value) {
      const found = proj.sessions.find(s => s.id === activeSessionId.value)
      if (found) return found.name
    }
    const solo = standaloneConversations.value.find(s => s.id === activeSessionId.value)
    return solo ? solo.name : '新对话'
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
      sessions: [],
    })
    newChatInProject(id)
  }

  return {
    projects,
    standaloneConversations,
    activeSessionId,
    activeSessionName,
    messages,
    getMessages,
    sendMessage,
    openSession,
    openNewChat,
    newChatInProject,
    toggleProject,
    createProject,
  }
})
