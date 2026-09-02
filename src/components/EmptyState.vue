<template>
  <v-card variant="flat" color="grey-lighten-4" class="my-8 pa-8 text-center rounded-lg">
    <v-icon icon="mdi-file-search-outline" size="64" color="grey-darken-1" class="mb-4" />

    <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">
      No Rockets Found
    </h3>

    <p class="text-body-2 text-medium-emphasis mb-6">
      No SpaceX rockets match your current filter or search criteria. Try clearing or adjusting your search term.
    </p>

    <v-btn
      color="primary"
      variant="outlined"
      prepend-icon="mdi-filter-off-outline"
      @click="onReset"
    >
      Reset Filters
    </v-btn>
  </v-card>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'reset'): void
}>()

function onReset() {
  emit('reset')
}
</script>
