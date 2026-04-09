<template>
  <aside class="sidebar">
    <!-- Title bar with traffic lights -->
    <div class="sidebar-titlebar">
      <TrafficLights
        @close="appStore.closeMainWindow()"
        @maximize="appStore.toggleMaximize()"
      />
      <div class="sidebar-titlebar-actions">
        <button class="sidebar-title-btn" title="搜索">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <button class="sidebar-title-btn" title="新建">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
          </svg>
        </button>
      </div>
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
.sidebar-titlebar {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
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
