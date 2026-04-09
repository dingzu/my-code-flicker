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

        <!-- Advanced toggle -->
        <button class="adv-toggle" @click="advanced = !advanced">
          <svg
            class="adv-arrow"
            :class="{ 'adv-arrow-open': advanced }"
            width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
          >
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          关联本地目录
        </button>

        <!-- Advanced section -->
        <div v-if="advanced" class="adv-section">
          <!-- Added folders -->
          <div v-if="folderPaths.length > 0" class="adv-folder-list">
            <div v-for="(fp, i) in folderPaths" :key="i" class="adv-folder-row">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" class="adv-folder-row-icon">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <span class="adv-folder-path">{{ fp.path }}</span>
              <span v-if="fp.gitDetected" class="adv-git-tag">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                  <path d="M6 9v6M18 15v-3a3 3 0 0 0-3-3H9"/>
                </svg>
                {{ fp.branch }}
              </span>
              <button class="adv-remove-btn" @click="removeFolder(i)">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Detected repos from folders -->
            <div v-if="autoDetectedRepos.length > 0" class="adv-detected-repos">
              <div class="adv-detected-label">检测到代码仓库</div>
              <div v-for="(repo, i) in autoDetectedRepos" :key="i" class="adv-repo-row">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                  <path d="M6 9v6M18 15v-3a3 3 0 0 0-3-3H9"/>
                </svg>
                <div class="adv-repo-info">
                  <span class="adv-repo-url">{{ repo.url }}</span>
                  <span class="adv-repo-source">来自 {{ repo.sourceDir }}</span>
                </div>
                <span class="adv-repo-branch-tag">{{ repo.branch }}</span>
              </div>
            </div>
          </div>

          <button class="adv-add-btn" @click="pickFolder">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            添加本地目录
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
import { ref, computed, inject } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'

const sheetVisible = inject('sheetVisible')
const sidebarStore = useSidebarStore()

const projectName = ref('')
const selectedTemplate = ref('blank')
const advanced = ref(false)
const folderPaths = ref([])

const templates = [
  { id: 'blank',    name: '空白',   color: '#9ca3af' },
  { id: 'chat',     name: '对话',   color: '#3b82f6' },
  { id: 'research', name: '调研',   color: '#d97706' },
  { id: 'code',     name: '代码',   color: '#16a34a' },
  { id: 'design',   name: '设计',   color: '#db2777' },
  { id: 'data',     name: '数据',   color: '#7c3aed' },
]

// Mock folders — in production these come from a file picker
const mockFolders = [
  {
    path: '/Users/wangyihan/Documents/dz-s-agent-hiro',
    gitDetected: true,
    branch: 'main',
    remoteUrl: 'git@github.com:dingzu/my-code-flicker.git',
  },
  {
    path: '/Users/wangyihan/Projects/myflicker',
    gitDetected: true,
    branch: 'dev',
    remoteUrl: 'https://github.com/dingzu/myflicker.git',
  },
  {
    path: '/Users/wangyihan/Documents/design-assets',
    gitDetected: false,
    branch: '',
    remoteUrl: '',
  },
]

const autoDetectedRepos = computed(() =>
  folderPaths.value
    .filter(fp => fp.gitDetected)
    .map(fp => ({
      url: fp.remoteUrl,
      branch: fp.branch,
      sourceDir: fp.path.split('/').pop(), // just the folder name as label
    }))
)

function pickFolder() {
  const available = mockFolders.filter(f => !folderPaths.value.find(fp => fp.path === f.path))
  if (!available.length) return
  const picked = available[Math.floor(Math.random() * available.length)]
  folderPaths.value.push({ ...picked })
  if (!projectName.value) {
    projectName.value = picked.path.split('/').pop()
  }
}

function removeFolder(i) {
  folderPaths.value.splice(i, 1)
}

function create() {
  const name = projectName.value.trim() || '新项目'
  sidebarStore.createProject(name, 'cloud')
  projectName.value = ''
  selectedTemplate.value = 'blank'
  advanced.value = false
  folderPaths.value = []
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

/* Advanced toggle */
.adv-toggle {
  display: inline-flex; align-items: center; gap: 5px;
  background: none; border: none; cursor: pointer;
  font-size: 12px; font-weight: 500; color: #9ca3af;
  padding: 0; font-family: inherit;
  transition: color 0.1s; align-self: flex-start;
}
.adv-toggle:hover { color: #6b7280; }
.adv-arrow { transition: transform 0.2s cubic-bezier(0.25,1,0.5,1); }
.adv-arrow-open { transform: rotate(90deg); }

/* Advanced section */
.adv-section {
  display: flex; flex-direction: column; gap: 8px;
  animation: advIn 0.16s ease both;
}
@keyframes advIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Folder list */
.adv-folder-list {
  display: flex; flex-direction: column; gap: 4px;
}
.adv-folder-row {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.07);
  background: #fafafa;
  font-size: 12.5px;
}
.adv-folder-row-icon { color: #9ca3af; flex-shrink: 0; }
.adv-folder-path {
  flex: 1; min-width: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: #374151;
}
.adv-git-tag {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; color: #16a34a; background: #dcfce7;
  padding: 2px 6px; border-radius: 4px; flex-shrink: 0;
}
.adv-remove-btn {
  width: 20px; height: 20px; border-radius: 4px;
  background: transparent; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #d1d5db; flex-shrink: 0; transition: color 0.1s, background 0.1s;
}
.adv-remove-btn:hover { color: #6b7280; background: #f3f4f6; }

/* Detected repos */
.adv-detected-repos {
  display: flex; flex-direction: column; gap: 4px;
  margin-top: 4px;
}
.adv-detected-label {
  font-size: 11px; color: #9ca3af; padding: 0 2px; margin-bottom: 2px;
}
.adv-repo-row {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid rgba(22,163,74,0.2);
  background: #f0fdf4;
  font-size: 12px;
}
.adv-repo-info {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; gap: 2px;
}
.adv-repo-url {
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: #374151; font-size: 12px;
}
.adv-repo-source {
  font-size: 11px; color: #9ca3af;
}
.adv-repo-branch-tag {
  font-size: 11px; color: #15803d; background: #dcfce7;
  padding: 2px 6px; border-radius: 4px; flex-shrink: 0; font-weight: 500;
}

/* Add button */
.adv-add-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 10px;
  border-radius: 7px;
  border: 1.5px dashed rgba(0,0,0,0.12);
  background: transparent;
  font-size: 12px; font-weight: 500; color: #6b7280;
  cursor: pointer; font-family: inherit;
  transition: border-color 0.1s, color 0.1s, background 0.1s;
  align-self: flex-start;
}
.adv-add-btn:hover { border-color: rgba(0,0,0,0.22); color: #374151; background: #f9fafb; }

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
