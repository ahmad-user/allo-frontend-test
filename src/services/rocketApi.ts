import type { ApiRocket, ApiRocketListResponse, Rocket } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'

/**
 * Maps raw API rocket object to frontend domain model with standardized field names
 */
export function mapApiRocketToDomain(apiRocket: ApiRocket): Rocket {
  let formattedCost: string | null = null
  if (apiRocket.launch_cost !== undefined && apiRocket.launch_cost !== null) {
    const rawCost = String(apiRocket.launch_cost).trim()
    if (rawCost.length > 0) {
      formattedCost = rawCost
    }
  }

  return {
    id: apiRocket.id,
    fullName: apiRocket.full_name || apiRocket.name || `Rocket #${apiRocket.id}`,
    description: apiRocket.description || null,
    launchCost: formattedCost,
    countryCode: apiRocket.manufacturer?.country_code || null,
    maidenFlight: apiRocket.maiden_flight || null,
    imageUrl: apiRocket.image_url || null,
    isLocal: false,
    active: apiRocket.active ?? null,
    reusable: apiRocket.reusable ?? null,
  }
}

export const rocketApi = {
  /**
   * Fetch list of SpaceX rockets using required query parameters:
   * manufacturer__name=SpaceX&mode=detailed&limit=20
   */
  async getRockets(): Promise<Rocket[]> {
    const url = `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch rockets (HTTP ${response.status}: ${response.statusText})`)
    }

    const data: ApiRocketListResponse = await response.json()
    return (data.results || []).map(mapApiRocketToDomain)
  },

  /**
   * Fetch detailed information for a single rocket by ID
   */
  async getRocketDetail(id: number | string): Promise<Rocket> {
    const url = `${BASE_URL}/config/launcher/${id}/`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch rocket detail (HTTP ${response.status}: ${response.statusText})`)
    }

    const data: ApiRocket = await response.json()
    return mapApiRocketToDomain(data)
  },
}
