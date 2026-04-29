<template>
  <div class="image-edit-panel" v-if="activeTool">
    <!-- 图生图面板 -->
    <div v-if="activeTool === 'image-to-image'" class="edit-panel-content">
      <div class="panel-header">
        <h3 class="panel-title">🎨 图生图</h3>
        <p class="panel-desc">使用 AI 生成一张风格相似的新图片</p>
      </div>
      
      <div class="form-group">
        <label class="form-label">相似度</label>
        <div class="slider-group">
          <input 
            type="range" 
            class="edit-slider" 
            min="0" 
            max="100" 
            v-model="similarity"
          />
          <span class="slider-value">{{ similarity }}%</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">提示词（可选）</label>
        <textarea 
          class="form-textarea" 
          placeholder="输入描述词来引导生成方向..."
          v-model="prompt"
          rows="3"
        />
      </div>

      <div class="panel-actions">
        <button class="action-btn action-btn-primary" @click="handleGenerate">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          生成图片
        </button>
        <button class="action-btn action-btn-secondary" @click="$emit('close')">
          取消
        </button>
      </div>
    </div>

    <!-- 局部重绘面板 -->
    <div v-if="activeTool === 'inpaint'" class="edit-panel-content">
      <div class="panel-header">
        <h3 class="panel-title">✏️ 局部重绘</h3>
        <p class="panel-desc">在图片上涂抹区域并输入描述优化</p>
      </div>

      <div class="form-group">
        <label class="form-label">画笔大小</label>
        <div class="slider-group">
          <input 
            type="range" 
            class="edit-slider" 
            min="5" 
            max="100" 
            v-model="brushSize"
          />
          <span class="slider-value">{{ brushSize }}px</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">优化描述</label>
        <textarea 
          class="form-textarea" 
          placeholder="描述你想要生成的内容..."
          v-model="inpaintPrompt"
          rows="3"
        />
      </div>

      <div class="brush-tools">
        <button class="brush-btn" :class="{ 'active': brushMode === 'draw' }" @click="brushMode = 'draw'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z"/>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
          </svg>
          涂抹
        </button>
        <button class="brush-btn" :class="{ 'active': brushMode === 'erase' }" @click="brushMode = 'erase'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 20H7L3 16l5-5 8 8z"/>
            <path d="M9 9l7-7 4 4-7 7"/>
          </svg>
          擦除
        </button>
        <button class="brush-btn" @click="clearMask">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          清空
        </button>
      </div>

      <div class="panel-actions">
        <button class="action-btn action-btn-primary" @click="handleInpaint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          开始重绘
        </button>
        <button class="action-btn action-btn-secondary" @click="$emit('close')">
          取消
        </button>
      </div>
    </div>

    <!-- 图像扩展面板 -->
    <div v-if="activeTool === 'outpaint'" class="edit-panel-content">
      <div class="panel-header">
        <h3 class="panel-title">🔲 图像扩展</h3>
        <p class="panel-desc">扩展图片尺寸，AI 自动填充扩展区域</p>
      </div>

      <div class="form-group">
        <label class="form-label">扩展方向</label>
        <div class="direction-grid">
          <button 
            v-for="dir in directions" 
            :key="dir.id"
            class="direction-btn"
            :class="{ 'active': expandDirection === dir.id }"
            @click="expandDirection = dir.id"
          >
            {{ dir.label }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">扩展尺寸</label>
        <div class="slider-group">
          <input 
            type="range" 
            class="edit-slider" 
            min="50" 
            max="500" 
            step="50"
            v-model="expandSize"
          />
          <span class="slider-value">{{ expandSize }}px</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">扩展提示词（可选）</label>
        <textarea 
          class="form-textarea" 
          placeholder="描述扩展区域应该包含的内容..."
          v-model="outpaintPrompt"
          rows="2"
        />
      </div>

      <div class="panel-actions">
        <button class="action-btn action-btn-primary" @click="handleOutpaint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 3 21 3 21 9"/>
            <polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/>
            <line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
          开始扩展
        </button>
        <button class="action-btn action-btn-secondary" @click="$emit('close')">
          取消
        </button>
      </div>
    </div>

    <!-- 智能抠图面板 -->
    <div v-if="activeTool === 'remove-bg'" class="edit-panel-content">
      <div class="panel-header">
        <h3 class="panel-title">✂️ 智能抠图</h3>
        <p class="panel-desc">自动识别主体并移除背景</p>
      </div>

      <div class="form-group">
        <label class="form-label">抠图模式</label>
        <div class="mode-group">
          <button 
            class="mode-btn"
            :class="{ 'active': removeMode === 'auto' }"
            @click="removeMode = 'auto'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            自动识别
          </button>
          <button 
            class="mode-btn"
            :class="{ 'active': removeMode === 'manual' }"
            @click="removeMode = 'manual'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
            </svg>
            手动标记
          </button>
        </div>
      </div>

      <div class="form-group" v-if="removeMode === 'auto'">
        <label class="form-label">边缘精细度</label>
        <div class="slider-group">
          <input 
            type="range" 
            class="edit-slider" 
            min="0" 
            max="100" 
            v-model="edgeSmooth"
          />
          <span class="slider-value">{{ edgeSmooth }}%</span>
        </div>
      </div>

      <div class="panel-actions">
        <button class="action-btn action-btn-primary" @click="handleRemoveBg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          </svg>
          开始抠图
        </button>
        <button class="action-btn action-btn-secondary" @click="$emit('close')">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  activeTool: { type: String, default: null },
  imageUrl: { type: String, required: true }
})

const emit = defineEmits(['close', 'generate', 'inpaint', 'outpaint', 'remove-bg'])

// 图生图参数
const similarity = ref(70)
const prompt = ref('')

// 局部重绘参数
const brushSize = ref(30)
const brushMode = ref('draw')
const inpaintPrompt = ref('')

// 图像扩展参数
const expandDirection = ref('all')
const expandSize = ref(200)
const outpaintPrompt = ref('')

const directions = computed(() => [
  { id: 'all', label: '全部' },
  { id: 'top', label: '上' },
  { id: 'bottom', label: '下' },
  { id: 'left', label: '左' },
  { id: 'right', label: '右' }
])

// 智能抠图参数
const removeMode = ref('auto')
const edgeSmooth = ref(50)

// 操作处理
function handleGenerate() {
  emit('generate', {
    tool: 'image-to-image',
    params: {
      similarity: similarity.value,
      prompt: prompt.value
    }
  })
}

function handleInpaint() {
  emit('inpaint', {
    tool: 'inpaint',
    params: {
      brushSize: brushSize.value,
      prompt: inpaintPrompt.value,
      mode: brushMode.value
    }
  })
}

function handleOutpaint() {
  emit('outpaint', {
    tool: 'outpaint',
    params: {
      direction: expandDirection.value,
      size: expandSize.value,
      prompt: outpaintPrompt.value
    }
  })
}

function handleRemoveBg() {
  emit('remove-bg', {
    tool: 'remove-bg',
    params: {
      mode: removeMode.value,
      edgeSmooth: edgeSmooth.value
    }
  })
}

function clearMask() {
  // 清空涂抹蒙版
  console.log('Clear mask')
}
</script>

<style scoped>
.image-edit-panel {
  position: absolute;
  top: 88px;
  right: 14px;
  width: 320px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08);
  z-index: 100;
  max-height: calc(100vh - 180px);
  overflow: auto;
}

.edit-panel-content {
  padding: 18px;
}

.panel-header {
  margin-bottom: 18px;
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(20, 20, 30, 0.9);
  margin: 0 0 6px 0;
}

.panel-desc {
  font-size: 12px;
  color: rgba(20, 20, 30, 0.55);
  margin: 0;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 12.5px;
  font-weight: 500;
  color: rgba(20, 20, 30, 0.75);
  margin-bottom: 8px;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.edit-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.edit-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #4285f4;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(66, 133, 244, 0.3);
}

.slider-value {
  font-size: 12px;
  color: rgba(20, 20, 30, 0.65);
  min-width: 44px;
  text-align: right;
  font-weight: 500;
}

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  font-size: 12.5px;
  color: rgba(20, 20, 30, 0.85);
  resize: vertical;
  outline: none;
  transition: all 0.15s;
  font-family: inherit;
  background: rgba(248, 249, 251, 0.6);
}

.form-textarea:focus {
  border-color: rgba(66, 133, 244, 0.5);
  background: #fff;
}

.form-textarea::placeholder {
  color: rgba(20, 20, 30, 0.35);
}

.brush-tools {
  display: flex;
  gap: 6px;
  margin-top: 12px;
}

.brush-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  color: rgba(20, 20, 30, 0.65);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.brush-btn:hover {
  background: rgba(248, 249, 251, 1);
  border-color: rgba(0, 0, 0, 0.18);
  color: rgba(20, 20, 30, 0.85);
}

.brush-btn.active {
  background: rgba(66, 133, 244, 0.08);
  border-color: rgba(66, 133, 244, 0.5);
  color: #4285f4;
}

.direction-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.direction-btn {
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  color: rgba(20, 20, 30, 0.65);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.direction-btn:hover {
  background: rgba(248, 249, 251, 1);
  border-color: rgba(0, 0, 0, 0.18);
  color: rgba(20, 20, 30, 0.85);
}

.direction-btn.active {
  background: rgba(66, 133, 244, 0.08);
  border-color: rgba(66, 133, 244, 0.5);
  color: #4285f4;
}

.mode-group {
  display: flex;
  gap: 8px;
}

.mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  color: rgba(20, 20, 30, 0.65);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.mode-btn:hover {
  background: rgba(248, 249, 251, 1);
  border-color: rgba(0, 0, 0, 0.18);
  color: rgba(20, 20, 30, 0.85);
}

.mode-btn.active {
  background: rgba(66, 133, 244, 0.08);
  border-color: rgba(66, 133, 244, 0.5);
  color: #4285f4;
}

.panel-actions {
  display: flex;
  gap: 8px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn-primary {
  background: linear-gradient(135deg, #4285f4 0%, #3b78e7 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.25);
}

.action-btn-primary:hover {
  background: linear-gradient(135deg, #3b78e7 0%, #3367d6 100%);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.35);
  transform: translateY(-1px);
}

.action-btn-secondary {
  background: rgba(0, 0, 0, 0.04);
  color: rgba(20, 20, 30, 0.65);
}

.action-btn-secondary:hover {
  background: rgba(0, 0, 0, 0.08);
  color: rgba(20, 20, 30, 0.85);
}
</style>
