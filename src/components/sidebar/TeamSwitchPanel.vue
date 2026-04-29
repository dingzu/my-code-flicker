<template>
  <Teleport to="body">
    <Transition name="panel-fade">
      <div v-if="appStore.teamSwitchPanelVisible" class="team-panel-overlay" @click="handleOverlayClick">
        <div class="team-panel" ref="panelRef" @click.stop>
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
              <div class="team-avatar" :style="getAvatarStyle(team)">
                {{ getTeamInitials(team) }}
              </div>
              <span class="team-name">{{ team.name }}</span>
              <svg
                v-if="appStore.currentTeamId === team.id"
                class="check-icon"
                width="16"
                height="16"
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
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../../stores/appStore'

const appStore = useAppStore()
const panelRef = ref(null)

// 生成团队头像背景色
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
  // 返回团队名称的首字母或缩写
  if (team.id === 'personal') return 'M'
  if (team.id === 'kuaixiaban') return '快'
  if (team.id === 'rd-design') return 'R'
  if (team.id === 'myflicker-product') return 'M'
  return team.name.charAt(0)
}

function handleOverlayClick() {
  appStore.closeTeamSwitchPanel()
}

// 点击外部关闭面板
function handleClickOutside(event) {
  if (panelRef.value && !panelRef.value.contains(event.target)) {
    appStore.closeTeamSwitchPanel()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.team-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding-left: 12px;
  padding-bottom: 60px;
}

.team-panel {
  width: 220px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.team-panel-header {
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(30, 30, 40, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.team-list {
  padding: 6px;
}

.team-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.team-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.team-item.active {
  background: rgba(102, 126, 234, 0.08);
}

.team-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.team-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: rgba(30, 30, 40, 0.85);
}

.team-item.active .team-name {
  color: #667eea;
  font-weight: 600;
}

.check-icon {
  color: #667eea;
  flex-shrink: 0;
}

/* 动画 */
.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: all 0.2s ease;
}

.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
}
</style>
