<template>
  <v-container class="py-8 px-4 px-sm-6 max-width-1100">
    <!-- Top Navigation Bar -->
    <div class="d-flex align-center justify-space-between flex-wrap gap-3 mb-6">
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-arrow-left"
        class="back-btn font-weight-bold text-none px-4 rounded-lg"
        @click="goBack"
      >
        Back to Fleet Directory
      </v-btn>

      <div v-if="rocket" class="font-mono text-caption text-slate-muted d-none d-sm-block">
        MISSION TELEMETRY // ID: <span class="text-primary font-weight-bold">{{ rocket.id }}</span>
      </div>
    </div>

    <!-- Loading State with Aerospace Skeleton -->
    <v-card v-if="isLoading" variant="flat" class="detail-loading-panel pa-8 text-center rounded-2xl">
      <v-progress-circular color="primary" size="56" width="3" indeterminate class="mb-4" />
      <div class="text-h6 font-weight-bold text-white mb-1">Loading Launch Vehicle Telemetry...</div>
      <div class="text-caption text-slate-muted font-mono">Fetching configuration from Launch Library 2</div>

      <div class="mt-8">
        <v-skeleton-loader type="image" height="280" class="rounded-xl mb-6 bg-surface-variant" />
        <v-skeleton-loader type="article, actions" class="rounded-xl bg-surface-variant" />
      </div>
    </v-card>

    <!-- Error State -->
    <ErrorState
      v-else-if="error"
      title="Vehicle Telemetry Unavailable"
      :message="error"
      @retry="onRetry"
    />

    <!-- Detail View Success -->
    <v-card v-else-if="rocket" elevation="0" class="detail-card rounded-2xl overflow-hidden">
      <!-- Media Header Banner -->
      <div class="media-banner-wrapper position-relative">
        <v-img
          :src="displayImage"
          height="400"
          cover
          class="rocket-detail-img bg-surface-variant"
          @error="onImageError"
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height bg-surface-variant">
              <v-progress-circular color="primary" indeterminate size="48" width="3" />
            </div>
          </template>
        </v-img>

        <!-- Banner Dark Vignette Gradient -->
        <div class="banner-gradient position-absolute fill-height w-100 top-0 left-0" />

        <!-- Floating Origin Badge -->
        <div class="position-absolute top-0 right-0 ma-4 z-index-2">
          <span
            v-if="rocket.isLocal"
            class="badge-pill badge-local font-mono d-inline-flex align-center px-3 py-1-5 rounded-pill"
          >
            <span class="badge-dot dot-local me-2" />
            Local Vehicle Specification
          </span>
          <span
            v-else
            class="badge-pill badge-api font-mono d-inline-flex align-center px-3 py-1-5 rounded-pill"
          >
            <v-icon icon="mdi-satellite-variant" size="14" class="me-2" />
            SpaceX Official API
          </span>
        </div>

        <!-- Floating Category Pill Bottom Left -->
        <div class="position-absolute bottom-0 left-0 ma-4 ma-sm-6 z-index-2">
          <div class="d-flex align-center gap-2">
            <span class="category-pill font-mono d-inline-flex align-center px-3 py-1 rounded">
              <v-icon icon="mdi-orbit" size="14" class="me-1 text-primary" />
              Orbital Launch Vehicle
            </span>
            <span v-if="rocket.reusable !== null && rocket.reusable !== undefined" class="category-pill font-mono d-inline-flex align-center px-3 py-1 rounded">
              <v-icon :icon="rocket.reusable ? 'mdi-recycle' : 'mdi-package-down'" size="14" class="me-1" :class="rocket.reusable ? 'text-success' : 'text-warning'" />
              {{ rocket.reusable ? 'Reusable First Stage' : 'Expendable' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Main Content Details -->
      <div class="pa-6 pa-md-8">
        <!-- Title & Header Bar -->
        <div class="mb-6">
          <div class="text-caption font-mono text-primary text-uppercase font-weight-bold mb-1 tracking-wider">
            SpaceX Launch Platform
          </div>
          <h1 class="text-h3 font-weight-black text-white aerospace-detail-title">
            {{ rocket.fullName }}
          </h1>
        </div>

        <v-divider class="detail-divider mb-8" />

        <!-- High-Impact Aerospace Metrics Grid -->
        <v-row class="mb-8">
          <!-- Cost per Launch Metric Card -->
          <v-col cols="12" sm="4">
            <div class="metric-card pa-5 rounded-xl h-100">
              <div class="d-flex align-center justify-space-between mb-3">
                <span class="text-caption font-mono font-weight-bold text-uppercase text-slate-muted">
                  Cost per Launch
                </span>
                <v-icon icon="mdi-currency-usd" size="20" color="primary" />
              </div>
              <div class="text-h5 font-weight-black font-mono text-primary">
                {{ displayCost }}
              </div>
              <div class="text-caption text-slate-muted mt-1">
                Estimated launch cost per mission
              </div>
            </div>
          </v-col>

          <!-- Country Metric Card -->
          <v-col cols="12" sm="4">
            <div class="metric-card pa-5 rounded-xl h-100">
              <div class="d-flex align-center justify-space-between mb-3">
                <span class="text-caption font-mono font-weight-bold text-uppercase text-slate-muted">
                  Country of Origin
                </span>
                <v-icon icon="mdi-flag-outline" size="20" color="secondary" />
              </div>
              <div class="text-h5 font-weight-black font-mono text-white">
                {{ displayCountry }}
              </div>
              <div class="text-caption text-slate-muted mt-1">
                Manufacturer jurisdiction
              </div>
            </div>
          </v-col>

          <!-- First Flight Metric Card -->
          <v-col cols="12" sm="4">
            <div class="metric-card pa-5 rounded-xl h-100">
              <div class="d-flex align-center justify-space-between mb-3">
                <span class="text-caption font-mono font-weight-bold text-uppercase text-slate-muted">
                  First Flight
                </span>
                <v-icon icon="mdi-calendar-star-outline" size="20" color="info" />
              </div>
              <div class="text-h5 font-weight-black font-mono text-white">
                {{ displayFirstFlight }}
              </div>
              <div class="text-caption text-slate-muted mt-1">
                Maiden orbital mission date
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Description Section -->
        <div class="description-section pa-6 rounded-xl">
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-text-box-search-outline" color="primary" size="22" class="me-2" />
            <h2 class="text-h6 font-weight-bold text-white mb-0">
              Engineering & Mission Overview
            </h2>
          </div>
          <p class="text-body-1 text-slate-body leading-relaxed mb-0">
            {{ displayDescription }}
          </p>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/state/rocketStore'
import type { Rocket } from '@/types/rocket'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const { getRocketById, state: storeState } = useRocketStore()

const rocket = ref<Rocket | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const imageFailed = ref(false)

// Reset error state when rocket ID or image URL changes
watch(
  () => [rocket.value?.id, rocket.value?.imageUrl],
  () => {
    imageFailed.value = false
  }
)

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="380" viewBox="0 0 800 380" fill="%230d1527"><rect width="100%" height="100%" fill="%230d1527"/><circle cx="400" cy="170" r="70" fill="%23131f38"/><path d="M400 110 L450 210 L350 210 Z" fill="%2338bdf8" opacity="0.8"/><circle cx="400" cy="170" r="14" fill="%23070b14"/><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="600" fill="%2364748b" letter-spacing="1.5">IMAGE NOT AVAILABLE</text></svg>'

const displayImage = computed(() => {
  if (imageFailed.value || !rocket.value?.imageUrl) {
    return PLACEHOLDER_IMAGE
  }
  return rocket.value.imageUrl
})

const displayDescription = computed(() => {
  return rocket.value?.description?.trim() || 'No detailed mission specification or description is currently recorded for this configuration.'
})

const displayCost = computed(() => {
  if (!rocket.value?.launchCost) return 'Not available'
  const costStr = rocket.value.launchCost.trim()
  if (!costStr) return 'Not available'
  if (costStr.startsWith('$')) return costStr
  const num = Number(costStr.replace(/[^0-9.]/g, ''))
  if (!isNaN(num) && num > 0) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
  }
  return costStr || 'Not available'
})

const displayCountry = computed(() => {
  if (!rocket.value?.countryCode) return 'Not available'
  const code = rocket.value.countryCode.trim()
  return code ? (code === 'USA' ? 'United States 🇺🇸' : code) : 'Not available'
})

const displayFirstFlight = computed(() => {
  if (!rocket.value?.maidenFlight) return 'Not available'
  const flightStr = rocket.value.maidenFlight.trim()
  return flightStr || 'Not available'
})

async function loadDetail(force = false) {
  const params = route.params as Record<string, any>
  const idParam = params.id as string

  // Clean up any stale rocket data and state immediately
  rocket.value = null
  imageFailed.value = false

  if (!idParam) {
    error.value = 'Invalid rocket ID.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const data = await getRocketById(idParam, force)
    if (!data) {
      rocket.value = null
      error.value = storeState.detailError || `Launch vehicle with ID "${idParam}" could not be located in telemetry database.`
    } else {
      rocket.value = data
    }
  } catch (err: any) {
    rocket.value = null
    error.value = err?.message || 'Failed to load vehicle telemetry.'
  } finally {
    isLoading.value = false
  }
}

function onRetry() {
  loadDetail(true)
}

function onImageError() {
  imageFailed.value = true
}

function goBack() {
  router.push('/')
}

onMounted(() => {
  loadDetail()
})

onBeforeUnmount(() => {
  rocket.value = null
  error.value = null
  imageFailed.value = false
})

watch(
  () => (route.params as Record<string, any>).id,
  (newId, oldId) => {
    if (newId !== oldId) {
      rocket.value = null
      error.value = null
      imageFailed.value = false
      loadDetail()
    }
  }
)
</script>

<style scoped>
.max-width-1100 {
  max-width: 1100px;
  margin: 0 auto;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.back-btn {
  background: rgba(56, 189, 248, 0.08) !important;
  border: 1px solid rgba(56, 189, 248, 0.25) !important;
  color: #38bdf8 !important;
}

.back-btn:hover {
  background: rgba(56, 189, 248, 0.16) !important;
}

.detail-card {
  background: #0d1527 !important;
  border: 1px solid rgba(56, 189, 248, 0.15) !important;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7);
}

.detail-loading-panel {
  background: #0d1527 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.media-banner-wrapper {
  overflow: hidden;
  background-color: #070b14;
}

.rocket-detail-img {
  transition: transform 0.6s ease;
}

.banner-gradient {
  background: linear-gradient(180deg, rgba(7, 11, 20, 0.2) 0%, rgba(13, 21, 39, 0.5) 60%, #0d1527 100%);
  pointer-events: none;
}

.z-index-2 {
  z-index: 2;
}

.badge-pill {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  backdrop-filter: blur(8px);
}

.badge-api {
  background: rgba(13, 21, 39, 0.9);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #38bdf8;
}

.badge-local {
  background: rgba(13, 21, 39, 0.9);
  border: 1px solid rgba(52, 211, 153, 0.35);
  color: #34d399;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.dot-local {
  background-color: #34d399;
  box-shadow: 0 0 8px #34d399;
}

.category-pill {
  background: rgba(7, 11, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  font-size: 0.75rem;
  backdrop-filter: blur(8px);
}

.aerospace-detail-title {
  letter-spacing: -0.02em;
  color: #ffffff;
}

.detail-divider {
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.metric-card {
  background: rgba(16, 27, 51, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.metric-card:hover {
  border-color: rgba(56, 189, 248, 0.3);
  transform: translateY(-2px);
}

.description-section {
  background: rgba(16, 27, 51, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.text-slate-muted {
  color: #94a3b8 !important;
}

.text-slate-body {
  color: #cbd5e1 !important;
}

.leading-relaxed {
  line-height: 1.8;
}
</style>
