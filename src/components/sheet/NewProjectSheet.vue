<template>
  <div
    class="sheet-overlay"
    v-if="sheetVisible"
    @click.self="sheetVisible = false"
  >
    <div class="sheet">
      <div class="sheet-header">
        <div class="sheet-title">新建项目</div>
        <button class="sheet-close" @click="sheetVisible = false">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="sheet-body">
        <!-- Project name -->
        <input
          class="sheet-input"
          type="text"
          placeholder="给项目起个名字…"
          v-model="projectName"
          autofocus
          @keydown.enter="create"
        >

        <!-- Template pills -->
        <div class="tpl-pills">
          <button
            v-for="tpl in templates"
            :key="tpl.id"
            class="tpl-pill"
            :class="{ 'tpl-pill-active': selectedTemplate === tpl.id }"
            @click="selectedTemplate = tpl.id"
          >
            <span class="tpl-pill-dot" :style="{ background: tpl.color }"></span>
            {{ tpl.name }}
          </button>
        </div>
      </div>

      <div class="sheet-footer">
        <button class="sheet-cancel" @click="sheetVisible = false">取消</button>
        <button class="sheet-cta" @click="create">创建项目</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'

const sheetVisible = inject('sheetVisible')
const sidebarStore = useSidebarStore()

const projectName = ref('')
const selectedTemplate = ref('blank')

const templates = [
  { id: 'blank',    name: '空白',   color: '#9ca3af' },
  { id: 'chat',     name: '对话',   color: '#3b82f6' },
  { id: 'research', name: '调研',   color: '#d97706' },
  { id: 'code',     name: '代码',   color: '#16a34a' },
  { id: 'design',   name: '设计',   color: '#db2777' },
  { id: 'data',     name: '数据',   color: '#7c3aed' },
]

function create() {
  const name = projectName.value.trim() || '新项目'
  sidebarStore.createProject(name, 'cloud')
  projectName.value = ''
  selectedTemplate.value = 'blank'
  sheetVisible.value = false
}
</script>

<style>
.sheet-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.18);
  backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9000;
}
.sheet {
  background: #fff; width: 100%; max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06);
  animation: sheetIn 0.22s cubic-bezier(0.25,1,0.5,1) both;
}
@keyframes sheetIn {
  from { transform: translateY(10px) scale(0.98); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}
.sheet-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 20px 0;
}
.sheet-title { font-size: 16px; font-weight: 600; color: #111827; letter-spacing: -0.02em; }
.sheet-close {
  width: 28px; height: 28px; border-radius: 50%;
  background: #f3f4f6; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #6b7280; transition: background 0.1s;
}
.sheet-close:hover { background: #e5e7eb; }

.sheet-body {
  padding: 16px 20px 20px;
  display: flex; flex-direction: column; gap: 12px;
}
.sheet-input {
  height: 44px; border: 1.5px solid rgba(0,0,0,0.1); border-radius: 10px;
  padding: 0 14px; font-size: 14px; font-family: inherit; color: #111827;
  outline: none; background: #fafafa; transition: border-color 0.15s;
  width: 100%; box-sizing: border-box;
}
.sheet-input:focus { border-color: #374151; background: #fff; }

/* Template pills */
.tpl-pills {
  display: flex; flex-wrap: wrap; gap: 6px;
}
.tpl-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1.5px solid rgba(0,0,0,0.08);
  background: #fafafa;
  font-size: 12.5px; font-weight: 400; color: #4b5563;
  cursor: pointer; font-family: inherit;
  transition: all 0.12s;
}
.tpl-pill:hover { border-color: rgba(0,0,0,0.16); background: #f3f4f6; color: #111827; }
.tpl-pill-active {
  border-color: #374151 !important;
  background: #111827 !important;
  color: #fff !important;
}
.tpl-pill-active .tpl-pill-dot { opacity: 0.7; }
.tpl-pill-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
}

.sheet-footer {
  display: flex; gap: 8px; justify-content: flex-end;
  padding: 0 20px 20px;
}
.sheet-cancel {
  height: 38px; padding: 0 16px; border-radius: 9px;
  border: 1.5px solid rgba(0,0,0,0.1); background: #fff;
  font-size: 13.5px; font-weight: 500; color: #374151;
  cursor: pointer; font-family: inherit; transition: background 0.1s;
}
.sheet-cancel:hover { background: #f9fafb; }
.sheet-cta {
  height: 38px; padding: 0 20px; border-radius: 9px;
  background: #111827; border: none; color: #fff;
  font-size: 13.5px; font-weight: 500; font-family: inherit;
  cursor: pointer; transition: background 0.12s;
}
.sheet-cta:hover { background: #1f2937; }
</style>
