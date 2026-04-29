<template>
  <div class="right-sidebar-container" :class="{ 'panel-open': activePanel }">
    <!-- 图标按钮栏 -->
    <div class="right-sidebar">
      <!-- 资产图标按钮 -->
      <button
        class="sidebar-icon-btn"
        :class="{ active: activePanel === 'assets' }"
        @click="togglePanel('assets')"
        title="资产"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
          <polyline points="13 2 13 9 20 9"/>
        </svg>
      </button>

      <!-- 应用图标按钮 -->
      <button
        class="sidebar-icon-btn"
        :class="{ active: activePanel === 'apps' }"
        @click="togglePanel('apps')"
        title="应用"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      </button>
    </div>

    <!-- 资产面板 - 嵌入式 -->
    <transition name="panel-slide">
      <AssetsPanel 
        v-if="activePanel === 'assets'" 
        class="right-assets-panel-embedded"
        @close="activePanel = null" 
        @select-asset="onSelectAsset" 
      />
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AssetsPanel from './AssetsPanel.vue'

const activePanel = ref(null)

const emit = defineEmits(['select-asset'])

function togglePanel(panel) {
  activePanel.value = activePanel.value === panel ? null : panel
}

function onSelectAsset(asset) {
  emit('select-asset', asset)
}
</script>

<style scoped>
.right-sidebar-container {
  position: absolute;
  right: 12px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 50;
  pointer-events: none;
}

.right-sidebar-container > * {
  pointer-events: auto;
}

.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  color: rgba(30, 30, 40, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s cubic-bezier(0.25, 0.1, 0.25, 1);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 0 0 0.5px rgba(0, 0, 0, 0.06);
}

.sidebar-icon-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  color: rgba(30, 30, 40, 0.75);
  box-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.12),
    0 0 0 0.5px rgba(0, 0, 0, 0.08);
  transform: scale(1.04);
}

.sidebar-icon-btn.active {
  background: rgba(60, 120, 220, 0.12);
  color: rgba(60, 120, 220, 1);
  box-shadow: 
    0 2px 6px rgba(60, 120, 220, 0.15),
    0 0 0 1px rgba(60, 120, 220, 0.2);
}

/* 嵌入式资产面板 */
.right-assets-panel-embedded {
  height: calc(100% - 24px);
  margin: 12px 0;
}

/* 面板滑入动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.panel-slide-enter-to,
.panel-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
