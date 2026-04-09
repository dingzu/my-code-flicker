<template>
  <div
    v-if="docStore.visible"
    ref="docWinRef"
    class="doc-window"
    :class="{ maximized: docStore.maximized }"
    :style="winStyle"
    @mousedown="bringToFront"
  >
    <!-- Title bar -->
    <div ref="docHandleRef" class="doc-titlebar">
      <div class="doc-traffic">
        <div class="doc-tl doc-tl-red"   @click="docStore.close()"></div>
        <div class="doc-tl doc-tl-amber"></div>
        <div class="doc-tl doc-tl-green" @click="docStore.toggleMaximize()"></div>
      </div>
      <span class="doc-title">{{ currentPageTitle }}</span>
      <div style="width:56px"></div>
    </div>

    <!-- Layout -->
    <div class="doc-layout">
      <DocNav />
      <div class="doc-body">
        <DocPage :pageId="docStore.activePage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDocStore } from '../../stores/docStore'
import { useDraggable } from '../../composables/useDraggable'
import DocNav from './DocNav.vue'
import DocPage from './DocPage.vue'

const docStore = useDocStore()
const docWinRef = ref(null)
const docHandleRef = ref(null)
const zIndex = ref(8800)

const { x, y, reset } = useDraggable(docWinRef, docHandleRef, {
  ignoreSelector: '.doc-tl',
  isMaximized: computed(() => ({ value: docStore.maximized })),
})

watch(() => docStore.visible, (visible) => {
  if (visible) { reset(); bringToFront() }
})

let topZ = 8800
function bringToFront() {
  topZ += 10
  if (topZ >= 8900) topZ = 8800
  zIndex.value = topZ
}

const winStyle = computed(() => {
  if (docStore.maximized) {
    return { top: '26px', left: '0', width: '100vw', height: 'calc(100vh - 26px)', transform: 'none', zIndex: zIndex.value }
  }
  if (x.value === 0 && y.value === 0) {
    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1)', opacity: '1', zIndex: zIndex.value }
  }
  return { top: x.value + 'px' === '0px' ? '50%' : y.value + 'px', left: x.value + 'px', transform: 'none', zIndex: zIndex.value }
})

const currentPageTitle = computed(() => {
  const page = docStore.pages.find(p => p.id === docStore.activePage)
  return page ? page.title : ''
})
</script>

<style>
.doc-window {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(1);
  width: min(1060px, 94vw); height: min(760px, 90vh);
  background: #fafaf8;
  border-radius: 12px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.12), 0 20px 60px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.12);
  display: flex; flex-direction: column;
  opacity: 1;
  transition: opacity 0.2s, transform 0.2s;
}
.doc-window.maximized {
  top: 26px !important; left: 0 !important;
  width: 100vw !important; height: calc(100vh - 26px) !important;
  transform: none !important;
  border-radius: 0;
}
.doc-titlebar {
  height: 40px; background: #f0efed;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 14px; flex-shrink: 0; cursor: default;
}
.doc-window.maximized .doc-titlebar { border-radius: 0; }
.doc-traffic { display: flex; gap: 6px; }
.doc-tl {
  width: 12px; height: 12px; border-radius: 50%; cursor: pointer;
  transition: filter 0.1s;
}
.doc-tl:hover { filter: brightness(0.85); }
.doc-tl-red   { background: #ff5f57; }
.doc-tl-amber { background: #febc2e; }
.doc-tl-green { background: #28c840; }
.doc-title {
  font-size: 13px; font-weight: 500; color: #3c3c3c; letter-spacing: -0.01em;
}
.doc-layout {
  display: flex; flex: 1; overflow: hidden;
}
.doc-body {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  padding: 0 0 40px;
}
.doc-body::-webkit-scrollbar { width: 6px; }
.doc-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 3px; }
</style>
