<template>
  <div class="dock">
    <!-- Finder -->
    <div class="dock-icon">
      <span class="dock-label">Finder</span>
      <div class="dock-bg finder-bg">🗂</div>
    </div>
    <!-- Safari -->
    <div class="dock-icon">
      <span class="dock-label">Safari</span>
      <div class="dock-bg safari-bg">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
          <circle cx="12" cy="12" r="9"/>
          <polyline points="12 2 12 5" stroke-width="1.2"/>
          <polyline points="12 19 12 22" stroke-width="1.2"/>
          <line x1="2" y1="12" x2="5" y2="12" stroke-width="1.2"/>
          <line x1="19" y1="12" x2="22" y2="12" stroke-width="1.2"/>
          <polygon points="16,8 10,14 8,16 14,10" fill="white" stroke="none" opacity="0.9"/>
        </svg>
      </div>
    </div>
    <!-- Mail -->
    <div class="dock-icon">
      <span class="dock-label">邮件</span>
      <div class="dock-bg mail-bg">
        <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round">
          <rect x="0.75" y="0.75" width="22.5" height="16.5" rx="2"/>
          <polyline points="0.75,1 12,10 23.25,1"/>
        </svg>
      </div>
    </div>
    <!-- Doc -->
    <div class="dock-icon" :class="{ active: docStore.visible }" @click="dockOpenDoc">
      <span class="dock-label">产品说明</span>
      <div style="width:48px;height:48px;border-radius:11px;background:linear-gradient(145deg,#e8f0fe,#d2e3fc);display:flex;align-items:center;justify-content:center;overflow:hidden;">
        <svg width="26" height="32" viewBox="0 0 36 44" fill="none">
          <rect x="0" y="0" width="36" height="44" rx="5" fill="#fff" opacity="0.85"/>
          <path d="M22 0 L36 14" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
          <path d="M22 0 L22 14 L36 14" fill="rgba(0,0,0,0.08)" stroke="none"/>
          <line x1="7" y1="20" x2="29" y2="20" stroke="#93b4f0" stroke-width="2" stroke-linecap="round"/>
          <line x1="7" y1="26" x2="29" y2="26" stroke="#93b4f0" stroke-width="2" stroke-linecap="round"/>
          <line x1="7" y1="32" x2="20" y2="32" stroke="#93b4f0" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
    <div class="dock-sep"></div>
    <!-- Myflicker -->
    <div class="dock-icon" :class="{ active: appStore.mainWindowVisible }" @click="dockOpenMyflicker">
      <span class="dock-label">Myflicker</span>
      <img class="dock-img" src="/1.jpg" alt="Myflicker">
    </div>
    <!-- Notes -->
    <div class="dock-icon">
      <span class="dock-label">备忘录</span>
      <div class="dock-bg notes-bg">
        <svg width="20" height="22" viewBox="0 0 20 22" fill="none" stroke="rgba(120,70,0,0.7)" stroke-width="1.5" stroke-linecap="round">
          <rect x="1" y="1" width="18" height="20" rx="2.5"/>
          <line x1="5" y1="7" x2="15" y2="7"/>
          <line x1="5" y1="11" x2="15" y2="11"/>
          <line x1="5" y1="15" x2="10" y2="15"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'
import { useDocStore } from '../stores/docStore'

const appStore = useAppStore()
const docStore = useDocStore()

function dockOpenDoc() {
  if (!docStore.visible) {
    docStore.open()
  }
  // 已打开则仅 bring to front（由 DocWindow 自行处理）
}

function dockOpenMyflicker() {
  if (!appStore.mainWindowVisible) {
    appStore.openMainWindow()
  }
}
</script>

<style>
.dock {
  position: fixed;
  bottom: 10px; left: 50%; transform: translateX(-50%);
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(28px) saturate(200%);
  -webkit-backdrop-filter: blur(28px) saturate(200%);
  border: 1px solid rgba(255,255,255,0.24);
  border-radius: 18px;
  padding: 7px 10px;
  display: flex; align-items: flex-end; gap: 7px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.1);
  z-index: 100;
}
.dock-icon {
  width: 48px; height: 48px;
  border-radius: 11px;
  cursor: pointer; position: relative;
  transition: transform 0.2s cubic-bezier(0.25,1,0.5,1);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.dock-icon:hover { transform: translateY(-8px) scale(1.1); }
.dock-icon:hover .dock-label { opacity: 1; transform: translateX(-50%) translateY(0); }
.dock-label {
  position: absolute; bottom: calc(100% + 9px);
  left: 50%; transform: translateX(-50%) translateY(4px);
  background: rgba(20,20,20,0.82);
  backdrop-filter: blur(8px);
  color: rgba(255,255,255,0.92);
  font-size: 11px; font-weight: 500;
  padding: 3px 8px; border-radius: 5px;
  white-space: nowrap; pointer-events: none;
  opacity: 0; transition: opacity 0.12s, transform 0.12s;
}
.dock-icon.active::after {
  content: '';
  position: absolute; bottom: -5px; left: 50%;
  transform: translateX(-50%);
  width: 4px; height: 4px;
  background: rgba(0,0,0,0.4); border-radius: 50%;
}
.dock-sep {
  width: 1px; height: 36px;
  background: rgba(255,255,255,0.25);
  margin: 0 3px; align-self: center;
}
.dock-img { width: 48px; height: 48px; border-radius: 11px; object-fit: cover; }
.dock-bg {
  width: 48px; height: 48px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
}
.finder-bg { background: linear-gradient(145deg, #60a5e0 0%, #1a6fc4 100%); }
.safari-bg { background: linear-gradient(145deg, #7dd3f8 0%, #0094ff 100%); }
.notes-bg  { background: linear-gradient(145deg, #fde68a 0%, #f59e0b 100%); }
.mail-bg   { background: linear-gradient(145deg, #5bc8fa 0%, #0a84ff 100%); }
</style>
