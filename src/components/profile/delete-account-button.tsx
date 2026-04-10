"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export function DeleteAccountButton() {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)

    const res = await fetch("/api/profile/delete-account", {
      method: "DELETE",
    })

    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || "Something went wrong")
      setLoading(false)
      return
    }

    await signOut({ callbackUrl: "/sign-in" })
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>
        Delete Account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete your account and all your data including
            items, collections, and settings. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete my account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
