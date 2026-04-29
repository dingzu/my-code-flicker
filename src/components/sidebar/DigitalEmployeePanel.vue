<template>
  <Teleport to="body">
    <Transition name="panel-slide">
      <div
        v-if="appStore.digitalEmployeePanelVisible"
        class="employee-panel-overlay"
        @click="appStore.closeDigitalEmployeePanel()"
      >
        <div class="employee-panel" @click.stop>
          <!-- 头部 -->
          <div class="panel-header">
            <h3 class="panel-title">数字员工</h3>
            <button class="create-btn" @click="appStore.openEmployeeEditor()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              创建员工
            </button>
          </div>

          <!-- 空状态 -->
          <div v-if="!appStore.digitalEmployees.length" class="empty-state">
            <div class="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
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
      </div>
    </Transition>

    <!-- 编辑弹窗 -->
    <DigitalEmployeeEditor />
  </Teleport>
</template>

<script setup>
import { useAppStore } from '../../stores/appStore'
import { useSidebarStore } from '../../stores/sidebarStore'
import DigitalEmployeeEditor from './DigitalEmployeeEditor.vue'

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

function handleDelete(employee) {
  if (confirm(`确定删除数字员工「${employee.name}」吗？`)) {
    appStore.deleteEmployee(employee.id)
  }
}

// 开始聊天
function handleStartChat(employee) {
  // 关闭数字员工面板
  appStore.closeDigitalEmployeePanel()
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
.employee-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.employee-panel {
  width: 480px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 100px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px 24px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.create-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

/* 空状态 */
.empty-state {
  padding: 60px 24px;
  text-align: center;
}

.empty-icon {
  color: rgba(0, 0, 0, 0.12);
  margin-bottom: 16px;
}

.empty-text {
  font-size: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  margin: 0 0 8px;
}

.empty-hint {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.4);
  margin: 0;
}

/* 员工列表 */
.employee-list {
  padding: 8px;
  overflow-y: auto;
  flex: 1;
}

.employee-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  transition: background 0.12s;
}

.employee-card:hover {
  background: rgba(0, 0, 0, 0.03);
}

.employee-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.employee-info {
  flex: 1;
  min-width: 0;
}

.employee-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 4px;
}

.employee-role {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.employee-messaging {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: rgba(102, 126, 234, 0.8);
  margin: 4px 0 0;
}

.employee-messaging svg {
  flex-shrink: 0;
}

.employee-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.12s;
}

.employee-card:hover .employee-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  transition: background 0.1s, color 0.1s;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.7);
}

.action-btn.primary {
  color: #667eea;
}

.action-btn.primary:hover {
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* 动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
