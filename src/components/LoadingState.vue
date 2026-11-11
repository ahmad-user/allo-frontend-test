<template>
  <div class="py-6">
    <!-- Telemetry Link Indicator -->
    <div class="d-flex flex-column align-center justify-center my-6">
      <div class="telemetry-radar-loader mb-4 position-relative d-flex align-center justify-center">
        <v-progress-circular color="primary" size="64" width="3" indeterminate />
        <v-icon icon="mdi-satellite-uplink" color="primary" size="24" class="position-absolute" />
      </div>
      <span class="text-h6 font-weight-bold text-white tracking-wide">Syncing Launch Telemetry...</span>
      <span class="text-caption font-mono text-slate-muted mt-1">Establishing link with Launch Library 2 API</span>
    </div>

    <!-- Structured Skeleton Cards Grid (Matches RocketCard layout) -->
    <v-row class="mt-4">
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        sm="6"
        lg="4"
      >
        <div class="skeleton-card pa-0 rounded-xl overflow-hidden">
          <v-skeleton-loader type="image" height="220" class="bg-surface-variant" />
          <div class="pa-4">
            <v-skeleton-loader type="heading" class="bg-transparent mb-2" />
            <v-skeleton-loader type="text@2" class="bg-transparent" />
          </div>
          <div class="px-4 py-3 border-t-dark d-flex justify-space-between align-center">
            <v-skeleton-loader type="chip" class="bg-transparent" width="100" />
            <v-skeleton-loader type="button" class="bg-transparent" width="70" />
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.text-slate-muted {
  color: #94a3b8;
}

.telemetry-radar-loader {
  width: 64px;
  height: 64px;
}

.skeleton-card {
  background: #0d1527;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.border-t-dark {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(7, 11, 20, 0.5);
}
</style>
