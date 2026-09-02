<template>
  <v-card variant="outlined" color="error" class="my-8 pa-6 rounded-lg bg-red-lighten-5">
    <div class="d-flex flex-column align-center text-center">
      <v-icon icon="mdi-alert-circle-outline" size="64" color="error" class="mb-4" />

      <h3 class="text-h5 font-weight-bold text-error mb-2">
        {{ title || 'Failed to Load SpaceX Data' }}
      </h3>

      <p class="text-body-1 text-grey-darken-2 max-width-600 mb-6">
        {{ message || 'An error occurred while fetching information from the SpaceX Launch Library 2 API.' }}
      </p>

      <v-btn
        color="error"
        size="large"
        variant="elevated"
        prepend-icon="mdi-refresh"
        @click="onRetry"
      >
        Retry Request
      </v-btn>
    </div>
  </v-card>
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
.max-width-600 {
  max-width: 600px;
}
</style>
