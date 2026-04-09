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
        <div class="sheet-field">
          <label class="sheet-label">项目名称</label>
          <input class="sheet-input" type="text" placeholder="例：我的新项目" v-model="projectName" autofocus>
        </div>

        <div class="sheet-field">
          <label class="sheet-label">执行位置</label>
          <div class="exec-options">
            <label class="exec-opt">
              <input type="radio" name="execMode" value="cloud" v-model="execMode">
              <div class="exec-opt-inner">
                <div class="exec-opt-icon exec-icon-cloud">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                  </svg>
                </div>
                <div>
                  <div class="exec-opt-name">云端</div>
                  <div class="exec-opt-sub">访问 Myflicker 云端文件</div>
                </div>
              </div>
            </label>
            <label class="exec-opt">
              <input type="radio" name="execMode" value="workspace" v-model="execMode">
              <div class="exec-opt-inner">
                <div class="exec-opt-icon exec-icon-ws">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <div>
                  <div class="exec-opt-name">本地工作区</div>
                  <div class="exec-opt-sub">绑定本地文件夹与 Git</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Workspace config -->
        <div class="ws-config" v-if="execMode === 'workspace'">
          <div class="sheet-field">
            <label class="sheet-label">本地文件夹</label>
            <div class="sheet-path-picker" @click="pickFolder">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <span :class="{ 'sheet-path-placeholder': !folderPath }">
                {{ folderPath || '选择文件夹…' }}
              </span>
              <span class="sheet-path-btn">浏览</span>
            </div>
          </div>
          <div class="sheet-field">
            <label class="sheet-label">Git 仓库</label>
            <div class="sheet-git-status">
              <div class="git-dot" :class="folderPath ? 'git-dot-found' : 'git-dot-pending'"></div>
              <span :style="folderPath ? 'color:#15803d' : ''">
                {{ folderPath ? '检测到 Git 仓库 · main · 最新' : '选择文件夹后自动检测' }}
              </span>
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
const execMode = ref('cloud')
const folderPath = ref('')

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
  sidebarStore.createProject(name, execMode.value)
  // reset
  projectName.value = ''
  execMode.value = 'cloud'
  folderPath.value = ''
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
  background: #fff; width: 100%; max-width: 460px;
  border-radius: 14px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06);
  animation: sheetIn 0.24s cubic-bezier(0.25,1,0.5,1) both;
}
@keyframes sheetIn {
  from { transform: translateY(12px) scale(0.98); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}
.sheet-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px 0;
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
.exec-options { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.exec-opt { cursor: pointer; }
.exec-opt input { display: none; }
.exec-opt-inner {
  display: flex; gap: 10px; align-items: flex-start;
  padding: 12px; border: 1.5px solid rgba(0,0,0,0.09);
  border-radius: 10px; background: #fafafa;
  transition: border-color 0.12s, background 0.12s;
}
.exec-opt input:checked + .exec-opt-inner { border-color: #374151; background: #f9fafb; }
.exec-opt-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.exec-icon-cloud { background: #dbeafe; color: #3b82f6; }
.exec-icon-ws    { background: #dcfce7; color: #16a34a; }
.exec-opt-name { font-size: 13px; font-weight: 500; color: #111827; }
.exec-opt-sub  { font-size: 11.5px; color: #9ca3af; margin-top: 2px; line-height: 1.3; }
.ws-config { display: flex; flex-direction: column; gap: 14px; padding-top: 2px; }
.sheet-path-picker {
  height: 40px; border: 1.5px solid rgba(0,0,0,0.1); border-radius: 9px;
  padding: 0 10px 0 12px; display: flex; align-items: center; gap: 8px;
  cursor: pointer; background: #fafafa; transition: border-color 0.15s;
  font-size: 13px; color: #111827;
}
.sheet-path-picker:hover { border-color: rgba(0,0,0,0.2); }
.sheet-path-placeholder { color: #9ca3af; }
.sheet-path-btn { font-size: 11.5px; font-weight: 500; color: #3b82f6; padding: 3px 8px; border-radius: 5px; background: #eff6ff; margin-left: auto; }
.sheet-git-status {
  height: 36px; display: flex; align-items: center; gap: 8px; padding: 0 12px;
  border-radius: 9px; border: 1.5px solid rgba(0,0,0,0.07); background: #fafafa;
  font-size: 12.5px; color: #9ca3af;
}
.git-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.git-dot-pending { background: #d1d5db; }
.git-dot-found   { background: #22c55e; }
.sheet-footer {
  display: flex; gap: 8px; justify-content: flex-end;
  padding: 0 20px 20px;
}
.sheet-cancel {
  height: 38px; padding: 0 16px; border-radius: 9px;
  border: 1.5px solid rgba(0,0,0,0.1); background: #fff;
  font-size: 13.5px; font-weight: 500; color: #374151;
  cursor: pointer; font-family: inherit;
  transition: background 0.1s;
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
