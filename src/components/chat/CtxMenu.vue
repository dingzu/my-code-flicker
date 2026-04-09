<template>
  <div class="ctx-menu" v-show="visible" @click.stop>
    <div class="ctx-menu-section">执行位置</div>

    <!-- Workspace projects -->
    <div
      v-for="proj in wsProjects"
      :key="proj.id"
      class="ctx-menu-item"
      :class="{ 'ctx-item-selected': modelValue === proj.id }"
      @click="select(proj.id, proj.name, 'ws')"
    >
      <div class="ctx-item-left">
        <div class="ctx-item-icon ctx-icon-ws">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <div>
          <div class="ctx-item-name">{{ proj.name }}</div>
          <div class="ctx-item-sub">本地 · ~/Documents/{{ proj.name }} · main</div>
        </div>
      </div>
      <svg v-if="modelValue === proj.id" class="ctx-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>

    <!-- Cloud projects -->
    <div
      v-for="proj in cloudProjects"
      :key="proj.id"
      class="ctx-menu-item"
      :class="{ 'ctx-item-selected': modelValue === proj.id }"
      @click="select(proj.id, proj.name, 'cloud')"
    >
      <div class="ctx-item-left">
        <div class="ctx-item-icon ctx-icon-cloud">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
          </svg>
        </div>
        <div>
          <div class="ctx-item-name">{{ proj.name }}</div>
          <div class="ctx-item-sub">云端 · Myflicker 文件系统</div>
        </div>
      </div>
    </div>

    <!-- No project -->
    <div
      class="ctx-menu-item"
      :class="{ 'ctx-item-selected': modelValue === 'free' }"
      @click="select('free', '无项目（云端）', 'cloud-free')"
    >
      <div class="ctx-item-left">
        <div class="ctx-item-icon ctx-icon-free">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div>
          <div class="ctx-item-name">无项目</div>
          <div class="ctx-item-sub">云端对话，不绑定任何项目</div>
        </div>
      </div>
    </div>

    <div class="ctx-menu-divider"></div>
    <div class="ctx-menu-item ctx-menu-item-action" @click="emit('new-project')">
      <div class="ctx-item-left">
        <div class="ctx-item-icon ctx-icon-add">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <div class="ctx-item-name">新建项目…</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'

const props = defineProps({
  visible: Boolean,
  modelValue: String,
})
const emit = defineEmits(['update:modelValue', 'update:label', 'update:type', 'new-project', 'close'])

const sidebarStore = useSidebarStore()
const wsProjects = computed(() => sidebarStore.projects.filter(p => p.hasWorkspace))
const cloudProjects = computed(() => sidebarStore.projects.filter(p => !p.hasWorkspace))

function select(id, label, type) {
  emit('update:modelValue', id)
  emit('update:label', label)
  emit('update:type', type)
  emit('close')
}
</script>

<style>
.ctx-menu {
  position: absolute;
  bottom: calc(100% + 4px); left: 0;
  background: #fff;
  border-radius: 11px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06);
  width: 280px;
  z-index: 500;
  overflow: hidden;
  padding: 6px;
}
.ctx-menu-section {
  font-size: 10.5px; font-weight: 600; color: #9ca3af;
  text-transform: uppercase; letter-spacing: 0.06em;
  padding: 4px 10px 6px;
}
.ctx-menu-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px; border-radius: 8px; cursor: pointer;
  transition: background 0.1s;
}
.ctx-menu-item:hover { background: #f9fafb; }
.ctx-item-selected { background: #f0f9ff; }
.ctx-item-left { display: flex; align-items: flex-start; gap: 9px; }
.ctx-item-icon {
  width: 24px; height: 24px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
.ctx-icon-ws    { background: #dcfce7; color: #16a34a; }
.ctx-icon-cloud { background: #dbeafe; color: #3b82f6; }
.ctx-icon-free  { background: #f3f4f6; color: #6b7280; }
.ctx-icon-add   { background: #f3f4f6; color: #374151; }
.ctx-item-name { font-size: 13px; font-weight: 500; color: #111827; }
.ctx-item-sub  { font-size: 11px; color: #9ca3af; margin-top: 1px; line-height: 1.3; }
.ctx-check { flex-shrink: 0; }
.ctx-menu-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 4px 0; }
.ctx-menu-item-action .ctx-item-name { color: #374151; }
</style>
