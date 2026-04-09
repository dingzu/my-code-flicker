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
          <!-- Local directory -->
          <div class="adv-item">
            <div class="adv-item-header">
              <div class="adv-icon" style="background:#dbeafe;color:#3b82f6">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span class="adv-item-label">本地目录</span>
              <span class="adv-item-sub">绑定本地文件夹</span>
            </div>
            <div class="sheet-path-picker" @click="pickFolder">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <span :class="{ 'sheet-path-placeholder': !folderPath }">
                {{ folderPath || '选择本地文件夹…' }}
              </span>
              <span class="sheet-path-btn">浏览</span>
            </div>
          </div>

          <!-- Cloud workspace -->
          <div class="adv-item">
            <div class="adv-item-header">
              <div class="adv-icon" style="background:#fef9c3;color:#ca8a04">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                </svg>
              </div>
              <span class="adv-item-label">云端 Workspace</span>
              <span class="adv-item-sub">连接 Myflicker 云端文件</span>
            </div>
            <div class="adv-select-row">
              <select class="sheet-select" v-model="cloudWorkspace">
                <option value="">不绑定云端 Workspace</option>
                <option value="personal">个人空间</option>
                <option value="team-a">团队空间 A</option>
                <option value="team-b">团队空间 B</option>
              </select>
            </div>
          </div>

          <!-- Git repo -->
          <div class="adv-item">
            <div class="adv-item-header">
              <div class="adv-icon" style="background:#dcfce7;color:#16a34a">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                  <path d="M6 9v6M18 15v-3a3 3 0 0 0-3-3H9"/>
                </svg>
              </div>
              <span class="adv-item-label">代码仓库</span>
              <span class="adv-item-sub">关联 Git 远程仓库</span>
            </div>
            <input
              class="sheet-input"
              type="text"
              placeholder="https://github.com/yourname/repo"
              v-model="repoUrl"
            >
            <div class="git-status-row" v-if="folderPath">
              <div class="git-dot git-dot-found"></div>
              <span style="color:#15803d">检测到 Git 仓库 · main · 最新</span>
            </div>
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
const folderPath = ref('')
const cloudWorkspace = ref('')
const repoUrl = ref('')

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

const mockPaths = [
  '/Users/wangyihan/Documents/dz-s-agent-hiro',
  '/Users/wangyihan/Projects/myflicker',
]

function pickFolder() {
  folderPath.value = mockPaths[Math.floor(Math.random() * mockPaths.length)]
  if (!projectName.value) {
    projectName.value = folderPath.value.split('/').pop()
  }
}

function create() {
  const name = projectName.value.trim() || '新项目'
  sidebarStore.createProject(name, 'cloud')
  projectName.value = ''
  selectedTemplate.value = 'blank'
  advanced.value = false
  folderPath.value = ''
  cloudWorkspace.value = ''
  repoUrl.value = ''
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
.sheet-label { font-size: 12px; font-weight: 500; color: #4b5563; }
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
.adv-select-row { }
.sheet-select {
  width: 100%; height: 40px;
  border: 1.5px solid rgba(0,0,0,0.1); border-radius: 9px;
  padding: 0 12px; font-size: 13px; font-family: inherit;
  color: #374151; background: #fff; outline: none;
  transition: border-color 0.15s; cursor: pointer;
  appearance: auto;
}
.sheet-select:focus { border-color: #374151; }
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
