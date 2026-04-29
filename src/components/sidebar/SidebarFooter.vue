<template>
  <div class="sidebar-footer-wrapper">
    <!-- 团队切换面板 - 放在 footer 上方 -->
    <Transition name="panel-slide">
      <div
        v-if="appStore.teamSwitchPanelVisible"
        class="team-panel"
        @click.stop
      >
        <div class="team-panel-header">
          <span>切换团队</span>
        </div>
        <div class="team-list">
          <div
            v-for="team in appStore.teams"
            :key="team.id"
            class="team-item"
            :class="{ active: appStore.currentTeamId === team.id }"
            @click="appStore.switchTeam(team.id)"
          >
            <div class="team-avatar-icon" :style="getAvatarStyle(team)">
              {{ getTeamInitials(team) }}
            </div>
            <span class="team-item-name">{{ team.name }}</span>
            <svg
              v-if="appStore.currentTeamId === team.id"
              class="check-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Footer -->
    <div class="sidebar-footer" @click.stop="handleFooterClick">
      <div class="user-avatar">
        <img src="/1.jpg" alt="avatar">
      </div>
      <span class="user-name">一寒</span>
      <svg class="chevron-icon" :class="{ open: appStore.teamSwitchPanelVisible }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/appStore'

const appStore = useAppStore()

function handleFooterClick() {
  appStore.toggleTeamSwitchPanel()
}

const avatarColors = {
  personal: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  kuaixiaban: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'rd-design': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'myflicker-product': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
}

function getAvatarStyle(team) {
  return {
    background: avatarColors[team.id] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }
}

function getTeamInitials(team) {
  if (team.id === 'personal') return 'M'
  if (team.id === 'kuaixiaban') return '快'
  if (team.id === 'rd-design') return 'R'
  if (team.id === 'myflicker-product') return 'M'
  return team.name.charAt(0)
}
</script>

<style>
.sidebar-footer-wrapper {
  position: relative;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 10px 16px;
  border-top: 1px solid rgba(0,0,0,0.08);
  display: flex; align-items: center; gap: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
  background: var(--sidebar-bg);
}
.sidebar-footer:hover {
  background: rgba(0, 0, 0, 0.02);
}
.user-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #ffd6a5, #b5f0f0);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600;
  color: #1a1a1a;
  flex-shrink: 0;
  overflow: hidden;
}
.user-avatar img { width: 100%; height: 100%; object-fit: cover; }
.user-name {
  flex: 1;
  font-size: 13px; font-weight: 500;
  color: rgba(30,30,40,0.85);
}
.chevron-icon {
  color: rgba(30, 30, 40, 0.35);
  transition: transform 0.2s ease, color 0.15s;
}
.chevron-icon.open {
  transform: rotate(180deg);
  color: rgba(30, 30, 40, 0.6);
}
.sidebar-footer:hover .chevron-icon {
  color: rgba(30, 30, 40, 0.55);
}

/* 团队切换面板 - 位于 footer 上方 */
.team-panel {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.team-panel-header {
  padding: 10px 14px 8px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(30, 30, 40, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.team-list {
  padding: 4px 6px 6px;
}

.team-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s ease;
}

.team-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.team-item.active {
  background: rgba(102, 126, 234, 0.08);
}

.team-avatar-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.team-item-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: rgba(30, 30, 40, 0.85);
}

.team-item.active .team-item-name {
  color: #667eea;
  font-weight: 600;
}

.check-icon {
  color: #667eea;
  flex-shrink: 0;
}

/* 弹出动画 - 从下方滑入 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: bottom center;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
}
</style>
