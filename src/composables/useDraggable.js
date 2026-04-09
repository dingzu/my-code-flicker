import { ref, onMounted, onUnmounted } from 'vue'

export function useDraggable(elementRef, handleRef, options = {}) {
  const x = ref(0)
  const y = ref(0)
  const isDragging = ref(false)

  let startX = 0
  let startY = 0
  let originX = 0
  let originY = 0

  function onMouseDown(e) {
    // 如果点击的是需要忽略的子元素，直接跳过
    if (options.ignoreSelector && e.target.closest(options.ignoreSelector)) return
    if (options.isMaximized?.value) return

    isDragging.value = true
    startX = e.clientX
    startY = e.clientY
    originX = x.value
    originY = y.value
    document.body.style.userSelect = 'none'
    e.preventDefault()
  }

  function onMouseMove(e) {
    if (!isDragging.value) return
    x.value = originX + (e.clientX - startX)
    y.value = originY + (e.clientY - startY)
  }

  function onMouseUp() {
    if (isDragging.value) {
      isDragging.value = false
      document.body.style.userSelect = ''
    }
  }

  onMounted(() => {
    const handle = handleRef.value
    if (handle) handle.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })

  onUnmounted(() => {
    const handle = handleRef.value
    if (handle) handle.removeEventListener('mousedown', onMouseDown)
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })

  function reset() {
    x.value = 0
    y.value = 0
  }

  return { x, y, isDragging, reset }
}
