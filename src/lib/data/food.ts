const FOOD_API_BASE = "https://fakerestaurantapi.runasp.net/api"

export type FoodItem = {
  itemID: number
  itemName: string
  itemDescription: string
  itemPrice: number
  restaurantName: string
  restaurantID: number
  imageUrl: string
}

export type Restaurant = {
  restaurantID: number
  restaurantName: string
  address: string
  type: string
  parkingLot: boolean
}

export const listFoodItems = async (params?: {
  itemName?: string
  sortbyprice?: "asc" | "desc"
}): Promise<FoodItem[]> => {
  const url = new URL(`${FOOD_API_BASE}/Restaurant/items`)
  if (params?.itemName) url.searchParams.set("ItemName", params.itemName)
  if (params?.sortbyprice) url.searchParams.set("sortbyprice", params.sortbyprice)

  return fetch(url.toString(), { next: { revalidate: 3600 } })
    .then((res) => res.json())
    .catch(() => [])
}

export const listRestaurants = async (params?: {
  category?: string
}): Promise<Restaurant[]> => {
  const url = new URL(`${FOOD_API_BASE}/Restaurant`)
  if (params?.category) url.searchParams.set("category", params.category)

  return fetch(url.toString(), { next: { revalidate: 3600 } })
    .then((res) => res.json())
    .catch(() => [])
}

export const getRestaurantMenu = async (restaurantId: number): Promise<FoodItem[]> => {
  return fetch(`${FOOD_API_BASE}/Restaurant/${restaurantId}/menu`, {
    next: { revalidate: 3600 },
  })
    .then((res) => res.json())
    .catch(() => [])
}

export type RestaurantWithMenu = Restaurant & { menu: FoodItem[] }
export type CuisineGroup = { type: string; restaurants: RestaurantWithMenu[] }

export const getRestaurantById = async (id: number): Promise<Restaurant | null> => {
  return fetch(`${FOOD_API_BASE}/Restaurant/${id}`, { next: { revalidate: 3600 } })
    .then((res) => res.json())
    .then((data) => (Array.isArray(data) ? data[0] : data) ?? null)
    .catch(() => null)
}

export const listCuisineTypes = async (): Promise<{ type: string; count: number }[]> => {
  const restaurants = await listRestaurants()
  const map = restaurants.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1
    return acc
  }, {})
  return Object.entries(map)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => a.type.localeCompare(b.type))
}

export const listRestaurantsWithMenus = async (): Promise<CuisineGroup[]> => {
  const restaurants = await listRestaurants()
  if (!restaurants.length) return []

  const menus = await Promise.all(
    restaurants.map((r) => getRestaurantMenu(r.restaurantID))
  )

  const withMenus: RestaurantWithMenu[] = restaurants.map((r, i) => ({
    ...r,
    menu: menus[i],
  }))

  // Group by cuisine type
  const grouped = withMenus.reduce<Record<string, RestaurantWithMenu[]>>(
    (acc, r) => {
      if (!acc[r.type]) acc[r.type] = []
      acc[r.type].push(r)
      return acc
    },
    {}
  )

  return Object.entries(grouped)
    .map(([type, restaurants]) => ({ type, restaurants }))
    .sort((a, b) => a.type.localeCompare(b.type))
}
