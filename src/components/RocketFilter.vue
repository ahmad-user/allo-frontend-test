<template>
  <v-card variant="flat" color="transparent" class="mb-4">
    <v-row align="center" density="compact">
      <!-- Search Input -->
      <v-col cols="12" md="7">
        <v-text-field
          :model-value="searchQuery"
          label="Search SpaceX rockets by name or description..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          variant="outlined"
          density="comfortable"
          @update:model-value="onSearchChange"
        />
      </v-col>

      <!-- Country Filter Select -->
      <v-col cols="12" sm="8" md="3">
        <v-select
          :model-value="selectedCountry"
          :items="countryOptions"
          label="Filter by Country"
          prepend-inner-icon="mdi-flag-outline"
          clearable
          hide-details
          variant="outlined"
          density="comfortable"
          @update:model-value="onCountryChange"
        />
      </v-col>

      <!-- Clear Button -->
      <v-col cols="12" sm="4" md="2" class="d-flex justify-end">
        <v-btn
          v-if="hasActiveFilter"
          color="secondary"
          variant="text"
          prepend-icon="mdi-filter-off-outline"
          block
          @click="onReset"
        >
          Clear Filters
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
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
    title: code === 'USA' ? 'USA 🇺🇸' : code,
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
  emit('update:selectedCountry',val)
}

function onReset() {
  emit('reset')
}
</script>
