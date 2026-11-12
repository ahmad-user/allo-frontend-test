<template>
  <v-dialog
    :model-value="modelValue"
    max-width="640"
    persistent
    class="add-rocket-dialog-wrapper"
    @update:model-value="onUpdateModelValue"
  >
    <v-card class="aerospace-dialog rounded-2xl overflow-hidden">
      <!-- Aerospace Dialog Header -->
      <div class="dialog-header px-6 py-5 d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <div class="header-icon-box pa-2 rounded-lg me-3 d-flex align-center justify-center">
            <v-icon icon="mdi-rocket-launch" color="primary" size="22" />
          </div>
          <div>
            <div class="text-caption font-mono text-primary text-uppercase font-weight-bold">Fleet Telemetry</div>
            <h2 class="text-h6 font-weight-bold text-white mb-0">Register Launch Vehicle</h2>
          </div>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          color="grey-lighten-1"
          density="comfortable"
          rounded="lg"
          @click="closeDialog"
        />
      </div>

      <v-divider class="dialog-divider" />

      <!-- Form Content -->
      <v-card-text class="pa-6">
        <div class="session-notice pa-3 rounded-lg mb-5 d-flex align-start">
          <v-icon icon="mdi-information-outline" size="18" color="primary" class="me-2 mt-0-5" />
          <div class="text-caption text-slate-notice">
            <strong>Local Vehicle Specification:</strong> The SpaceX API is read-only. Added vehicles will be stored locally in memory for this session and will immediately appear in the catalog.
          </div>
        </div>

        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="submitForm">
          <v-row density="comfortable">
            <!-- Full Name -->
            <v-col cols="12">
              <label class="input-label text-caption font-mono font-weight-bold text-slate-label mb-1 d-block">
                VEHICLE FULL NAME *
              </label>
              <v-text-field
                v-model="form.fullName"
                placeholder="e.g. Falcon Heavy Block 5"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                :rules="rules.fullName"
                prepend-inner-icon="mdi-rocket-outline"
                class="aerospace-form-input"
                required
              />
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <label class="input-label text-caption font-mono font-weight-bold text-slate-label mb-1 d-block">
                MISSION OVERVIEW & SPECS
              </label>
              <v-textarea
                v-model="form.description"
                placeholder="e.g. Heavy-lift launch vehicle designed to carry massive payloads into geostationary transfer orbit..."
                variant="outlined"
                density="comfortable"
                rounded="lg"
                rows="3"
                :rules="rules.description"
                prepend-inner-icon="mdi-text"
                class="aerospace-form-input"
              />
            </v-col>

            <!-- Launch Cost -->
            <v-col cols="12" sm="6">
              <label class="input-label text-caption font-mono font-weight-bold text-slate-label mb-1 d-block">
                ESTIMATED COST PER LAUNCH
              </label>
              <v-text-field
                v-model="form.launchCost"
                placeholder="e.g. $90,000,000"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                :rules="rules.launchCost"
                prepend-inner-icon="mdi-currency-usd"
                class="aerospace-form-input"
              />
            </v-col>

            <!-- Country Code -->
            <v-col cols="12" sm="6">
              <label class="input-label text-caption font-mono font-weight-bold text-slate-label mb-1 d-block">
                COUNTRY CODE
              </label>
              <v-text-field
                v-model="form.countryCode"
                placeholder="e.g. USA"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                :rules="rules.countryCode"
                prepend-inner-icon="mdi-flag-outline"
                class="aerospace-form-input"
              />
            </v-col>

            <!-- First Flight -->
            <v-col cols="12" sm="6">
              <label class="input-label text-caption font-mono font-weight-bold text-slate-label mb-1 d-block">
                FIRST FLIGHT DATE
              </label>
              <v-text-field
                v-model="form.maidenFlight"
                type="date"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                :rules="rules.maidenFlight"
                prepend-inner-icon="mdi-calendar"
                class="aerospace-form-input"
              />
            </v-col>

            <!-- Image URL -->
            <v-col cols="12" sm="6">
              <label class="input-label text-caption font-mono font-weight-bold text-slate-label mb-1 d-block">
                IMAGE WEB URL
              </label>
              <v-text-field
                v-model="form.imageUrl"
                placeholder="https://example.com/rocket.jpg"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                :rules="rules.imageUrl"
                prepend-inner-icon="mdi-image-outline"
                class="aerospace-form-input"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider class="dialog-divider" />

      <!-- Aerospace Unified Dark Footer -->
      <div class="dialog-footer pa-4 px-6 d-flex align-center justify-end gap-3">
        <v-btn
          variant="tonal"
          color="grey-lighten-2"
          rounded="lg"
          class="cancel-btn font-weight-medium text-none px-4"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-plus"
          rounded="lg"
          elevation="0"
          :disabled="!isFormValid"
          class="submit-btn font-weight-bold text-none px-5"
          @click="submitForm"
        >
          Register Rocket
        </v-btn>
      </div>
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
  fullName: [
    (v: string) => Boolean(v && v.trim()) || 'Rocket full name is required',
    (v: string) => !v || v.trim().length >= 2 || 'Rocket full name must be at least 2 characters',
    (v: string) => !v || v.trim().length <= 100 || 'Rocket full name cannot exceed 100 characters',
  ],
  description: [
    (v: string) => !v || v.trim().length <= 2000 || 'Description cannot exceed 2000 characters',
  ],
  launchCost: [
    (v: string) =>
      !v ||
      !v.trim() ||
      /^\$?\s*\d[\d,]*(?:\.\d+)?$/.test(v.trim()) ||
      'Cost must be a valid positive amount (e.g. $90,000,000 or 90000000)',
  ],
  countryCode: [
    (v: string) =>
      !v ||
      !v.trim() ||
      /^[A-Za-z\s]{2,50}$/.test(v.trim()) ||
      'Country should contain 2-4 letters (e.g. USA, IDN)',
  ],
  maidenFlight: [
    (v: string) =>
      !v ||
      !v.trim() ||
      /^\d{4}-\d{2}-\d{2}$/.test(v.trim()) ||
      'Must be a valid date in YYYY-MM-DD format',
  ],
  imageUrl: [
    (v: string) =>
      !v ||
      !v.trim() ||
      /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v.trim()) ||
      'Must be a valid URL starting with http:// or https://',
  ],
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

async function submitForm() {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  const trimmedName = form.fullName ? form.fullName.trim() : ''
  if (!trimmedName) return

  emit('add-rocket', {
    fullName: trimmedName,
    description: form.description?.trim() || undefined,
    launchCost: form.launchCost?.trim() || undefined,
    countryCode: form.countryCode?.trim().toUpperCase() || undefined,
    maidenFlight: form.maidenFlight?.trim() || undefined,
    imageUrl: form.imageUrl?.trim() || undefined,
  })

  closeDialog()
}
</script>

<style scoped>
/* Vuetify places dialog content inside a teleported overlay. */
:deep(.add-rocket-dialog-wrapper .v-overlay__content) {
  max-height: calc(100vh - 48px);
  max-height: calc(100dvh - 48px);
  overflow: hidden;
}

.aerospace-dialog {
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: calc(100vh - 48px);
  max-height: calc(100dvh - 48px);
  overflow: hidden;
  background: #0d1527 !important;
  border: 1px solid rgba(56, 189, 248, 0.2) !important;
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 24px -4px rgba(56, 189, 248, 0.15) !important;
}

.dialog-header {
  flex: 0 0 auto;
  background: rgba(16, 27, 51, 0.95);
}

:deep(.aerospace-dialog > .v-card-text) {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.header-icon-box {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.dialog-divider {
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.session-notice {
  background: rgba(56, 189, 248, 0.06);
  border: 1px solid rgba(56, 189, 248, 0.18);
}

.text-slate-notice {
  color: #94a3b8;
  line-height: 1.5;
}

.text-slate-label {
  color: #94a3b8;
  letter-spacing: 0.05em;
  font-size: 0.72rem;
}

.mt-0-5 {
  margin-top: 2px;
}

:deep(.aerospace-form-input .v-field) {
  background-color: rgba(7, 11, 20, 0.6) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.aerospace-form-input .v-field--focused) {
  border-color: #38bdf8 !important;
  box-shadow: 0 0 0 1px #38bdf8, 0 0 10px rgba(56, 189, 248, 0.2) !important;
}

.dialog-footer {
  flex: 0 0 auto;
  background: rgba(7, 11, 20, 0.6);
}

.gap-3 {
  gap: 12px;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.submit-btn {
  background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%) !important;
  color: #070b14 !important;
  box-shadow: 0 4px 14px rgba(56, 189, 248, 0.3) !important;
}

.submit-btn:hover {
  box-shadow: 0 6px 20px rgba(56, 189, 248, 0.45) !important;
}
</style>
