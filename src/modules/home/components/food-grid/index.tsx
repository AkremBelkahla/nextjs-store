import Image from "next/image"
import { FoodItem } from "@lib/data/food"

type FoodGridProps = {
  items: FoodItem[]
}

const FoodGrid = ({ items }: FoodGridProps) => {
  if (!items?.length) {
    return (
      <div className="flex items-center justify-center py-20 text-ui-fg-subtle">
        No food items available.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.itemID}
          className="group flex flex-col bg-white border border-ui-border-base rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div className="relative aspect-square bg-ui-bg-subtle overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.itemName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className="flex flex-col gap-y-2 p-4 flex-1">
            <div className="flex items-start justify-between gap-x-2">
              <h3 className="txt-compact-medium font-semibold text-ui-fg-base leading-tight">
                {item.itemName}
              </h3>
              <span className="txt-compact-small font-semibold text-ui-fg-base whitespace-nowrap">
                ₹{item.itemPrice}
              </span>
            </div>
            <p className="txt-small text-ui-fg-subtle line-clamp-2 flex-1">
              {item.itemDescription}
            </p>
            <span className="txt-xsmall text-ui-fg-muted mt-auto">
              {item.restaurantName}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FoodGrid
