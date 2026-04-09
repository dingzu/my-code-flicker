import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const mainWindowVisible = ref(true)
  const mainWindowMaximized = ref(false)

  function closeMainWindow() {
    mainWindowVisible.value = false
  }

  function openMainWindow() {
    mainWindowVisible.value = true
    mainWindowMaximized.value = false
  }

  function toggleMaximize() {
    mainWindowMaximized.value = !mainWindowMaximized.value
  }

  return {
    mainWindowVisible,
    mainWindowMaximized,
    closeMainWindow,
    openMainWindow,
    toggleMaximize,
  }
})
