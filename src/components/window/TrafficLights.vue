<template>
  <div class="traffic-lights">
    <div class="tl tl-red" @click="emit('close')"></div>
    <div class="tl tl-amber"></div>
    <div class="tl tl-green" @click="emit('maximize')"></div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close', 'maximize'])
</script>

<style>
.traffic-lights { display: flex; gap: 7px; align-items: center; }
.tl {
  width: 12px; height: 12px; border-radius: 50%;
  cursor: pointer; position: relative;
  transition: filter 0.1s;
}
.tl::after {
  content: '';
  position: absolute; inset: 0;
  border-radius: 50%;
  border: 0.5px solid rgba(0,0,0,0.18);
}
.tl-red   { background: var(--red); }
.tl-amber { background: var(--amber); }
.tl-green { background: var(--green); }
.tl:hover { filter: brightness(1.1); }
</style>
