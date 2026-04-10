<template>
  <div>
    <!-- Projects section -->
    <div class="sidebar-section">
      <div class="section-header">
        <span class="section-label">项目</span>
        <div class="section-actions">
          <!-- Filter dropdown -->
          <div class="filter-dropdown-wrapper">
            <button class="filter-text-btn" @click="filterOpen = !filterOpen">
              <span>{{ currentFilterLabel }}</span>
              <svg
                class="filter-arrow"
                :class="{ open: filterOpen }"
                width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            
            <!-- Dropdown menu -->
            <div v-if="filterOpen" class="filter-menu">
              <div class="filter-option" :class="{ active: sidebarStore.projectFilterType === 'all' }" @click="selectFilter('all')">
                <span>全部项目</span>
                <svg v-if="sidebarStore.projectFilterType === 'all'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="filter-option" :class="{ active: sidebarStore.projectFilterType === 'personal' }" @click="selectFilter('personal')">
                <span>个人项目</span>
                <svg v-if="sidebarStore.projectFilterType === 'personal'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              
              <div class="filter-divider"></div>
              
              <!-- Team filter options -->
              <div class="filter-label">团队项目</div>
              <div
                v-for="team in sidebarStore.teams.filter(t => t.id !== 'personal')"
                :key="team.id"
                class="filter-option filter-option-sub"
                :class="{ active: sidebarStore.projectFilterType === 'team' && sidebarStore.projectFilterTeamId === team.id }"
                @click="selectFilter('team', team.id)"
              >
                <div class="filter-team-avatar" :style="{ background: team.color }">{{ team.name[0] }}</div>
                <span>{{ team.name }}</span>
                <svg v-if="sidebarStore.projectFilterType === 'team' && sidebarStore.projectFilterTeamId === team.id" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
          </div>

          <button class="section-add" title="新建项目" @click="sheetVisible = true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
      <ProjectItem
        v-for="proj in sidebarStore.filteredProjects"
        :key="proj.id"
        :project="proj"
      />
    </div>

    <!-- Standalone conversations -->
    <div class="sidebar-section">
      <div class="section-header">
        <span class="section-label">对话</span>
        <button class="section-add" title="新建对话" @click="sidebarStore.openNewChat()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>
      <div
        v-for="convo in sidebarStore.standaloneConversations"
        :key="convo.id"
        class="sub-item"
        :class="{ 'sub-item-active': sidebarStore.activeSessionId === convo.id }"
        @click="sidebarStore.openSession(convo.id)"
      >
        {{ convo.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, computed } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'
import ProjectItem from './ProjectItem.vue'

const sidebarStore = useSidebarStore()

// 控制 NewProjectSheet 显示（通过 provide/inject 或 store 也可，这里用简单的 prop 事件）
// 为简化，直接操控 sheetVisible（通过 NewProjectSheet 在 App 层用 store 控制）
// 这里通过 inject 获取 sheetVisible（在 App.vue 中 provide）
// 实际上用一个简单的 ref 即可，因为 Sheet 是全局的
const sheetVisible = inject('sheetVisible')

const filterOpen = ref(false)

// 当前筛选标签文字
const currentFilterLabel = computed(() => {
  if (sidebarStore.projectFilterType === 'all') {
    return '全部'
  }
  if (sidebarStore.projectFilterType === 'personal') {
    return '个人'
  }
  if (sidebarStore.projectFilterType === 'team' && sidebarStore.projectFilterTeamId) {
    const team = sidebarStore.teams.find(t => t.id === sidebarStore.projectFilterTeamId)
    return team ? team.name : '团队'
  }
  return '全部'
})

function selectFilter(type, teamId = null) {
  sidebarStore.setProjectFilter(type, teamId)
  filterOpen.value = false
}
</script>

<style>
.sidebar-section {
  padding: 12px 8px 4px;
  flex-shrink: 0;
}
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 10px;
  margin-bottom: 2px;
}
.section-label {
  font-size: 11.5px;
  font-weight: 500;
  color: rgba(30,30,40,0.42);
  letter-spacing: 0.01em;
}
.section-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.section-add {
  background: none; border: none; cursor: pointer;
  color: rgba(30,30,40,0.42);
  padding: 2px;
  border-radius: 4px;
  display: flex; align-items: center;
  transition: color 0.1s;
}
.section-add:hover { color: rgba(30,30,40,0.88); }

/* Filter dropdown */
.filter-dropdown-wrapper {
  position: relative;
}
.filter-text-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(30,30,40,0.55);
  padding: 2px 5px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11.5px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.12s;
}
.filter-text-btn:hover {
  color: rgba(30,30,40,0.85);
  background: rgba(0,0,0,0.04);
}
.filter-arrow {
  flex-shrink: 0;
  color: rgba(30,30,40,0.35);
  transition: transform 0.15s;
}
.filter-arrow.open {
  transform: rotate(180deg);
}
.filter-menu {
  position: absolute;
  top: 24px;
  right: 0;
  min-width: 160px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);
  padding: 4px;
  z-index: 100;
  animation: filterMenuIn 0.15s cubic-bezier(0.25,1,0.5,1) both;
}
@keyframes filterMenuIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 9px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: rgba(30,30,40,0.75);
  transition: background 0.1s;
}
.filter-option:hover {
  background: rgba(0,0,0,0.04);
}
.filter-option.active {
  background: rgba(0,0,0,0.06);
  color: rgba(30,30,40,0.95);
  font-weight: 500;
}
.filter-option span {
  flex: 1;
}
.filter-option svg {
  flex-shrink: 0;
  color: #16a34a;
}
.filter-option-sub {
  padding-left: 12px;
}
.filter-divider {
  height: 1px;
  background: rgba(0,0,0,0.06);
  margin: 4px 0;
}
.filter-label {
  font-size: 10.5px;
  font-weight: 600;
  color: rgba(30,30,40,0.4);
  padding: 6px 9px 3px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.filter-team-avatar {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.sub-item {
  display: flex; align-items: center;
  padding: 5px 10px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 12.5px;
  color: rgba(30,30,40,0.55);
  transition: background 0.1s, color 0.1s;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sub-item:hover { background: rgba(0,0,0,0.04); color: rgba(20,20,30,0.85); }
.sub-item-active { color: rgba(20,20,30,0.85); font-weight: 500; background: rgba(0,0,0,0.05); }
.sub-item-add {
  gap: 5px; color: rgba(20,20,30,0.35);
  font-size: 12px;
}
.sub-item-add:hover { color: rgba(20,20,30,0.6); }
</style>
