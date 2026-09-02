<template>
  <v-container class="py-6 px-4 px-sm-6 max-width-1000">
    <!-- Back Button -->
    <v-btn
      color="primary"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      @click="goBack"
    >
      Back to Rocket List
    </v-btn>

    <!-- Loading State -->
    <v-card v-if="isLoading" variant="flat" class="pa-8 text-center rounded-lg">
      <v-progress-circular color="primary" size="64" width="6" indeterminate class="mb-4" />
      <div class="text-h6 text-medium-emphasis">Loading Rocket Details...</div>
    </v-card>

    <!-- Error State -->
    <ErrorState
      v-else-if="error"
      title="Rocket Not Found"
      :message="error"
      @retry="loadDetail"
    />

    <!-- Detail View Success -->
    <v-card v-else-if="rocket" elevation="3" class="rounded-xl overflow-hidden">
      <!-- Media Header Banner -->
      <div class="position-relative">
        <v-img
          :src="displayImage"
          height="380"
          cover
          class="bg-grey-lighten-3"
          @error="onImageError"
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
              <v-progress-circular color="primary" indeterminate size="48" />
            </div>
          </template>
        </v-img>

        <v-chip
          v-if="rocket.isLocal"
          color="info"
          size="medium"
          variant="elevated"
          class="position-absolute top-0 right-0 ma-4"
        >
          Local Rocket
        </v-chip>
        <v-chip
          v-else
          color="primary"
          size="medium"
          variant="elevated"
          class="position-absolute top-0 right-0 ma-4"
        >
          SpaceX API
        </v-chip>
      </div>

      <!-- Main Content -->
      <v-card-text class="pa-6 pa-md-8">
        <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-4">
          <h1 class="text-h3 font-weight-bold text-primary">
            {{ rocket.fullName }}
          </h1>
        </div>

        <v-divider class="mb-6" />

        <!-- Info Grid Cards -->
        <v-row class="mb-6">
          <!-- Cost per Launch -->
          <v-col cols="12" sm="4">
            <v-card variant="tonal" color="primary" class="pa-4 rounded-lg h-100">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-currency-usd" color="primary" class="me-2" />
                <span class="text-caption font-weight-medium text-uppercase text-medium-emphasis">
                  Cost per Launch
                </span>
              </div>
              <div class="text-h6 font-weight-bold">
                {{ displayCost }}
              </div>
            </v-card>
          </v-col>

          <!-- Country -->
          <v-col cols="12" sm="4">
            <v-card variant="tonal" color="secondary" class="pa-4 rounded-lg h-100">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-map-marker-outline" color="secondary" class="me-2" />
                <span class="text-caption font-weight-medium text-uppercase text-medium-emphasis">
                  Country
                </span>
              </div>
              <div class="text-h6 font-weight-bold">
                {{ displayCountry }}
              </div>
            </v-card>
          </v-col>

          <!-- First Flight -->
          <v-col cols="12" sm="4">
            <v-card variant="tonal" color="info" class="pa-4 rounded-lg h-100">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-calendar-range" color="info" class="me-2" />
                <span class="text-caption font-weight-medium text-uppercase text-medium-emphasis">
                  First Flight
                </span>
              </div>
              <div class="text-h6 font-weight-bold">
                {{ displayFirstFlight }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Description Section -->
        <div>
          <h2 class="text-h6 font-weight-bold mb-2 text-grey-darken-3">
            Description
          </h2>
          <p class="text-body-1 text-grey-darken-2 leading-relaxed">
            {{ displayDescription }}
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
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

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="380" viewBox="0 0 800 380" fill="%23e0e0e0"><rect width="100%" height="100%" fill="%23eeeeee"/><path d="M400 100 L480 260 L320 260 Z" fill="%239e9e9e"/><circle cx="400" cy="190" r="30" fill="%23e0e0e0"/><text x="50%" y="82%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23757575">No Rocket Image Available</text></svg>'

const displayImage = computed(() => {
  if (imageFailed.value || !rocket.value?.imageUrl) {
    return PLACEHOLDER_IMAGE
  }
  return rocket.value.imageUrl
})

const displayDescription = computed(() => {
  return rocket.value?.description?.trim() || 'No description available.'
})

const displayCost = computed(() => {
  if (!rocket.value?.launchCost) return 'Not available.'
  const costStr = rocket.value.launchCost.trim()
  if (!costStr) return 'Not available.'
  if (costStr.startsWith('$')) return costStr
  const num = Number(costStr.replace(/[^0-9.]/g, ''))
  if (!isNaN(num) && num > 0) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
  }
  return costStr || 'Not available.'
})

const displayCountry = computed(() => {
  if (!rocket.value?.countryCode) return 'Not available.'
  const code = rocket.value.countryCode.trim()
  return code ? (code === 'USA' ? 'USA 🇺🇸' : code) : 'Not available.'
})

const displayFirstFlight = computed(() => {
  if (!rocket.value?.maidenFlight) return 'Not available.'
  const flightStr = rocket.value.maidenFlight.trim()
  return flightStr || 'Not available.'
})

async function loadDetail() {
  const params = route.params as Record<string, any>
  const idParam = params.id as string
  if (!idParam) {
    error.value = 'Invalid rocket ID.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  error.value = null
  imageFailed.value = false

  try {
    const data = await getRocketById(idParam)
    if (!data) {
      error.value = storeState.detailError || `Rocket with ID "${idParam}" could not be found.`
    } else {
      rocket.value = data
    }
  } catch (err: any) {
    error.value = err?.message || 'Failed to load rocket detail.'
  } finally {
    isLoading.value = false
  }
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

watch(
  () => (route.params as Record<string, any>).id,
  () => {
    loadDetail()
  }
)
</script>

<style scoped>
.max-width-1000 {
  max-width: 1000px;
  margin: 0 auto;
}
.leading-relaxed {
  line-height: 1.7;
}
</style>
