<template>
  <div class="filter-panel pa-3 pa-sm-4 rounded-xl mb-6">
    <v-row align="center" density="comfortable">
      <!-- Search Input -->
      <v-col cols="12" md="7">
        <v-text-field
          :model-value="searchQuery"
          placeholder="Search SpaceX fleet by vehicle name, serial, or specs..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="aerospace-input"
          @update:model-value="onSearchChange"
        />
      </v-col>

      <!-- Country Filter Select -->
      <v-col cols="12" :sm="hasActiveFilter ? 7 : 12" :md="hasActiveFilter ? 3 : 5">
        <v-select
          :model-value="selectedCountry"
          :items="countryOptions"
          label="Filter by Country"
          prepend-inner-icon="mdi-flag-outline"
          clearable
          hide-details
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="aerospace-input"
          @update:model-value="onCountryChange"
        />
      </v-col>

      <!-- Clear Button (Smoothly rendered when filter is active) -->
      <v-col
        v-if="hasActiveFilter"
        cols="12"
        sm="5"
        md="2"
        class="d-flex align-center justify-end"
      >
        <v-btn
          color="error"
          variant="tonal"
          prepend-icon="mdi-filter-off-outline"
          block
          rounded="lg"
          density="comfortable"
          class="clear-filters-btn font-weight-medium text-none"
          @click="onReset"
        >
          Reset Filter
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  searchQuery: string
  selectedCountry: string | null
  availableCountries: string[]
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:selectedCountry', val: string | null): void
  (e: 'reset'): void
}>()

const countryOptions = computed(() => {
  return props.availableCountries.map((code) => ({
    title: code === 'USA' ? 'United States 🇺🇸' : code,
    value: code,
  }))
})

const hasActiveFilter = computed(() => {
  return Boolean(props.searchQuery || props.selectedCountry)
})

function onSearchChange(val: string | null) {
  emit('update:searchQuery', val || '')
}

function onCountryChange(val: string | null) {
  emit('update:selectedCountry', val)
}

function onReset() {
  emit('reset')
}
</script>

<style scoped>
.filter-panel {
  background: rgba(13, 21, 39, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(56, 189, 248, 0.12);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
}

:deep(.aerospace-input .v-field) {
  background-color: rgba(7, 11, 20, 0.6) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  transition: all 0.2s ease-in-out;
}

:deep(.aerospace-input .v-field--focused) {
  border-color: #38bdf8 !important;
  box-shadow: 0 0 0 1px #38bdf8, 0 0 12px rgba(56, 189, 248, 0.25) !important;
}

:deep(.aerospace-input .v-field__outline) {
  --v-field-border-opacity: 0.15;
}

:deep(.aerospace-input .v-field__input) {
  font-size: 0.95rem;
  color: #f1f5f9;
}

.clear-filters-btn {
  border: 1px solid rgba(248, 113, 113, 0.2);
  background: rgba(248, 113, 113, 0.08) !important;
  color: #fca5a5 !important;
  height: 44px;
}

.clear-filters-btn:hover {
  background: rgba(248, 113, 113, 0.18) !important;
}
</style>
