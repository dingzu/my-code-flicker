<template>
  <aside class="sidebar">
    <!-- Title bar with traffic lights -->
    <div class="sidebar-titlebar">
      <div class="sidebar-titlebar-left">
        <TrafficLights
          @close="appStore.closeMainWindow()"
          @maximize="appStore.toggleMaximize()"
        />
      </div>
      <div class="sidebar-titlebar-actions">
        <button class="sidebar-title-btn" title="搜索">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <button class="sidebar-title-btn" title="收起侧边栏" @click="appStore.toggleSidebar()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <polyline points="16 15 13 12 16 9"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Logo: below titlebar, above nav -->
    <div class="sidebar-logo">
      <span class="logo-text">{{ appStore.currentTeam.logo }}</span>
    </div>

    <!-- Primary nav -->
    <SidebarNav />

    <!-- Scrollable projects/convos -->
    <div class="sidebar-scroll">
      <ProjectList />
    </div>

    <!-- Footer: user -->
    <SidebarFooter />
  </aside>
</template>

<script setup>
import { useAppStore } from '../../stores/appStore'
import TrafficLights from '../window/TrafficLights.vue'
import SidebarNav from './SidebarNav.vue'
import ProjectList from './ProjectList.vue'
import SidebarFooter from './SidebarFooter.vue'

const appStore = useAppStore()
</script>

<style>
.sidebar {
  width: var(--sidebar-w);
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}
/* Logo */
.sidebar-logo {
  padding: 4px 18px 2px;
  flex-shrink: 0;
}
.logo-text {
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
}
.sidebar-titlebar {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
}
.sidebar-titlebar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sidebar-titlebar-actions { display: flex; gap: 10px; align-items: center; }

.sidebar-title-btn {
  background: none; border: none; cursor: pointer;
  color: rgba(30,30,40,0.42);
  padding: 3px;
  border-radius: 4px;
  display: flex; align-items: center;
  transition: color 0.12s;
}
.sidebar-title-btn:hover { color: rgba(30,30,40,0.88); }
.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
.sidebar-scroll::-webkit-scrollbar { width: 4px; }
.sidebar-scroll::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
}
</style>
