<template>
  <nav class="doc-nav">
    <div class="doc-nav-section">文档</div>
    <div
      v-for="page in docStore.pages"
      :key="page.id"
      class="doc-nav-item"
      :class="{ active: docStore.activePage === page.id }"
      @click="docStore.switchPage(page.id)"
    >
      <span class="doc-nav-dot"></span>
      {{ page.title }}
    </div>
  </nav>
</template>

<script setup>
import { useDocStore } from '../../stores/docStore'
const docStore = useDocStore()
</script>

<style>
.doc-nav {
  width: 196px; flex-shrink: 0;
  background: #f0efed;
  border-right: 1px solid rgba(0,0,0,0.08);
  overflow-y: auto; overflow-x: hidden;
  padding: 12px 0;
}
.doc-nav::-webkit-scrollbar { width: 4px; }
.doc-nav::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
.doc-nav-section {
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: #9ca3af;
  padding: 6px 16px 4px;
  margin-top: 8px;
}
.doc-nav-section:first-child { margin-top: 0; }
.doc-nav-item {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 16px; font-size: 13px; color: #3c3c3c;
  cursor: pointer;
  transition: background 0.1s;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  line-height: 1.4;
}
.doc-nav-item:hover { background: rgba(0,0,0,0.05); }
.doc-nav-item.active { background: rgba(59,130,246,0.1); color: #1d4ed8; font-weight: 500; }
.doc-nav-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #d1d5db; flex-shrink: 0;
}
.doc-nav-item.active .doc-nav-dot { background: #3b82f6; }
</style>
