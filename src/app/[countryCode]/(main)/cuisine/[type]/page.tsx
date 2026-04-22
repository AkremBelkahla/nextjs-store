import { Metadata } from "next"
import Link from "next/link"
import { listRestaurants, slugify } from "@lib/data/food"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ countryCode: string; type: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const label = decodeURIComponent(type)
  return { title: `${label} — Food Store` }
}

export default async function CuisinePage({ params }: Props) {
  const { countryCode, type } = await params
  const label = decodeURIComponent(type)

  const allRestaurants = await listRestaurants()
  const restaurants = allRestaurants.filter((r) => r.type === label)

  if (!restaurants.length) return notFound()

  return (
    <div className="content-container py-12">
      {/* Breadcrumb */}
      <nav className="txt-small text-ui-fg-muted mb-8 flex items-center gap-x-2">
        <Link href={`/${countryCode}`} className="hover:text-ui-fg-base">
          Home
        </Link>
        <span>/</span>
        <span className="text-ui-fg-base">{label}</span>
      </nav>

      <h1 className="text-3xl font-semibold text-ui-fg-base mb-2">{label}</h1>
      <p className="text-ui-fg-subtle mb-10">
        {restaurants.length} restaurant{restaurants.length > 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-6">
        {restaurants.map((r) => (
          <Link
            key={r.restaurantID}
            href={`/${countryCode}/cuisine/${encodeURIComponent(type)}/${slugify(r.restaurantName)}`}
            className="group flex flex-col gap-y-3 bg-white border border-ui-border-base rounded-xl p-6 hover:border-ui-border-interactive hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-x-3">
              <h2 className="text-lg font-semibold text-ui-fg-base group-hover:text-ui-fg-interactive leading-tight">
                {r.restaurantName}
              </h2>
              {r.parkingLot && (
                <span className="shrink-0 txt-xsmall text-ui-fg-muted border border-ui-border-base rounded px-2 py-0.5">
                  Parking 🅿️
                </span>
              )}
            </div>
            <p className="txt-small text-ui-fg-subtle">{r.address}</p>
            <span className="txt-small text-ui-fg-interactive mt-auto">
              View menu →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
