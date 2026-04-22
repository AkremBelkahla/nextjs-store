import Image from "next/image"
import { CuisineGroup, FoodItem } from "@lib/data/food"

const FoodCard = ({ item }: { item: FoodItem }) => (
  <div className="group flex flex-col bg-white border border-ui-border-base rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
    <div className="relative aspect-square bg-ui-bg-subtle overflow-hidden">
      <Image
        src={item.imageUrl}
        alt={item.itemName}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
      />
    </div>
    <div className="flex flex-col gap-y-2 p-4 flex-1">
      <div className="flex items-start justify-between gap-x-2">
        <h4 className="txt-compact-medium font-semibold text-ui-fg-base leading-tight">
          {item.itemName}
        </h4>
        <span className="txt-compact-small font-semibold text-ui-fg-base whitespace-nowrap">
          ₹{item.itemPrice}
        </span>
      </div>
      <p className="txt-small text-ui-fg-subtle line-clamp-2 flex-1">
        {item.itemDescription}
      </p>
    </div>
  </div>
)

type FoodGridProps = {
  cuisineGroups: CuisineGroup[]
}

const FoodGrid = ({ cuisineGroups }: FoodGridProps) => {
  if (!cuisineGroups?.length) {
    return (
      <div className="flex items-center justify-center py-20 text-ui-fg-subtle">
        No food items available.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-16">
      {cuisineGroups.map((group) => (
        <section key={group.type}>
          {/* Cuisine type header */}
          <div className="flex items-center gap-x-4 mb-8">
            <h2 className="text-2xl font-semibold text-ui-fg-base whitespace-nowrap">
              {group.type}
            </h2>
            <div className="h-px bg-ui-border-base flex-1" />
            <span className="txt-small text-ui-fg-muted whitespace-nowrap">
              {group.restaurants.length} restaurant{group.restaurants.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Restaurants within this cuisine */}
          <div className="flex flex-col gap-y-10">
            {group.restaurants.map((restaurant) => (
              <div key={restaurant.restaurantID}>
                {/* Restaurant header */}
                <div className="flex items-baseline gap-x-3 mb-4">
                  <h3 className="text-lg font-medium text-ui-fg-base">
                    {restaurant.restaurantName}
                  </h3>
                  <span className="txt-small text-ui-fg-muted">
                    {restaurant.address}
                  </span>
                  {restaurant.parkingLot && (
                    <span className="txt-xsmall text-ui-fg-muted bg-ui-bg-subtle border border-ui-border-base rounded px-2 py-0.5">
                      Parking
                    </span>
                  )}
                </div>

                {/* Menu items grid */}
                {restaurant.menu.length > 0 ? (
                  <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-4">
                    {restaurant.menu.map((item) => (
                      <FoodCard key={item.itemID} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="txt-small text-ui-fg-muted italic">
                    No dishes available for this restaurant.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default FoodGrid
