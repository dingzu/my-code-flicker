import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const mainWindowVisible = ref(true)
  const mainWindowMaximized = ref(false)
  // 'code' | 'work'
  const mode = ref('code')
  // 侧边栏显示状态
  const sidebarVisible = ref(true)

  // 团队相关状态
  const teams = ref([
    { id: 'personal', name: '个人', logo: 'MyFlicker' },
    { id: 'kuaixiaban', name: '快下班', logo: '快下班' },
    { id: 'rd-design', name: '研发设计中心', logo: 'R&D' },
    { id: 'myflicker-product', name: 'MyFlicker 产品组', logo: 'MF' },
  ])
  const currentTeamId = ref('personal')
  const teamSwitchPanelVisible = ref(false)

  const currentTeam = computed(() => {
    return teams.value.find(t => t.id === currentTeamId.value) || teams.value[0]
  })

  // 是否为团队版（非个人）
  const isTeamMode = computed(() => currentTeamId.value !== 'personal')

  // 数字员工相关状态
  const digitalEmployees = ref([])
  const digitalEmployeeEditorVisible = ref(false)
  const editingEmployee = ref(null)

  function openEmployeeEditor(employee = null) {
    editingEmployee.value = employee ? { ...employee } : null
    digitalEmployeeEditorVisible.value = true
  }

  function closeEmployeeEditor() {
    digitalEmployeeEditorVisible.value = false
    editingEmployee.value = null
  }

  function saveEmployee(employeeData) {
    if (editingEmployee.value) {
      // 编辑现有员工
      const idx = digitalEmployees.value.findIndex(e => e.id === editingEmployee.value.id)
      if (idx !== -1) {
        digitalEmployees.value[idx] = { ...digitalEmployees.value[idx], ...employeeData }
      }
    } else {
      // 创建新员工
      const newEmployee = {
        id: 'emp-' + Date.now(),
        ...employeeData,
        createdAt: new Date().toISOString(),
      }
      digitalEmployees.value.push(newEmployee)
    }
    closeEmployeeEditor()
  }

  function deleteEmployee(employeeId) {
    digitalEmployees.value = digitalEmployees.value.filter(e => e.id !== employeeId)
  }

  // ==================== 团队管理相关状态 ====================

  // 当前团队的成员列表
  const teamMembers = ref([
    { id: 'user-1', name: '张三', avatar: 'Z', role: 'owner', email: 'zhangsan@example.com' },
    { id: 'user-2', name: '李四', avatar: 'L', role: 'admin', email: 'lisi@example.com' },
    { id: 'user-3', name: '王五', avatar: 'W', role: 'member', email: 'wangwu@example.com' },
    { id: 'user-4', name: '赵六', avatar: 'Z', role: 'member', email: 'zhaoliu@example.com' },
  ])

  // 添加团队成员
  function addTeamMember(memberData) {
    const newMember = {
      id: 'user-' + Date.now(),
      ...memberData,
      avatar: memberData.name.charAt(0).toUpperCase(),
    }
    teamMembers.value.push(newMember)
  }

  // 删除团队成员
  function removeTeamMember(memberId) {
    teamMembers.value = teamMembers.value.filter(m => m.id !== memberId)
  }

  // 更新成员角色
  function updateMemberRole(memberId, newRole) {
    const member = teamMembers.value.find(m => m.id === memberId)
    if (member) {
      member.role = newRole
    }
  }

  // ==================== 技能管理相关状态 ====================

  // 个人技能列表
  const personalSkills = ref([
    { id: 'skill-1', name: '文档摘要', description: '快速提取文档核心内容', enabled: true },
    { id: 'skill-2', name: '代码审查', description: '自动检查代码质量和规范', enabled: true },
    { id: 'skill-3', name: '数据分析', description: '处理和可视化数据', enabled: false },
    { id: 'skill-4', name: '翻译助手', description: '多语言实时翻译', enabled: true },
    { id: 'skill-5', name: 'PPT生成', description: '根据内容自动生成演示文稿', enabled: false },
    { id: 'skill-6', name: '会议纪要', description: '自动整理会议要点', enabled: true },
  ])

  // 团队技能列表
  const teamSkills = ref([
    { id: 'team-skill-1', name: 'PRD 分析', description: '产品需求文档深度分析', enabled: true, teamId: 'kuaixiaban' },
    { id: 'team-skill-2', name: '技术方案设计', description: '架构设计与技术选型建议', enabled: true, teamId: 'rd-design' },
    { id: 'team-skill-3', name: '竞品调研', description: '自动化竞品分析报告', enabled: false, teamId: 'myflicker-product' },
    { id: 'team-skill-4', name: '数据看板', description: '团队数据可视化看板', enabled: true, teamId: 'kuaixiaban' },
    { id: 'team-skill-5', name: '代码规范检查', description: '团队统一代码风格检查', enabled: true, teamId: 'rd-design' },
    { id: 'team-skill-6', name: '用户访谈总结', description: '自动整理用户访谈记录', enabled: false, teamId: 'myflicker-product' },
  ])

  // 启用团队技能（在个人版使用全部团队技能）
  const enableTeamSkillsInPersonal = ref(false)

  // 团队版：是否查看全部技能（默认只看当前团队技能）
  const showAllSkillsInTeam = ref(false)

  // 当前显示的技能列表（根据模式决定）
  const currentSkills = computed(() => {
    if (isTeamMode.value) {
      // 团队版：默认只显示当前团队的技能，开启后显示全部
      if (showAllSkillsInTeam.value) {
        return [...personalSkills.value, ...teamSkills.value]
      }
      return teamSkills.value.filter(s => s.teamId === currentTeamId.value || s.teamId === 'all')
    } else {
      // 个人版：显示个人技能
      if (enableTeamSkillsInPersonal.value) {
        // 启用了团队技能，显示全部技能
        return [...personalSkills.value, ...teamSkills.value]
      }
      return personalSkills.value
    }
  })

  // 切换技能启用状态
  function toggleSkill(skillId) {
    // 先在个人技能中查找
    const personalSkill = personalSkills.value.find(s => s.id === skillId)
    if (personalSkill) {
      personalSkill.enabled = !personalSkill.enabled
      return
    }
    // 再在团队技能中查找
    const teamSkill = teamSkills.value.find(s => s.id === skillId)
    if (teamSkill) {
      teamSkill.enabled = !teamSkill.enabled
    }
  }

  // 切换团队技能启用设置
  function toggleTeamSkillsInPersonal() {
    enableTeamSkillsInPersonal.value = !enableTeamSkillsInPersonal.value
  }

  // 切换团队版查看全部技能
  function toggleShowAllSkillsInTeam() {
    showAllSkillsInTeam.value = !showAllSkillsInTeam.value
  }

  // ==================== 窗口管理 ====================

  function closeMainWindow() {
    mainWindowVisible.value = false
  }

  function openMainWindow() {
    mainWindowVisible.value = true
    mainWindowMaximized.value = false
  }

  function toggleMaximize() {
    mainWindowMaximized.value = !mainWindowMaximized.value
  }

  function toggleMode() {
    mode.value = mode.value === 'code' ? 'work' : 'code'
  }

  function switchTeam(teamId) {
    currentTeamId.value = teamId
    teamSwitchPanelVisible.value = false
  }

  function toggleTeamSwitchPanel() {
    teamSwitchPanelVisible.value = !teamSwitchPanelVisible.value
  }

  function closeTeamSwitchPanel() {
    teamSwitchPanelVisible.value = false
  }

  function toggleSidebar() {
    sidebarVisible.value = !sidebarVisible.value
  }

  return {
    mainWindowVisible,
    mainWindowMaximized,
    mode,
    sidebarVisible,
    teams,
    currentTeamId,
    currentTeam,
    isTeamMode,
    teamSwitchPanelVisible,
    closeMainWindow,
    openMainWindow,
    toggleMaximize,
    toggleMode,
    switchTeam,
    toggleTeamSwitchPanel,
    closeTeamSwitchPanel,
    toggleSidebar,
    // 数字员工相关
    digitalEmployees,
    digitalEmployeeEditorVisible,
    editingEmployee,
    openEmployeeEditor,
    closeEmployeeEditor,
    saveEmployee,
    deleteEmployee,
    // 技能管理相关
    personalSkills,
    teamSkills,
    enableTeamSkillsInPersonal,
    showAllSkillsInTeam,
    currentSkills,
    toggleSkill,
    toggleTeamSkillsInPersonal,
    toggleShowAllSkillsInTeam,
    // 团队管理相关
    teamMembers,
    addTeamMember,
    removeTeamMember,
    updateMemberRole,
  }
})
