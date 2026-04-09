<template>
  <div class="desktop-icon" @click="onSingleClick" @dblclick="emit('dblclick')">
    <div class="desktop-icon-img">
      <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
        <rect x="0" y="0" width="36" height="44" rx="5" fill="#fff"/>
        <rect x="0" y="0" width="36" height="44" rx="5" fill="url(#pg)" opacity="0.9"/>
        <path d="M22 0 L36 14" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <path d="M22 0 L22 14 L36 14" fill="rgba(0,0,0,0.06)" stroke="none"/>
        <line x1="7" y1="20" x2="29" y2="20" stroke="#bbb" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="7" y1="25" x2="29" y2="25" stroke="#bbb" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="7" y1="30" x2="22" y2="30" stroke="#bbb" stroke-width="1.5" stroke-linecap="round"/>
        <defs>
          <linearGradient id="pg" x1="0" y1="0" x2="36" y2="44" gradientUnits="userSpaceOnUse">
            <stop stop-color="#e8f0fe"/>
            <stop offset="1" stop-color="#d2e3fc"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="desktop-icon-label" :class="{ selected: isSelected }">产品说明.doc</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['dblclick'])
const isSelected = ref(false)

function onSingleClick() {
  isSelected.value = !isSelected.value
}
</script>

<style>
.desktop-icon {
  position: absolute;
  top: 48px; left: 20px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: default; user-select: none; width: 72px;
}
.desktop-icon-img {
  width: 56px; height: 68px;
  display: flex; align-items: center; justify-content: center;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.18));
  transition: transform 0.15s, filter 0.15s;
}
.desktop-icon:hover .desktop-icon-img {
  transform: scale(1.06);
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.22));
}
.desktop-icon:active .desktop-icon-img { transform: scale(0.96); }
.desktop-icon-label {
  font-size: 11.5px; color: #fff; text-align: center;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  padding: 1px 6px; border-radius: 4px;
  max-width: 72px; word-break: break-all; line-height: 1.3;
}
.desktop-icon-label.selected { background: rgba(0,100,255,0.55); }
</style>
