<template>
  <div class="chat-input-area">
    <!-- Context bar -->
    <div class="context-bar" ref="ctxBarRef">
      <button
        class="ctx-pill"
        :class="{
          'ctx-pill-ws': ctxType === 'ws',
          'ctx-pill-cloud': ctxType === 'cloud',
          'ctx-pill-free': ctxType === 'cloud-free',
        }"
        @click.stop="ctxOpen = !ctxOpen"
      >
        <svg v-if="ctxType === 'ws'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
        <svg v-else-if="ctxType === 'cloud'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        </svg>
        <span>{{ ctxLabel }}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <CtxMenu
        :visible="ctxOpen"
        v-model="ctxId"
        @update:label="ctxLabel = $event"
        @update:type="ctxType = $event"
        @new-project="openNewProject"
        @close="ctxOpen = false"
      />

      <div class="ctx-spacer"></div>
      <span class="ctx-hint">⌘↵ 发送</span>
    </div>

    <!-- Text input -->
    <div class="chat-input-wrap">
      <textarea
        ref="inputRef"
        class="chat-input"
        v-model="inputText"
        placeholder="告诉 Myflicker 你想做什么…"
        rows="1"
        @keydown="handleKey"
        @input="autoResize"
      ></textarea>
      <button class="chat-send-btn" @click="send">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'
import CtxMenu from './CtxMenu.vue'

const sidebarStore = useSidebarStore()
const sheetVisible = inject('sheetVisible')

const inputText = ref('')
const inputRef = ref(null)
const ctxBarRef = ref(null)
const ctxOpen = ref(false)
const ctxId = ref('proj1')
const ctxLabel = ref('dz-s-agent-hiro')
const ctxType = ref('ws')

function send() {
  const text = inputText.value.trim()
  if (!text) return
  sidebarStore.sendMessage(sidebarStore.activeSessionId, text)
  inputText.value = ''
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }
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

function openNewProject() {
  ctxOpen.value = false
  if (sheetVisible) sheetVisible.value = true
}

// 点击外部关闭
function onDocClick(e) {
  if (ctxOpen.value && ctxBarRef.value && !ctxBarRef.value.contains(e.target)) {
    ctxOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<style>
.chat-input-area {
  border-top: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
  padding: 10px 14px 12px;
  flex-shrink: 0;
  position: relative;
}
.context-bar {
  display: flex; align-items: center; gap: 6px;
  margin-bottom: 8px;
  position: relative;
}
.ctx-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 9px;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.1);
  background: #f9fafb;
  font-size: 12px; font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.1s, border-color 0.1s;
  font-family: inherit;
}
.ctx-pill:hover { background: #f3f4f6; border-color: rgba(0,0,0,0.15); }
.ctx-pill-ws    { color: #15803d; border-color: rgba(21,128,61,0.2); background: #f0fdf4; }
.ctx-pill-cloud { color: #1d4ed8; border-color: rgba(29,78,216,0.2); background: #eff6ff; }
.ctx-pill-free  { color: #6b7280; }
.ctx-spacer { flex: 1; }
.ctx-hint { font-size: 11px; color: #d1d5db; }
.chat-input-wrap {
  display: flex; align-items: flex-end; gap: 8px;
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  padding: 8px 8px 8px 12px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.chat-input-wrap:focus-within {
  border-color: rgba(0,0,0,0.2);
  box-shadow: 0 0 0 3px rgba(0,0,0,0.04);
}
.chat-input {
  flex: 1; border: none; outline: none; resize: none;
  font-family: inherit; font-size: 13.5px; color: #111827;
  line-height: 1.5; background: transparent;
  min-height: 22px; max-height: 160px;
  overflow-y: auto;
}
.chat-input::placeholder { color: #d1d5db; }
.chat-send-btn {
  width: 32px; height: 32px; border-radius: 8px;
  background: #1a1a1a; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
  transition: background 0.12s, transform 0.1s;
}
.chat-send-btn:hover { background: #333; }
.chat-send-btn:active { transform: scale(0.94); }
</style>
