<template>
  <div class="sidebar-footer">
    <div class="user-avatar">
      <img src="/1.jpg" alt="avatar">
    </div>
    <span class="user-name">一寒</span>
  </div>
</template>

<style>
.sidebar-footer {
  padding: 10px 16px;
  border-top: 1px solid rgba(0,0,0,0.08);
  display: flex; align-items: center; gap: 10px;
  flex-shrink: 0;
}
.user-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #ffd6a5, #b5f0f0);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600;
  color: #1a1a1a;
  flex-shrink: 0;
  overflow: hidden;
}
.user-avatar img { width: 100%; height: 100%; object-fit: cover; }
.user-name {
  font-size: 13px; font-weight: 500;
  color: rgba(30,30,40,0.85);
}
</style>
