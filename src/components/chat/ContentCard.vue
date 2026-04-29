<template>
  <div class="content-card-wrap">
    <!-- 技能市场页面 -->
    <template v-if="sidebarStore.activeNav === 'skill-market'">
      <div class="skill-management-card">
        <div class="card-header">
          <div class="card-title-icon"></div>
          <span class="card-title">技能市场</span>
        </div>
        <div class="card-body">
          <SkillMarketPage />
        </div>
      </div>
    </template>

    <!-- 技能管理页面 -->
    <template v-else-if="sidebarStore.activeNav === 'skills'">
      <div class="skill-management-card">
        <div class="card-header">
          <div class="card-title-icon"></div>
          <span class="card-title">技能管理</span>
        </div>
        <div class="card-body">
          <SkillManagementPage />
        </div>
      </div>
    </template>

    <!-- 团队管理页面 -->
    <template v-else-if="sidebarStore.activeNav === 'team-management'">
      <div class="skill-management-card">
        <div class="card-header">
          <div class="card-title-icon"></div>
          <span class="card-title">团队管理</span>
        </div>
        <div class="card-body">
          <TeamManagementPage />
        </div>
      </div>
    </template>

    <!-- 数字员工管理页面 -->
    <template v-else-if="sidebarStore.activeNav === 'digital-employees'">
      <div class="skill-management-card">
        <div class="card-header">
          <div class="card-title-icon"></div>
          <span class="card-title">数字员工</span>
        </div>
        <div class="card-body">
          <DigitalEmployeeManagementPage />
        </div>
      </div>
    </template>

    <!-- 任务管理页面 -->
    <template v-else-if="sidebarStore.activeNav === 'schedule'">
      <div class="skill-management-card">
        <div class="card-header">
          <div class="card-title-icon"></div>
          <span class="card-title">任务管理</span>
        </div>
        <div class="card-body">
          <TaskManagementPage />
        </div>
      </div>
    </template>

    <!-- 普通对话页面 -->
    <template v-else>
      <div class="content-card">
        <!-- Card header -->
        <div class="card-header">
          <div class="card-title-icon"></div>
          <span class="card-title">{{ sidebarStore.activeSessionName }}</span>
        </div>

        <!-- New chat view (no messages yet) -->
        <NewChatView v-if="isNewChat" />

        <!-- Chat body (has messages) -->
        <template v-else>
          <div class="card-body" ref="bodyRef" v-show="!previewExpanded">
            <ChatMessages :messages="currentMessages" />
          </div>
          <ChatInput v-show="!previewExpanded" />
        </template>
      </div>

      <!-- Asset Preview -->
      <AssetPreview 
        v-if="previewAsset" 
        :asset="previewAsset" 
        :expanded="previewExpanded"
        :class="{ 'preview-expanded': previewExpanded }"
        @close="previewAsset = null; previewExpanded = false" 
        @toggle-expand="togglePreviewExpand" 
      />
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'
import { useAppStore } from '../../stores/appStore'
import ChatMessages from './ChatMessages.vue'
import ChatInput from './ChatInput.vue'
import NewChatView from './NewChatView.vue'
import AssetPreview from './AssetPreview.vue'
import SkillManagementPage from '../skill/SkillManagementPage.vue'
import SkillMarketPage from '../skill/SkillMarketPage.vue'
import TeamManagementPage from '../skill/TeamManagementPage.vue'
import DigitalEmployeeManagementPage from '../employee/DigitalEmployeeManagementPage.vue'
import TaskManagementPage from '../task/TaskManagementPage.vue'

const sidebarStore = useSidebarStore()
const bodyRef = ref(null)
const previewAsset = ref(null)
const previewExpanded = ref(false)

const emit = defineEmits(['select-asset'])

function onSelectAsset(asset) {
  previewAsset.value = asset
  emit('select-asset', asset)
}

function togglePreviewExpand() {
  previewExpanded.value = !previewExpanded.value
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

// 接收来自外部的资产选择
defineExpose({
  selectAsset: onSelectAsset
})
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

/* 技能管理卡片样式 */
.skill-management-card {
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
.skill-management-card .card-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
.skill-management-card .card-body::-webkit-scrollbar {
  width: 5px;
}
.skill-management-card .card-body::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 3px;
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

/* 预览展开时的样式 */
.preview-expanded {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}
</style>
