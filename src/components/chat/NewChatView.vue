<template>
  <div class="ncv-wrap">
    <!-- Greeting -->
    <div class="ncv-greeting">
      <p class="ncv-hello">你好，一寒</p>
      <p class="ncv-sub">今天想做什么？</p>
    </div>

    <!-- Project selector (outside input box) -->
    <div class="ncv-ctx-row" ref="ctxWrapRef">
      <span class="ncv-ctx-label">在</span>
      <button
        class="ncv-ctx-btn"
        :class="{
          'ncv-ctx-ws': ctxType === 'ws',
          'ncv-ctx-cloud': ctxType === 'cloud',
          'ncv-ctx-free': ctxType === 'cloud-free',
        }"
        @click.stop="ctxOpen = !ctxOpen"
      >
        <svg v-if="ctxType === 'ws'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
        <svg v-else-if="ctxType === 'cloud'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        </svg>
        <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>{{ ctxLabel }}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <span class="ncv-ctx-label">中发起对话</span>

      <!-- Dropdown -->
      <div class="ncv-ctx-menu" v-show="ctxOpen" @click.stop>
        <div class="ncv-ctx-section">执行位置</div>

        <div
          v-for="proj in wsProjects"
          :key="proj.id"
          class="ncv-ctx-item"
          :class="{ 'ncv-ctx-selected': ctxId === proj.id }"
          @click="selectCtx(proj.id, proj.name, 'ws')"
        >
          <div class="ncv-ctx-item-left">
            <div class="ncv-ctx-icon ncv-icon-ws">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <div>
              <div class="ncv-ctx-name">{{ proj.name }}</div>
              <div class="ncv-ctx-sub">本地 · main</div>
            </div>
          </div>
          <svg v-if="ctxId === proj.id" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div
          v-for="proj in cloudProjects"
          :key="proj.id"
          class="ncv-ctx-item"
          :class="{ 'ncv-ctx-selected': ctxId === proj.id }"
          @click="selectCtx(proj.id, proj.name, 'cloud')"
        >
          <div class="ncv-ctx-item-left">
            <div class="ncv-ctx-icon ncv-icon-cloud">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
            </div>
            <div>
              <div class="ncv-ctx-name">{{ proj.name }}</div>
              <div class="ncv-ctx-sub">云端</div>
            </div>
          </div>
          <svg v-if="ctxId === proj.id" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div
          class="ncv-ctx-item"
          :class="{ 'ncv-ctx-selected': ctxId === 'free' }"
          @click="selectCtx('free', '无项目', 'cloud-free')"
        >
          <div class="ncv-ctx-item-left">
            <div class="ncv-ctx-icon ncv-icon-free">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <div class="ncv-ctx-name">无项目</div>
              <div class="ncv-ctx-sub">云端对话，不绑定项目</div>
            </div>
          </div>
          <svg v-if="ctxId === 'free'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div class="ncv-ctx-divider"></div>
        <div class="ncv-ctx-item" @click="openNewProject">
          <div class="ncv-ctx-item-left">
            <div class="ncv-ctx-icon ncv-icon-add">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div class="ncv-ctx-name">新建项目…</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input box -->
    <div class="ncv-input-card" ref="inputCardRef">
      <!-- Attachments preview -->
      <div v-if="attachments.length > 0" class="ncv-attachments">
        <div v-for="(att, i) in attachments" :key="i" class="ncv-att-item">
          <img v-if="att.type === 'image'" :src="att.url" class="ncv-att-thumb" />
          <div v-else class="ncv-att-file">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <span>{{ att.name }}</span>
          </div>
          <button class="ncv-att-remove" @click="removeAttachment(i)">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Rich input for highlight fields -->
      <div
        ref="richInputRef"
        class="ncv-rich-input"
        contenteditable="true"
        data-placeholder="告诉 Myflicker 你想做什么…"
        @input="onRichInput"
        @keydown="handleRichKey"
      ></div>
      
      <!-- Hidden textarea for plain text fallback -->
      <textarea
        ref="inputRef"
        class="ncv-textarea"
        v-model="inputText"
        placeholder="告诉 Myflicker 你想做什么…"
        rows="1"
        @keydown="handleKey"
        @input="autoResize"
        style="display: none;"
      ></textarea>

      <!-- Inspiration Popup — anchored to input card -->
      <InspirePopup
        :visible="inspirationOpen"
        @select="handleInspireSelect"
        @close="inspirationOpen = false"
        @go-square="handleGoSquare"
      />

      <!-- Bottom toolbar -->
      <div class="ncv-toolbar">
        <div class="ncv-toolbar-left">
          <!-- Upload button -->
          <button class="ncv-tool-btn" @click="triggerUpload" title="添加图片或文件">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          <!-- File button -->
          <button class="ncv-tool-btn" @click="triggerFileUpload" title="添加文件">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          <!-- Inspiration button -->
          <div class="ncv-insp-wrap" ref="inspirationWrapRef">
            <button class="ncv-tool-btn" :class="{ active: inspirationOpen }" @click.stop="toggleInspiration" title="灵感触发">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </button>
          </div>
          <input ref="fileInputRef" type="file" accept="image/*" style="display:none" @change="onImageSelected" multiple />
          <input ref="attachInputRef" type="file" style="display:none" @change="onFileSelected" multiple />
        </div>

        <div class="ncv-toolbar-right">
          <span class="ncv-hint">⌘↵ 发送</span>
          <button class="ncv-send-btn" :class="{ active: inputText.trim() || attachments.length > 0 }" @click="send">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Suggestion chips -->
    <div class="ncv-suggestions">
      <button
        v-for="s in suggestions"
        :key="s"
        class="ncv-chip"
        @click="fillSuggestion(s)"
      >{{ s }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'
import InspirePopup from './InspirePopup.vue'

const sidebarStore = useSidebarStore()
const sheetVisible = inject('sheetVisible', null)

// 监听预填充文本，当有新值时设置到输入框
watch(() => sidebarStore.chatInputPrefill, async (newVal) => {
  if (newVal) {
    // 等待 DOM 更新
    await nextTick()
    if (richInputRef.value) {
      richInputRef.value.innerText = newVal
      inputText.value = newVal
      // 清空预填充，避免重复设置
      sidebarStore.clearChatInputPrefill()
      // 聚焦输入框
      richInputRef.value?.focus()
    }
  }
}, { immediate: true })

const inputRef = ref(null)
const ctxWrapRef = ref(null)
const fileInputRef = ref(null)
const attachInputRef = ref(null)
const inputText = ref('')
const ctxOpen = ref(false)
const ctxId = ref('proj1')
const ctxLabel = ref('dz-s-agent-hiro')
const ctxType = ref('ws')
const attachments = ref([])

const wsProjects = computed(() => sidebarStore.projects.filter(p => p.hasWorkspace))
const cloudProjects = computed(() => sidebarStore.projects.filter(p => !p.hasWorkspace))

const suggestions = ['帮我写一份需求文档', '分析这份数据', '代码 Review', '头脑风暴']

// Inspiration
const inspirationOpen = ref(false)
const inspirationWrapRef = ref(null)
const richInputRef = ref(null)

function toggleInspiration() {
  inspirationOpen.value = !inspirationOpen.value
}

// Handle inspiration selection with highlight fields
function handleInspireSelect(item) {
  inspirationOpen.value = false

  // Convert 【field】 to highlight-field spans for rich editing
  const html = item.prompt.replace(/【([^】]+)】/g, '<span class="highlight-field" contenteditable="true">$1</span>')

  // If we have rich input, use it; otherwise fall back to textarea
  if (richInputRef.value) {
    richInputRef.value.innerHTML = html
    // Focus first field
    nextTick(() => {
      const firstField = richInputRef.value.querySelector('.highlight-field')
      if (firstField) {
        firstField.focus()
        selectAllText(firstField)
      } else {
        richInputRef.value.focus()
      }
    })
  } else {
    // Fallback: just set plain text
    inputText.value = item.prompt
    inputRef.value?.focus()
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.style.height = 'auto'
        inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 160) + 'px'
      }
    })
  }
}

function selectAllText(el) {
  const range = document.createRange()
  range.selectNodeContents(el)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

function handleGoSquare() {
  inspirationOpen.value = false
  // Could navigate to square view or show toast
  console.log('Go to inspiration square')
}

function selectCtx(id, label, type) {
  ctxId.value = id
  ctxLabel.value = label
  ctxType.value = type
  ctxOpen.value = false
}

function openNewProject() {
  ctxOpen.value = false
  if (sheetVisible) sheetVisible.value = true
}

function send() {
  // Get text from rich input
  const richText = richInputRef.value?.innerText?.trim() || ''
  const text = richText || inputText.value.trim()
  if (!text && attachments.value.length === 0) return
  sidebarStore.sendMessage(sidebarStore.activeSessionId, text)
  inputText.value = ''
  if (richInputRef.value) richInputRef.value.innerHTML = ''
  attachments.value = []
  if (inputRef.value) inputRef.value.style.height = 'auto'
}

// Rich input handlers
function onRichInput(e) {
  // Sync to inputText for send button state
  inputText.value = e.target.innerText || ''
}

function handleRichKey(e) {
  const active = document.activeElement
  
  // Tab navigation between highlight fields
  if (active.classList?.contains('highlight-field') && e.key === 'Tab') {
    e.preventDefault()
    const fields = [...richInputRef.value.querySelectorAll('.highlight-field')]
    const idx = fields.indexOf(active)
    const next = e.shiftKey ? fields[idx - 1] : fields[idx + 1]
    if (next) {
      next.focus()
      selectAllText(next)
    }
    return
  }
  
  // Cmd/Ctrl + Enter to send
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    send()
  }
}

function handleKey(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    send()
  }
}

function autoResize(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 160) + 'px'
}

function fillSuggestion(s) {
  inputText.value = s
  inputRef.value?.focus()
}

function triggerUpload() {
  fileInputRef.value?.click()
}

function triggerFileUpload() {
  attachInputRef.value?.click()
}

function onImageSelected(e) {
  const files = Array.from(e.target.files || [])
  files.forEach(file => {
    const url = URL.createObjectURL(file)
    attachments.value.push({ type: 'image', name: file.name, url })
  })
  e.target.value = ''
}

function onFileSelected(e) {
  const files = Array.from(e.target.files || [])
  files.forEach(file => {
    attachments.value.push({ type: 'file', name: file.name })
  })
  e.target.value = ''
}

function removeAttachment(i) {
  attachments.value.splice(i, 1)
}

function onDocClick(e) {
  if (ctxOpen.value && ctxWrapRef.value && !ctxWrapRef.value.contains(e.target)) {
    ctxOpen.value = false
  }
  if (inspirationOpen.value && inspirationWrapRef.value && !inspirationWrapRef.value.contains(e.target)) {
    inspirationOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<style>
.ncv-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 32px 40px 80px;
  overflow: hidden;
}

.ncv-greeting {
  text-align: center;
  margin-bottom: 4px;
}
.ncv-hello {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
}
.ncv-sub {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

/* ── Project selector row ── */
.ncv-ctx-row {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  max-width: 580px;
  width: 100%;
}
.ncv-ctx-label {
  font-size: 13px;
  color: #9ca3af;
}
.ncv-ctx-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.1);
  background: #f9fafb;
  font-size: 12.5px; font-weight: 500;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s, border-color 0.1s;
}
.ncv-ctx-btn:hover { background: #f3f4f6; border-color: rgba(0,0,0,0.15); }
.ncv-ctx-ws   { color: #15803d; border-color: rgba(21,128,61,0.25); background: #f0fdf4; }
.ncv-ctx-cloud { color: #1d4ed8; border-color: rgba(29,78,216,0.2); background: #eff6ff; }
.ncv-ctx-free  { color: #6b7280; }

/* Dropdown */
.ncv-ctx-menu {
  position: absolute;
  top: calc(100% + 6px); left: 0;
  background: #fff;
  border-radius: 11px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06);
  width: 280px;
  z-index: 700;
  overflow: hidden;
  padding: 6px;
}
.ncv-ctx-section {
  font-size: 10.5px; font-weight: 600; color: #9ca3af;
  text-transform: uppercase; letter-spacing: 0.06em;
  padding: 4px 10px 6px;
}
.ncv-ctx-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px; border-radius: 8px; cursor: pointer;
  transition: background 0.1s;
}
.ncv-ctx-item:hover { background: #f9fafb; }
.ncv-ctx-selected { background: #f0f9ff; }
.ncv-ctx-item-left { display: flex; align-items: flex-start; gap: 9px; }
.ncv-ctx-icon {
  width: 24px; height: 24px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
.ncv-icon-ws    { background: #dcfce7; color: #16a34a; }
.ncv-icon-cloud { background: #dbeafe; color: #3b82f6; }
.ncv-icon-free  { background: #f3f4f6; color: #6b7280; }
.ncv-icon-add   { background: #f3f4f6; color: #374151; }
.ncv-ctx-name { font-size: 13px; font-weight: 500; color: #111827; }
.ncv-ctx-sub  { font-size: 11px; color: #9ca3af; margin-top: 1px; line-height: 1.3; }
.ncv-ctx-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 4px 0; }

/* ── Input card ── */
.ncv-input-card {
  width: 100%;
  max-width: 580px;
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.1);
  border-radius: 14px;
  padding: 12px 12px 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04);
  transition: border-color 0.15s, box-shadow 0.15s;
  position: relative;
}
.ncv-input-card:focus-within {
  border-color: rgba(0,0,0,0.18);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 0 0 3px rgba(0,0,0,0.04);
}

/* Attachments */
.ncv-attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.ncv-att-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.08);
}
.ncv-att-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  display: block;
}
.ncv-att-file {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  background: #f9fafb;
  font-size: 12px;
  color: #374151;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ncv-att-remove {
  position: absolute;
  top: 3px; right: 3px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  border: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.15s;
}
.ncv-att-item:hover .ncv-att-remove { opacity: 1; }

.ncv-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  color: #111827;
  line-height: 1.6;
  background: transparent;
  min-height: 24px;
  max-height: 160px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0;
  margin-bottom: 10px;
}
.ncv-textarea::placeholder { color: #d1d5db; }

.ncv-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ncv-toolbar-left { display: flex; align-items: center; gap: 2px; }
.ncv-toolbar-right { display: flex; align-items: center; gap: 8px; }

/* Tool buttons */
.ncv-tool-btn {
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  border: none;
  background: transparent;
  border-radius: 7px;
  color: #9ca3af;
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}
.ncv-tool-btn:hover { background: rgba(0,0,0,0.05); color: #374151; }

.ncv-hint { font-size: 11px; color: #d1d5db; }
.ncv-send-btn {
  width: 32px; height: 32px; border-radius: 8px;
  background: #e5e7eb; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #9ca3af; flex-shrink: 0;
  transition: background 0.12s, color 0.12s, transform 0.1s;
}
.ncv-send-btn.active { background: #1a1a1a; color: #fff; }
.ncv-send-btn.active:hover { background: #333; }
.ncv-send-btn:active { transform: scale(0.94); }

/* Suggestion chips */
.ncv-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  max-width: 580px;
}
.ncv-chip {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.7);
  font-size: 12.5px;
  color: #6b7280;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s, border-color 0.1s, color 0.1s;
}
.ncv-chip:hover {
  background: rgba(255,255,255,0.95);
  border-color: rgba(0,0,0,0.14);
  color: #374151;
}

/* ── Rich Input ── */
.ncv-rich-input {
  width: 100%;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  color: #111827;
  line-height: 1.6;
  background: transparent;
  min-height: 24px;
  max-height: 160px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0;
  margin-bottom: 10px;
  white-space: pre-wrap;
  word-break: break-word;
}

.ncv-rich-input:empty::before {
  content: attr(data-placeholder);
  color: #d1d5db;
  pointer-events: none;
}

/* Highlight editable field */
.ncv-rich-input :deep(.highlight-field),
.highlight-field {
  display: inline-block;
  background: #fef3c7;
  border: 1.5px solid #f59e0b;
  border-radius: 5px;
  padding: 0 5px;
  color: #78350f;
  cursor: text;
  min-width: 22px;
  outline: none;
  transition: all 0.15s;
  font-size: 14px;
}

.ncv-rich-input :deep(.highlight-field:focus),
.highlight-field:focus {
  background: #fffbeb;
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

/* ── Inspiration button ── */
.ncv-tool-btn.active {
  background: rgba(0,0,0,0.07);
  color: #374151;
}

.ncv-insp-wrap {
  position: relative;
}
</style>
