<template>
  <v-dialog :model-value="modelValue" max-width="600" persistent @update:model-value="onUpdateModelValue">
    <v-card class="rounded-lg">
      <v-card-title class="d-flex align-center justify-space-between bg-primary text-white px-6 py-4">
        <div class="d-flex align-center">
          <v-icon icon="mdi-rocket-launch" class="me-2" />
          <span class="text-h6 font-weight-bold">Add New Rocket</span>
        </div>
        <v-btn icon="mdi-close" variant="text" color="white" density="compact" @click="closeDialog" />
      </v-card-title>

      <v-card-text class="pa-6">
        <v-alert
          type="info"
          variant="tonal"
          density="comfortable"
          class="mb-4 text-caption"
          icon="mdi-information-outline"
        >
          API is read-only. Added rocket will be stored in local memory for this session and appear immediately in the list and detail view.
        </v-alert>

        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm">
          <v-row density="comfortable">
            <v-col cols="12">
              <v-text-field
                v-model="form.fullName"
                label="Rocket Full Name *"
                placeholder="e.g. Falcon Heavy Block 5"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-rocket-outline"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                placeholder="e.g. Heavy-lift launch vehicle designed to carry large payloads to orbit."
                variant="outlined"
                density="comfortable"
                rows="3"
                prepend-inner-icon="mdi-text"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.launchCost"
                label="Cost per Launch"
                placeholder="e.g. $90,000,000"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-currency-usd"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.countryCode"
                label="Country Code"
                placeholder="e.g. USA"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-flag-outline"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.maidenFlight"
                label="First Flight Date"
                type="date"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.imageUrl"
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-image-outline"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer />
        <v-btn color="grey-darken-1" variant="text" @click="closeDialog">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-plus"
          :disabled="!isFormValid"
          @click="submitForm"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'add-rocket', rocket: NewRocketInput): void
}>()

const formRef = ref()
const isFormValid = ref(false)

const form = reactive<NewRocketInput>({
  fullName: '',
  description: '',
  launchCost: '',
  countryCode: 'USA',
  maidenFlight: '',
  imageUrl: '',
})

const rules = {
  required: (v: string) => Boolean(v && v.trim()) || 'Rocket full name is required',
}

function resetForm() {
  form.fullName = ''
  form.description = ''
  form.launchCost = ''
  form.countryCode = 'USA'
  form.maidenFlight = ''
  form.imageUrl = ''
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

function closeDialog() {
  resetForm()
  emit('update:modelValue', false)
}

function onUpdateModelValue(val: boolean) {
  if (!val) {
    closeDialog()
  }
}

function submitForm() {
  if (!form.fullName.trim()) return

  emit('add-rocket', {
    fullName: form.fullName.trim(),
    description: form.description?.trim() || undefined,
    launchCost: form.launchCost?.trim() || undefined,
    countryCode: form.countryCode?.trim() || undefined,
    maidenFlight: form.maidenFlight?.trim() || undefined,
    imageUrl: form.imageUrl?.trim() || undefined,
  })

  closeDialog()
}
</script>
