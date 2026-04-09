<template>
  <div v-if="messages.length" class="chat-messages">
    <div
      v-for="msg in messages"
      :key="msg.id"
      class="chat-msg"
      :class="msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-agent'"
    >
      <div class="msg-bubble">{{ msg.text }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  messages: { type: Array, default: () => [] },
})
</script>

<style>
.chat-messages {
  flex: 1; padding: 20px 20px 4px;
  display: flex; flex-direction: column; gap: 16px;
}
.chat-msg { display: flex; gap: 10px; align-items: flex-start; max-width: 88%; }
.chat-msg-user { margin-left: auto; flex-direction: row-reverse; }
.msg-bubble {
  padding: 9px 13px; border-radius: 12px;
  font-size: 13.5px; line-height: 1.55; color: #1a1a1a;
}
.chat-msg-user .msg-bubble  { background: #1a1a1a; color: #fff; border-radius: 12px 12px 3px 12px; }
.chat-msg-agent .msg-bubble { background: #f3f4f6; border-radius: 12px 12px 12px 3px; }
</style>
