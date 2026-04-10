<template>
  <div
    class="sheet-overlay"
    v-if="sheetVisible"
    @click.self="sheetVisible = false"
  >
    <div class="sheet-wrapper" :class="{ 'sheet-wrapper-expanded': advanced }">
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
            高级设置
          </button>
        </div>

        <div class="sheet-footer">
          <button class="sheet-cancel" @click="sheetVisible = false">取消</button>
          <button class="sheet-cta" @click="create">创建项目</button>
        </div>
      </div>

      <!-- Advanced side panel -->
      <div class="adv-panel" v-if="advanced">
        <div class="adv-panel-header">
          <span class="adv-panel-title">高级设置</span>
        </div>
        <div class="adv-panel-body">

          <!-- Personal / Team toggle -->
          <div class="adv-section-block">
            <div class="adv-section-label">项目归属</div>
            <div class="adv-ownership-tabs">
              <button
                class="adv-ownership-tab"
                :class="{ active: ownerType === 'personal' }"
                @click="ownerType = 'personal'"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                个人
              </button>
              <button
                class="adv-ownership-tab"
                :class="{ active: ownerType === 'team' }"
                @click="ownerType = 'team'"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="9" cy="7" r="3"/>
                  <circle cx="16" cy="7" r="3"/>
                  <path d="M1 20c0-3.3 3.1-6 7-6 1 0 2 .2 2.8.6"/>
                  <path d="M23 20c0-3.3-3.1-6-7-6s-7 2.7-7 6"/>
                </svg>
                团队
              </button>
            </div>

            <!-- Team options -->
            <div v-if="ownerType === 'team'" class="adv-team-section">
              <div class="adv-team-tabs">
                <button
                  class="adv-team-tab"
                  :class="{ active: teamMode === 'existing' }"
                  @click="teamMode = 'existing'"
                >关联已有团队</button>
                <button
                  class="adv-team-tab"
                  :class="{ active: teamMode === 'new' }"
                  @click="teamMode = 'new'"
                >新建团队</button>
              </div>

              <div v-if="teamMode === 'existing'" class="adv-team-list">
                <div
                  v-for="team in mockTeams"
                  :key="team.id"
                  class="adv-team-item"
                  :class="{ active: selectedTeam === team.id }"
                  @click="selectedTeam = team.id"
                >
                  <div class="adv-team-avatar" :style="{ background: team.color }">{{ team.name[0] }}</div>
                  <div class="adv-team-info">
                    <div class="adv-team-name">{{ team.name }}</div>
                    <div class="adv-team-meta">{{ team.members }} 人</div>
                  </div>
                  <svg v-if="selectedTeam === team.id" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2.5" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>

              <div v-if="teamMode === 'new'" class="adv-new-team-form">
                <input class="adv-input" type="text" placeholder="团队名称…" v-model="newTeamName">
                <div class="adv-new-team-hint">创建后可以在设置中邀请成员</div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="adv-divider"></div>

          <!-- Local directories -->
          <div class="adv-section-block">
            <div class="adv-section-label">本地目录</div>
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
                <div class="adv-detected-label">检测到 Git 仓库</div>
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

          <!-- Divider -->
          <div class="adv-divider"></div>

          <!-- Cloud Git repos -->
          <div class="adv-section-block">
            <div class="adv-section-label">云端 Git 仓库</div>
            <div v-if="cloudRepos.length > 0" class="adv-folder-list">
              <div v-for="(repo, i) in cloudRepos" :key="i" class="adv-folder-row">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" class="adv-folder-row-icon">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                  <path d="M6 9v6M18 15v-3a3 3 0 0 0-3-3H9"/>
                </svg>
                <span class="adv-folder-path">{{ repo.url }}</span>
                <span class="adv-git-tag">{{ repo.branch }}</span>
                <button class="adv-remove-btn" @click="removeCloudRepo(i)">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="addingCloudRepo" class="adv-cloud-form">
              <input class="adv-input" type="text" placeholder="https://github.com/user/repo.git" v-model="cloudRepoUrl" @keydown.enter="confirmCloudRepo" autofocus>
              <div class="adv-cloud-form-actions">
                <button class="adv-form-btn adv-form-btn-cancel" @click="addingCloudRepo = false; cloudRepoUrl = ''">取消</button>
                <button class="adv-form-btn adv-form-btn-confirm" @click="confirmCloudRepo">添加</button>
              </div>
            </div>

            <button v-if="!addingCloudRepo" class="adv-add-btn" @click="addingCloudRepo = true">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              添加云端仓库
            </button>
          </div>

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
const advanced = ref(false)
const folderPaths = ref([])
const ownerType = ref('personal')
const teamMode = ref('existing')
const selectedTeam = ref(null)
const newTeamName = ref('')
const cloudRepos = ref([])
const addingCloudRepo = ref(false)
const cloudRepoUrl = ref('')

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

const mockTeams = [
  { id: 't1', name: 'Design', color: '#f59e0b', members: 8 },
  { id: 't2', name: 'Engineering', color: '#3b82f6', members: 24 },
  { id: 't3', name: 'Product', color: '#10b981', members: 6 },
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
      sourceDir: fp.path.split('/').pop(),
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

function confirmCloudRepo() {
  const url = cloudRepoUrl.value.trim()
  if (!url) return
  cloudRepos.value.push({ url, branch: 'main' })
  cloudRepoUrl.value = ''
  addingCloudRepo.value = false
}

function removeCloudRepo(i) {
  cloudRepos.value.splice(i, 1)
}

function create() {
  const name = projectName.value.trim() || '新项目'
  sidebarStore.createProject(name, 'cloud')
  projectName.value = ''
  selectedTemplate.value = 'blank'
  advanced.value = false
  folderPaths.value = []
  ownerType.value = 'personal'
  teamMode.value = 'existing'
  selectedTeam.value = null
  newTeamName.value = ''
  cloudRepos.value = []
  addingCloudRepo.value = false
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

/* ── Advanced side panel ── */
.adv-panel {
  width: 280px;
  flex-shrink: 0;
  background: #f9fafb;
  border-left: 1px solid rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  animation: advPanelIn 0.2s cubic-bezier(0.25,1,0.5,1) both;
}
@keyframes advPanelIn {
  from { opacity: 0; transform: translateX(12px); }
  to   { opacity: 1; transform: translateX(0); }
}
.adv-panel-header {
  padding: 20px 16px 12px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.adv-panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  letter-spacing: -0.01em;
}
.adv-panel-body {
  flex: 1;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
}

.adv-section-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
}
.adv-divider {
  height: 1px;
  background: rgba(0,0,0,0.06);
  margin: 0;
}
.adv-section-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Ownership tabs */
.adv-ownership-tabs {
  display: flex;
  gap: 6px;
}
.adv-ownership-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1.5px solid rgba(0,0,0,0.09);
  background: #fff;
  font-size: 12.5px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.12s;
}
.adv-ownership-tab:hover {
  border-color: rgba(0,0,0,0.16);
  color: #374151;
}
.adv-ownership-tab.active {
  border-color: #111827;
  background: #111827;
  color: #fff;
}

/* Team section */
.adv-team-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.adv-team-tabs {
  display: flex;
  background: rgba(0,0,0,0.05);
  border-radius: 7px;
  padding: 3px;
  gap: 2px;
}
.adv-team-tab {
  flex: 1;
  padding: 5px 8px;
  border-radius: 5px;
  border: none;
  background: transparent;
  font-size: 11.5px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.12s;
}
.adv-team-tab.active {
  background: #fff;
  color: #111827;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.adv-team-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.adv-team-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 9px;
  border-radius: 8px;
  border: 1.5px solid transparent;
  background: #fff;
  cursor: pointer;
  transition: all 0.12s;
}
.adv-team-item:hover {
  border-color: rgba(0,0,0,0.1);
}
.adv-team-item.active {
  border-color: #374151;
  background: #fff;
}
.adv-team-avatar {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.adv-team-info {
  flex: 1;
  min-width: 0;
}
.adv-team-name {
  font-size: 12.5px;
  font-weight: 500;
  color: #111827;
}
.adv-team-meta {
  font-size: 11px;
  color: #9ca3af;
}
.adv-new-team-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.adv-new-team-hint {
  font-size: 11px;
  color: #9ca3af;
  padding: 0 2px;
}

/* Common inputs */
.adv-input {
  height: 34px;
  border: 1.5px solid rgba(0,0,0,0.1);
  border-radius: 7px;
  padding: 0 10px;
  font-size: 12.5px;
  font-family: inherit;
  color: #111827;
  outline: none;
  background: #fff;
  transition: border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
}
.adv-input:focus { border-color: #374151; }

/* Folder list */
.adv-folder-list {
  display: flex; flex-direction: column; gap: 4px;
}
.adv-folder-row {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 9px;
  border-radius: 7px;
  border: 1px solid rgba(0,0,0,0.07);
  background: #fff;
  font-size: 12px;
}
.adv-folder-row-icon { color: #9ca3af; flex-shrink: 0; }
.adv-folder-path {
  flex: 1; min-width: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: #374151;
}
.adv-git-tag {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10.5px; color: #16a34a; background: #dcfce7;
  padding: 2px 5px; border-radius: 4px; flex-shrink: 0;
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
  padding: 7px 9px;
  border-radius: 7px;
  border: 1px solid rgba(22,163,74,0.2);
  background: #f0fdf4;
  font-size: 11.5px;
}
.adv-repo-info {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; gap: 2px;
}
.adv-repo-url {
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: #374151; font-size: 11.5px;
}
.adv-repo-source { font-size: 10.5px; color: #9ca3af; }
.adv-repo-branch-tag {
  font-size: 10.5px; color: #15803d; background: #dcfce7;
  padding: 2px 5px; border-radius: 4px; flex-shrink: 0; font-weight: 500;
}

/* Cloud repo form */
.adv-cloud-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.adv-cloud-form-actions {
  display: flex;
  gap: 5px;
  justify-content: flex-end;
}
.adv-form-btn {
  height: 28px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  border: none;
  transition: all 0.1s;
}
.adv-form-btn-cancel {
  background: rgba(0,0,0,0.05);
  color: #6b7280;
}
.adv-form-btn-cancel:hover { background: rgba(0,0,0,0.09); }
.adv-form-btn-confirm {
  background: #111827;
  color: #fff;
}
.adv-form-btn-confirm:hover { background: #1f2937; }

/* Add button */
.adv-add-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 9px;
  border-radius: 6px;
  border: 1.5px dashed rgba(0,0,0,0.12);
  background: transparent;
  font-size: 11.5px; font-weight: 500; color: #6b7280;
  cursor: pointer; font-family: inherit;
  transition: border-color 0.1s, color 0.1s, background 0.1s;
  align-self: flex-start;
}
.adv-add-btn:hover { border-color: rgba(0,0,0,0.22); color: #374151; background: #fff; }
</style>
