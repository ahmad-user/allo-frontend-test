<template>
  <v-row>
    <v-col
      v-for="rocket in rockets"
      :key="rocket.id"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <RocketCard :rocket="rocket" />
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
