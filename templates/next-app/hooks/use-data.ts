"use client"

import { client } from "@/lib/wdpro/client"
import { createUseData } from "components-library-mtx/hooks"

export const useData = createUseData({
  api: client,
})
