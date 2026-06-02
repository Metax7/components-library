"use client"

import { useData } from "@/hooks/use-data"
import { Button } from "components-library-mtx/button"

export default function Home() {
  const {
    data: jewelryData,
    isLoading: isJewelryLoading,
    refetch: refetchJewelry,
  } = useData({
    resource: "jewelries",
    params: {
      per_page: 3,
    },
  })

  const {
    data: stoneData,
    isLoading: isStoneLoading,
    refetch: refetchStones,
  } = useData({
    resource: "stones",
    params: {
      per_page: 3,
    },
  })

  return (
    <main className="mx-auto flex max-w-6xl flex-col t-gap p-8">
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
        <section className="space-y-6">
          <div className="space-y-4 border bg-white p-6 shadow-sm">
            <div className="t-row justify-between border-b pb-2">
              <h2 className="text-2xl font-bold">Jewelry Collection</h2>
              <Button
                title="Refetch"
                size="sm"
                onClick={() => refetchJewelry()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-refresh-cw-icon lucide-refresh-cw"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </Button>
            </div>

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

        <section className="space-y-6">
          <div className="space-y-4 border bg-white p-6 shadow-sm">
            <div className="t-row justify-between border-b pb-2">
              <h2 className="text-2xl font-bold">Stone Collection</h2>
              <Button title="Refetch" size="sm" onClick={() => refetchStones()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-refresh-cw-icon lucide-refresh-cw"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </Button>
            </div>

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

      <footer className="border-t pt-8 text-center text-sm text-gray-400">
        Built with Next.js 15 + components-library-mtx
      </footer>
    </main>
  )
}
