"use client"

import { useData } from "@/hooks/use-data"

export default function Home() {
  const { data: jewelryData, isLoading: isJewelryLoading } = useData({
    resource: "jewelries",
    params: {
      per_page: 3,
    },
  })

  const { data: stoneData, isLoading: isStoneLoading } = useData({
    resource: "stones",
    params: {
      per_page: 3,
    },
  })

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 p-8">
      {/* Header */}
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          WDPRO Template
        </h1>
        <p className="text-xl text-gray-500">
          Listing Jewelry and Stones using{" "}
          <code className="bg-gray-200 px-1 py-0.5 text-base">useData</code>{" "}
          hook
        </p>
      </section>

      <div className="grid grid-cols-1 gap-12">
        {/* Jewelry List Section */}
        <section className="space-y-6">
          <div className="space-y-4 border bg-white p-6 shadow-sm">
            <h2 className="border-b pb-2 text-2xl font-bold">
              Jewelry Collection
            </h2>

            {isJewelryLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 animate-pulse bg-gray-100" />
                ))}
              </div>
            ) : jewelryData?.data?.length ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {jewelryData.data.map((item) => (
                  <div
                    key={item.id}
                    className="group relative border p-4 transition"
                  >
                    <p className="font-mono text-xs text-gray-400">
                      {item.item_no}
                    </p>
                    <h3 className="line-clamp-1 font-semibold text-gray-900">
                      {item.description}
                    </h3>
                    <p className="mt-1 text-lg font-bold text-blue-600">
                      $
                      {item.price_total?.toLocaleString() ??
                        "Contact for price"}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase">
                        {item.category}
                      </span>
                      <span className="bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase">
                        {item.metal_1_type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 py-12 text-center">
                <p className="text-gray-500">No jewelry items found.</p>
              </div>
            )}
          </div>
        </section>

        {/* Stone List Section */}
        <section className="space-y-6">
          <div className="space-y-4 border bg-white p-6 shadow-sm">
            <h2 className="border-b pb-2 text-2xl font-bold">
              Stone Collection
            </h2>

            {isStoneLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 animate-pulse bg-gray-100" />
                ))}
              </div>
            ) : stoneData?.data?.length ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stoneData.data.map((item) => (
                  <div
                    key={item.id}
                    className="group relative border p-4 transition"
                  >
                    <p className="font-mono text-xs text-gray-400">
                      {item.item_no}
                    </p>
                    <h3 className="font-semibold text-gray-900">
                      {item.shape_name} {item.carats}ct
                    </h3>
                    <p className="mt-1 text-lg font-bold text-emerald-600">
                      {item.color_code} / {item.clarity_code}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase">
                        {item.stone_type_human}
                      </span>
                      <span className="bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase">
                        {item.lab_name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 py-12 text-center">
                <p className="text-gray-500">No stones found.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer Info */}
      <footer className="border-t pt-8 text-center text-sm text-gray-400">
        Built with Next.js 15 + components-library-mtx
      </footer>
    </main>
  )
}
