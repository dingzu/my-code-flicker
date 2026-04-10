<template>
  <div class="content-card-wrap">
    <!-- Main chat card -->
    <div class="content-card">
      <!-- Card header -->
      <div class="card-header">
        <div class="card-title-icon"></div>
        <span class="card-title">{{ sidebarStore.activeSessionName }}</span>

        <div class="card-header-actions">
          <button
            class="header-btn"
            :class="{ 'header-btn-active': assetsOpen }"
            @click="assetsOpen = !assetsOpen"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            资产
          </button>
        </div>
      </div>

      <!-- New chat view (no messages yet) -->
      <NewChatView v-if="isNewChat" />

      <!-- Chat body (has messages) -->
      <template v-else>
        <div class="card-body" ref="bodyRef">
          <ChatMessages :messages="currentMessages" />
        </div>
        <ChatInput />
      </template>
    </div>

    <!-- Asset Preview -->
    <AssetPreview v-if="previewAsset" :asset="previewAsset" @close="previewAsset = null" />

    <!-- Assets Panel -->
    <AssetsPanel v-if="assetsOpen" @close="assetsOpen = false" @select-asset="onSelectAsset" />
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'
import ChatMessages from './ChatMessages.vue'
import ChatInput from './ChatInput.vue'
import NewChatView from './NewChatView.vue'
import AssetsPanel from './AssetsPanel.vue'
import AssetPreview from './AssetPreview.vue'

const sidebarStore = useSidebarStore()
const bodyRef = ref(null)
const assetsOpen = ref(false)
const previewAsset = ref(null)

function onSelectAsset(asset) {
  previewAsset.value = asset
}

const currentMessages = computed(() => {
  const id = sidebarStore.activeSessionId
  return sidebarStore.messages[id] || []
})

const isNewChat = computed(() => currentMessages.value.length === 0)

// 消息更新后滚动到底部
watch(currentMessages, async () => {
  await nextTick()
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
}, { deep: true })
</script>

<style>
.content-card-wrap {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: var(--gap);
  overflow: hidden;
}

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
  min-width: 0;
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
.header-btn-active {
  background: rgba(0,0,0,0.07);
  color: rgba(20,20,30,0.82);
  border-color: rgba(0,0,0,0.14);
}
.card-body {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  padding: 0;
  display: flex; flex-direction: column;
}
.card-body::-webkit-scrollbar { width: 5px; }
.card-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
</style>
