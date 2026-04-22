import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getRestaurantById, getRestaurantMenu } from "@lib/data/food"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; type: string; restaurantId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { restaurantId } = await params
  const restaurant = await getRestaurantById(Number(restaurantId))
  return { title: restaurant ? `${restaurant.restaurantName} — Food Store` : "Restaurant" }
}

export default async function RestaurantPage({ params }: Props) {
  const { countryCode, type, restaurantId } = await params
  const typeLabel = decodeURIComponent(type)

  const [restaurant, menu] = await Promise.all([
    getRestaurantById(Number(restaurantId)),
    getRestaurantMenu(Number(restaurantId)),
  ])

  if (!restaurant) return notFound()

  return (
    <div className="content-container py-12">
      {/* Breadcrumb */}
      <nav className="txt-small text-ui-fg-muted mb-8 flex items-center gap-x-2 flex-wrap">
        <Link href={`/${countryCode}`} className="hover:text-ui-fg-base">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/${countryCode}/cuisine/${encodeURIComponent(type)}`}
          className="hover:text-ui-fg-base"
        >
          {typeLabel}
        </Link>
        <span>/</span>
        <span className="text-ui-fg-base">{restaurant.restaurantName}</span>
      </nav>

      {/* Restaurant header */}
      <div className="mb-10 flex flex-col gap-y-2">
        <h1 className="text-3xl font-semibold text-ui-fg-base">
          {restaurant.restaurantName}
        </h1>
        <div className="flex items-center gap-x-4 text-ui-fg-subtle txt-small">
          <span>{typeLabel}</span>
          <span>•</span>
          <span>{restaurant.address}</span>
          {restaurant.parkingLot && (
            <>
              <span>•</span>
              <span>Parking 🅿️</span>
            </>
          )}
        </div>
      </div>

      {/* Menu */}
      {menu.length === 0 ? (
        <p className="text-ui-fg-muted italic">
          No dishes available for this restaurant.
        </p>
      ) : (
        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-6">
          {menu.map((item) => (
            <div
              key={item.itemID}
              className="group flex flex-col bg-white border border-ui-border-base rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
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
                  <h3 className="txt-compact-medium font-semibold text-ui-fg-base leading-tight">
                    {item.itemName}
                  </h3>
                  <span className="txt-compact-small font-semibold text-ui-fg-base whitespace-nowrap">
                    ₹{item.itemPrice}
                  </span>
                </div>
                <p className="txt-small text-ui-fg-subtle line-clamp-3">
                  {item.itemDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
