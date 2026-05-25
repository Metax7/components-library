"use client"

import { LogOut } from "lucide-react"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { signOut } from "@/lib/wdpro/actions"
import { User, useQueryClient } from "components-library-mtx"

export default function SignOut({
  userId,
}: {
  userId: NonNullable<User>["id"]
}) {
  const queryClient = useQueryClient()

  const handleSignOut = async () => {
    await signOut(userId)

    queryClient.setQueryData(["session"], null)
    queryClient.removeQueries()
  }

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      variant="destructive"
      className="cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sign Out</span>
    </DropdownMenuItem>
  )
}
