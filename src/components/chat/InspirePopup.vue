<template>
  <div class="inspire-popup" v-show="visible">
    <!-- Top bar -->
    <div class="popup-topbar">
      <div class="popup-title">灵感触发</div>
      <div class="popup-search-wrap">
        <span class="search-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </span>
        <input
          ref="searchRef"
          type="text"
          v-model="searchQuery"
          placeholder="搜索条目..."
          @input="filterItems"
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="popup-tabs" @click.stop>
      <button
        v-for="tab in tabs"
        :key="tab"
        class="popup-tab"
        :class="{ active: activeTab === tab }"
        @click="setTab(tab)"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Items list -->
    <div class="popup-items">
      <!-- Empty state for '我的' -->
      <div v-if="activeTab === '我的' && myItems.length === 0" class="popup-empty">
        <div class="popup-empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        </div>
        <p>还没有配置任何条目<br>浏览其他分类，点击「加入我的」</p>
      </div>

      <!-- Empty search result -->
      <div v-else-if="filteredItems.length === 0" class="popup-empty">
        <div class="popup-empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <p>未找到相关条目</p>
      </div>

      <!-- Items -->
      <div
        v-else
        v-for="item in filteredItems"
        :key="item.id"
        class="popup-item"
        @click="selectItem(item)"
      >
        <div class="popup-item-body">
          <div class="popup-item-title">
            {{ item.title }}
            <span v-if="item.skill" class="p-tag">· {{ item.skill }}</span>
          </div>
          <div class="popup-item-preview">{{ item.prompt }}</div>
        </div>
        <div class="popup-item-btns">
          <!-- '我的' tab shows remove button -->
          <button
            v-if="activeTab === '我的'"
            class="pi-btn pi-btn-del"
            @click.stop="removeFromMy(item.id)"
            title="从我的移除"
          >
            ✕ 移除
          </button>
          <!-- Other tabs show add/added button -->
          <button
            v-else-if="myItems.includes(item.id)"
            class="pi-btn pi-btn-add added"
            @click.stop
            title="已添加"
          >
            ✓ 已添加
          </button>
          <button
            v-else
            class="pi-btn pi-btn-add"
            @click.stop="addToMy(item.id)"
            title="加入我的"
          >
            ＋ 加入我的
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="popup-footer">
      <a @click.stop="goToSquare">去灵感广场探索更多条目 →</a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'close', 'go-square'])

// Tabs
const tabs = ['查阅搜', '润材料', '巧制作', '帮我办', '提醒我', '写代码', '我的']
const activeTab = ref('查阅搜')
const searchQuery = ref('')
const searchRef = ref(null)

// My items (configured items)
const myItems = ref([])

// Inspiration data
const inspirations = ref([
  // 查阅搜
  { id: 1, cat: '查阅搜', title: '查今天班车', prompt: '帮我查一下【明天/本周五】从【出发地】到公司的班车时刻', skill: '快手班车助手', tags: ['行政', '日常高频'] },
  { id: 2, cat: '查阅搜', title: '查今日菜单', prompt: '查一下【园区名称】今天【午餐/晚餐】的菜单，我偏好【清淡/辣】', skill: '快手菜单查询助手', tags: ['行政', '日常高频'] },
  { id: 3, cat: '查阅搜', title: '读取文档内容', prompt: '读取这个 Docs 文档链接【URL】的内容，给我总结核心信息', skill: '快手文档助手', tags: ['日常高频', '文档处理'] },
  { id: 4, cat: '查阅搜', title: '查会议内容', prompt: '帮我查一下最近【会议名称/关键词】的会议内容和摘要', skill: 'Onepoint会议助手', tags: ['日常高频'] },
  { id: 5, cat: '查阅搜', title: '搜索行业动态', prompt: '搜索【关键词】最近【一周/一个月】的行业动态，整理成摘要', skill: '互联网内容调研', tags: ['AI相关', '运营'] },
  { id: 6, cat: '查阅搜', title: '公众号内容搜索', prompt: '帮我在微信公众号搜索关于【主题】的文章，整理核心观点', skill: '互联网内容调研', tags: ['运营', 'AI相关'] },
  { id: 7, cat: '查阅搜', title: '竞品调研', prompt: '调研【竞品名称】的最新功能更新和用户评价', skill: '互联网内容调研', tags: ['产品', '运营'] },
  { id: 8, cat: '查阅搜', title: '调研AI今日动态', prompt: '今天 AI 领域有什么新动态？帮我整理成日报', skill: 'AI行业调研', tags: ['AI相关', '日常高频'] },

  // 润材料
  { id: 10, cat: '润材料', title: '整理会议纪要', prompt: '帮我整理今天的【会议记录文字】，提炼关键决策和行动项，生成结构化摘要', skill: '', tags: ['日常高频', '文档处理'] },
  { id: 11, cat: '润材料', title: '写邮件', prompt: '帮我写一封【拒绝/催促/感谢】邮件，对象是【同事/上级/外部合作方】，内容是【事项描述】', skill: '', tags: ['日常高频', '对外协作'] },
  { id: 12, cat: '润材料', title: '文字翻译', prompt: '把这段文字翻译成【英文/日文/韩文】，保持专业语气', skill: '', tags: ['日常高频', '对外协作'] },
  { id: 13, cat: '润材料', title: '写技术方案', prompt: '帮我写一份关于【主题】的技术方案设计文档', skill: '技术方案设计', tags: ['研发'] },
  { id: 14, cat: '润材料', title: '写PRD', prompt: '帮我写一份【功能/项目】的 PRD 文档，目标用户是【用户群体】', skill: '产品管理助手', tags: ['产品'] },
  { id: 15, cat: '润材料', title: '写调研报告', prompt: '帮我写一份清爽风格的调研报告，主题是【报告主题】', skill: '清爽调研报告风格', tags: ['产品', '运营'] },

  // 巧制作
  { id: 20, cat: '巧制作', title: '生成PPT', prompt: '帮我根据【需求描述/文档链接】生成一份 PPT，主题是【PPT主题】', skill: 'PPT生成器', tags: ['日常高频', '设计'] },
  { id: 21, cat: '巧制作', title: '制作信息图', prompt: '帮我把这段文字做成一张信息图，风格【简洁/商务/活泼】', skill: '信息图生成器', tags: ['设计'] },
  { id: 22, cat: '巧制作', title: '生成UI原型', prompt: '帮我根据【需求描述】生成 UI 产品原型，平台是【PC/移动端】', skill: 'UI原型设计', tags: ['设计', '产品'] },
  { id: 23, cat: '巧制作', title: '制作数据图表', prompt: '帮我把【数据/文字内容】做成可交互的数据图表，类型是【柱状图/折线图/饼图】', skill: '数据图表生成器', tags: ['数据', '设计'] },
  { id: 24, cat: '巧制作', title: '做网页', prompt: '帮我做一个网页：【功能描述】', skill: '网页开发', tags: ['研发', '设计'] },

  // 帮我办
  { id: 30, cat: '帮我办', title: '预约会议室', prompt: '帮我预约【明天下午3点】的会议室，关键词【位置/关键词】', skill: '会议室助手', tags: ['行政', '日常高频'] },
  { id: 31, cat: '帮我办', title: '邀请访客', prompt: '帮我邀请访客【访客姓名】，【日期】来公司，来访事由是【事由】', skill: '快手访客预约助手', tags: ['行政', '对外协作'] },
  { id: 32, cat: '帮我办', title: '给群发消息', prompt: '帮我给「【群名】」发一条消息：【消息内容】\n\n注意：如果 AI 不在群里，请告诉我如何邀请加入。', skill: '', tags: ['日常高频'] },
  { id: 33, cat: '帮我办', title: '对比分析方案', prompt: '帮我对比分析【方案A】和【方案B】，从【效率/成本/用户体验】维度输出结论', skill: '', tags: ['产品', '日常高频'] },

  // 提醒我
  { id: 40, cat: '提醒我', title: '单次定时提醒', prompt: '今天下午【15:00】提醒我【事项】，只提醒一次', skill: '', timer: true, tags: ['日常高频'] },
  { id: 41, cat: '提醒我', title: '每日定时提醒', prompt: '每天【09:00】提醒我【做什么事】', skill: '', timer: true, tags: ['日常高频'] },
  { id: 42, cat: '提醒我', title: '每周AI行业周报', prompt: '每周【周一09:00】给我发一份 AI 行业周报', skill: 'AI行业调研', timer: true, tags: ['AI相关'] },
  { id: 43, cat: '提醒我', title: '推送AI早报', prompt: '每天【08:30】给我推送一份 AI 行业早报', skill: 'AI资讯监控助手', timer: true, tags: ['AI相关'] },

  // 写代码
  { id: 50, cat: '写代码', title: '理解需求文档', prompt: '帮我理解这份需求文档【PRD链接/内容】，输出结构化需求分析', skill: '需求理解', tags: ['研发', '产品'] },
  { id: 51, cat: '写代码', title: 'AI生成测试用例', prompt: '帮我根据这份 PRD【链接/内容】生成手工测试用例', skill: 'KTest智能生成手工测试用例', tags: ['研发', '新手推荐'] },
  { id: 52, cat: '写代码', title: 'Code Review', prompt: '帮我 Review 这段代码，检查潜在问题和改进建议：【粘贴代码】', skill: '', tags: ['研发', '日常高频'] },
  { id: 53, cat: '写代码', title: '解释报错信息', prompt: '解释一下这段报错信息，并给出解决方案：【粘贴报错内容】', skill: '', tags: ['研发', '新手推荐'] },
  { id: 54, cat: '写代码', title: '生成Commit Message', prompt: '帮我把这段内容生成规范的 Git Commit Message', skill: '提交信息生成', tags: ['研发', '日常高频'] },
])

// Computed filtered items
const filteredItems = computed(() => {
  let list = []

  if (activeTab.value === '我的') {
    list = myItems.value.map(id => inspirations.value.find(i => i.id === id)).filter(Boolean)
  } else {
    list = inspirations.value.filter(i => i.cat === activeTab.value)
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.prompt.toLowerCase().includes(q) ||
      (i.skill && i.skill.toLowerCase().includes(q))
    )
  }

  return list
})

// Methods
function setTab(tab) {
  activeTab.value = tab
  searchQuery.value = ''
}

function filterItems() {
  // Just trigger re-render via computed
}

function addToMy(id) {
  if (!myItems.value.includes(id)) {
    myItems.value.unshift(id)
    showToast('✅ 已加入「我的」菜单')
  }
}

function removeFromMy(id) {
  myItems.value = myItems.value.filter(i => i !== id)
  showToast('已从「我的」移除')
}

function selectItem(item) {
  emit('select', item)
}

function goToSquare() {
  emit('go-square')
}

// Toast
const toastVisible = ref(false)
const toastMessage = ref('')
function showToast(msg) {
  toastMessage.value = msg
  // Could implement toast in parent or here
  console.log('[Toast]', msg)
}

// Focus search on open
watch(() => props.visible, (val) => {
  if (val) {
    searchQuery.value = ''
    nextTick(() => {
      searchRef.value?.focus()
    })
  }
})

// Expose for parent
defineExpose({
  myItems
})
</script>

<style scoped>
.inspire-popup {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 12px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 8px 28px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
  z-index: 800;
  overflow: hidden;
  animation: popupIn 0.16s ease;
}

@keyframes popupIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Top bar ── */
.popup-topbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 12px 9px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.popup-title {
  font-size: 12.5px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.popup-search-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f3f4f6;
  border-radius: 7px;
  padding: 5px 9px;
}

.search-icon {
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.popup-search-wrap input {
  border: none;
  background: none;
  outline: none;
  font-size: 12.5px;
  color: #374151;
  width: 100%;
  font-family: inherit;
}

.popup-search-wrap input::placeholder {
  color: #9ca3af;
}

/* ── Tabs ── */
.popup-tabs {
  display: flex;
  padding: 0 6px;
  gap: 1px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  overflow-x: auto;
  flex-shrink: 0;
}

.popup-tabs::-webkit-scrollbar {
  display: none;
}

.popup-tab {
  padding: 7px 11px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 12.5px;
  color: #6b7280;
  white-space: nowrap;
  transition: color 0.12s;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-family: inherit;
}

.popup-tab.active {
  color: #111827;
  border-bottom-color: #111827;
  font-weight: 600;
}

.popup-tab:hover:not(.active) {
  color: #374151;
}

/* ── Items ── */
.popup-items {
  max-height: 220px;
  overflow-y: auto;
  padding: 5px 6px;
}

.popup-items::-webkit-scrollbar {
  width: 3px;
}

.popup-items::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}

.popup-item {
  padding: 7px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.popup-item:hover {
  background: rgba(0,0,0,0.04);
}

.popup-item:hover .popup-item-btns {
  opacity: 1;
}

.popup-item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.popup-item-title {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.popup-item-preview {
  font-size: 11.5px;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popup-item-btns {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.12s;
  flex-shrink: 0;
}

.pi-btn {
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 3px;
  transition: all 0.12s;
  font-family: inherit;
}

.pi-btn-add {
  background: #f3f4f6;
  color: #374151;
  border-color: rgba(0,0,0,0.08);
}

.pi-btn-add:hover {
  background: #111827;
  color: white;
  border-color: #111827;
}

.pi-btn-add.added {
  background: rgba(16,185,129,0.08);
  color: #059669;
  border-color: rgba(16,185,129,0.2);
  cursor: default;
}

.pi-btn-del {
  background: #f3f4f6;
  color: #6b7280;
  border-color: rgba(0,0,0,0.08);
}

.pi-btn-del:hover {
  background: #fee2e2;
  color: #dc2626;
  border-color: rgba(220,38,38,0.2);
}

/* ── Tags ── */
.p-tag {
  background: transparent;
  color: #9ca3af;
  border-radius: 4px;
  font-size: 10.5px;
  padding: 0;
  font-weight: 400;
}

/* ── Empty ── */
.popup-empty {
  text-align: center;
  padding: 24px 16px;
  color: #9ca3af;
}

.popup-empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #d1d5db;
}

.popup-empty p {
  font-size: 12.5px;
  margin: 0;
  line-height: 1.6;
}

/* ── Footer ── */
.popup-footer {
  border-top: 1px solid rgba(0,0,0,0.05);
  padding: 8px 12px;
  text-align: center;
}

.popup-footer a {
  font-size: 11.5px;
  color: #6b7280;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.1s;
}

.popup-footer a:hover {
  color: #111827;
}
</style>
