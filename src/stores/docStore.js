import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDocStore = defineStore('doc', () => {
  const visible = ref(false)
  const maximized = ref(false)
  const activePage = ref('preface')

  const pages = [
    { id: 'preface', title: '产品文档概览' },
    { id: 'brief',   title: '产品思路 · 融合方案' },
    { id: 'arch',    title: '融合方案 · 技术文档' },
  ]

  function open() {
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  function toggle() {
    visible.value = !visible.value
  }

  function toggleMaximize() {
    maximized.value = !maximized.value
  }

  function switchPage(id) {
    activePage.value = id
  }

  return { visible, maximized, activePage, pages, open, close, toggle, toggleMaximize, switchPage }
})
