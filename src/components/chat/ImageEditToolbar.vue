<template>
  <div class="image-edit-toolbar">
    <button 
      v-for="tool in tools" 
      :key="tool.id"
      class="edit-tool-btn"
      :class="{ 'active': activeTool === tool.id }"
      :title="tool.label"
      @click="$emit('select-tool', tool.id)"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" v-html="tool.icon" />
      <span class="tool-label">{{ tool.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeTool: { type: String, default: null }
})

defineEmits(['select-tool'])

const tools = computed(() => [
  {
    id: 'image-to-image',
    label: '图生图',
    icon: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'
  },
  {
    id: 'inpaint',
    label: '局部重绘',
    icon: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>'
  },
  {
    id: 'outpaint',
    label: '图像扩展',
    icon: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>'
  },
  {
    id: 'remove-bg',
    label: '智能抠图',
    icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
  }
])
</script>

<style scoped>
.image-edit-toolbar {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.edit-tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  color: rgba(20, 20, 30, 0.75);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.edit-tool-btn:hover {
  background: rgba(248, 249, 251, 1);
  border-color: rgba(66, 133, 244, 0.3);
  color: rgba(20, 20, 30, 0.9);
}

.edit-tool-btn.active {
  background: rgba(66, 133, 244, 0.08);
  border-color: rgba(66, 133, 244, 0.6);
  color: #4285f4;
}

.edit-tool-btn svg {
  flex-shrink: 0;
}

.tool-label {
  white-space: nowrap;
}
</style>
