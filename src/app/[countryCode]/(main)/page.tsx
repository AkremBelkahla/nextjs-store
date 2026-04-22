import { Metadata } from "next"

import FoodGrid from "@modules/home/components/food-grid"
import { listFoodItems } from "@lib/data/food"

export const metadata: Metadata = {
  title: "Food Store",
  description: "Découvrez notre sélection de plats délicieux.",
}

export default async function Home() {
  const items = await listFoodItems({ sortbyprice: "asc" })

  return (
    <>
      <div className="h-[40vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle flex items-center justify-center">
        <div className="text-center flex flex-col gap-4">
          <h1 className="text-4xl font-semibold text-ui-fg-base">
            Bienvenue sur Food Store 🍽️
          </h1>
          <p className="text-ui-fg-subtle text-lg">
            Explorez nos plats et saveurs du monde entier
          </p>
        </div>
      </div>

      <div className="content-container py-12">
        <h2 className="text-2xl font-semibold text-ui-fg-base mb-8">
          Tous les plats
        </h2>
        <FoodGrid items={items} />
      </div>
    </>
  )
}
