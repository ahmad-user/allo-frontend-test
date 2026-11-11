<template>
  <v-container class="py-8 px-4 px-sm-6 px-md-8 max-width-1280">
    <!-- Hero / Header Section -->
    <header class="mb-8">
      <!-- Telemetry Status Ribbon -->
      <div class="d-flex align-center flex-wrap gap-2 mb-3">
        <div class="telemetry-badge font-mono d-inline-flex align-center px-3 py-1 rounded-pill">
          <span class="status-dot me-2" />
          <span class="text-caption font-weight-bold tracking-wider text-primary">LIVE TELEMETRY</span>
          <span class="mx-2 text-disabled opacity-40">/</span>
          <span class="text-caption text-medium-emphasis">LL2 API v2.2.0</span>
        </div>

        <div class="telemetry-pill d-none d-sm-inline-flex align-center px-3 py-1 rounded-pill">
          <v-icon icon="mdi-shield-check-outline" size="14" color="success" class="me-1" />
          <span class="text-caption text-medium-emphasis">SpaceX Fleet Verified</span>
        </div>
      </div>

      <!-- Main Title & Action Row -->
      <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between gap-4">
        <div>
          <h1 class="text-h3 font-weight-black text-white aerospace-title mb-2">
            SpaceX Rocket Fleet
          </h1>
          <p class="text-body-1 text-slate max-width-700 mb-0">
            Comprehensive catalog of orbital and deep-space launch vehicles engineered by SpaceX. Real-time telemetry specifications powered by Launch Library 2.
          </p>
        </div>

        <div class="d-flex align-center flex-wrap gap-3">
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-plus"
            elevation="0"
            class="add-rocket-btn font-weight-bold text-none px-5 rounded-lg"
            @click="isAddDialogOpen = true"
          >
            Add Rocket
          </v-btn>
        </div>
      </div>

      <!-- Metrics Telemetry Bar -->
      <div class="metrics-grid mt-6 pa-4 rounded-xl">
        <v-row density="compact" align="center">
          <v-col cols="6" sm="3">
            <div class="d-flex align-center">
              <v-icon icon="mdi-rocket-outline" size="20" color="primary" class="me-3" />
              <div>
                <div class="text-caption text-disabled text-uppercase font-weight-medium">Total Vehicles</div>
                <div class="text-h6 font-weight-bold font-mono text-white">{{ allRockets.length }}</div>
              </div>
            </div>
          </v-col>

          <v-divider vertical class="d-none d-sm-block my-2" />

          <v-col cols="6" sm="3">
            <div class="d-flex align-center">
              <v-icon icon="mdi-filter-check-outline" size="20" color="info" class="me-3" />
              <div>
                <div class="text-caption text-disabled text-uppercase font-weight-medium">Visible / Filtered</div>
                <div class="text-h6 font-weight-bold font-mono text-primary">{{ filteredRockets.length }}</div>
              </div>
            </div>
          </v-col>

          <v-divider vertical class="d-none d-sm-block my-2" />

          <v-col cols="6" sm="3">
            <div class="d-flex align-center">
              <v-icon icon="mdi-database-clock-outline" size="20" color="secondary" class="me-3" />
              <div>
                <div class="text-caption text-disabled text-uppercase font-weight-medium">Local Vehicles</div>
                <div class="text-h6 font-weight-bold font-mono text-secondary">{{ state.localRockets.length }}</div>
              </div>
            </div>
          </v-col>

          <v-divider vertical class="d-none d-sm-block my-2" />

          <v-col cols="6" sm="3">
            <div class="d-flex align-center">
              <v-icon icon="mdi-orbit" size="20" color="success" class="me-3" />
              <div>
                <div class="text-caption text-disabled text-uppercase font-weight-medium">Mission Status</div>
                <div class="text-h6 font-weight-bold font-mono text-success">READY</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </header>

    <!-- Search & Filter Controls -->
    <section class="mb-8">
      <RocketFilter
        :search-query="state.searchQuery"
        :selected-country="state.selectedCountry"
        :available-countries="availableCountries"
        @update:search-query="setSearchQuery"
        @update:selected-country="setSelectedCountry"
        @reset="resetFilter"
      />
    </section>

    <!-- UI State Views -->
    <main>
      <!-- Loading State -->
      <LoadingState v-if="state.isLoading" />

      <!-- Error State -->
      <ErrorState
        v-else-if="state.error"
        :message="state.error"
        @retry="onRetry"
      />

      <!-- Empty State -->
      <EmptyState
        v-else-if="filteredRockets.length === 0"
        @reset="resetFilter"
      />

      <!-- Success Grid -->
      <RocketGrid
        v-else
        :rockets="filteredRockets"
      />
    </main>

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
  allRockets,
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
.max-width-1280 {
  max-width: 1280px;
  margin: 0 auto;
}

.max-width-700 {
  max-width: 700px;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}

.aerospace-title {
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #ffffff 40%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-slate {
  color: #94a3b8 !important;
  line-height: 1.6;
}

.telemetry-badge {
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.telemetry-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
  display: inline-block;
  animation: pulse-dot 2s infinite ease-in-out;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.85);
  }
}

.metrics-grid {
  background: rgba(13, 21, 39, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
}

.add-rocket-btn {
  background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%) !important;
  color: #070b14 !important;
  box-shadow: 0 4px 18px rgba(56, 189, 248, 0.35) !important;
  transition: all 0.2s ease-in-out;
}

.add-rocket-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(56, 189, 248, 0.45) !important;
}
</style>
