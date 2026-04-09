<template>
  <div
    v-if="appStore.mainWindowVisible"
    ref="winRef"
    class="window"
    :class="{ 'win-open': isAnimating, 'window-maximized': appStore.mainWindowMaximized }"
    :style="windowStyle"
    @mousedown="bringToFront"
  >
    <Sidebar />
    <div class="content-area">
      <ContentCard />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '../../stores/appStore'
import { useDraggable } from '../../composables/useDraggable'
import Sidebar from '../sidebar/Sidebar.vue'
import ContentCard from '../chat/ContentCard.vue'

const appStore = useAppStore()
const winRef = ref(null)
const handleRef = ref(null)
const isAnimating = ref(false)
const zIndex = ref(1500)

// 延迟获取拖拽手柄（sidebar titlebar）
onMounted(() => {
  handleRef.value = winRef.value?.querySelector('.sidebar-titlebar')
})

const { x, y, reset } = useDraggable(winRef, handleRef, {
  ignoreSelector: '.tl, .sidebar-title-btn',
  isMaximized: computed(() => ({ value: appStore.mainWindowMaximized })),
})

// 监听窗口显示，触发动画
watch(() => appStore.mainWindowVisible, (visible) => {
  if (visible) {
    reset()
    isAnimating.value = false
    requestAnimationFrame(() => {
      isAnimating.value = true
      setTimeout(() => { isAnimating.value = false }, 320)
    })
  }
})

const windowStyle = computed(() => {
  if (appStore.mainWindowMaximized) {
    return {
      width: '100vw',
      height: 'calc(100vh - 26px)',
      borderRadius: '0',
      top: '26px',
      left: '0',
      transform: 'none',
      zIndex: zIndex.value,
    }
  }
  return {
    transform: `translate(calc(-50% + ${x.value}px), calc(-50% + 13px + ${y.value}px))`,
    zIndex: zIndex.value,
  }
})

let topZ = 1500
function bringToFront() {
  topZ += 10
  if (topZ > 8900) topZ = 1500
  zIndex.value = topZ
}
</script>

<style>
.window {
  width: min(1120px, calc(100vw - 48px));
  height: min(760px, calc(100vh - 72px));
  display: flex;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.22),
    0 2px 6px rgba(0,0,0,0.14),
    0 16px 40px rgba(0,0,0,0.26),
    0 40px 80px rgba(0,0,0,0.2);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% + 13px));
  transition: opacity 0.22s, transform 0.22s cubic-bezier(0.25,1,0.5,1), box-shadow 0.2s;
  background:
    radial-gradient(ellipse 90% 50% at 50% 115%, rgba(160,210,255,0.28) 0%, rgba(190,200,255,0.12) 45%, transparent 70%),
    linear-gradient(180deg, #f0f2f5 0%, #edf0f4 40%, #eaecf2 100%);
  animation: windowIn 0.32s cubic-bezier(0.25,1,0.5,1) both;
}
.window.win-open {
  animation: windowIn 0.28s cubic-bezier(0.25,1,0.5,1) both;
}
.window.window-maximized {
  border-radius: 0 !important;
}

/* ── RIGHT CONTENT ── */
.content-area {
  flex: 1;
  background: var(--content-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: var(--gap);
  gap: var(--gap);
}
</style>
