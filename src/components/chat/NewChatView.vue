<template>
  <div class="ncv-wrap">
    <!-- Greeting -->
    <div class="ncv-greeting">
      <p class="ncv-hello">你好，一寒</p>
      <p class="ncv-sub">今天想做什么？</p>
    </div>

    <!-- Centered input box -->
    <div class="ncv-input-card">
      <textarea
        ref="inputRef"
        class="ncv-textarea"
        v-model="inputText"
        placeholder="告诉 Myflicker 你想做什么…"
        rows="1"
        @keydown="handleKey"
        @input="autoResize"
      ></textarea>

      <!-- Bottom toolbar -->
      <div class="ncv-toolbar">
        <div class="ncv-toolbar-left">
          <!-- Project selector -->
          <div class="ncv-ctx-wrap" ref="ctxWrapRef">
            <button
              class="ncv-ctx-btn"
              :class="{
                'ncv-ctx-ws': ctxType === 'ws',
                'ncv-ctx-cloud': ctxType === 'cloud',
                'ncv-ctx-free': ctxType === 'cloud-free',
              }"
              @click.stop="ctxOpen = !ctxOpen"
            >
              <svg v-if="ctxType === 'ws'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <svg v-else-if="ctxType === 'cloud'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
              <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>{{ ctxLabel }}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <!-- Dropdown -->
            <div class="ncv-ctx-menu" v-show="ctxOpen" @click.stop>
              <div class="ncv-ctx-section">执行位置</div>

              <div
                v-for="proj in wsProjects"
                :key="proj.id"
                class="ncv-ctx-item"
                :class="{ 'ncv-ctx-selected': ctxId === proj.id }"
                @click="selectCtx(proj.id, proj.name, 'ws')"
              >
                <div class="ncv-ctx-item-left">
                  <div class="ncv-ctx-icon ncv-icon-ws">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="ncv-ctx-name">{{ proj.name }}</div>
                    <div class="ncv-ctx-sub">本地 · main</div>
                  </div>
                </div>
                <svg v-if="ctxId === proj.id" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>

              <div
                v-for="proj in cloudProjects"
                :key="proj.id"
                class="ncv-ctx-item"
                :class="{ 'ncv-ctx-selected': ctxId === proj.id }"
                @click="selectCtx(proj.id, proj.name, 'cloud')"
              >
                <div class="ncv-ctx-item-left">
                  <div class="ncv-ctx-icon ncv-icon-cloud">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="ncv-ctx-name">{{ proj.name }}</div>
                    <div class="ncv-ctx-sub">云端</div>
                  </div>
                </div>
                <svg v-if="ctxId === proj.id" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>

              <div
                class="ncv-ctx-item"
                :class="{ 'ncv-ctx-selected': ctxId === 'free' }"
                @click="selectCtx('free', '无项目', 'cloud-free')"
              >
                <div class="ncv-ctx-item-left">
                  <div class="ncv-ctx-icon ncv-icon-free">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="ncv-ctx-name">无项目</div>
                    <div class="ncv-ctx-sub">云端对话，不绑定项目</div>
                  </div>
                </div>
                <svg v-if="ctxId === 'free'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>

              <div class="ncv-ctx-divider"></div>
              <div class="ncv-ctx-item" @click="openNewProject">
                <div class="ncv-ctx-item-left">
                  <div class="ncv-ctx-icon ncv-icon-add">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </div>
                  <div class="ncv-ctx-name">新建项目…</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="ncv-toolbar-right">
          <span class="ncv-hint">⌘↵ 发送</span>
          <button class="ncv-send-btn" :class="{ active: inputText.trim() }" @click="send">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Suggestion chips -->
    <div class="ncv-suggestions">
      <button
        v-for="s in suggestions"
        :key="s"
        class="ncv-chip"
        @click="fillSuggestion(s)"
      >{{ s }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'

const sidebarStore = useSidebarStore()
const sheetVisible = inject('sheetVisible', null)

const inputRef = ref(null)
const ctxWrapRef = ref(null)
const inputText = ref('')
const ctxOpen = ref(false)
const ctxId = ref('proj1')
const ctxLabel = ref('dz-s-agent-hiro')
const ctxType = ref('ws')

const wsProjects = computed(() => sidebarStore.projects.filter(p => p.hasWorkspace))
const cloudProjects = computed(() => sidebarStore.projects.filter(p => !p.hasWorkspace))

const suggestions = ['帮我写一份需求文档', '分析这份数据', '代码 Review', '头脑风暴']

function selectCtx(id, label, type) {
  ctxId.value = id
  ctxLabel.value = label
  ctxType.value = type
  ctxOpen.value = false
}

function openNewProject() {
  ctxOpen.value = false
  if (sheetVisible) sheetVisible.value = true
}

function send() {
  const text = inputText.value.trim()
  if (!text) return
  sidebarStore.sendMessage(sidebarStore.activeSessionId, text)
  inputText.value = ''
  if (inputRef.value) inputRef.value.style.height = 'auto'
}

function handleKey(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    send()
  }
}

function autoResize(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 160) + 'px'
}

function fillSuggestion(s) {
  inputText.value = s
  inputRef.value?.focus()
}

function onDocClick(e) {
  if (ctxOpen.value && ctxWrapRef.value && !ctxWrapRef.value.contains(e.target)) {
    ctxOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<style>
.ncv-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 32px 40px 48px;
  overflow: hidden;
}

.ncv-greeting {
  text-align: center;
  margin-bottom: 4px;
}
.ncv-hello {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
}
.ncv-sub {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

.ncv-input-card {
  width: 100%;
  max-width: 580px;
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.1);
  border-radius: 14px;
  padding: 12px 12px 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.ncv-input-card:focus-within {
  border-color: rgba(0,0,0,0.18);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 0 0 3px rgba(0,0,0,0.04);
}

.ncv-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  color: #111827;
  line-height: 1.6;
  background: transparent;
  min-height: 24px;
  max-height: 160px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0;
  margin-bottom: 10px;
}
.ncv-textarea::placeholder { color: #d1d5db; }

.ncv-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ncv-toolbar-left { display: flex; align-items: center; gap: 6px; }
.ncv-toolbar-right { display: flex; align-items: center; gap: 8px; }

/* Context selector button */
.ncv-ctx-wrap { position: relative; }
.ncv-ctx-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 9px;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.1);
  background: #f9fafb;
  font-size: 12px; font-weight: 500;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s;
}
.ncv-ctx-btn:hover { background: #f3f4f6; }
.ncv-ctx-ws   { color: #15803d; border-color: rgba(21,128,61,0.2); background: #f0fdf4; }
.ncv-ctx-cloud { color: #1d4ed8; border-color: rgba(29,78,216,0.2); background: #eff6ff; }
.ncv-ctx-free  { color: #6b7280; }

/* Dropdown */
.ncv-ctx-menu {
  position: absolute;
  bottom: calc(100% + 6px); left: 0;
  background: #fff;
  border-radius: 11px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06);
  width: 280px;
  z-index: 700;
  overflow: hidden;
  padding: 6px;
}
.ncv-ctx-section {
  font-size: 10.5px; font-weight: 600; color: #9ca3af;
  text-transform: uppercase; letter-spacing: 0.06em;
  padding: 4px 10px 6px;
}
.ncv-ctx-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px; border-radius: 8px; cursor: pointer;
  transition: background 0.1s;
}
.ncv-ctx-item:hover { background: #f9fafb; }
.ncv-ctx-selected { background: #f0f9ff; }
.ncv-ctx-item-left { display: flex; align-items: flex-start; gap: 9px; }
.ncv-ctx-icon {
  width: 24px; height: 24px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
.ncv-icon-ws    { background: #dcfce7; color: #16a34a; }
.ncv-icon-cloud { background: #dbeafe; color: #3b82f6; }
.ncv-icon-free  { background: #f3f4f6; color: #6b7280; }
.ncv-icon-add   { background: #f3f4f6; color: #374151; }
.ncv-ctx-name { font-size: 13px; font-weight: 500; color: #111827; }
.ncv-ctx-sub  { font-size: 11px; color: #9ca3af; margin-top: 1px; line-height: 1.3; }
.ncv-ctx-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 4px 0; }

.ncv-hint { font-size: 11px; color: #d1d5db; }
.ncv-send-btn {
  width: 32px; height: 32px; border-radius: 8px;
  background: #e5e7eb; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #9ca3af; flex-shrink: 0;
  transition: background 0.12s, color 0.12s, transform 0.1s;
}
.ncv-send-btn.active { background: #1a1a1a; color: #fff; }
.ncv-send-btn.active:hover { background: #333; }
.ncv-send-btn:active { transform: scale(0.94); }

/* Suggestion chips */
.ncv-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  max-width: 580px;
}
.ncv-chip {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.7);
  font-size: 12.5px;
  color: #6b7280;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s, border-color 0.1s, color 0.1s;
}
.ncv-chip:hover {
  background: rgba(255,255,255,0.95);
  border-color: rgba(0,0,0,0.14);
  color: #374151;
}
</style>
