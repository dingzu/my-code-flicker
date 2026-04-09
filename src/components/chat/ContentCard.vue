<template>
  <div class="content-card">
    <!-- Card header -->
    <div class="card-header">
      <div class="card-title-icon"></div>
      <span class="card-title">{{ sidebarStore.activeSessionName }}</span>

      <!-- Project context selector -->
      <div class="header-ctx-wrap" ref="ctxBarRef">
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
          placement="header"
        />
      </div>

      <div class="card-header-actions">
        <button class="header-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
          资产
        </button>
      </div>
    </div>

    <!-- Card body -->
    <div class="card-body" ref="bodyRef">
      <!-- Empty state -->
      <div v-if="currentMessages.length === 0" class="chat-empty-state">
        <div class="ces-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p class="ces-title">{{ sidebarStore.activeSessionName }}</p>
        <p class="ces-hint">在下方输入，开始这个对话</p>
      </div>

      <ChatMessages :messages="currentMessages" />
    </div>

    <!-- Input Area -->
    <ChatInput />
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick, inject, onMounted, onUnmounted } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'
import ChatMessages from './ChatMessages.vue'
import ChatInput from './ChatInput.vue'
import CtxMenu from './CtxMenu.vue'

const sidebarStore = useSidebarStore()
const sheetVisible = inject('sheetVisible', null)
const bodyRef = ref(null)
const ctxBarRef = ref(null)
const ctxOpen = ref(false)
const ctxId = ref('proj1')
const ctxLabel = ref('dz-s-agent-hiro')
const ctxType = ref('ws')

const currentMessages = computed(() => {
  const id = sidebarStore.activeSessionId
  return sidebarStore.messages[id] || []
})

// 消息更新后滚动到底部
watch(currentMessages, async () => {
  await nextTick()
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
}, { deep: true })

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
.content-card {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-radius: var(--card-radius);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.06);
}
.card-header {
  height: 48px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  display: flex; align-items: center;
  padding: 0 18px;
  gap: 10px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.6);
}
.card-title-icon {
  width: 16px; height: 16px;
  border: 1.5px solid rgba(0,0,0,0.22);
  border-radius: 50%;
  flex-shrink: 0;
}
.card-title {
  font-size: 14px; font-weight: 500;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.header-ctx-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.card-header-actions {
  margin-left: auto;
  display: flex; align-items: center; gap: 6px;
}
.header-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 10px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: rgba(0,0,0,0.03);
  font-size: 12.5px; font-weight: 400;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.1s;
}
.header-btn:hover { background: rgba(0,0,0,0.06); }
.card-body {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  padding: 0;
  display: flex; flex-direction: column;
}
.card-body::-webkit-scrollbar { width: 5px; }
.card-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
.chat-empty-state {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 8px;
  padding: 40px 20px;
  user-select: none; pointer-events: none;
}
.ces-icon { color: #d1d5db; }
.ces-title { font-size: 14px; font-weight: 500; color: #6b7280; }
.ces-hint  { font-size: 12.5px; color: #d1d5db; }
</style>
