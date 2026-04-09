<template>
  <div class="desktop">
    <MenuBar />
    <!-- Desktop icon -->
    <DesktopIcon @dblclick="docStore.open()" />
    <!-- Main app window -->
    <MainWindow />
    <!-- Doc floating window -->
    <DocWindow />
    <!-- New Project Sheet -->
    <NewProjectSheet />
    <!-- Dock -->
    <Dock />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import MenuBar from './components/MenuBar.vue'
import DesktopIcon from './components/DesktopIcon.vue'
import MainWindow from './components/window/MainWindow.vue'
import DocWindow from './components/doc/DocWindow.vue'
import NewProjectSheet from './components/sheet/NewProjectSheet.vue'
import Dock from './components/Dock.vue'
import { useDocStore } from './stores/docStore'

const docStore = useDocStore()

// 全局 provide sheetVisible，供 ProjectList、ChatInput 注入
const sheetVisible = ref(false)
provide('sheetVisible', sheetVisible)
</script>

<style>
.desktop {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1706370956847-3a03b8c8e08d?w=2560&q=85&fit=crop');
  background-size: cover;
  background-position: center;
  background-color: #a8b8c8;
}
</style>
