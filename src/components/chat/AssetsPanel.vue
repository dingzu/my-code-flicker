<template>
  <div class="assets-panel">
    <!-- Header -->
    <div class="assets-header">
      <div class="assets-tabs">
        <button class="assets-tab" :class="{ active: activeTab === 'assets' }" @click="activeTab = 'assets'">资产</button>
        <button class="assets-tab" :class="{ active: activeTab === 'apps' }" @click="activeTab = 'apps'">应用</button>
      </div>
      <div class="assets-header-actions">
        <button class="assets-icon-btn" title="刷新">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
        <button class="assets-icon-btn" title="搜索">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <button class="assets-icon-btn" title="新建">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <button class="assets-icon-btn" title="关闭面板" @click="$emit('close')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Assets tab: file tree -->
    <div v-if="activeTab === 'assets'" class="assets-tree">
      <!-- 多媒体 -->
      <div class="tree-group">
        <div class="tree-group-header">
          <span class="tree-folder-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </span>
          <span>多媒体</span>
        </div>
      </div>

      <!-- 文档 -->
      <div class="tree-group">
        <div class="tree-group-header" @click="docsExpanded = !docsExpanded">
          <span class="tree-folder-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </span>
          <span>文档</span>
        </div>
        <div v-if="docsExpanded" class="tree-children">
          <div
            v-for="file in docFiles"
            :key="file.id"
            class="tree-file"
            :class="{ 'tree-file-active': activeFile === file.id }"
            @click="activeFile = file.id"
          >
            <span class="tree-file-icon pdf-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                <polyline points="14 2 14 8 20 8" fill="none" stroke="white" stroke-width="1.5"/>
              </svg>
            </span>
            <span class="tree-file-name">{{ file.name }}</span>
            <div v-if="activeFile === file.id" class="tree-file-actions">
              <button class="tree-action-btn" title="复制链接">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </button>
              <button class="tree-action-btn" title="更多">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 代码 -->
      <div class="tree-group">
        <div class="tree-group-header">
          <span class="tree-folder-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </span>
          <span>代码</span>
        </div>
      </div>

      <!-- Diff -->
      <div class="tree-group">
        <div class="tree-group-header">
          <span class="tree-folder-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </span>
          <span>Diff</span>
        </div>
      </div>

      <!-- html -->
      <div class="tree-group">
        <div class="tree-group-header">
          <span class="tree-folder-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </span>
          <span>html</span>
        </div>
      </div>
    </div>

    <!-- Apps tab: app list -->
    <div v-else-if="activeTab === 'apps'" class="apps-list">
      <div
        v-for="app in appList"
        :key="app.id"
        class="app-item"
        :class="{ 'app-item-active': activeApp === app.id }"
        @click="activeApp = app.id"
      >
        <div class="app-favicon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
        </div>
        <div class="app-info">
          <span class="app-name">{{ app.name }}</span>
          <span class="app-url">{{ app.url }}</span>
        </div>
        <div v-if="activeApp === app.id" class="app-actions">
          <button class="tree-action-btn" title="在浏览器中打开" @click.stop="openApp(app)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </button>
          <button class="tree-action-btn" title="复制链接" @click.stop="copyLink(app)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="appList.length === 0" class="apps-empty">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
        <p>还没有应用</p>
        <span>Agent 生成的 HTML 应用<br>会出现在这里</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['close'])

const activeTab = ref('assets')

// Assets tab state
const docsExpanded = ref(true)
const activeFile = ref('doc2')
const docFiles = ref([
  { id: 'doc1', name: '文件名' },
  { id: 'doc2', name: '文件名' },
  { id: 'doc3', name: '构建 MyFlicker 文件' },
])

// Apps tab state
const activeApp = ref(null)
const appList = ref([
  {
    id: 'app1',
    name: 'MyFlicker 首页',
    url: 'cdnfile.corp.kuaishou.com/…/780f73a.html',
    href: 'https://cdnfile.corp.kuaishou.com/kc/files/a/design-ai/poify/780f73aff9efb9b3bee04d913.html',
  },
  {
    id: 'app2',
    name: '用户留存看板',
    url: 'cdnfile.corp.kuaishou.com/…/a3c9e12.html',
    href: '#',
  },
  {
    id: 'app3',
    name: 'PRD 管理平台',
    url: 'cdnfile.corp.kuaishou.com/…/f2b8d45.html',
    href: '#',
  },
])

function openApp(app) {
  if (app.href && app.href !== '#') {
    window.open(app.href, '_blank')
  }
}

function copyLink(app) {
  navigator.clipboard.writeText(app.href).catch(() => {})
}
</script>

<style>
.assets-panel {
  width: 240px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border-radius: var(--card-radius);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.06);
  animation: assetsPanelIn 0.2s cubic-bezier(0.25,1,0.5,1) both;
}

@keyframes assetsPanelIn {
  from { opacity: 0; transform: translateX(12px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Header */
.assets-header {
  height: 48px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 8px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.5);
}

.assets-tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.assets-tab {
  padding: 3px 8px;
  border-radius: 5px;
  border: none;
  background: none;
  font-size: 13px;
  font-weight: 400;
  color: rgba(20,20,30,0.4);
  cursor: pointer;
  transition: all 0.12s;
}

.assets-tab.active {
  color: rgba(20,20,30,0.85);
  font-weight: 500;
  background: rgba(0,0,0,0.06);
}

.assets-tab:hover:not(.active) {
  color: rgba(20,20,30,0.65);
  background: rgba(0,0,0,0.04);
}

.assets-header-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.assets-icon-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 5px;
  color: rgba(20,20,30,0.4);
  cursor: pointer;
  transition: all 0.12s;
}

.assets-icon-btn:hover {
  color: rgba(20,20,30,0.8);
  background: rgba(0,0,0,0.05);
}

/* ── Assets tree ── */
.assets-tree {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
}

.assets-tree::-webkit-scrollbar { width: 4px; }
.assets-tree::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 2px; }

.tree-group { margin-bottom: 2px; }

.tree-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 400;
  color: rgba(20,20,30,0.75);
  cursor: pointer;
  user-select: none;
  transition: background 0.1s;
}

.tree-group-header:hover { background: rgba(0,0,0,0.04); }

.tree-folder-icon {
  color: rgba(20,20,30,0.35);
  display: flex;
  align-items: center;
}

.tree-children { padding: 0; }

.tree-file {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 16px 5px 38px;
  font-size: 12.5px;
  color: rgba(20,20,30,0.72);
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  margin: 0 6px;
  transition: background 0.1s;
  position: relative;
}

.tree-file:hover { background: rgba(0,0,0,0.04); }
.tree-file.tree-file-active { background: rgba(0,0,0,0.06); }

.tree-file-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.pdf-icon { color: #e34234; }

.tree-file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-file-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.tree-action-btn {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 4px;
  color: rgba(20,20,30,0.45);
  cursor: pointer;
  transition: all 0.1s;
}

.tree-action-btn:hover {
  color: rgba(20,20,30,0.8);
  background: rgba(0,0,0,0.06);
}

/* ── Apps list ── */
.apps-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.apps-list::-webkit-scrollbar { width: 4px; }
.apps-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 2px; }

.app-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: background 0.1s;
}

.app-item:hover { background: rgba(0,0,0,0.04); }
.app-item.app-item-active { background: rgba(0,0,0,0.06); }

.app-favicon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #4285f4;
}

.app-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-name {
  font-size: 12.5px;
  font-weight: 500;
  color: rgba(20,20,30,0.82);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-url {
  font-size: 11px;
  color: rgba(20,20,30,0.38);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

/* Empty state */
.apps-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  text-align: center;
  user-select: none;
  pointer-events: none;
  color: #d1d5db;
}

.apps-empty p {
  font-size: 13.5px;
  font-weight: 500;
  color: #9ca3af;
  margin: 0;
}

.apps-empty span {
  font-size: 12px;
  color: #d1d5db;
  line-height: 1.5;
}
</style>
