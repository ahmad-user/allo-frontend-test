<template>
  <v-row class="rocket-grid-row">
    <v-col
      v-for="rocket in rockets"
      :key="rocket.id"
      cols="12"
      sm="6"
      lg="4"
      class="d-flex"
    >
      <RocketCard :rocket="rocket" class="w-100" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import type { Rocket } from '@/types/rocket'
import RocketCard from './RocketCard.vue'

defineProps<{
  rockets: Rocket[]
}>()
</script>

<style scoped>
.rocket-grid-row {
  margin-top: -12px;
  margin-bottom: 24px;
}
</style>
