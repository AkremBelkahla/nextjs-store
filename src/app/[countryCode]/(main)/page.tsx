import { Metadata } from "next"
import Link from "next/link"
import { listCuisineTypes } from "@lib/data/food"

export const metadata: Metadata = {
  title: "Food Store",
  description: "Discover our selection of delicious dishes.",
}

const CUISINE_EMOJIS: Record<string, string> = {
  Biryani: "🍚",
  "Bengali Cuisine": "🐟",
  Brewery: "🍺",
  Continental: "🥩",
  "Fine Dining": "🍽️",
  Gujarati: "🥗",
  "Gujarati Thali": "🍱",
  "Hyderabadi Cuisine": "🫕",
  "Indian Cafe": "☕",
  "Modern Indian": "✨",
  Mughlai: "🍖",
  "Multi-cuisine": "🌍",
  "North Indian": "🫓",
  "Parsi Cuisine": "🥘",
  Rajasthani: "🏜️",
  Seafood: "🦞",
  "South Indian": "🥞",
  Thai: "🌿",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const cuisines = await listCuisineTypes()

  return (
    <>
      <div className="h-[40vh] w-full border-b border-ui-border-base bg-ui-bg-subtle flex items-center justify-center">
        <div className="text-center flex flex-col gap-4">
          <h1 className="text-4xl font-semibold text-ui-fg-base">
            Welcome to Food Store 🍽️
          </h1>
          <p className="text-ui-fg-subtle text-lg">
            Explore cuisines from around the world
          </p>
        </div>
      </div>

      <div className="content-container py-12">
        <h2 className="text-2xl font-semibold text-ui-fg-base mb-8">
          Our Cuisines
        </h2>
        <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 large:grid-cols-5 gap-4">
          {cuisines.map(({ type, count }) => (
            <Link
              key={type}
              href={`/${countryCode}/cuisine/${encodeURIComponent(type)}`}
              className="group flex flex-col items-center justify-center gap-y-3 bg-white border border-ui-border-base rounded-xl p-6 hover:border-ui-border-interactive hover:shadow-md transition-all duration-200"
            >
              <span className="text-4xl">
                {CUISINE_EMOJIS[type] ?? "🍴"}
              </span>
              <span className="txt-compact-medium font-medium text-ui-fg-base text-center leading-tight">
                {type}
              </span>
              <span className="txt-xsmall text-ui-fg-muted">
                {count} restaurant{count > 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
