<template>
  <nav class="menubar">
    <span class="menubar-apple">&#63743;</span>
    <span class="menubar-appname">Myflicker</span>
    <div class="menubar-items">
      <span class="menubar-item">文件</span>
      <span class="menubar-item">编辑</span>
      <span class="menubar-item">视图</span>
      <span class="menubar-item">窗口</span>
      <span class="menubar-item">帮助</span>
    </div>
    <div class="menubar-right">
      <!-- wifi -->
      <svg width="15" height="12" viewBox="0 0 24 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M2 6c5.5-5.5 14.5-5.5 20 0"/>
        <path d="M5 10c3.8-3.8 10.2-3.8 14 0"/>
        <path d="M8.5 14c2-2 5-2 7 0"/>
        <circle cx="12" cy="17" r="1" fill="currentColor"/>
      </svg>
      <!-- battery -->
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <rect x="0.75" y="0.75" width="17.5" height="10.5" rx="2.5"/>
        <rect x="2.5" y="2.5" width="11" height="7" rx="1.2" fill="currentColor" stroke="none" opacity="0.85"/>
        <path d="M19.5 4v4" stroke-width="2" opacity="0.6"/>
      </svg>
      <span class="menubar-clock">{{ clock }}</span>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const clock = ref('')

function tick() {
  const n = new Date()
  const h = String(n.getHours()).padStart(2, '0')
  const m = String(n.getMinutes()).padStart(2, '0')
  clock.value = h + ':' + m
}

let timer
onMounted(() => {
  tick()
  timer = setInterval(tick, 10000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style>
.menubar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 26px;
  background: rgba(20,20,20,0.82);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 18px;
  z-index: 9999;
  user-select: none;
}
.menubar-apple {
  color: rgba(255,255,255,0.85);
  font-size: 15px;
  line-height: 1;
}
.menubar-appname {
  font-size: 13px; font-weight: 600;
  color: rgba(255,255,255,0.9);
  letter-spacing: -0.01em;
}
.menubar-items { display: flex; gap: 2px; }
.menubar-item {
  font-size: 13px;
  color: rgba(255,255,255,0.78);
  padding: 2px 8px;
  border-radius: 4px;
  cursor: default;
}
.menubar-item:hover { background: rgba(255,255,255,0.12); }
.menubar-right {
  margin-left: auto;
  display: flex; align-items: center; gap: 14px;
  color: rgba(255,255,255,0.72);
  font-size: 12px;
}
.menubar-clock {
  font-size: 12.5px; font-weight: 400;
  color: rgba(255,255,255,0.88);
  font-variant-numeric: tabular-nums;
}
</style>
