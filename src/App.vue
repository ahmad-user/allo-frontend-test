<template>
  <v-app class="aerospace-app">
    <div class="aerospace-stars-overlay" />
    <v-main class="aerospace-main position-relative">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>

<style scoped>
.aerospace-app {
  background: #070b14 !important;
  color: #f1f5f9;
  min-height: 100vh;
}

.aerospace-stars-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-image:
    radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.7), rgba(0, 0, 0, 0)),
    radial-gradient(1.5px 1.5px at 90px 40px, rgba(56, 189, 248, 0.8), rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 160px 120px, #ffffff, rgba(0, 0, 0, 0)),
    radial-gradient(1.5px 1.5px at 230px 190px, rgba(56, 189, 248, 0.6), rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 300px 80px, rgba(255, 255, 255, 0.8), rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 350px 350px;
  opacity: 0.25;
  z-index: 0;
}

.aerospace-main {
  background:
    radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(129, 140, 248, 0.05) 0%, transparent 40%),
    #070b14;
  min-height: 100vh;
  z-index: 1;
}
</style>
