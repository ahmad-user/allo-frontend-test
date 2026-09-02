<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    elevation="2"
    hover
    @click="navigateToDetail"
  >
    <div class="card-media-wrapper position-relative">
      <v-img
        :src="displayImage"
        height="220"
        cover
        class="bg-grey-lighten-3"
        @error="onImageError"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
            <v-progress-circular color="primary" indeterminate size="32" />
          </div>
        </template>
      </v-img>

      <v-chip
        v-if="rocket.isLocal"
        color="info"
        size="small"
        variant="elevated"
        class="position-absolute top-0 right-0 ma-2"
      >
        Local Rocket
      </v-chip>
      <v-chip
        v-else
        color="primary"
        size="small"
        variant="elevated"
        class="position-absolute top-0 right-0 ma-2"
      >
        SpaceX API
      </v-chip>
    </div>

    <v-card-item class="pb-1">
      <v-card-title class="text-h6 font-weight-bold text-truncate">
        {{ rocket.fullName }}
      </v-card-title>
      <v-card-subtitle v-if="rocket.countryCode" class="d-flex align-center mt-1">
        <v-icon icon="mdi-map-marker-outline" size="16" class="me-1" />
        {{ rocket.countryCode }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1 pt-1">
      <p class="text-body-2 text-medium-emphasis line-clamp-3 mb-0">
        {{ displayDescription }}
      </p>
    </v-card-text>

    <v-divider />

    <v-card-actions class="px-4 py-3 bg-grey-lighten-4">
      <span class="text-caption text-medium-emphasis">
        <v-icon icon="mdi-rocket-launch-outline" size="14" class="me-1" />
        {{ displayFlight }}
      </span>
      <v-spacer />
      <v-btn
        color="primary"
        variant="text"
        size="small"
        append-icon="mdi-chevron-right"
      >
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

// SVG Placeholder fallback if image is missing or fails to load
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220" fill="%23e0e0e0"><rect width="100%" height="100%" fill="%23eeeeee"/><path d="M200 60 L240 140 L160 140 Z" fill="%239e9e9e"/><circle cx="200" cy="110" r="15" fill="%23e0e0e0"/><text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23757575">No Rocket Image</text></svg>'

const imageFailed = ref(false)

const displayImage = computed(() => {
  if (imageFailed.value || !props.rocket.imageUrl) {
    return PLACEHOLDER_IMAGE
  }
  return props.rocket.imageUrl
})

const displayDescription = computed(() => {
  return props.rocket.description || 'No description available.'
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
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}
.rocket-card:hover {
  transform: translateY(-4px);
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
