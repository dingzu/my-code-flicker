<template>
  <div class="employee-management-page">
    <div class="employee-management-layout">
      <!-- 主内容区 -->
      <div class="employees-main">
        <!-- 页面标题 -->
        <div class="page-header">
          <div class="page-header-left">
            <h1 class="page-title">数字员工</h1>
            <p class="page-subtitle">
              {{ appStore.isTeamMode ? `当前团队：${appStore.currentTeam.name}` : '管理您的数字员工' }}
            </p>
          </div>
          <div class="page-header-actions">
            <button class="header-action-btn primary" @click="appStore.openEmployeeEditor()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              创建员工
            </button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!appStore.digitalEmployees.length" class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="8" r="4"/>
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
            </svg>
          </div>
          <p class="empty-text">暂无数字员工</p>
          <p class="empty-hint">创建数字员工来自动处理团队任务</p>
        </div>

        <!-- 员工列表 -->
        <div v-else class="employee-list">
          <div
            v-for="employee in appStore.digitalEmployees"
            :key="employee.id"
            class="employee-card"
          >
            <div class="employee-avatar" :style="getAvatarStyle(employee)">
              {{ employee.name?.charAt(0) || '?' }}
            </div>
            <div class="employee-info">
              <h4 class="employee-name">{{ employee.name }}</h4>
              <p class="employee-role">{{ getRoleLabel(employee.role) }}</p>
              <p v-if="employee.messagingId" class="employee-messaging">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                消息号: {{ employee.messagingId }}
              </p>
            </div>
            <div class="employee-actions">
              <button class="action-btn primary" @click="handleStartChat(employee)" title="开始聊天">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
              <button class="action-btn primary" @click="handleGoToKimChat(employee)" title="去KIM聊天">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </button>
              <button class="action-btn primary" @click="handleInviteToGroup(employee)" title="邀请到群">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </button>
              <button class="action-btn" @click="appStore.openEmployeeEditor(employee)" title="编辑">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="action-btn delete" @click="handleDelete(employee)" title="删除">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：设置面板 -->
      <div class="employees-sidebar">
        <div class="settings-panel">
          <h3 class="panel-title">关于数字员工</h3>
          <div class="panel-section">
            <p class="panel-description">
              数字员工可以帮助您自动处理日常任务，提升团队协作效率。您可以为不同的工作场景创建专属的数字员工。
            </p>
          </div>

          <div class="panel-section">
            <h4 class="section-title">员工统计</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ appStore.digitalEmployees.length }}</div>
                <div class="stat-label">总员工数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ employeesWithMessaging }}</div>
                <div class="stat-label">已配置消息号</div>
              </div>
            </div>
          </div>

          <div class="panel-section">
            <h4 class="section-title">快速操作</h4>
            <div class="quick-actions">
              <button class="quick-action-btn" @click="appStore.openEmployeeEditor()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>创建新员工</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <DigitalEmployeeEditor />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../stores/appStore'
import { useSidebarStore } from '../../stores/sidebarStore'
import DigitalEmployeeEditor from '../sidebar/DigitalEmployeeEditor.vue'

const appStore = useAppStore()
const sidebarStore = useSidebarStore()

// 预设岗位描述列表
const roleLabels = {
  'assistant': '智能助手',
  'analyst': '数据分析师',
  'reviewer': '代码审查员',
  'writer': '文档撰写员',
  'coordinator': '任务协调员',
  'monitor': '监控告警员',
}

function getRoleLabel(role) {
  return roleLabels[role] || role || '未设置岗位'
}

function getAvatarStyle(employee) {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ]
  const idx = Math.abs(employee.name?.charCodeAt(0) || 0) % colors.length
  return { background: colors[idx] }
}

// 统计配置了消息号的员工数量
const employeesWithMessaging = computed(() => {
  return appStore.digitalEmployees.filter(e => e.messagingId).length
})

function handleDelete(employee) {
  if (confirm(`确定删除数字员工「${employee.name}」吗？`)) {
    appStore.deleteEmployee(employee.id)
  }
}

// 开始聊天
function handleStartChat(employee) {
  // 设置预填充文本为员工名字
  sidebarStore.setChatInputPrefill(`@${employee.name} `)
  // 切换到对话页
  sidebarStore.setActiveNav('new-chat')
  sidebarStore.openNewChat(`与 ${employee.name} 的对话`)
}

// 去KIM聊天
function handleGoToKimChat(employee) {
  console.log('去KIM聊天:', employee.name)
  if (employee.messagingId) {
    // 打开 KIM 消息号聊天页面
    window.open(`kim://chat?userId=${employee.messagingId}`, '_blank')
  } else {
    alert('该数字员工未配置消息号')
  }
}

// 邀请到群
function handleInviteToGroup(employee) {
  console.log('邀请到群:', employee.name)
  if (employee.messagingId) {
    // TODO: 打开群选择弹窗
    alert(`即将邀请 ${employee.name} 加入群聊`)
  } else {
    alert('该数字员工未配置消息号')
  }
}
</script>

<style scoped>
.employee-management-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.employee-management-layout {
  flex: 1;
  display: flex;
  gap: 16px;
  overflow: hidden;
  padding: 0;
}

.employees-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 24px 24px 24px 28px;
}

.employees-sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 24px 28px 24px 0;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-header-left {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.page-header-actions {
  display: flex;
  gap: 8px;
}

.header-action-btn {
  padding: 9px 16px;
  background: #f5f5f7;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.header-action-btn:hover {
  background: #e8e8ea;
}

.header-action-btn.primary {
  background: #6366f1;
  color: white;
}

.header-action-btn.primary:hover {
  background: #4f46e5;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8edf5 100%);
  border-radius: 50%;
  margin-bottom: 20px;
  color: #94a3b8;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 员工列表 */
.employee-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.employee-list::-webkit-scrollbar {
  width: 6px;
}

.employee-list::-webkit-scrollbar-track {
  background: transparent;
}

.employee-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.employee-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.employee-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.15s ease;
}

.employee-card:hover {
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.employee-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.employee-info {
  flex: 1;
  min-width: 0;
}

.employee-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.employee-role {
  font-size: 13px;
  color: #666;
  margin: 0 0 4px 0;
}

.employee-messaging {
  font-size: 12px;
  color: #6366f1;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.employee-messaging svg {
  flex-shrink: 0;
}

.employee-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.action-btn:hover {
  background: #e8e8ea;
  color: #1a1a1a;
}

.action-btn.primary {
  background: #6366f1;
  color: white;
}

.action-btn.primary:hover {
  background: #4f46e5;
}

.action-btn.delete {
  background: #fff;
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* 设置面板 */
.settings-panel {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.panel-description {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-action-btn {
  width: 100%;
  padding: 12px;
  background: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s ease;
}

.quick-action-btn:hover {
  background: #6366f1;
  color: white;
}

.quick-action-btn svg {
  flex-shrink: 0;
}
</style>
