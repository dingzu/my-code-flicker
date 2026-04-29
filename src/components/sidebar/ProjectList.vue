<template>
  <div>
    <!-- Projects section -->
    <div class="sidebar-section">
      <div class="section-header">
        <span class="section-label">项目</span>
        <button class="section-add" title="新建项目" @click="sheetVisible = true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
      <ProjectItem
        v-for="proj in sidebarStore.projects"
        :key="proj.id"
        :project="proj"
      />
    </div>

    <!-- Standalone conversations -->
    <div class="sidebar-section">
      <div class="section-header">
        <span class="section-label">对话</span>
        <button class="section-add" title="新建对话" @click="sidebarStore.openNewChat()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
      <div
        v-for="convo in sidebarStore.standaloneConversations"
        :key="convo.id"
        class="sub-item"
        :class="{ 'sub-item-active': sidebarStore.activeSessionId === convo.id }"
        @click="sidebarStore.openSession(convo.id)"
      >
        {{ convo.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'
import ProjectItem from './ProjectItem.vue'

const sidebarStore = useSidebarStore()

// 控制 NewProjectSheet 显示（通过 provide/inject 或 store 也可，这里用简单的 prop 事件）
// 为简化，直接操控 sheetVisible（通过 NewProjectSheet 在 App 层用 store 控制）
// 这里通过 inject 获取 sheetVisible（在 App.vue 中 provide）
// 实际上用一个简单的 ref 即可，因为 Sheet 是全局的
const sheetVisible = inject('sheetVisible')
</script>

<style>
.sidebar-section {
  padding: 12px 8px 4px;
  flex-shrink: 0;
}
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 10px;
  margin-bottom: 2px;
}
.section-label {
  font-size: 11.5px;
  font-weight: 500;
  color: rgba(30,30,40,0.42);
  letter-spacing: 0.01em;
}
.section-add {
  background: none; border: none; cursor: pointer;
  color: rgba(30,30,40,0.42);
  padding: 2px;
  border-radius: 4px;
  display: flex; align-items: center;
  transition: color 0.1s;
}
.section-add:hover { color: rgba(30,30,40,0.88); }

.sub-item {
  display: flex; align-items: center;
  padding: 5px 10px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 12.5px;
  color: rgba(30,30,40,0.55);
  transition: background 0.1s, color 0.1s;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sub-item:hover { background: rgba(0,0,0,0.04); color: rgba(20,20,30,0.85); }
.sub-item-active { color: rgba(20,20,30,0.85); font-weight: 500; background: rgba(0,0,0,0.05); }
.sub-item-add {
  gap: 5px; color: rgba(20,20,30,0.35);
  font-size: 12px;
}
.sub-item-add:hover { color: rgba(20,20,30,0.6); }
</style>
