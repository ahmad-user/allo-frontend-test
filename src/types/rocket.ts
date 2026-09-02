export interface ApiManufacturer {
  id?: number
  name?: string
  country_code?: string | null
  abbrev?: string | null
}

export interface ApiRocket {
  id: number
  url?: string
  name?: string
  full_name?: string | null
  description?: string | null
  active?: boolean | null
  reusable?: boolean | null
  launch_cost?: string | number | null
  maiden_flight?: string | null
  image_url?: string | null
  manufacturer?: ApiManufacturer | null
  length?: number | null
  diameter?: number | null
  launch_mass?: number | null
  leo_capacity?: number | null
  gto_capacity?: number | null
}

export interface ApiRocketListResponse {
  count: number
  next: string | null
  previous: string | null
  results: ApiRocket[]
}

export interface Rocket {
  id: number | string
  fullName: string
  description: string | null
  launchCost: string | null
  countryCode: string | null
  maidenFlight: string | null
  imageUrl: string | null
  isLocal?: boolean
  active?: boolean | null
  reusable?: boolean | null
}

export interface NewRocketInput {
  fullName: string
  description?: string
  launchCost?: string
  countryCode?: string
  maidenFlight?: string
  imageUrl?: string
}
