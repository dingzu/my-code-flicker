<template>
  <div class="skill-market-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-header-left">
        <button class="back-btn" @click="goBack">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="page-title-group">
          <h1 class="page-title">技能市场</h1>
          <p class="page-subtitle">发现更多实用技能，提升工作效率</p>
        </div>
      </div>
      <div class="page-header-actions">
        <div class="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索技能..."
            class="search-input"
          />
        </div>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="category-tab"
        :class="{ active: activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        {{ cat.label }}
        <span class="category-count">{{ getCategoryCount(cat.id) }}</span>
      </button>
    </div>

    <!-- 技能列表 -->
    <div class="skill-grid">
      <div
        v-for="skill in filteredMarketSkills"
        :key="skill.id"
        class="skill-card"
        :class="{ installed: isInstalled(skill.id) }"
      >
        <div class="skill-card-header">
          <div class="skill-card-icon" :style="{ background: skill.gradient }">
            <span class="skill-card-icon-text">{{ skill.icon }}</span>
          </div>
          <div class="skill-card-meta">
            <h3 class="skill-card-name">{{ skill.name }}</h3>
            <span class="skill-card-category">{{ skill.categoryName }}</span>
          </div>
        </div>
        <p class="skill-card-desc">{{ skill.description }}</p>
        <div class="skill-card-footer">
          <div class="skill-card-stats">
            <span class="stat-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {{ skill.users }}
            </span>
            <span class="stat-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              {{ skill.rating }}
            </span>
          </div>
          <button
            class="install-btn"
            :class="{ installed: isInstalled(skill.id) }"
            @click="toggleInstall(skill)"
          >
            <template v-if="isInstalled(skill.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              已安装
            </template>
            <template v-else>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              安装
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredMarketSkills.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      </div>
      <p class="empty-text">未找到匹配的技能</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'
import { useAppStore } from '../../stores/appStore'

const sidebarStore = useSidebarStore()
const appStore = useAppStore()

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
  { id: 'all', label: '全部' },
  { id: 'productivity', label: '效率工具' },
  { id: 'development', label: '开发辅助' },
  { id: 'analysis', label: '数据分析' },
  { id: 'creative', label: '创意设计' },
]

const marketSkills = ref([
  {
    id: 'market-1',
    name: '智能周报',
    description: '自动汇总本周工作内容，生成结构化周报',
    category: 'productivity',
    categoryName: '效率工具',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    users: '12.3k',
    rating: '4.9',
  },
  {
    id: 'market-2',
    name: '代码解释器',
    description: '运行 Python 代码并可视化结果',
    category: 'development',
    categoryName: '开发辅助',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    users: '8.7k',
    rating: '4.8',
  },
  {
    id: 'market-3',
    name: '数据可视化',
    description: '将数据转换为精美图表和报告',
    category: 'analysis',
    categoryName: '数据分析',
    icon: '📈',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    users: '15.2k',
    rating: '4.7',
  },
  {
    id: 'market-4',
    name: 'AI 绘图',
    description: '文字描述生成精美图片',
    category: 'creative',
    categoryName: '创意设计',
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    users: '28.5k',
    rating: '4.9',
  },
  {
    id: 'market-5',
    name: '文档翻译',
    description: '支持多语言文档精准翻译',
    category: 'productivity',
    categoryName: '效率工具',
    icon: '🌐',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    users: '9.4k',
    rating: '4.6',
  },
  {
    id: 'market-6',
    name: 'API 调试',
    description: '快速测试和调试 API 接口',
    category: 'development',
    categoryName: '开发辅助',
    icon: '🔧',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    users: '6.2k',
    rating: '4.5',
  },
  {
    id: 'market-7',
    name: 'SQL 助手',
    description: '自然语言生成 SQL 查询',
    category: 'analysis',
    categoryName: '数据分析',
    icon: '🗃️',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    users: '11.8k',
    rating: '4.8',
  },
  {
    id: 'market-8',
    name: 'PPT 生成',
    description: '根据内容自动生成演示文稿',
    category: 'creative',
    categoryName: '创意设计',
    icon: '📑',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    users: '18.3k',
    rating: '4.7',
  },
])

const filteredMarketSkills = computed(() => {
  let skills = marketSkills.value
  
  if (activeCategory.value !== 'all') {
    skills = skills.filter(s => s.category === activeCategory.value)
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    skills = skills.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    )
  }
  
  return skills
})

function getCategoryCount(catId) {
  if (catId === 'all') return marketSkills.value.length
  return marketSkills.value.filter(s => s.category === catId).length
}

function isInstalled(skillId) {
  return appStore.personalSkills.some(s => s.id === skillId && s.enabled)
}

function toggleInstall(skill) {
  const existingSkill = appStore.personalSkills.find(s => s.id === skill.id)
  if (existingSkill) {
    appStore.toggleSkill(skill.id)
  } else {
    appStore.personalSkills.push({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      enabled: true,
    })
  }
}

function goBack() {
  sidebarStore.setActiveNav('skills')
}
</script>

<style>
.skill-market-page {
  padding: 24px 28px;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-muted);
}
.back-btn:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-primary);
}
.page-title-group {
  flex: 1;
}
.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}
.page-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}
.page-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: white;
  transition: all 0.15s;
}
.search-box:focus-within {
  border-color: rgba(102, 126, 234, 0.4);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
.search-box svg {
  color: var(--text-muted);
  flex-shrink: 0;
}
.search-input {
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  width: 180px;
}
.search-input::placeholder {
  color: var(--text-muted);
}

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.category-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: rgba(0, 0, 0, 0.03);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.category-tab:hover {
  background: rgba(0, 0, 0, 0.06);
}
.category-tab.active {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.25);
  color: #667eea;
}
.category-count {
  background: rgba(0, 0, 0, 0.08);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
}
.category-tab.active .category-count {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

/* 技能网格 */
.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

/* 技能卡片 */
.skill-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
  transition: all 0.15s;
}
.skill-card:hover {
  border-color: rgba(102, 126, 234, 0.25);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.08);
}
.skill-card.installed {
  border-color: rgba(102, 126, 234, 0.3);
}
.skill-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.skill-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.skill-card-icon-text {
  font-size: 20px;
}
.skill-card-meta {
  flex: 1;
  min-width: 0;
}
.skill-card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 2px 0;
}
.skill-card-category {
  font-size: 12px;
  color: var(--text-muted);
}
.skill-card-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 14px 0;
  line-height: 1.5;
}
.skill-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.skill-card-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}
.stat-item svg {
  opacity: 0.6;
}
.install-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: white;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s;
}
.install-btn:hover {
  background: rgba(0, 0, 0, 0.03);
}
.install-btn.installed {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.25);
  color: #667eea;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}
.empty-icon {
  color: rgba(0, 0, 0, 0.12);
  margin-bottom: 16px;
}
.empty-text {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  .page-header-actions {
    width: 100%;
  }
  .search-box {
    flex: 1;
  }
  .search-input {
    width: 100%;
  }
}
</style>
