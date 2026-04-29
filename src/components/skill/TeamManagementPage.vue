<template>
  <div class="team-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <div class="team-avatar-large">{{ teamAvatar }}</div>
        <div class="team-info">
          <h2 class="team-name">{{ appStore.currentTeam.name }}</h2>
          <p class="team-desc">团队ID: {{ appStore.currentTeam.id }}</p>
        </div>
      </div>
      <button class="invite-btn" @click="showInviteDialog = true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <line x1="20" y1="8" x2="20" y2="14"/>
          <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
        邀请成员
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ totalMembers }}</div>
        <div class="stat-label">团队成员</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ adminCount }}</div>
        <div class="stat-label">管理员</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ memberCount }}</div>
        <div class="stat-label">普通成员</div>
      </div>
    </div>

    <!-- 成员列表 -->
    <div class="members-section">
      <div class="section-header">
        <h3 class="section-title">成员列表</h3>
        <div class="filter-tabs">
          <button
            class="filter-tab"
            :class="{ active: currentFilter === 'all' }"
            @click="currentFilter = 'all'"
          >
            全部
          </button>
          <button
            class="filter-tab"
            :class="{ active: currentFilter === 'admin' }"
            @click="currentFilter = 'admin'"
          >
            管理员
          </button>
          <button
            class="filter-tab"
            :class="{ active: currentFilter === 'member' }"
            @click="currentFilter = 'member'"
          >
            成员
          </button>
        </div>
      </div>

      <div class="members-list">
        <div
          v-for="member in filteredMembers"
          :key="member.id"
          class="member-item"
        >
          <div class="member-avatar" :style="getAvatarStyle(member)">
            {{ member.avatar }}
          </div>
          <div class="member-info">
            <div class="member-name-row">
              <span class="member-name">{{ member.name }}</span>
              <span v-if="member.role === 'owner'" class="role-badge owner">所有者</span>
              <span v-else-if="member.role === 'admin'" class="role-badge admin">管理员</span>
              <span v-else class="role-badge member">成员</span>
            </div>
            <div class="member-email">{{ member.email }}</div>
          </div>
          <div class="member-actions">
            <button
              v-if="canManageMember(member)"
              class="action-btn"
              @click="openRoleMenu(member)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 邀请成员弹窗 -->
    <Teleport to="body">
      <Transition name="dialog-fade">
        <div v-if="showInviteDialog" class="dialog-overlay" @click="showInviteDialog = false">
          <div class="dialog" @click.stop>
            <div class="dialog-header">
              <h3>邀请成员</h3>
              <button class="close-btn" @click="showInviteDialog = false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="dialog-body">
              <div class="form-group">
                <label>成员姓名</label>
                <input
                  v-model="newMember.name"
                  type="text"
                  placeholder="请输入成员姓名"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>邮箱地址</label>
                <input
                  v-model="newMember.email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>角色权限</label>
                <div class="role-options">
                  <label class="role-option">
                    <input v-model="newMember.role" type="radio" value="member" />
                    <div class="role-option-content">
                      <div class="role-option-title">普通成员</div>
                      <div class="role-option-desc">可以使用团队功能，查看团队资源</div>
                    </div>
                  </label>
                  <label class="role-option">
                    <input v-model="newMember.role" type="radio" value="admin" />
                    <div class="role-option-content">
                      <div class="role-option-title">管理员</div>
                      <div class="role-option-desc">可以管理团队成员和配置团队设置</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div class="dialog-footer">
              <button class="btn-secondary" @click="showInviteDialog = false">取消</button>
              <button class="btn-primary" @click="handleInvite" :disabled="!isValidNewMember">
                发送邀请
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 角色管理弹窗 -->
    <Teleport to="body">
      <Transition name="dialog-fade">
        <div v-if="showRoleMenu && selectedMember" class="dialog-overlay" @click="showRoleMenu = false">
          <div class="dialog role-dialog" @click.stop>
            <div class="dialog-header">
              <h3>管理成员</h3>
              <button class="close-btn" @click="showRoleMenu = false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="dialog-body">
              <div class="selected-member-preview">
                <div class="member-avatar" :style="getAvatarStyle(selectedMember)">
                  {{ selectedMember.avatar }}
                </div>
                <div class="member-info">
                  <div class="member-name">{{ selectedMember.name }}</div>
                  <div class="member-email">{{ selectedMember.email }}</div>
                </div>
              </div>
              <div class="role-actions">
                <button
                  v-if="selectedMember.role !== 'admin'"
                  class="role-action-btn"
                  @click="handleChangeRole('admin')"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                  设为管理员
                </button>
                <button
                  v-if="selectedMember.role !== 'member'"
                  class="role-action-btn"
                  @click="handleChangeRole('member')"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                  设为普通成员
                </button>
                <div class="divider"></div>
                <button class="role-action-btn danger" @click="handleRemoveMember">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  移出团队
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../stores/appStore'

const appStore = useAppStore()
const currentFilter = ref('all')
const showInviteDialog = ref(false)
const showRoleMenu = ref(false)
const selectedMember = ref(null)

const newMember = ref({
  name: '',
  email: '',
  role: 'member',
})

// 团队头像
const teamAvatar = computed(() => {
  return appStore.currentTeam.logo.charAt(0).toUpperCase()
})

// 统计
const totalMembers = computed(() => appStore.teamMembers.length)
const adminCount = computed(() => appStore.teamMembers.filter(m => m.role === 'admin' || m.role === 'owner').length)
const memberCount = computed(() => appStore.teamMembers.filter(m => m.role === 'member').length)

// 过滤成员
const filteredMembers = computed(() => {
  if (currentFilter.value === 'all') {
    return appStore.teamMembers
  }
  if (currentFilter.value === 'admin') {
    return appStore.teamMembers.filter(m => m.role === 'admin' || m.role === 'owner')
  }
  return appStore.teamMembers.filter(m => m.role === 'member')
})

// 验证新成员表单
const isValidNewMember = computed(() => {
  return newMember.value.name.trim() && newMember.value.email.trim()
})

// 头像样式
function getAvatarStyle(member) {
  const colors = {
    owner: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    admin: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    member: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  }
  return {
    background: colors[member.role] || colors.member,
  }
}

// 是否可以管理该成员（不能管理所有者）
function canManageMember(member) {
  return member.role !== 'owner'
}

// 打开角色管理菜单
function openRoleMenu(member) {
  selectedMember.value = member
  showRoleMenu.value = true
}

// 处理邀请
function handleInvite() {
  if (!isValidNewMember.value) return
  appStore.addTeamMember({
    name: newMember.value.name.trim(),
    email: newMember.value.email.trim(),
    role: newMember.value.role,
  })
  // 重置表单
  newMember.value = { name: '', email: '', role: 'member' }
  showInviteDialog.value = false
}

// 修改角色
function handleChangeRole(newRole) {
  if (selectedMember.value) {
    appStore.updateMemberRole(selectedMember.value.id, newRole)
  }
  showRoleMenu.value = false
  selectedMember.value = null
}

// 移除成员
function handleRemoveMember() {
  if (selectedMember.value) {
    appStore.removeTeamMember(selectedMember.value.id)
  }
  showRoleMenu.value = false
  selectedMember.value = null
}
</script>

<style scoped>
.team-management-page {
  padding: 32px 48px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  max-width: 1200px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.team-avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.team-name {
  font-size: 20px;
  font-weight: 600;
  color: rgba(30, 30, 40, 0.9);
  margin: 0 0 4px;
}

.team-desc {
  font-size: 13px;
  color: rgba(30, 30, 40, 0.5);
  margin: 0;
}

.invite-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.invite-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

/* 统计卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  max-width: 1200px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: rgba(30, 30, 40, 0.9);
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 13px;
  color: rgba(30, 30, 40, 0.5);
}

/* 成员列表 */
.members-section {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  overflow: hidden;
  max-width: 1200px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(30, 30, 40, 0.9);
  margin: 0;
}

.filter-tabs {
  display: flex;
  gap: 4px;
  background: rgba(0, 0, 0, 0.04);
  padding: 4px;
  border-radius: 8px;
}

.filter-tab {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 500;
  color: rgba(30, 30, 40, 0.5);
  cursor: pointer;
  transition: all 0.15s;
}

.filter-tab:hover {
  color: rgba(30, 30, 40, 0.7);
}

.filter-tab.active {
  background: white;
  color: rgba(30, 30, 40, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.members-list {
  padding: 8px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: 10px;
  transition: background 0.15s;
}

.member-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.member-name {
  font-size: 14px;
  font-weight: 500;
  color: rgba(30, 30, 40, 0.9);
}

.member-email {
  font-size: 12px;
  color: rgba(30, 30, 40, 0.5);
}

.role-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.role-badge.owner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.role-badge.admin {
  background: rgba(240, 147, 251, 0.15);
  color: #d63384;
}

.role-badge.member {
  background: rgba(79, 172, 254, 0.15);
  color: #0d6efd;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: rgba(30, 30, 40, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(30, 30, 40, 0.7);
}

/* 弹窗样式 */
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
  z-index: 10000;
  padding: 20px;
}

.dialog {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 0;
}

.dialog-header h3 {
  font-size: 17px;
  font-weight: 600;
  color: rgba(30, 30, 40, 0.9);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: rgba(30, 30, 40, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(30, 30, 40, 0.7);
}

.dialog-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: rgba(30, 30, 40, 0.7);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 14px;
  background: white;
  transition: all 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.role-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.role-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
}

.role-option:hover {
  border-color: rgba(102, 126, 234, 0.3);
  background: rgba(102, 126, 234, 0.02);
}

.role-option input[type="radio"] {
  margin-top: 2px;
  accent-color: #667eea;
}

.role-option-content {
  flex: 1;
}

.role-option-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(30, 30, 40, 0.9);
  margin-bottom: 2px;
}

.role-option-desc {
  font-size: 12px;
  color: rgba(30, 30, 40, 0.5);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 20px 20px;
}

.btn-secondary {
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  font-size: 13px;
  font-weight: 500;
  color: rgba(30, 30, 40, 0.7);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.03);
}

.btn-primary {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 13px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 角色管理弹窗 */
.role-dialog {
  max-width: 360px;
}

.selected-member-preview {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  margin-bottom: 16px;
}

.role-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role-action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: rgba(30, 30, 40, 0.8);
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.role-action-btn:hover {
  background: rgba(0, 0, 0, 0.04);
}

.role-action-btn.danger {
  color: #dc3545;
}

.role-action-btn.danger:hover {
  background: rgba(220, 53, 69, 0.08);
}

.divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
  margin: 8px 0;
}

/* 动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-from .dialog,
.dialog-fade-leave-to .dialog {
  transform: scale(0.95);
}
</style>
