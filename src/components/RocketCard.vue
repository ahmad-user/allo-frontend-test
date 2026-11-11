<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column rounded-xl"
    elevation="0"
    hover
    @click="navigateToDetail"
  >
    <!-- Media Wrapper with Aerospace Cinematic Overlay -->
    <div class="card-media-wrapper position-relative">
      <v-img
        :src="displayImage"
        height="220"
        cover
        class="rocket-img bg-surface-variant"
        @error="onImageError"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-surface-variant">
            <v-progress-circular color="primary" indeterminate size="32" width="2" />
          </div>
        </template>
      </v-img>

      <!-- Gradient Fade Overlay -->
      <div class="media-gradient-overlay position-absolute fill-height w-100 top-0 left-0" />

      <!-- Origin Badge -->
      <div class="position-absolute top-0 right-0 ma-3 z-index-2">
        <span
          v-if="rocket.isLocal"
          class="badge-pill badge-local font-mono d-inline-flex align-center px-2 py-1 rounded-pill"
        >
          <span class="badge-dot dot-local me-1" />
          Local Rocket
        </span>
        <span
          v-else
          class="badge-pill badge-api font-mono d-inline-flex align-center px-2 py-1 rounded-pill"
        >
          <v-icon icon="mdi-satellite-variant" size="12" class="me-1" />
          SpaceX API
        </span>
      </div>

      <!-- Quick Country Badge (Overlaid on Bottom Left of Image) -->
      <div v-if="rocket.countryCode" class="position-absolute bottom-0 left-0 ma-3 z-index-2">
        <span class="country-tag font-mono d-inline-flex align-center px-2 py-1 rounded">
          <v-icon icon="mdi-map-marker-outline" size="12" class="me-1 text-primary" />
          {{ rocket.countryCode }}
        </span>
      </div>
    </div>

    <!-- Content Body -->
    <v-card-item class="pt-4 pb-2 px-4">
      <v-card-title class="text-h6 font-weight-bold text-white text-truncate aerospace-card-title">
        {{ rocket.fullName }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-1 pb-4 px-4">
      <p class="text-body-2 text-slate-card line-clamp-3 mb-0">
        {{ displayDescription }}
      </p>
    </v-card-text>

    <!-- Unified Dark Footer (Replacing the former bright white bar) -->
    <div class="card-footer px-4 py-3 d-flex align-center justify-space-between">
      <div class="d-flex align-center text-caption text-slate-card">
        <v-icon icon="mdi-calendar-clock-outline" size="15" class="me-1 text-primary opacity-80" />
        <span class="font-mono text-truncate">{{ displayFlight }}</span>
      </div>

      <div class="details-cta d-flex align-center text-caption font-weight-bold text-primary">
        <span>Details</span>
        <v-icon icon="mdi-arrow-right" size="15" class="cta-arrow ms-1" />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

// SVG Placeholder fallback if image is missing or fails to load
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220" fill="%230d1527"><rect width="100%" height="100%" fill="%230d1527"/><circle cx="200" cy="95" r="45" fill="%23131f38"/><path d="M200 60 L230 120 L170 120 Z" fill="%2338bdf8" opacity="0.8"/><circle cx="200" cy="95" r="8" fill="%23070b14"/><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="600" fill="%2364748b" letter-spacing="1">IMAGE NOT AVAILABLE</text></svg>'

const imageFailed = ref(false)

// Reset error state when rocket ID or image URL changes
watch(
  () => [props.rocket.id, props.rocket.imageUrl],
  () => {
    imageFailed.value = false
  }
)

const displayImage = computed(() => {
  if (imageFailed.value || !props.rocket.imageUrl) {
    return PLACEHOLDER_IMAGE
  }
  return props.rocket.imageUrl
})

const displayDescription = computed(() => {
  return props.rocket.description || 'No description available for this launch vehicle configuration.'
})

const displayFlight = computed(() => {
  return props.rocket.maidenFlight || 'Date unknown'
})

function onImageError() {
  imageFailed.value = true
}

function navigateToDetail() {
  router.push(`/rockets/${props.rocket.id}`)
}
</script>

<style scoped>
.rocket-card {
  background: #0d1527 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.rocket-card:hover {
  transform: translateY(-5px);
  border-color: rgba(56, 189, 248, 0.4) !important;
  box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.7), 0 0 20px -3px rgba(56, 189, 248, 0.2) !important;
}

.card-media-wrapper {
  overflow: hidden;
  background-color: #0d1527;
}

.rocket-img {
  transition: transform 0.4s ease-out;
}

.rocket-card:hover .rocket-img {
  transform: scale(1.04);
}

.media-gradient-overlay {
  background: linear-gradient(180deg, rgba(7, 11, 20, 0.2) 0%, rgba(13, 21, 39, 0.4) 60%, #0d1527 100%);
  pointer-events: none;
}

.z-index-2 {
  z-index: 2;
}

.badge-pill {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  backdrop-filter: blur(8px);
}

.badge-api {
  background: rgba(13, 21, 39, 0.85);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #38bdf8;
}

.badge-local {
  background: rgba(13, 21, 39, 0.85);
  border: 1px solid rgba(52, 211, 153, 0.3);
  color: #34d399;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.dot-local {
  background-color: #34d399;
  box-shadow: 0 0 6px #34d399;
}

.country-tag {
  background: rgba(7, 11, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  font-size: 0.75rem;
  backdrop-filter: blur(6px);
}

.aerospace-card-title {
  letter-spacing: -0.01em;
  color: #ffffff;
}

.text-slate-card {
  color: #94a3b8 !important;
  line-height: 1.55;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  background: rgba(7, 11, 20, 0.55);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.details-cta {
  transition: transform 0.2s ease;
}

.cta-arrow {
  transition: transform 0.2s ease;
}

.rocket-card:hover .cta-arrow {
  transform: translateX(3px);
}
</style>
