import { reactive, computed } from 'vue'
import { rocketApi } from '@/services/rocketApi'
import type { Rocket, NewRocketInput } from '@/types/rocket'

interface RocketState {
  apiRockets: Rocket[]
  localRockets: Rocket[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  selectedCountry: string | null
  detailCache: Record<string | number, Rocket>
  detailLoading: boolean
  detailError: string | null
}

const state = reactive<RocketState>({
  apiRockets: [],
  localRockets: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCountry: null,
  detailCache: {},
  detailLoading: false,
  detailError: null,
})

// All rockets combined: local rockets first or appended
const allRockets = computed<Rocket[]>(() => [
  ...state.localRockets,
  ...state.apiRockets,
])

// Filtered rockets based on search query and country filter
const filteredRockets = computed<Rocket[]>(() => {
  const query = state.searchQuery.trim().toLowerCase()
  const country = state.selectedCountry

  return allRockets.value.filter((rocket) => {
    const matchesQuery =
      !query ||
      rocket.fullName.toLowerCase().includes(query) ||
      (rocket.description && rocket.description.toLowerCase().includes(query)) ||
      (rocket.countryCode && rocket.countryCode.toLowerCase().includes(query))

    const matchesCountry =
      !country ||
      (rocket.countryCode && rocket.countryCode.toUpperCase() === country.toUpperCase())

    return matchesQuery && matchesCountry
  })
})

// Available countries for filtering
const availableCountries = computed<string[]>(() => {
  const countries = new Set<string>()
  allRockets.value.forEach((rocket) => {
    if (rocket.countryCode) {
      countries.add(rocket.countryCode.toUpperCase())
    }
  })
  return Array.from(countries).sort()
})

export function useRocketStore() {
  async function fetchRockets(force = false) {
    if (!force && state.apiRockets.length > 0) {
      return
    }

    state.isLoading = true
    state.error = null

    try {
      const rockets = await rocketApi.getRockets()
      state.apiRockets = rockets
    } catch (err: any) {
      state.error = err?.message || 'An unexpected error occurred while loading rockets.'
    } finally {
      state.isLoading = false
    }
  }

  async function getRocketById(id: string | number, force = false): Promise<Rocket | null> {
    const idStr = String(id)

    if (force) {
      delete state.detailCache[idStr]
      state.detailError = null
    }

    // 1. Check local/loaded rockets first
    const existing = allRockets.value.find((r) => String(r.id) === idStr)
    if (existing) {
      return existing
    }

    // 2. Check detail cache if not forced
    if (!force && state.detailCache[idStr]) {
      return state.detailCache[idStr]
    }

    // 3. If ID is local rocket (starts with 'local-') but not found, it doesn't exist
    if (idStr.startsWith('local-')) {
      state.detailError = `Local rocket with ID "${idStr}" not found.`
      return null
    }

    // 4. Fetch from detail API
    state.detailLoading = true
    state.detailError = null

    try {
      const fetched = await rocketApi.getRocketDetail(id)
      state.detailCache[idStr] = fetched
      return fetched
    } catch (err: any) {
      state.detailError = err?.message || `Failed to fetch details for rocket ID ${id}.`
      return null
    } finally {
      state.detailLoading = false
    }
  }

  function addRocket(input: NewRocketInput): Rocket {
    const trimmedName = input.fullName ? input.fullName.trim() : ''
    if (!trimmedName) {
      throw new Error('Rocket full name is required.')
    }

    const trimmedCountry = input.countryCode ? input.countryCode.trim().toUpperCase() : null

    const newRocket: Rocket = {
      id: `local-${Date.now()}`,
      fullName: trimmedName,
      description: input.description?.trim() || null,
      launchCost: input.launchCost?.trim() || null,
      countryCode: trimmedCountry || null,
      maidenFlight: input.maidenFlight?.trim() || null,
      imageUrl: input.imageUrl?.trim() || null,
      isLocal: true,
    }

    state.localRockets.unshift(newRocket)
    return newRocket
  }

  function setSearchQuery(query: string) {
    state.searchQuery = query
  }

  function setSelectedCountry(country: string | null) {
    state.selectedCountry = country
  }

  function resetFilter() {
    state.searchQuery = ''
    state.selectedCountry = null
  }

  return {
    state,
    allRockets,
    filteredRockets,
    availableCountries,
    fetchRockets,
    getRocketById,
    addRocket,
    setSearchQuery,
    setSelectedCountry,
    resetFilter,
  }
}
