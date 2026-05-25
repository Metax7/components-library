"use server"

import {
  createAuthActions,
  createBookmarkActions,
} from "components-library-mtx/actions"
import { updateTag } from "next/cache"
import { client } from "./client"

const deps = { api: client, revalidateTag: updateTag }

export const { signIn, signUp, signOut } = createAuthActions(deps)
export const { toggleBookmark } = createBookmarkActions(deps)
