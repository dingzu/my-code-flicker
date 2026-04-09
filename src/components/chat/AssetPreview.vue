<template>
  <div class="preview-wrap">
    <!-- Tabs bar -->
    <div class="preview-tabs-bar">
      <div class="preview-tab preview-tab-active">
        <span class="preview-tab-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#e34234">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <polyline points="14 2 14 8 20 8" fill="none" stroke="white" stroke-width="1.5"/>
          </svg>
        </span>
        <span class="preview-tab-name">{{ asset.name }}</span>
        <button class="preview-tab-close" @click="$emit('close')">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <!-- Ghost duplicate tab (matches screenshot) -->
      <div class="preview-tab preview-tab-ghost">
        <span class="preview-tab-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#e34234">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <polyline points="14 2 14 8 20 8" fill="none" stroke="white" stroke-width="1.5"/>
          </svg>
        </span>
        <span class="preview-tab-name">{{ asset.name }}</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="preview-toolbar">
      <!-- Page nav -->
      <div class="preview-page-nav">
        <button class="ptb" @click="prevPage" :disabled="page <= 1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span class="ptb-pager">{{ page }} <span class="pager-sep">/</span> {{ totalPages }}</span>
        <button class="ptb" @click="nextPage" :disabled="page >= totalPages">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <!-- Zoom -->
      <div class="preview-zoom">
        <button class="ptb" @click="zoomOut">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <input type="range" class="zoom-slider" min="50" max="200" step="10" v-model.number="zoom" />
        <button class="ptb" @click="zoomIn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <span class="zoom-label">{{ zoom }}%</span>
        <button class="ptb">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      <!-- Right actions -->
      <div class="preview-right-actions">
        <button class="ptb" title="下载">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button class="ptb" title="刷新">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
        <button class="ptb" title="全屏">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="15 3 21 3 21 9"/>
            <polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/>
            <line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
        </button>
        <button class="ptb" title="关闭" @click="$emit('close')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Doc content -->
    <div class="preview-body">
      <div class="preview-scale-wrap" :style="{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }">
        <div class="preview-doc-page">
          <h1 class="pdf-title">泛开发者用户场景研究</h1>
          <p class="pdf-meta">目标：分析泛开发者市场需求，明确发力方向，支持产品战略决策</p>

          <div class="pdf-section">
            <h2>一、市场调研</h2>
            <h3>1.1 开发者与泛开发者市场规模</h3>
            <ul class="pdf-list">
              <li>全球开发者人口：根据 SlashData 数据，全球开发者人口已超过 <strong>4700 万</strong>，且年增长显著，预计到 2025 年时突破 <strong>5000 万</strong>，表现出市场平台领先在泛域吸引力。<a href="#" class="pdf-ref">数据来源 1</a></li>
              <li>开发者平台：GitHub 报告显示全球活跃开发者已超过 <strong>1.8 亿</strong>，表现出平台主要吸引力的 AI 编辑力。<a href="#" class="pdf-ref">数据来源 2</a></li>
              <li>知识工作者扩展：Microsoft Work Trend Index 报告显示，<strong>75% 的知识工作者</strong>正在使用生成式 AI 工具，说明 AI 技术的普及性正在超过传统开发者圈，且逐步进入更多细分领域。<a href="#" class="pdf-ref">数据来源 3</a></li>
            </ul>

            <h3>1.2 需求趋势分析</h3>
            <ul class="pdf-list">
              <li>生成式 AI 使用扩展：GitHub Octoverse 2024 报告指出，生成式 AI 项目贡献比增长了 <strong>59%</strong>，项目数增长 <strong>98%</strong>，表明 AI 技术在开发领域的应用正在以规律数据增长，特别是在代码生成与自动化任务上。<a href="#" class="pdf-ref">数据来源 4</a></li>
              <li>AI 信任问题：Stack Overflow 2024 调查显示 <strong>76% 开发者</strong>正在使用或计划使用 AI 工具，但对其输出的信任度较低，约 <strong>43% 的开发者</strong>认为 AI 输出准确性不高。<a href="#" class="pdf-ref">数据来源 5</a></li>
            </ul>

            <h3>1.3 市场机会总结</h3>
            <ul class="pdf-list">
              <li>广泛市场需求：无论是开发者、数据分析师，还是运营团队，AI 工具的使用率正在普及，尤其在"生成内容"和"提高生产力"方面，市场需求巨大。</li>
              <li>信任问题是瓶颈：用户对 AI 工具的信任度较低，尤其在生成内容和数据分析中，对准确性与可靠性有较高要求。</li>
            </ul>
          </div>

          <div class="pdf-section">
            <h2>二、用户画像分析</h2>
            <h3>2.1 个人用户画像（四大核心用户画像）</h3>
            <table class="pdf-table">
              <tr>
                <td>
                  <div class="pdf-table-cell-header">👨‍💻 职业开发者</div>
                  <ul class="pdf-list-sm">
                    <li>任务：写代码、做架构、测试与文档写作</li>
                    <li>需求痛点：AI 输出不可控、缺乏与现有工具（IDE、Git）深度集成、隐私与安全问题</li>
                    <li>外部支撑：Stack Overflow 2024 对 AI 的使用与信任问题，AI 的准确性与生成代码的可验证性是主要痛点。</li>
                  </ul>
                </td>
                <td>
                  <div class="pdf-table-cell-header">📚 学习者与成长型开发者</div>
                  <ul class="pdf-list-sm">
                    <li>任务：学习编程、做练习、写作业、Debug</li>
                    <li>需求痛点：缺乏系统化学习路径、需要自动化建设调进步、一步步引导，不要仅仅提供答案</li>
                    <li>外部支撑：Stack Overflow 和 freeCodeCamp 的学习行为与需求，学习路径明确化与生成支持是被讨论满足的需求。</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="pdf-table-cell-header">🔧 开发相关岗位（以不开发为主，但高度参与开发流程的角色）</div>
                  <ul class="pdf-list-sm">
                    <li>任务：数据查看、报告生成、做自动化脚本等，主要用 SQL，做可视化图表</li>
                    <li>需求痛点：操作复杂的 BI 工具，且难以集成开发与数据分析环境，拖延效率。</li>
                    <li>外部支撑：Microsoft Work Trend Index，75% 知识工作者使用 AI。</li>
                  </ul>
                </td>
                <td>
                  <div class="pdf-table-cell-header">🌱 低代码开发者 / 非专业开发者</div>
                  <ul class="pdf-list-sm">
                    <li>任务：使用低代码/无代码工具开发内部应用或将业务自动化</li>
                    <li>需求痛点：对 IT 系统不熟悉，但需要快速创建工具，且对权限与合规性有较高需要</li>
                    <li>外部支撑：Gartner 对 Citizen Developer 的定义及在企业中低代码/无代码工具使用的趋势。</li>
                  </ul>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  asset: { type: Object, required: true },
})
defineEmits(['close'])

const page = ref(1)
const totalPages = ref(2)
const zoom = ref(100)

function prevPage() { if (page.value > 1) page.value-- }
function nextPage() { if (page.value < totalPages.value) page.value++ }
function zoomIn()  { if (zoom.value < 200) zoom.value += 10 }
function zoomOut() { if (zoom.value > 50)  zoom.value -= 10 }
</script>

<style>
/* ── Outer wrapper ── */
.preview-wrap {
  flex: 1;
  min-width: 0;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-radius: var(--card-radius);
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Tabs bar ── */
.preview-tabs-bar {
  height: 40px;
  display: flex;
  align-items: flex-end;
  padding: 0 0 0 0;
  background: rgba(245,246,248,0.8);
  border-bottom: 1px solid rgba(0,0,0,0.07);
  flex-shrink: 0;
  gap: 0;
}

.preview-tab {
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  font-size: 12.5px;
  font-weight: 400;
  color: rgba(20,20,30,0.75);
  cursor: pointer;
  user-select: none;
  position: relative;
  border-right: 1px solid rgba(0,0,0,0.06);
  flex-shrink: 0;
  max-width: 180px;
}

.preview-tab-active {
  background: rgba(255,255,255,0.95);
  color: rgba(20,20,30,0.88);
  font-weight: 500;
  border-bottom: 2px solid rgba(255,255,255,0.95);
  margin-bottom: -1px;
}

.preview-tab-ghost {
  background: rgba(0,0,0,0.02);
  color: rgba(20,20,30,0.45);
}

.preview-tab-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.preview-tab-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
}

.preview-tab-close {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 3px;
  color: rgba(20,20,30,0.35);
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: all 0.1s;
}
.preview-tab-close:hover {
  color: rgba(20,20,30,0.7);
  background: rgba(0,0,0,0.07);
}

/* ── Toolbar ── */
.preview-toolbar {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 12px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.7);
  flex-shrink: 0;
}

.preview-page-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.ptb-pager {
  font-size: 12.5px;
  color: rgba(20,20,30,0.65);
  padding: 0 4px;
  min-width: 40px;
  text-align: center;
}

.pager-sep {
  color: rgba(20,20,30,0.3);
  margin: 0 2px;
}

.preview-zoom {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.zoom-slider {
  width: 80px;
  height: 3px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(0,0,0,0.12);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  flex-shrink: 0;
}
.zoom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(20,20,30,0.65);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.zoom-label {
  font-size: 12px;
  color: rgba(20,20,30,0.55);
  min-width: 36px;
  flex-shrink: 0;
}

.preview-right-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  flex-shrink: 0;
}

/* ── Shared toolbar button ── */
.ptb {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 5px;
  color: rgba(20,20,30,0.45);
  cursor: pointer;
  transition: all 0.1s;
  flex-shrink: 0;
  padding: 0;
}
.ptb:hover {
  color: rgba(20,20,30,0.8);
  background: rgba(0,0,0,0.05);
}
.ptb:disabled {
  opacity: 0.3;
  cursor: default;
  pointer-events: none;
}

/* ── Body ── */
.preview-body {
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  background: rgba(240,242,246,0.6);
}

.preview-body::-webkit-scrollbar { width: 5px; }
.preview-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }

.preview-scale-wrap {
  display: inline-block;
  width: 100%;
}

/* ── Document page ── */
.preview-doc-page {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05);
  padding: 48px 56px;
  min-height: 600px;
  max-width: 760px;
  margin: 0 auto;
  outline: 2px solid rgba(66,133,244,0.55);
  outline-offset: 3px;
  transition: outline-color 0.2s;
}

.pdf-title {
  font-size: 22px;
  font-weight: 700;
  color: #111;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.pdf-meta {
  font-size: 13px;
  color: rgba(20,20,30,0.45);
  margin: 0 0 28px 0;
  line-height: 1.5;
}

.pdf-section {
  margin-bottom: 24px;
}

.pdf-section h2 {
  font-size: 17px;
  font-weight: 700;
  color: #111;
  margin: 0 0 12px 0;
  padding-bottom: 6px;
  border-bottom: 1.5px solid rgba(0,0,0,0.08);
}

.pdf-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: rgba(20,20,30,0.85);
  margin: 14px 0 8px 0;
}

.pdf-list {
  margin: 0 0 12px 0;
  padding-left: 18px;
  list-style-type: disc;
}

.pdf-list li {
  font-size: 12.5px;
  color: rgba(20,20,30,0.75);
  line-height: 1.7;
  margin-bottom: 6px;
}

.pdf-list strong {
  color: rgba(20,20,30,0.9);
}

.pdf-ref {
  color: #4285f4;
  text-decoration: none;
  font-size: 11px;
  margin-left: 4px;
}
.pdf-ref:hover { text-decoration: underline; }

/* Table */
.pdf-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-top: 8px;
}
.pdf-table td {
  border: 1px solid rgba(0,0,0,0.1);
  padding: 10px 12px;
  vertical-align: top;
  width: 50%;
}

.pdf-table-cell-header {
  font-weight: 600;
  color: rgba(20,20,30,0.82);
  margin-bottom: 6px;
  font-size: 12.5px;
}

.pdf-list-sm {
  margin: 6px 0 0 0;
  padding-left: 16px;
  list-style-type: disc;
}
.pdf-list-sm li {
  font-size: 11.5px;
  color: rgba(20,20,30,0.7);
  line-height: 1.6;
  margin-bottom: 4px;
}
</style>
