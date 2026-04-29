<template>
  <div
    class="sheet-overlay"
    v-if="sheetVisible"
    @click.self="sheetVisible = false"
  >
    <div class="sheet-wrapper">
      <!-- Main panel -->
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

          <!-- Template cards -->
          <div class="tpl-cards">
            <button
              v-for="tpl in templates"
              :key="tpl.id"
              class="tpl-card"
              :class="{ 'tpl-card-active': selectedTemplate === tpl.id }"
              @click="selectedTemplate = tpl.id"
            >
              <span class="tpl-card-icon" v-html="tpl.icon"></span>
              <span class="tpl-card-name">{{ tpl.name }}</span>
            </button>
          </div>
        </div>

        <div class="sheet-footer">
          <button class="sheet-cancel" @click="sheetVisible = false">取消</button>
          <button class="sheet-cta" @click="create">创建项目</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'

const sheetVisible = inject('sheetVisible')
const sidebarStore = useSidebarStore()

const projectName = ref('')
const selectedTemplate = ref('blank')

const templates = [
  {
    id: 'blank', name: '空白', color: '#9ca3af',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="3"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="12" y1="9" x2="12" y2="15"/></svg>`
  },
  {
    id: 'chat', name: '对话', color: '#3b82f6',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
  },
  {
    id: 'research', name: '调研', color: '#d97706',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`
  },
  {
    id: 'code', name: '代码', color: '#16a34a',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
  },
  {
    id: 'design', name: '设计', color: '#db2777',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`
  },
  {
    id: 'data', name: '数据', color: '#7c3aed',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
  },
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

/* Wrapper handles horizontal expansion */
.sheet-wrapper {
  display: flex;
  align-items: stretch;
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06);
  overflow: hidden;
  animation: sheetIn 0.22s cubic-bezier(0.25,1,0.5,1) both;
}
@keyframes sheetIn {
  from { transform: translateY(10px) scale(0.98); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}

.sheet {
  background: #fff;
  width: 400px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
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
  flex: 1;
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

/* Template cards */
.tpl-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.tpl-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  aspect-ratio: 1;
  padding: 12px;
  border-radius: 12px;
  border: 1.5px solid rgba(0,0,0,0.08);
  background: #fafafa;
  font-size: 12.5px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.tpl-card:hover {
  border-color: rgba(0,0,0,0.16);
  background: #f3f4f6;
  color: #111827;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.tpl-card-active {
  border-color: #374151 !important;
  background: #111827 !important;
  color: #fff !important;
}
.tpl-card-active .tpl-card-icon { opacity: 0.85; }
.tpl-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}
.tpl-card-name {
  font-size: 12.5px;
  letter-spacing: -0.01em;
}

/* Footer */
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
