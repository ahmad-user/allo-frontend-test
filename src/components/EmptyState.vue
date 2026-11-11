<template>
  <div class="empty-panel my-8 pa-8 rounded-2xl text-center position-relative overflow-hidden">
    <div class="d-flex flex-column align-center">
      <div class="empty-icon-box pa-4 rounded-circle mb-4 d-flex align-center justify-center">
        <v-icon icon="mdi-radar" size="44" color="primary" />
      </div>

      <div class="text-caption font-mono text-primary font-weight-bold text-uppercase mb-1 tracking-wider">
        No Matching Telemetry
      </div>

      <h3 class="text-h5 font-weight-bold text-white mb-2">
        No Launch Vehicles Found
      </h3>

      <p class="text-body-1 text-slate-muted max-width-540 mb-6">
        No rockets in the active fleet match your search criteria or country filter. Try adjusting your query or resetting all filters.
      </p>

      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-filter-off-outline"
        rounded="lg"
        class="reset-btn font-weight-bold text-none px-6"
        @click="onReset"
      >
        Reset Fleet Filters
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'reset'): void
}>()

function onReset() {
  emit('reset')
}
</script>

<style scoped>
.empty-panel {
  background: #0d1527;
  border: 1px dashed rgba(56, 189, 248, 0.25);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.6);
}

.empty-icon-box {
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.text-slate-muted {
  color: #94a3b8;
  line-height: 1.6;
}

.max-width-540 {
  max-width: 540px;
}

.reset-btn {
  background: rgba(56, 189, 248, 0.1) !important;
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: #38bdf8 !important;
}

.reset-btn:hover {
  background: rgba(56, 189, 248, 0.2) !important;
}
</style>
