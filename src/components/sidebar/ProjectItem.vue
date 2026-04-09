<template>
  <div>
    <div class="project-item" @click="sidebarStore.toggleProject(project.id)">
      <span class="project-chevron" :class="{ open: project.expanded }">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </span>
      <span class="project-icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      </span>
      <span class="project-name">{{ project.name }}</span>
      <span v-if="project.hasWorkspace" class="project-ws-badge" title="已绑定本地工作区">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      </span>
    </div>

    <div class="project-children" :class="{ hidden: !project.expanded }">
      <div
        v-for="session in project.sessions"
        :key="session.id"
        class="sub-item"
        :class="{ 'sub-item-active': sidebarStore.activeSessionId === session.id }"
        @click.stop="sidebarStore.openSession(session.id)"
      >
        {{ session.name }}
      </div>
      <div class="sub-item sub-item-add" @click.stop="sidebarStore.newChatInProject(project.id)">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        新建对话
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSidebarStore } from '../../stores/sidebarStore'

defineProps({
  project: { type: Object, required: true },
})

const sidebarStore = useSidebarStore()
</script>

<style>
.project-item {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 8px; border-radius: 8px; cursor: pointer;
  font-size: 13px; color: rgba(20,20,30,0.78);
  transition: background 0.1s; user-select: none;
}
.project-item:hover { background: rgba(0,0,0,0.04); }
.project-chevron {
  color: rgba(20,20,30,0.3); flex-shrink: 0;
  transition: transform 0.15s;
}
.project-chevron.open { transform: rotate(90deg); }
.project-icon { color: rgba(20,20,30,0.4); flex-shrink: 0; }
.project-name { flex: 1; font-weight: 400; }
.project-ws-badge {
  width: 16px; height: 16px; border-radius: 4px;
  background: #dcfce7; color: #16a34a;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.project-children {
  padding-left: 20px;
  overflow: hidden;
  transition: max-height 0.2s cubic-bezier(0.25,1,0.5,1);
  max-height: 300px;
}
.project-children.hidden { max-height: 0 !important; }
</style>
