"use cache: private"

import { createDal } from "components-library-mtx/dal"
import { cacheLife, cacheTag } from "next/cache"
import { client } from "./client"

const dal = createDal({
  api: client,
  cacheLife: () => cacheLife("hours"),
  cacheTag,
})

export const getSession = async () => await dal.auth.getCurrentUser()

export const getJewelries = async ({
  params,
}: {
  params?: Parameters<typeof dal.jewelries.findMany>[0]
} = {}) => await dal.jewelries.findMany(params)

export const getStones = async ({
  params,
}: {
  params?: Parameters<typeof dal.stones.findMany>[0]
} = {}) => await dal.stones.findMany(params)

export const getBookmarks = async ({
  params,
}: {
  params?: Parameters<typeof dal.bookmarks.findMany>[0]
} = {}) => await dal.bookmarks.findMany(params)

export const getQuotes = async ({
  params,
}: {
  params?: Parameters<typeof dal.quotes.findMany>[0]
} = {}) => await dal.quotes.findMany(params)
