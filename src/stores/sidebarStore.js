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
  const messages = ref({})

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
