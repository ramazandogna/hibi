<template>
  <div>SignUp View</div>
  <div class="auth-link">
    <span>
      <RouterLink to="/"> Anasayfa </RouterLink>
    </span>
    <span>
      <RouterLink to="/login"> Login </RouterLink>
    </span>
  </div>
</template>

<script lang="ts" setup></script>

<style>
.auth-link {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}
</style>
