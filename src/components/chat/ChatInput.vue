<template>
  <div class="chat-input-area">
    <!-- Text input -->
    <div class="chat-input-wrap">
      <textarea
        ref="inputRef"
        class="chat-input"
        v-model="inputText"
        placeholder="告诉 Myflicker 你想做什么…"
        rows="1"
        @keydown="handleKey"
        @input="autoResize"
      ></textarea>
      <button class="chat-send-btn" @click="send">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSidebarStore } from '../../stores/sidebarStore'

const sidebarStore = useSidebarStore()

const inputText = ref('')
const inputRef = ref(null)

function send() {
  const text = inputText.value.trim()
  if (!text) return
  sidebarStore.sendMessage(sidebarStore.activeSessionId, text)
  inputText.value = ''
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
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
</script>

<style>
.chat-input-area {
  border-top: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
  padding: 10px 14px 12px;
  flex-shrink: 0;
  position: relative;
}
.chat-input-wrap {
  display: flex; align-items: flex-end; gap: 8px;
  background: #fff;
  border: 1.5px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  padding: 8px 8px 8px 12px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.chat-input-wrap:focus-within {
  border-color: rgba(0,0,0,0.2);
  box-shadow: 0 0 0 3px rgba(0,0,0,0.04);
}
.chat-input {
  flex: 1; border: none; outline: none; resize: none;
  font-family: inherit; font-size: 13.5px; color: #111827;
  line-height: 1.5; background: transparent;
  min-height: 22px; max-height: 160px;
  overflow-y: auto;
}
.chat-input::placeholder { color: #d1d5db; }
.chat-send-btn {
  width: 32px; height: 32px; border-radius: 8px;
  background: #1a1a1a; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
  transition: background 0.12s, transform 0.1s;
}
.chat-send-btn:hover { background: #333; }
.chat-send-btn:active { transform: scale(0.94); }
</style>
