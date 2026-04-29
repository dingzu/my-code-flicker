<template>
  <div class="task-management-page">
    <!-- 顶部操作栏 -->
    <div class="top-bar">
      <div class="page-title">
        <h2>定时任务</h2>
        <span class="count">{{ tasks.length }} 个任务</span>
      </div>
      <button class="action-btn primary" @click="showNewTaskDialog = true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        新建任务
      </button>
    </div>

    <!-- 任务列表 -->
    <div class="task-list">
      <template v-if="tasks.length === 0">
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <p>暂无定时任务</p>
        </div>
      </template>

      <div 
        v-for="task in tasks" 
        :key="task.id" 
        class="task-item"
        :class="{ 
          'task-running': task.status === 'running',
          'task-paused': task.status === 'paused',
          'task-finished': task.status === 'finished'
        }"
        @click="selectTask(task)"
      >
        <div class="task-toggle" @click.stop>
          <label class="switch">
            <input 
              type="checkbox" 
              :checked="task.status === 'running'"
              :disabled="task.status === 'finished'"
              @change="toggleTaskStatus(task)"
            />
            <span class="slider"></span>
          </label>
        </div>
        <div class="task-content">
          <div class="task-title">
            {{ task.title }}
          </div>
          <div class="task-meta">
            <span class="schedule-info">
              {{ formatSchedule(task.schedule) }}
            </span>
            <span v-if="task.status !== 'finished' && task.nextRun" class="next-run">
              下次: {{ formatDateShort(task.nextRun) }}
            </span>
            <span class="execution-count">
              {{ task.executionHistory?.length || 0 }} 次
            </span>
            <span 
              class="status-text"
              :class="{
                'status-running': task.status === 'running',
                'status-paused': task.status === 'paused',
                'status-finished': task.status === 'finished'
              }"
            >
              {{ getStatusText(task.status) }}
            </span>
          </div>
        </div>
        <div class="task-actions" @click.stop>
          <button 
            v-if="task.status !== 'finished'"
            class="action-icon-btn execute-btn"
            @click="executeTask(task)"
            title="立即执行"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </button>
          <button 
            class="action-icon-btn delete-btn" 
            @click="deleteTask(task)"
            title="删除"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 右侧详情面板 - 执行历史 -->
    <div v-if="selectedTask" class="task-detail-panel">
      <div class="panel-header">
        <h3>{{ selectedTask.title }}</h3>
        <button class="close-btn" @click="selectedTask = null">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="panel-content">
        <!-- 任务基本信息 -->
        <div class="task-info-section">
          <div class="info-item">
            <span class="info-label">执行计划</span>
            <code class="info-value cron">{{ selectedTask.schedule }}</code>
          </div>
          <div class="info-item">
            <span class="info-label">任务状态</span>
            <span 
              class="info-value status"
              :class="{
                'status-running': selectedTask.status === 'running',
                'status-paused': selectedTask.status === 'paused',
                'status-finished': selectedTask.status === 'finished'
              }"
            >
              {{ getStatusText(selectedTask.status) }}
            </span>
          </div>
          <div v-if="selectedTask.status !== 'finished' && selectedTask.nextRun" class="info-item">
            <span class="info-label">下次执行</span>
            <span class="info-value">{{ formatDate(selectedTask.nextRun) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">总次数</span>
            <span class="info-value">{{ selectedTask.executionHistory?.length || 0 }} 次</span>
          </div>
        </div>

        <!-- 执行历史列表 -->
        <div class="history-section">
          <div class="section-header">
            <h4>执行历史</h4>
          </div>
          
          <template v-if="!selectedTask.executionHistory || selectedTask.executionHistory.length === 0">
            <div class="empty-history">
              <p>暂无执行记录</p>
            </div>
          </template>

          <div v-else class="history-list">
            <div 
              v-for="record in selectedTask.executionHistory" 
              :key="record.id" 
              class="history-item"
              :class="{ 
                'history-success': record.status === 'success',
                'history-failed': record.status === 'failed'
              }"
              @click="viewHistoryDetail(record)"
            >
              <div class="history-main">
                <div class="history-icon">
                  <svg v-if="record.status === 'success'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
                <div class="history-info">
                  <div class="history-time">{{ formatDate(record.executedAt) }}</div>
                  <div class="history-meta">
                    <span class="meta-item">{{ record.duration }}ms</span>
                    <span v-if="record.status === 'failed'" class="meta-item error">{{ record.error }}</span>
                  </div>
                </div>
              </div>
              <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 执行历史详情对话框 -->
    <div v-if="selectedHistory" class="dialog-overlay" @click.self="selectedHistory = null">
      <div class="dialog detail-dialog">
        <div class="dialog-header">
          <h3>执行详情</h3>
          <button class="close-btn" @click="selectedHistory = null">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="detail-section">
            <label>执行时间</label>
            <div class="detail-value">{{ formatDate(selectedHistory.executedAt) }}</div>
          </div>
          <div class="detail-section">
            <label>执行状态</label>
            <span 
              class="status-badge"
              :class="{
                'status-running': selectedHistory.status === 'success',
                'status-paused': selectedHistory.status === 'failed'
              }"
            >
              {{ selectedHistory.status === 'success' ? '成功' : '失败' }}
            </span>
          </div>
          <div class="detail-section">
            <label>执行耗时</label>
            <div class="detail-value">{{ selectedHistory.duration }} ms</div>
          </div>
          <div v-if="selectedHistory.error" class="detail-section">
            <label>错误信息</label>
            <div class="detail-value error-text">{{ selectedHistory.error }}</div>
          </div>
          <div v-if="selectedHistory.output" class="detail-section">
            <label>执行输出</label>
            <pre class="detail-output">{{ selectedHistory.output }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建任务对话框 -->
    <div v-if="showNewTaskDialog" class="dialog-overlay" @click.self="showNewTaskDialog = false">
      <div class="dialog">
        <div class="dialog-header">
          <h3>新建定时任务</h3>
          <button class="close-btn" @click="showNewTaskDialog = false">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>任务标题 *</label>
            <input 
              v-model="newTask.title" 
              class="form-input"
              placeholder="输入任务标题"
            />
          </div>

          <div class="form-group">
            <label>任务描述</label>
            <textarea 
              v-model="newTask.description" 
              class="form-textarea"
              rows="3"
              placeholder="添加任务描述（可选）"
            />
          </div>

          <div class="form-group">
            <label>执行计划 (Cron 表达式) *</label>
            <input 
              v-model="newTask.schedule" 
              class="form-input"
              placeholder="例如: 0 9 * * * (每天9点)"
            />
            <div class="hint">常用表达式: 每天9点 (0 9 * * *) | 每小时 (0 * * * *) | 每周一9点 (0 9 * * 1)</div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn secondary" @click="showNewTaskDialog = false">取消</button>
          <button class="btn primary" @click="createTask" :disabled="!newTask.title || !newTask.schedule">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 状态
const selectedTask = ref(null)
const selectedHistory = ref(null)
const showNewTaskDialog = ref(false)

// 任务数据（示例数据）
const tasks = ref([
  {
    id: '1',
    title: '每日数据报表同步',
    description: '自动同步每日运营数据到数据库',
    schedule: '0 9 * * *',
    status: 'running', // running, paused, finished
    nextRun: new Date('2024-04-28 09:00:00'),
    createdAt: new Date('2024-01-15'),
    executionHistory: [
      {
        id: 'h1',
        executedAt: new Date('2024-04-27 09:00:00'),
        status: 'success',
        duration: 2345,
        output: '成功同步 1,234 条数据\n处理时间: 2.3s\n目标数据库: production-db',
      },
      {
        id: 'h2',
        executedAt: new Date('2024-04-26 09:00:00'),
        status: 'success',
        duration: 2156,
        output: '成功同步 1,189 条数据\n处理时间: 2.1s\n目标数据库: production-db',
      },
      {
        id: 'h3',
        executedAt: new Date('2024-04-25 09:00:00'),
        status: 'failed',
        duration: 1234,
        error: '数据库连接超时',
        output: 'Error: Connection timeout after 30s\nRetrying... Failed\nRollback completed',
      },
      {
        id: 'h4',
        executedAt: new Date('2024-04-24 09:00:00'),
        status: 'success',
        duration: 2567,
        output: '成功同步 1,298 条数据\n处理时间: 2.5s\n目标数据库: production-db',
      },
    ],
  },
  {
    id: '2',
    title: '周报生成',
    description: '自动生成并发送周报邮件',
    schedule: '0 18 * * 5',
    status: 'paused',
    nextRun: new Date('2024-05-03 18:00:00'),
    createdAt: new Date('2023-11-01'),
    executionHistory: [
      {
        id: 'h5',
        executedAt: new Date('2024-04-26 18:00:00'),
        status: 'success',
        duration: 5678,
        output: '周报生成成功\n发送至: 23 位收件人\n文件大小: 2.3MB',
      },
      {
        id: 'h6',
        executedAt: new Date('2024-04-19 18:00:00'),
        status: 'success',
        duration: 5234,
        output: '周报生成成功\n发送至: 23 位收件人\n文件大小: 2.1MB',
      },
    ],
  },
  {
    id: '3',
    title: '临时数据迁移任务',
    description: '一次性数据迁移任务，已完成',
    schedule: '0 2 15 4 *',
    status: 'finished',
    createdAt: new Date('2024-04-10'),
    executionHistory: [
      {
        id: 'h7',
        executedAt: new Date('2024-04-15 02:00:00'),
        status: 'success',
        duration: 12345,
        output: '数据迁移完成\n迁移记录: 50,000 条\n总耗时: 12.3s\n验证: 通过',
      },
    ],
  },
])

// 新任务表单
const newTask = ref({
  title: '',
  description: '',
  schedule: '',
})

// 方法
function createTask() {
  if (!newTask.value.title || !newTask.value.schedule) return

  const task = {
    id: Date.now().toString(),
    title: newTask.value.title,
    description: newTask.value.description,
    schedule: newTask.value.schedule,
    status: 'paused',
    createdAt: new Date(),
    nextRun: calculateNextRun(newTask.value.schedule),
    executionHistory: [],
  }

  tasks.value.unshift(task)
  showNewTaskDialog.value = false
  
  // 重置表单
  newTask.value = {
    title: '',
    description: '',
    schedule: '',
  }
}

function selectTask(task) {
  selectedTask.value = { ...task }
}

function toggleTaskStatus(task) {
  const target = tasks.value.find(t => t.id === task.id)
  if (target && target.status !== 'finished') {
    target.status = target.status === 'running' ? 'paused' : 'running'
    if (selectedTask.value && selectedTask.value.id === task.id) {
      selectedTask.value.status = target.status
    }
  }
}

function executeTask(task) {
  // 模拟立即执行
  const target = tasks.value.find(t => t.id === task.id)
  if (target) {
    const newRecord = {
      id: 'h' + Date.now(),
      executedAt: new Date(),
      status: Math.random() > 0.2 ? 'success' : 'failed',
      duration: Math.floor(Math.random() * 3000) + 1000,
      output: Math.random() > 0.2 
        ? '手动执行成功\n处理完成\n状态: 正常' 
        : 'Error: Execution failed\nRetry recommended',
      error: Math.random() > 0.2 ? undefined : '执行异常',
    }
    
    if (!target.executionHistory) {
      target.executionHistory = []
    }
    target.executionHistory.unshift(newRecord)
    
    // 如果当前选中的是这个任务，更新详情面板
    if (selectedTask.value && selectedTask.value.id === task.id) {
      selectedTask.value.executionHistory = [...target.executionHistory]
    }
    
    alert(`任务"${task.title}"已触发执行`)
  }
}

function deleteTask(task) {
  if (confirm('确定要删除这个任务吗?')) {
    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
      if (selectedTask.value && selectedTask.value.id === task.id) {
        selectedTask.value = null
      }
    }
  }
}

function viewHistoryDetail(record) {
  selectedHistory.value = { ...record }
}

function getStatusText(status) {
  const statusMap = {
    running: '运行中',
    paused: '已暂停',
    finished: '已结束',
  }
  return statusMap[status] || status
}

function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateShort(date) {
  if (!date) return '-'
  const d = new Date(date)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (d.toDateString() === now.toDateString()) {
    return '今天 ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (d.toDateString() === tomorrow.toDateString()) {
    return '明天 ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  return formatDate(date)
}

function formatSchedule(schedule) {
  const scheduleMap = {
    '0 9 * * *': '每天 9:00',
    '0 * * * *': '每小时',
    '0 9 * * 1': '每周一 9:00',
    '0 18 * * 5': '每周五 18:00',
    '0 2 15 4 *': '每年 4月15日 2:00',
  }
  return scheduleMap[schedule] || schedule
}

function calculateNextRun(schedule) {
  // 简化实现，实际应该使用 cron 解析库
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  return tomorrow
}
</script>

<style scoped>
.task-management-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fafbfc;
  position: relative;
}

/* 顶部操作栏 */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.page-title {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.page-title h2 {
  font-size: 16px;
  font-weight: 600;
  color: rgba(20, 20, 30, 0.9);
  margin: 0;
}

.page-title .count {
  font-size: 13px;
  color: rgba(20, 20, 30, 0.5);
  font-weight: 400;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5568d3;
}

/* 任务列表 */
.task-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.task-list::-webkit-scrollbar {
  width: 6px;
}

.task-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: rgba(20, 20, 30, 0.4);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.15s;
  border-left: 2px solid rgba(0, 0, 0, 0.08);
}

.task-item:hover {
  border-color: rgba(102, 126, 234, 0.2);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.task-item.task-running {
  border-left-color: #22c55e;
}

.task-item.task-paused {
  border-left-color: #f59e0b;
}

.task-item.task-finished {
  border-left-color: rgba(0, 0, 0, 0.12);
  opacity: 0.6;
}

/* 开关控制 */
.task-toggle {
  flex-shrink: 0;
  padding-top: 2px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  border-radius: 22px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #22c55e;
}

input:checked + .slider:before {
  transform: translateX(18px);
}

input:disabled + .slider {
  cursor: not-allowed;
  opacity: 0.5;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(20, 20, 30, 0.9);
  margin-bottom: 6px;
}

.task-finished .task-title {
  color: rgba(20, 20, 30, 0.5);
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(20, 20, 30, 0.5);
}

.schedule-info {
  color: rgba(20, 20, 30, 0.6);
}

.next-run,
.execution-count {
  color: rgba(20, 20, 30, 0.45);
}

.status-text {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
}

.status-text.status-running {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-text.status-paused {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-text.status-finished {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(20, 20, 30, 0.4);
}

.task-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.action-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: rgba(20, 20, 30, 0.35);
  cursor: pointer;
  transition: all 0.15s;
}

.action-icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(20, 20, 30, 0.7);
}

.execute-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* 右侧详情面板 */
.task-detail-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: white;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.04);
  z-index: 10;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.panel-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: rgba(20, 20, 30, 0.9);
  margin: 0;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: rgba(20, 20, 30, 0.5);
  cursor: pointer;
  transition: all 0.15s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(20, 20, 30, 0.8);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

/* 任务信息区域 */
.task-info-section {
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 12px;
  color: rgba(20, 20, 30, 0.5);
  flex-shrink: 0;
}

.info-value {
  font-size: 12px;
  color: rgba(20, 20, 30, 0.8);
  text-align: right;
}

.info-value.cron {
  background: rgba(0, 0, 0, 0.05);
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 11px;
}

.info-value.status {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 10px;
}

.info-value.status.status-running {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.info-value.status.status-paused {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.info-value.status.status-finished {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(20, 20, 30, 0.4);
}

/* 执行历史 */
.history-section {
  margin-top: 4px;
}

.section-header {
  margin-bottom: 12px;
}

.section-header h4 {
  font-size: 12px;
  font-weight: 600;
  color: rgba(20, 20, 30, 0.6);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty-history {
  padding: 40px 20px;
  text-align: center;
  color: rgba(20, 20, 30, 0.3);
}

.empty-history p {
  font-size: 12px;
  margin: 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.history-item:hover {
  background: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.1);
}

.history-success {
  border-left: 2px solid #22c55e;
}

.history-failed {
  border-left: 2px solid #ef4444;
}

.history-main {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.history-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.history-success .history-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.history-failed .history-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-time {
  font-size: 12px;
  font-weight: 500;
  color: rgba(20, 20, 30, 0.8);
  margin-bottom: 2px;
}

.history-meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: rgba(20, 20, 30, 0.5);
}

.meta-item.error {
  color: #ef4444;
}

.chevron-icon {
  color: rgba(20, 20, 30, 0.3);
  flex-shrink: 0;
}

/* 详情对话框 */
.detail-dialog {
  width: 480px;
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: rgba(20, 20, 30, 0.6);
  margin-bottom: 6px;
}

.detail-value {
  font-size: 13px;
  color: rgba(20, 20, 30, 0.8);
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}

.detail-value.error-text {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.detail-output {
  font-size: 12px;
  color: rgba(20, 20, 30, 0.8);
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  padding: 12px;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Monaco', 'Courier New', monospace;
  line-height: 1.6;
  max-height: 300px;
  overflow-y: auto;
}

.detail-output::-webkit-scrollbar {
  width: 6px;
}

.detail-output::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

/* 对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  width: 500px;
  max-width: 90vw;
  max-height: 80vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dialog-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: rgba(20, 20, 30, 0.9);
  margin: 0;
}

.dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.dialog-body::-webkit-scrollbar {
  width: 6px;
}

.dialog-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: rgba(20, 20, 30, 0.8);
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 13px;
  color: rgba(20, 20, 30, 0.9);
  transition: all 0.15s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
}

.hint {
  margin-top: 6px;
  font-size: 11px;
  color: rgba(20, 20, 30, 0.5);
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.btn {
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn.secondary {
  background: rgba(0, 0, 0, 0.04);
  color: rgba(20, 20, 30, 0.7);
}

.btn.secondary:hover {
  background: rgba(0, 0, 0, 0.08);
}

.btn.primary {
  background: #667eea;
  color: white;
}

.btn.primary:hover {
  background: #5568d3;
}

.btn.primary:disabled {
  background: rgba(0, 0, 0, 0.1);
  color: rgba(20, 20, 30, 0.3);
  cursor: not-allowed;
}
</style>
