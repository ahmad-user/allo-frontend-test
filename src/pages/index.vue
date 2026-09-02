<template>
  <v-container class="py-6 px-4 px-sm-6 max-width-1200">
    <!-- Header Area -->
    <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-6 gap-3">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary d-flex align-center">
          <v-icon icon="mdi-rocket-launch" class="me-3" color="primary" />
          SpaceX Rocket Fleet
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis mb-0">
          Explore launch vehicles powered by SpaceX and Launch Library 2 API
        </p>
      </div>

      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-plus-circle"
        variant="elevated"
        class="mt-3 mt-sm-0"
        @click="isAddDialogOpen = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <!-- Filter Component -->
    <RocketFilter
      :search-query="state.searchQuery"
      :selected-country="state.selectedCountry"
      :available-countries="availableCountries"
      @update:search-query="setSearchQuery"
      @update:selected-country="setSelectedCountry"
      @reset="resetFilter"
    />

    <!-- UI States: Loading, Error, Empty, Success -->
    <LoadingState v-if="state.isLoading" />

    <ErrorState
      v-else-if="state.error"
      :message="state.error"
      @retry="onRetry"
    />

    <EmptyState
      v-else-if="filteredRockets.length === 0"
      @reset="resetFilter"
    />

    <RocketGrid
      v-else
      :rockets="filteredRockets"
    />

    <!-- Add Rocket Dialog -->
    <AddRocketDialog
      v-model="isAddDialogOpen"
      @add-rocket="handleAddRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/state/rocketStore'
import type { NewRocketInput } from '@/types/rocket'
import RocketFilter from '@/components/RocketFilter.vue'
import RocketGrid from '@/components/RocketGrid.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const {
  state,
  filteredRockets,
  availableCountries,
  fetchRockets,
  addRocket,
  setSearchQuery,
  setSelectedCountry,
  resetFilter,
} = useRocketStore()

const isAddDialogOpen = ref(false)

onMounted(() => {
  fetchRockets()
})

function onRetry() {
  fetchRockets(true)
}

function handleAddRocket(input: NewRocketInput) {
  addRocket(input)
}
</script>

<style scoped>
.max-width-1200 {
  max-width: 1200px;
  margin: 0 auto;
}
.gap-3 {
  gap: 12px;
}
</style>
