<template>
  <div class="sidebar-nav">
    <div
      v-for="item in navItems"
      :key="item.id"
      class="nav-item"
      :class="{ active: activeNav === item.id }"
      @click="handleNavClick(item)"
    >
      <span class="nav-icon" v-html="item.icon"></span>
      {{ item.label }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'

const sidebarStore = useSidebarStore()
const activeNav = ref('new-chat')

const navItems = [
  {
    id: 'new-chat',
    label: '新对话',
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
  {
    id: 'schedule',
    label: '任务管理',
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
  {
    id: 'skills',
    label: '技能市场',
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
  },
  {
    id: 'profile',
    label: '我的 Flicker',
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  },
]

function handleNavClick(item) {
  activeNav.value = item.id
  if (item.id === 'new-chat') {
    sidebarStore.openNewChat()
  }
}
</script>

<style>
.sidebar-nav {
  padding: 4px 8px 8px;
  flex-shrink: 0;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13.5px;
  font-weight: 400;
  color: rgba(20,20,30,0.82);
  transition: background 0.1s;
  user-select: none;
}
.nav-item:hover { background: rgba(0,0,0,0.05); }
.nav-item.active { background: rgba(0,0,0,0.07); font-weight: 500; }
.nav-icon {
  width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  color: rgba(20,20,30,0.38);
}
.nav-item.active .nav-icon,
.nav-item:hover .nav-icon { color: rgba(30,30,40,0.65); }
</style>
