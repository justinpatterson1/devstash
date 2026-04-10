import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getProfileData } from "@/lib/db/profile"
import { UserAvatar } from "@/components/user-avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangePasswordForm } from "@/components/profile/change-password-form"
import { DeleteAccountButton } from "@/components/profile/delete-account-button"
import {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File,
  Image,
  Layers,
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const profile = await getProfileData(session.user.id)
  if (!profile) redirect("/sign-in")

  return (
    <div className="flex min-h-full justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <UserAvatar
                name={profile.name ?? profile.email}
                image={profile.image}
                className="size-16"
              />
              <div className="flex flex-col gap-1">
                <p className="text-lg font-medium">
                  {profile.name ?? "No name set"}
                </p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <p className="text-xs text-muted-foreground">
                  Joined {profile.createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-bold">{profile.stats.totalItems}</p>
                <p className="text-sm text-muted-foreground">Items</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{profile.stats.totalCollections}</p>
                <p className="text-sm text-muted-foreground">Collections</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">By type</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {profile.stats.itemsByType.map((t) => {
                  const Icon = iconMap[t.icon] ?? Layers
                  return (
                    <div
                      key={t.name}
                      className="flex items-center gap-2 rounded-md border border-border px-3 py-2"
                    >
                      <Icon className="size-4 shrink-0" style={{ color: t.color }} />
                      <span className="text-sm">{t.name}</span>
                      <span className="ml-auto text-sm font-medium text-muted-foreground">
                        {t.count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        {profile.hasPassword && (
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <DeleteAccountButton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
