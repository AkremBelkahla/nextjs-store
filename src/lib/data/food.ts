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
