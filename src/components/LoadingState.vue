<template>
  <div class="py-8">
    <div class="d-flex flex-column align-center justify-center my-6">
      <v-progress-circular color="primary" size="64" width="6" indeterminate class="mb-4" />
      <span class="text-h6 text-medium-emphasis font-weight-medium">Loading SpaceX Rockets...</span>
      <span class="text-caption text-disabled mt-1">Fetching data from Launch Library 2 API</span>
    </div>

    <!-- Skeleton Grid Loader -->
    <v-row class="mt-4">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader
          type="card-avatar, article, actions"
          elevation="2"
          class="rounded-lg"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
</script>
