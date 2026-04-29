<template>
  <div class="skill-management-page">
    <div class="skill-management-layout">
      <!-- 左侧：技能列表 -->
      <div class="skills-main">
        <!-- 页面标题 -->
        <div class="page-header">
          <div class="page-header-left">
            <h1 class="page-title">技能管理</h1>
            <p class="page-subtitle">
              {{ appStore.isTeamMode ? `当前团队：${appStore.currentTeam.name}` : '管理您的个人技能' }}
            </p>
          </div>
          <div class="page-header-actions">
            <button class="header-action-btn" @click="goToSkillMarket">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              技能市场
            </button>
            <button class="header-action-btn primary" @click="createSkill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              创建技能
            </button>
          </div>
        </div>

        <!-- 技能分类标签 -->
        <div class="skill-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="skill-tab"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
            <span class="tab-count">{{ getTabCount(tab.id) }}</span>
          </button>
        </div>

        <!-- 技能列表 -->
        <div class="skill-list">
          <div
            v-for="skill in filteredSkills"
            :key="skill.id"
            class="skill-item"
            :class="{ disabled: !skill.enabled }"
          >
            <div class="skill-main">
              <div class="skill-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="skill-content">
                <div class="skill-header">
                  <h3 class="skill-name">{{ skill.name }}</h3>
                  <span v-if="skill.teamId" class="skill-badge team">
                    {{ getTeamName(skill.teamId) }}
                  </span>
                </div>
                <p class="skill-desc">{{ skill.description }}</p>
              </div>
            </div>
            <label class="toggle-switch small">
              <input
                type="checkbox"
                :checked="skill.enabled"
                @change="appStore.toggleSkill(skill.id)"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredSkills.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <p class="empty-text">暂无{{ activeTab === 'enabled' ? '已启用' : activeTab === 'disabled' ? '已禁用' : '' }}的技能</p>
        </div>
      </div>

      <!-- 右侧：设置面板 -->
      <div class="skills-sidebar">
        <div class="settings-panel">
          <h3 class="panel-title">设置</h3>

          <!-- 团队技能启用设置 - 仅个人版显示 -->
          <div v-if="!appStore.isTeamMode" class="setting-item">
            <div class="setting-info">
              <h4 class="setting-name">启用团队技能</h4>
              <p class="setting-desc">开启后可在个人版使用全部团队技能</p>
            </div>
            <label class="toggle-switch small">
              <input
                type="checkbox"
                :checked="appStore.enableTeamSkillsInPersonal"
                @change="appStore.toggleTeamSkillsInPersonal"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div v-else>
            <!-- 当前团队信息 -->
            <div class="team-info">
              <div class="team-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div class="team-detail">
                <h4 class="team-name">{{ appStore.currentTeam.name }}</h4>
                <p class="team-skills-count">{{ appStore.currentSkills.length }} 个可用技能</p>
              </div>
            </div>
            <!-- 查看全部技能开关 -->
            <div class="setting-item" style="margin-top: 14px;">
              <div class="setting-info">
                <h4 class="setting-name">查看全部技能</h4>
                <p class="setting-desc">开启后同时显示个人技能和全部团队技能</p>
              </div>
              <label class="toggle-switch small">
                <input
                  type="checkbox"
                  :checked="appStore.showAllSkillsInTeam"
                  @change="appStore.toggleShowAllSkillsInTeam"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-divider"></div>

          <!-- 快捷操作 -->
          <div class="quick-actions">
            <h4 class="actions-title">快捷操作</h4>
            <button class="action-btn" @click="enableAllSkills">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              全部启用
            </button>
            <button class="action-btn" @click="disableAllSkills">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              全部禁用
            </button>
          </div>
        </div>

        <!-- 使用提示 -->
        <div class="tips-panel">
          <div class="tips-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <p class="tips-text">
            启用的技能会在对话中自动可用，禁用后技能将不会响应。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../stores/appStore'
import { useSidebarStore } from '../../stores/sidebarStore'

const appStore = useAppStore()
const sidebarStore = useSidebarStore()

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'enabled', label: '已启用' },
  { id: 'disabled', label: '已禁用' },
]

const activeTab = ref('all')

const filteredSkills = computed(() => {
  const skills = appStore.currentSkills
  if (activeTab.value === 'all') return skills
  if (activeTab.value === 'enabled') return skills.filter(s => s.enabled)
  if (activeTab.value === 'disabled') return skills.filter(s => !s.enabled)
  return skills
})

function getTabCount(tabId) {
  const skills = appStore.currentSkills
  if (tabId === 'all') return skills.length
  if (tabId === 'enabled') return skills.filter(s => s.enabled).length
  if (tabId === 'disabled') return skills.filter(s => !s.enabled).length
  return 0
}

function getTeamName(teamId) {
  const teamMap = {
    'kuaixiaban': '快下班',
    'rd-design': '研发设计',
    'myflicker-product': '产品组',
  }
  return teamMap[teamId] || teamId
}

function enableAllSkills() {
  appStore.currentSkills.forEach(skill => {
    if (!skill.enabled) {
      appStore.toggleSkill(skill.id)
    }
  })
}

function disableAllSkills() {
  appStore.currentSkills.forEach(skill => {
    if (skill.enabled) {
      appStore.toggleSkill(skill.id)
    }
  })
}

function goToSkillMarket() {
  sidebarStore.setActiveNav('skill-market')
}

function createSkill() {
  sidebarStore.setActiveNav('new-chat')
  sidebarStore.openNewChat('新对话')
  sidebarStore.setChatInputPrefill('使用 skill-creator 创建一个技能：')
}
</script>

<style>
.skill-management-page {
  padding: 24px 28px;
}

.skill-management-layout {
  display: flex;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 左侧：技能列表 */
.skills-main {
  flex: 1;
  min-width: 0;
}

/* 页面头部 */
.page-header {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.page-header-left {
  flex: 1;
}
.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}
.page-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}
.page-header-actions {
  display: flex;
  gap: 10px;
}
.header-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: white;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s;
}
.header-action-btn:hover {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.15);
}
.header-action-btn svg {
  color: var(--text-muted);
}
.header-action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}
.header-action-btn.primary svg {
  color: white;
}
.header-action-btn.primary:hover {
  opacity: 0.92;
}

/* 技能标签页 */
.skill-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 12px;
}
.skill-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
}
.skill-tab:hover {
  background: rgba(0, 0, 0, 0.04);
}
.skill-tab.active {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.25);
  color: #667eea;
}
.tab-count {
  background: rgba(0, 0, 0, 0.08);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
}
.skill-tab.active .tab-count {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

/* 技能列表 */
.skill-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.skill-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 20px;
  transition: all 0.15s;
}
.skill-item:hover {
  border-color: rgba(102, 126, 234, 0.25);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
}
.skill-item.disabled {
  opacity: 0.65;
}
.skill-main {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}
.skill-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  flex-shrink: 0;
}
.skill-item.disabled .skill-icon {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-muted);
}
.skill-content {
  flex: 1;
  min-width: 0;
}
.skill-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}
.skill-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}
.skill-badge {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
  flex-shrink: 0;
}
.skill-badge.team {
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
}
.skill-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}
.empty-icon {
  color: rgba(0, 0, 0, 0.12);
  margin-bottom: 16px;
}
.empty-text {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

/* 右侧：设置面板 */
.skills-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.settings-panel {
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}
.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

/* 设置项 */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.setting-info {
  flex: 1;
  min-width: 0;
}
.setting-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 3px 0;
}
.setting-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

/* 团队信息 */
.team-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.team-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  flex-shrink: 0;
}
.team-detail {
  flex: 1;
}
.team-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 2px 0;
}
.team-skills-count {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

/* 分隔线 */
.setting-divider {
  height: 1px;
  background: var(--border);
  margin: 16px 0;
}

/* 快捷操作 */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.actions-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: white;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s;
}
.action-btn:hover {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.15);
}
.action-btn svg {
  color: var(--text-muted);
}

/* 使用提示 */
.tips-panel {
  margin-top: 16px;
  background: rgba(102, 126, 234, 0.06);
  border: 1px solid rgba(102, 126, 234, 0.12);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  gap: 10px;
}
.tips-icon {
  color: #667eea;
  flex-shrink: 0;
}
.tips-text {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

/* 开关样式 */
.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}
.toggle-switch.small {
  width: 36px;
  height: 20px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.15);
  transition: 0.2s;
  border-radius: 24px;
}
.toggle-slider::before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.toggle-switch.small .toggle-slider::before {
  height: 14px;
  width: 14px;
}
.toggle-switch input:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(20px);
}
.toggle-switch.small input:checked + .toggle-slider::before {
  transform: translateX(16px);
}

/* 响应式 */
@media (max-width: 960px) {
  .skill-management-layout {
    flex-direction: column;
  }
  .skills-sidebar {
    width: 100%;
  }
}
</style>
