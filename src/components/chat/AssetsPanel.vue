<template>
  <div class="assets-panel">
    <!-- Team selector at top -->
    <div class="assets-team-selector">
      <button
        class="assets-team-dropdown"
        @click="teamDropdownOpen = !teamDropdownOpen"
      >
        <div class="assets-team-avatar" :style="{ background: currentTeam?.color || '#9ca3af' }">
          {{ currentTeam?.name?.[0] || '?' }}
        </div>
        <span class="assets-team-name">{{ currentTeam?.name || '个人空间' }}</span>
        <svg
          class="assets-team-arrow"
          :class="{ open: teamDropdownOpen }"
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div v-if="teamDropdownOpen" class="assets-team-menu">
        <div
          v-for="team in sidebarStore.teams"
          :key="team.id"
          class="assets-team-option"
          :class="{ active: sidebarStore.activeTeamId === team.id }"
          @click="selectTeam(team.id)"
        >
          <div class="assets-team-avatar" :style="{ background: team.color }">
            {{ team.name[0] }}
          </div>
          <span class="assets-team-option-name">{{ team.name }}</span>
          <svg v-if="sidebarStore.activeTeamId === team.id" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Header with tabs -->
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

    <!-- View filter (only for assets tab) -->
    <div v-if="activeTab === 'assets'" class="assets-view-filter">
      <button
        class="view-filter-btn"
        :class="{ active: viewFilter === 'all' }"
        @click="viewFilter = 'all'"
        title="显示全部"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
      </button>
      <button
        class="view-filter-btn"
        :class="{ active: viewFilter === 'changed' }"
        @click="viewFilter = 'changed'"
        title="只看有变化"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M4.2 4.2l4.2 4.2m5.6 5.6l4.2 4.2M1 12h6m6 0h6M4.2 19.8l4.2-4.2m5.6-5.6l4.2-4.2"/>
        </svg>
      </button>
      <button
        class="view-filter-btn"
        :class="{ active: viewFilter === 'images' }"
        @click="viewFilter = 'images'"
        title="只看图片"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </button>
      <button
        class="view-filter-btn"
        :class="{ active: viewFilter === 'docs' }"
        @click="viewFilter = 'docs'"
        title="只看文档"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </button>
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
            v-for="file in filteredDocFiles"
            :key="file.id"
            class="tree-file"
            :class="{ 'tree-file-active': activeFile === file.id }"
            @click="selectFile(file)"
          >
            <span class="tree-file-icon pdf-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                <polyline points="14 2 14 8 20 8" fill="none" stroke="white" stroke-width="1.5"/>
              </svg>
            </span>
            <span class="tree-file-name">{{ file.name }}</span>
            <span v-if="file.hasChanges" class="tree-file-badge" title="有变化">●</span>
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

    <!-- Bottom action bar -->
    <div class="assets-action-bar">
      <button class="action-bar-btn" title="代码审查" @click="triggerCodeReview">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
        <span>Code Review</span>
      </button>
      <button class="action-bar-btn" title="格式化" @click="formatFiles">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="17 1 21 5 17 9"/>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          <polyline points="7 23 3 19 7 15"/>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        </svg>
        <span>格式化</span>
      </button>
      <button class="action-bar-btn action-bar-btn-more" title="更多操作">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'

const emit = defineEmits(['close', 'select-asset'])
const sidebarStore = useSidebarStore()

const activeTab = ref('assets')
const teamDropdownOpen = ref(false)
const viewFilter = ref('all') // 'all' | 'changed' | 'images' | 'docs'

// 当前选中的团队
const currentTeam = computed(() => {
  return sidebarStore.teams.find(t => t.id === sidebarStore.activeTeamId)
})

function selectTeam(teamId) {
  sidebarStore.setActiveTeam(teamId)
  teamDropdownOpen.value = false
}

// Assets tab state
const docsExpanded = ref(true)
const activeFile = ref('doc2')
const docFiles = ref([
  { id: 'doc1', name: '文件名', hasChanges: false },
  { id: 'doc2', name: '文件名', hasChanges: true },
  { id: 'doc3', name: '构建 MyFlicker 文件', hasChanges: false },
])

// Filter files based on view filter
const filteredDocFiles = computed(() => {
  if (viewFilter.value === 'all') return docFiles.value
  if (viewFilter.value === 'changed') return docFiles.value.filter(f => f.hasChanges)
  if (viewFilter.value === 'docs') return docFiles.value
  if (viewFilter.value === 'images') return [] // No images in doc files
  return docFiles.value
})

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

function selectFile(file) {
  activeFile.value = file.id
  emit('select-asset', { type: 'doc', ...file })
}

function openApp(app) {
  if (app.href && app.href !== '#') {
    window.open(app.href, '_blank')
  }
}

function copyLink(app) {
  navigator.clipboard.writeText(app.href).catch(() => {})
}

// Action bar functions
function triggerCodeReview() {
  console.log('触发 Code Review')
  // TODO: 实现 Code Review 功能
}

function formatFiles() {
  console.log('格式化文件')
  // TODO: 实现格式化功能
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 0;
  flex-shrink: 0;
}

/* Team Selector (moved to top) */
.assets-team-selector {
  padding: 8px 12px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  position: relative;
  flex-shrink: 0;
}
.assets-team-dropdown {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 8px;
  border-radius: 7px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.7);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.12s;
}
.assets-team-dropdown:hover {
  background: rgba(255,255,255,0.9);
  border-color: rgba(0,0,0,0.12);
}
.assets-team-avatar {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.assets-team-name {
  flex: 1;
  font-size: 12.5px;
  font-weight: 500;
  color: #111827;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.assets-team-arrow {
  flex-shrink: 0;
  color: #9ca3af;
  transition: transform 0.15s;
}
.assets-team-arrow.open {
  transform: rotate(180deg);
}
.assets-team-menu {
  position: absolute;
  top: 50px;
  left: 12px;
  right: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);
  padding: 4px;
  z-index: 100;
  animation: teamMenuIn 0.15s cubic-bezier(0.25,1,0.5,1) both;
}
@keyframes teamMenuIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.assets-team-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 9px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s;
}
.assets-team-option:hover {
  background: rgba(0,0,0,0.04);
}
.assets-team-option.active {
  background: rgba(0,0,0,0.06);
}
.assets-team-option-name {
  flex: 1;
  font-size: 12.5px;
  font-weight: 500;
  color: #111827;
}
.assets-team-option svg {
  flex-shrink: 0;
  color: #16a34a;
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

/* ── View Filter ── */
.assets-view-filter {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.3);
  flex-shrink: 0;
}

.view-filter-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 5px;
  color: rgba(20,20,30,0.35);
  cursor: pointer;
  transition: all 0.12s;
  flex-shrink: 0;
}

.view-filter-btn:hover {
  color: rgba(20,20,30,0.65);
  background: rgba(0,0,0,0.04);
}

.view-filter-btn.active {
  color: rgba(20,20,30,0.85);
  background: rgba(0,0,0,0.08);
}

/* ── File badge (for changed files) ── */
.tree-file-badge {
  margin-left: auto;
  margin-right: 4px;
  font-size: 8px;
  color: #f59e0b;
  flex-shrink: 0;
  line-height: 1;
}

/* ── Action Bar ── */
.assets-action-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 8px;
  border-top: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.5);
  flex-shrink: 0;
}

.action-bar-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 8px;
  border: none;
  background: rgba(0,0,0,0.03);
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 500;
  color: rgba(20,20,30,0.65);
  cursor: pointer;
  transition: all 0.12s;
  font-family: inherit;
}

.action-bar-btn:hover {
  background: rgba(0,0,0,0.06);
  color: rgba(20,20,30,0.85);
}

.action-bar-btn svg {
  flex-shrink: 0;
}

.action-bar-btn-more {
  flex: 0 0 auto;
  width: 32px;
  padding: 6px;
}

.action-bar-btn-more span {
  display: none;
}
</style>
