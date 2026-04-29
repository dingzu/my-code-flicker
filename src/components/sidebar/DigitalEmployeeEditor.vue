<template>
  <Transition name="modal-fade">
    <div
      v-if="appStore.digitalEmployeeEditorVisible"
      class="editor-overlay"
      @click="appStore.closeEmployeeEditor()"
    >
      <div class="editor-modal" @click.stop>
        <!-- 头部 -->
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditing ? '编辑数字员工' : '创建数字员工' }}</h3>
          <button class="close-btn" @click="appStore.closeEmployeeEditor()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- 表单 -->
        <div class="modal-body">
          <!-- 头像选择 -->
          <div class="form-section">
            <label class="section-label">头像</label>
            <div class="avatar-options">
              <div
                v-for="(color, idx) in avatarColors"
                :key="idx"
                class="avatar-option"
                :style="{ background: color }"
                :class="{ selected: form.avatarColor === idx }"
                @click="form.avatarColor = idx"
              >
                {{ form.name?.charAt(0) || '?' }}
              </div>
            </div>
          </div>

          <!-- 名称 -->
          <div class="form-section">
            <label class="section-label">名称 <span class="required">*</span></label>
            <input
              v-model="form.name"
              type="text"
              class="form-input"
              placeholder="例如：小助手、数据分析师"
              maxlength="20"
            />
          </div>

          <!-- 岗位描述 -->
          <div class="form-section">
            <label class="section-label">岗位描述</label>
            <div class="role-chips">
              <div
                v-for="role in availableRoles"
                :key="role.id"
                class="role-chip"
                :class="{ selected: form.role === role.id }"
                @click="form.role = role.id"
              >
                <span class="role-icon">{{ role.icon }}</span>
                {{ role.name }}
              </div>
            </div>
            <p class="section-hint">选择数字员工的岗位类型</p>
          </div>

          <!-- 消息号 -->
          <div class="form-section">
            <label class="section-label">消息号 ID</label>
            <input
              v-model="form.messagingId"
              type="text"
              class="form-input"
              placeholder="输入消息号的 ID，例如：100001"
              maxlength="30"
            />
            <p class="section-hint">配置后数字员工可通过该消息号接收和发送消息</p>
          </div>

          <!-- 技能范围 -->
          <div class="form-section">
            <label class="section-label">技能范围</label>
            <div class="skill-chips">
              <div
                v-for="skill in availableSkills"
                :key="skill.id"
                class="skill-chip"
                :class="{ selected: form.skills.includes(skill.id) }"
                @click="toggleSkill(skill.id)"
              >
                {{ skill.name }}
              </div>
            </div>
            <p class="section-hint">选择此数字员工可使用的技能</p>
          </div>

          <!-- 知识库 -->
          <div class="form-section">
            <label class="section-label">知识库</label>
            <div class="knowledge-chips">
              <div
                v-for="kb in availableKnowledgeBases"
                :key="kb.id"
                class="knowledge-chip"
                :class="{ selected: form.knowledgeBases.includes(kb.id) }"
                @click="toggleKnowledgeBase(kb.id)"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                {{ kb.name }}
              </div>
            </div>
            <p class="section-hint">选择此数字员工可访问的知识库</p>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="appStore.closeEmployeeEditor()">取消</button>
          <button
            class="btn btn-primary"
            :disabled="!form.name?.trim()"
            @click="handleSave"
          >
            {{ isEditing ? '保存修改' : '创建员工' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '../../stores/appStore'

const appStore = useAppStore()

const isEditing = computed(() => !!appStore.editingEmployee)

const form = ref({
  name: '',
  role: '',
  avatarColor: 0,
  messagingId: '',
  skills: [],
  knowledgeBases: [],
})

// 头像颜色选项
const avatarColors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
]

// 可用岗位列表
const availableRoles = [
  { id: 'assistant', name: '智能助手', icon: '🤖' },
  { id: 'analyst', name: '数据分析师', icon: '📊' },
  { id: 'reviewer', name: '代码审查员', icon: '🔍' },
  { id: 'writer', name: '文档撰写员', icon: '📝' },
  { id: 'coordinator', name: '任务协调员', icon: '📋' },
  { id: 'monitor', name: '监控告警员', icon: '🔔' },
]

// 可用技能列表
const availableSkills = [
  { id: 'code-review', name: '代码审查' },
  { id: 'doc-writing', name: '文档撰写' },
  { id: 'data-analysis', name: '数据分析' },
  { id: 'meeting-summary', name: '会议纪要' },
  { id: 'task-reminder', name: '任务提醒' },
  { id: 'report-generation', name: '报告生成' },
]

// 可用知识库列表
const availableKnowledgeBases = [
  { id: 'team-docs', name: '团队文档' },
  { id: 'product-specs', name: '产品规范' },
  { id: 'tech-wiki', name: '技术Wiki' },
  { id: 'meeting-records', name: '会议记录' },
]

// 监听编辑状态变化，初始化表单
watch(
  () => appStore.editingEmployee,
  (employee) => {
    if (employee) {
      form.value = {
        name: employee.name || '',
        role: employee.role || '',
        avatarColor: employee.avatarColor || 0,
        messagingId: employee.messagingId || '',
        skills: employee.skills || [],
        knowledgeBases: employee.knowledgeBases || [],
      }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  form.value = {
    name: '',
    role: '',
    avatarColor: 0,
    messagingId: '',
    skills: [],
    knowledgeBases: [],
  }
}

function toggleSkill(skillId) {
  const idx = form.value.skills.indexOf(skillId)
  if (idx === -1) {
    form.value.skills.push(skillId)
  } else {
    form.value.skills.splice(idx, 1)
  }
}

function toggleKnowledgeBase(kbId) {
  const idx = form.value.knowledgeBases.indexOf(kbId)
  if (idx === -1) {
    form.value.knowledgeBases.push(kbId)
  } else {
    form.value.knowledgeBases.splice(idx, 1)
  }
}

function handleSave() {
  if (!form.value.name?.trim()) return
  
  appStore.saveEmployee({
    name: form.value.name.trim(),
    role: form.value.role?.trim() || '',
    avatarColor: form.value.avatarColor,
    messagingId: form.value.messagingId?.trim() || '',
    skills: [...form.value.skills],
    knowledgeBases: [...form.value.knowledgeBases],
  })
}
</script>

<style scoped>
.editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.editor-modal {
  width: 520px;
  max-width: 100%;
  max-height: calc(100vh - 60px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.modal-title {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  transition: background 0.1s, color 0.1s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.7);
}

.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}

.form-section {
  margin-bottom: 20px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 10px;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.section-hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  margin: 8px 0 0;
}

/* 头像选择 */
.avatar-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.avatar-option {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  border: 2px solid transparent;
}

.avatar-option:hover {
  transform: translateY(-2px);
}

.avatar-option.selected {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 表单输入 */
.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  font-size: 14px;
  color: #1a1a2e;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(0, 0, 0, 0.35);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

/* 技能/知识库/岗位选择 */
.skill-chips,
.knowledge-chips,
.role-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip,
.knowledge-chip,
.role-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.12s;
  background: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.65);
  border: 1px solid transparent;
}

.skill-chip:hover,
.knowledge-chip:hover,
.role-chip:hover {
  background: rgba(0, 0, 0, 0.08);
}

.skill-chip.selected,
.knowledge-chip.selected,
.role-chip.selected {
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
  border-color: rgba(102, 126, 234, 0.3);
}

.role-icon {
  font-size: 14px;
}

/* 底部按钮 */
.modal-footer {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.65);
}

.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .editor-modal,
.modal-fade-leave-to .editor-modal {
  transform: scale(0.95);
}
</style>
