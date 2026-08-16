<template>
  <div class="auth-layout">
    <main class="auth-card">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-background, #f9f9f9);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: var(--color-background-soft, #ffffff);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 10rem 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
