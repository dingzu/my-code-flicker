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
        <div class="sheet-field">
          <label class="sheet-label">项目名称</label>
          <input class="sheet-input" type="text" placeholder="例：我的新项目" v-model="projectName" autofocus>
        </div>

        <!-- Template selection -->
        <div class="sheet-field">
          <label class="sheet-label">项目模板</label>
          <div class="template-grid">
            <label
              v-for="tpl in templates"
              :key="tpl.id"
              class="tpl-card"
              :class="{ 'tpl-card-selected': selectedTemplate === tpl.id }"
            >
              <input type="radio" name="template" :value="tpl.id" v-model="selectedTemplate">
              <div class="tpl-icon" :style="{ background: tpl.bg, color: tpl.color }">
                <span v-html="tpl.icon"></span>
              </div>
              <div class="tpl-name">{{ tpl.name }}</div>
              <div class="tpl-desc">{{ tpl.desc }}</div>
            </label>
          </div>
        </div>

        <!-- Cloud Workspace (first-class) -->
        <div class="sheet-field">
          <label class="sheet-label">
            云端 Workspace
            <span class="sheet-label-badge">推荐</span>
          </label>
          <p class="sheet-field-hint">每个项目默认拥有云端空间，方便多端同步查看 Session 进度。</p>
          <div class="cloud-options">
            <label
              v-for="opt in cloudOptions"
              :key="opt.value"
              class="cloud-opt"
              :class="{ 'cloud-opt-selected': cloudWorkspace === opt.value }"
            >
              <input type="radio" name="cloud" :value="opt.value" v-model="cloudWorkspace">
              <div class="cloud-opt-icon" :style="{ background: opt.bg, color: opt.color }" v-html="opt.icon"></div>
              <div class="cloud-opt-body">
                <div class="cloud-opt-name">{{ opt.name }}</div>
                <div class="cloud-opt-sub">{{ opt.sub }}</div>
              </div>
              <div v-if="opt.value === 'auto'" class="cloud-opt-badge">默认</div>
            </label>
          </div>
        </div>

        <!-- Advanced mode toggle -->
        <button class="advanced-toggle" @click="advanced = !advanced">
          <svg
            class="advanced-arrow"
            :class="{ 'advanced-arrow-open': advanced }"
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
          >
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          高级配置
        </button>

        <!-- Advanced section -->
        <div class="advanced-section" v-if="advanced">

          <!-- Local directories (multi) -->
          <div class="adv-item">
            <div class="adv-item-header">
              <div class="adv-icon" style="background:#dbeafe;color:#3b82f6">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span class="adv-item-label">本地目录</span>
              <span class="adv-item-sub">可绑定多个本地文件夹</span>
            </div>

            <!-- Added folders list -->
            <div v-if="folderPaths.length > 0" class="adv-folder-list">
              <div v-for="(fp, i) in folderPaths" :key="i" class="adv-folder-row">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="color:#6b7280;flex-shrink:0">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <span class="adv-folder-path">{{ fp.path }}</span>
                <span v-if="fp.gitDetected" class="adv-folder-git-tag">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                    <path d="M6 9v6M18 15v-3a3 3 0 0 0-3-3H9"/>
                  </svg>
                  {{ fp.branch }}
                </span>
                <button class="adv-folder-remove" @click="removeFolder(i)">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <button class="adv-add-btn" @click="pickFolder">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              添加本地目录
            </button>
          </div>

          <!-- Git repos (multi, auto-detect + manual) -->
          <div class="adv-item">
            <div class="adv-item-header">
              <div class="adv-icon" style="background:#dcfce7;color:#16a34a">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                  <path d="M6 9v6M18 15v-3a3 3 0 0 0-3-3H9"/>
                </svg>
              </div>
              <span class="adv-item-label">代码仓库</span>
              <span class="adv-item-sub">自动关联或手动添加多个</span>
            </div>

            <!-- Auto-detected repos from folders -->
            <div v-if="autoDetectedRepos.length > 0" class="adv-repos-detected">
              <div class="adv-repos-detected-label">从本地目录检测到</div>
              <div v-for="(repo, i) in autoDetectedRepos" :key="'auto-'+i" class="adv-repo-row adv-repo-auto">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                  <path d="M6 9v6M18 15v-3a3 3 0 0 0-3-3H9"/>
                </svg>
                <span class="adv-repo-url">{{ repo.url }}</span>
                <span class="adv-repo-branch">{{ repo.branch }}</span>
                <span class="adv-repo-auto-tag">自动</span>
              </div>
            </div>

            <!-- Manually added repos -->
            <div v-if="manualRepos.length > 0" class="adv-manual-repos">
              <div v-for="(repo, i) in manualRepos" :key="'manual-'+i" class="adv-repo-row">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="color:#6b7280;flex-shrink:0">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                  <path d="M6 9v6M18 15v-3a3 3 0 0 0-3-3H9"/>
                </svg>
                <span class="adv-repo-url">{{ repo.url }}</span>
                <button class="adv-folder-remove" @click="removeRepo(i)">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Add repo input -->
            <div v-if="addingRepo" class="adv-repo-input-row">
              <input
                ref="repoInputRef"
                class="sheet-input adv-repo-input"
                type="text"
                placeholder="https://github.com/yourname/repo"
                v-model="repoInputVal"
                @keydown.enter="confirmAddRepo"
                @keydown.esc="addingRepo = false"
              >
              <button class="adv-repo-confirm" @click="confirmAddRepo">添加</button>
              <button class="adv-repo-cancel" @click="addingRepo = false">取消</button>
            </div>

            <button class="adv-add-btn" @click="startAddRepo" v-if="!addingRepo">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              手动添加仓库
            </button>
          </div>

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
const advanced = ref(false)
const folderPaths = ref([])
const cloudWorkspace = ref('auto')
const manualRepos = ref([])
const addingRepo = ref(false)
const repoInputVal = ref('')
const repoInputRef = ref(null)

import { computed, nextTick } from 'vue'

// Auto-detect git repos from added folders (mock)
const autoDetectedRepos = computed(() => {
  return folderPaths.value
    .filter(fp => fp.gitDetected)
    .map(fp => ({ url: fp.remoteUrl, branch: fp.branch }))
})

const templates = [
  {
    id: 'blank',
    name: '空白项目',
    desc: '从零开始',
    bg: '#f3f4f6',
    color: '#6b7280',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>`,
  },
  {
    id: 'chat',
    name: '对话助手',
    desc: 'AI 对话项目',
    bg: '#dbeafe',
    color: '#3b82f6',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
  {
    id: 'research',
    name: '调研分析',
    desc: '信息收集与整理',
    bg: '#fef3c7',
    color: '#d97706',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  },
  {
    id: 'code',
    name: '代码开发',
    desc: '工程项目研发',
    bg: '#dcfce7',
    color: '#16a34a',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  },
  {
    id: 'design',
    name: '设计创意',
    desc: '图文与视觉产出',
    bg: '#fce7f3',
    color: '#db2777',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  },
  {
    id: 'data',
    name: '数据分析',
    desc: '数据处理与可视化',
    bg: '#ede9fe',
    color: '#7c3aed',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  },
]

const cloudOptions = [
  {
    value: 'auto',
    name: '自动创建云端空间',
    sub: '为此项目新建专属云端 Workspace',
    bg: '#eff6ff',
    color: '#3b82f6',
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  },
  {
    value: 'personal',
    name: '个人空间',
    sub: '使用已有的个人 Workspace',
    bg: '#f3e8ff',
    color: '#7c3aed',
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  },
  {
    value: 'team',
    name: '团队共享空间',
    sub: '多人协作，共享 Session 记录',
    bg: '#fef3c7',
    color: '#d97706',
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    value: 'none',
    name: '不绑定云端',
    sub: '仅本地，无多端同步',
    bg: '#f3f4f6',
    color: '#9ca3af',
    icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
  },
]

const mockFolders = [
  { path: '/Users/wangyihan/Documents/dz-s-agent-hiro', gitDetected: true, branch: 'main', remoteUrl: 'git@github.com:dingzu/my-code-flicker.git' },
  { path: '/Users/wangyihan/Projects/myflicker', gitDetected: true, branch: 'dev', remoteUrl: 'https://github.com/dingzu/myflicker.git' },
  { path: '/Users/wangyihan/Documents/design-assets', gitDetected: false, branch: '', remoteUrl: '' },
]

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

function startAddRepo() {
  addingRepo.value = true
  nextTick(() => repoInputRef.value?.focus())
}

function confirmAddRepo() {
  const url = repoInputVal.value.trim()
  if (url) manualRepos.value.push({ url })
  repoInputVal.value = ''
  addingRepo.value = false
}

function removeRepo(i) {
  manualRepos.value.splice(i, 1)
}

function create() {
  const name = projectName.value.trim() || '新项目'
  sidebarStore.createProject(name, cloudWorkspace.value !== 'none' ? 'cloud' : 'local')
  projectName.value = ''
  selectedTemplate.value = 'blank'
  advanced.value = false
  folderPaths.value = []
  cloudWorkspace.value = 'auto'
  manualRepos.value = []
  addingRepo.value = false
  sheetVisible.value = false
}
</script>

<style>
.sheet-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9000;
}
.sheet {
  background: #fff; width: 100%; max-width: 480px;
  border-radius: 14px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06);
  animation: sheetIn 0.24s cubic-bezier(0.25,1,0.5,1) both;
  max-height: 88vh; overflow-y: auto;
}
@keyframes sheetIn {
  from { transform: translateY(12px) scale(0.98); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}
.sheet-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px 0;
  position: sticky; top: 0; background: #fff; z-index: 1;
}
.sheet-title { font-size: 16px; font-weight: 600; color: #111827; letter-spacing: -0.02em; }
.sheet-close {
  width: 28px; height: 28px; border-radius: 50%;
  background: #f3f4f6; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #6b7280; transition: background 0.1s;
}
.sheet-close:hover { background: #e5e7eb; }
.sheet-body { padding: 18px 20px; display: flex; flex-direction: column; gap: 16px; }
.sheet-field { display: flex; flex-direction: column; gap: 7px; }
.sheet-label {
  font-size: 12px; font-weight: 500; color: #4b5563;
  display: flex; align-items: center; gap: 6px;
}
.sheet-label-badge {
  font-size: 10px; font-weight: 600; color: #3b82f6;
  background: #eff6ff; border-radius: 4px;
  padding: 1px 6px; letter-spacing: 0.02em;
}
.sheet-field-hint {
  font-size: 12px; color: #9ca3af; margin: 0;
  line-height: 1.5;
}
.sheet-input {
  height: 40px; border: 1.5px solid rgba(0,0,0,0.1); border-radius: 9px;
  padding: 0 12px; font-size: 13.5px; font-family: inherit; color: #111827;
  outline: none; background: #fafafa; transition: border-color 0.15s;
}
.sheet-input:focus { border-color: #374151; background: #fff; }

/* Template grid */
.template-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
}
.tpl-card {
  cursor: pointer; border-radius: 10px;
  border: 1.5px solid rgba(0,0,0,0.08);
  padding: 10px 10px 9px;
  background: #fafafa;
  transition: border-color 0.12s, background 0.12s;
  display: flex; flex-direction: column; gap: 5px;
}
.tpl-card input { display: none; }
.tpl-card:hover { border-color: rgba(0,0,0,0.18); background: #f9fafb; }
.tpl-card-selected { border-color: #374151 !important; background: #f9fafb !important; }
.tpl-icon {
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.tpl-name { font-size: 12.5px; font-weight: 500; color: #111827; line-height: 1; }
.tpl-desc { font-size: 11px; color: #9ca3af; line-height: 1.3; }

/* Cloud options */
.cloud-options {
  display: flex; flex-direction: column; gap: 6px;
}
.cloud-opt {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1.5px solid rgba(0,0,0,0.08);
  background: #fafafa;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s;
  position: relative;
}
.cloud-opt input { display: none; }
.cloud-opt:hover { border-color: rgba(0,0,0,0.16); background: #f9fafb; }
.cloud-opt-selected { border-color: #374151 !important; background: #fafafa; }
.cloud-opt-icon {
  width: 28px; height: 28px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.cloud-opt-body { flex: 1; min-width: 0; }
.cloud-opt-name { font-size: 13px; font-weight: 500; color: #111827; }
.cloud-opt-sub  { font-size: 11.5px; color: #9ca3af; margin-top: 1px; }
.cloud-opt-badge {
  font-size: 10px; font-weight: 600; color: #3b82f6;
  background: #eff6ff; border-radius: 4px;
  padding: 2px 7px; flex-shrink: 0;
}

/* Advanced toggle */
.advanced-toggle {
  display: flex; align-items: center; gap: 5px;
  background: none; border: none; cursor: pointer;
  font-size: 12.5px; font-weight: 500; color: #6b7280;
  padding: 0; font-family: inherit;
  transition: color 0.1s; align-self: flex-start;
}
.advanced-toggle:hover { color: #374151; }
.advanced-arrow {
  transition: transform 0.2s cubic-bezier(0.25,1,0.5,1);
}
.advanced-arrow-open { transform: rotate(90deg); }

/* Advanced section */
.advanced-section {
  display: flex; flex-direction: column; gap: 14px;
  border: 1.5px solid rgba(0,0,0,0.07);
  border-radius: 10px; padding: 14px;
  background: #fafafa;
  animation: advIn 0.18s ease both;
}
@keyframes advIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.adv-item { display: flex; flex-direction: column; gap: 7px; }
.adv-item-header {
  display: flex; align-items: center; gap: 8px;
}
.adv-icon {
  width: 24px; height: 24px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.adv-item-label { font-size: 12.5px; font-weight: 500; color: #374151; }
.adv-item-sub { font-size: 11.5px; color: #9ca3af; margin-left: 2px; }
.sheet-path-picker {
  height: 40px; border: 1.5px solid rgba(0,0,0,0.1); border-radius: 9px;
  padding: 0 10px 0 12px; display: flex; align-items: center; gap: 8px;
  cursor: pointer; background: #fff; transition: border-color 0.15s;
  font-size: 13px; color: #111827;
}
.sheet-path-picker:hover { border-color: rgba(0,0,0,0.2); }
.sheet-path-placeholder { color: #9ca3af; }
.sheet-path-btn { font-size: 11.5px; font-weight: 500; color: #3b82f6; padding: 3px 8px; border-radius: 5px; background: #eff6ff; margin-left: auto; }
.git-status-row {
  display: flex; align-items: center; gap: 7px;
  font-size: 12px; color: #9ca3af; padding: 0 2px;
}
/* Multi-folder list */
.adv-folder-list {
  display: flex; flex-direction: column; gap: 4px;
  margin-bottom: 4px;
}
.adv-folder-row {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.07);
  background: #fff;
  font-size: 12.5px;
}
.adv-folder-path {
  flex: 1; min-width: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: #374151;
}
.adv-folder-git-tag {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; color: #16a34a; background: #dcfce7;
  padding: 2px 7px; border-radius: 4px; flex-shrink: 0;
}
.adv-folder-remove {
  width: 20px; height: 20px; border-radius: 5px;
  background: transparent; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #d1d5db; flex-shrink: 0; transition: color 0.1s, background 0.1s;
}
.adv-folder-remove:hover { color: #6b7280; background: #f3f4f6; }

/* Add button */
.adv-add-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 10px;
  border-radius: 7px;
  border: 1.5px dashed rgba(0,0,0,0.12);
  background: transparent;
  font-size: 12.5px; font-weight: 500; color: #6b7280;
  cursor: pointer; font-family: inherit;
  transition: border-color 0.1s, color 0.1s, background 0.1s;
  align-self: flex-start;
}
.adv-add-btn:hover { border-color: rgba(0,0,0,0.22); color: #374151; background: #f9fafb; }

/* Detected repos */
.adv-repos-detected {
  display: flex; flex-direction: column; gap: 4px;
  margin-bottom: 4px;
}
.adv-repos-detected-label {
  font-size: 11px; color: #9ca3af; padding: 0 2px;
}
.adv-repo-row {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.07);
  background: #fff;
  font-size: 12.5px;
}
.adv-repo-auto { border-color: rgba(22,163,74,0.18); background: #f0fdf4; }
.adv-repo-url {
  flex: 1; min-width: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: #374151;
}
.adv-repo-branch {
  font-size: 11px; color: #6b7280; background: #f3f4f6;
  padding: 2px 6px; border-radius: 4px; flex-shrink: 0;
}
.adv-repo-auto-tag {
  font-size: 10px; color: #15803d; background: #dcfce7;
  padding: 2px 6px; border-radius: 4px; flex-shrink: 0; font-weight: 600;
}
.adv-manual-repos { display: flex; flex-direction: column; gap: 4px; margin-bottom: 4px; }

/* Repo input row */
.adv-repo-input-row {
  display: flex; align-items: center; gap: 6px;
  margin-bottom: 4px;
}
.adv-repo-input { flex: 1; height: 36px; }
.adv-repo-confirm {
  height: 36px; padding: 0 12px; border-radius: 8px;
  background: #111827; border: none; color: #fff;
  font-size: 12.5px; font-weight: 500; font-family: inherit;
  cursor: pointer; flex-shrink: 0; transition: background 0.1s;
}
.adv-repo-confirm:hover { background: #1f2937; }
.adv-repo-cancel {
  height: 36px; padding: 0 10px; border-radius: 8px;
  border: 1.5px solid rgba(0,0,0,0.1); background: #fff;
  font-size: 12.5px; color: #6b7280; font-family: inherit;
  cursor: pointer; flex-shrink: 0; transition: background 0.1s;
}
.adv-repo-cancel:hover { background: #f9fafb; }

.git-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.git-dot-pending { background: #d1d5db; }
.git-dot-found   { background: #22c55e; }
.sheet-footer {
  display: flex; gap: 8px; justify-content: flex-end;
  padding: 0 20px 20px;
  position: sticky; bottom: 0; background: #fff;
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
