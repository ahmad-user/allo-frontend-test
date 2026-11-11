<template>
  <div class="error-panel my-8 pa-8 rounded-2xl text-center position-relative overflow-hidden">
    <div class="error-glow-overlay" />
    <div class="d-flex flex-column align-center position-relative z-index-1">
      <div class="error-icon-box pa-4 rounded-circle mb-4 d-flex align-center justify-center">
        <v-icon icon="mdi-alert-octagon-outline" size="44" color="error" />
      </div>

      <div class="text-caption font-mono text-error font-weight-bold text-uppercase mb-1 tracking-wider">
        Telemetry Link Interrupted
      </div>

      <h3 class="text-h5 font-weight-bold text-white mb-2">
        {{ title || 'Unable to Retrieve SpaceX Telemetry' }}
      </h3>

      <p class="text-body-1 text-slate-muted max-width-600 mb-6">
        {{ message || 'A network error or rate limit occurred while querying the Launch Library 2 API. Check your connection or try again.' }}
      </p>

      <v-btn
        color="error"
        size="large"
        variant="elevated"
        prepend-icon="mdi-refresh"
        rounded="lg"
        elevation="0"
        class="retry-btn font-weight-bold text-none px-6"
        @click="onRetry"
      >
        Retry Telemetry Link
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string
  message?: string | null
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()

function onRetry() {
  emit('retry')
}
</script>

<style scoped>
.error-panel {
  background: #0d1527;
  border: 1px solid rgba(248, 113, 113, 0.25);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.6);
}

.error-glow-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 20%, rgba(248, 113, 113, 0.08) 0%, transparent 60%);
  pointer-events: none;
}

.error-icon-box {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.25);
}

.text-slate-muted {
  color: #94a3b8;
  line-height: 1.6;
}

.max-width-600 {
  max-width: 600px;
}

.z-index-1 {
  z-index: 1;
}

.retry-btn {
  background: linear-gradient(135deg, #f87171 0%, #dc2626 100%) !important;
  color: #ffffff !important;
  box-shadow: 0 4px 16px rgba(248, 113, 113, 0.3) !important;
}

.retry-btn:hover {
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.45) !important;
}
</style>
