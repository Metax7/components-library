import { getSession } from "@/lib/wdpro/dal"

import { redirect } from "next/navigation"
import {
  User as UserIcon,
  Mail,
  Building2,
  MapPin,
  Phone,
  Globe,
  Shield,
  Calendar,
  Hash,
  CreditCard,
  Settings,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

export default async function ProfilePage() {
  const user = await getSession()

  if (!user) {
    redirect("/sign-in")
  }

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase()

  const joinedDate = user.created_at
    ? format(new Date(user.created_at), "MMMM d, yyyy")
    : "Unknown"

  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-4 py-10">
      {/* Header Section */}
      <div className="relative overflow-hidden border bg-linear-to-r from-primary/10 via-background to-primary/5 p-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 bg-primary/5 blur-3xl" />

        <div className="relative flex flex-col items-center gap-8 md:flex-row">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
              <AvatarImage src="" />
              <AvatarFallback className="bg-linear-to-br from-primary to-primary/60 text-3xl font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute right-1 bottom-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background p-1.5 shadow-lg">
              <div className="h-full w-full rounded-full bg-green-500 ring-2 ring-green-500/20" />
            </div>
          </div>

          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight">
                {user.full_name || "User Profile"}
              </h1>
              <p className="flex items-center justify-center gap-2 text-lg text-muted-foreground md:justify-start">
                <Mail className="h-4 w-4" /> {user.email}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <Badge variant="secondary">
                <Shield />
                {user.role.toUpperCase()}
              </Badge>
              {user.customer_number && (
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-sm font-medium"
                >
                  <Hash className="mr-1.5 h-3.5 w-3.5" />
                  ID: {user.customer_number}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button className="shadow-lg shadow-primary/20">
              <Settings className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-8 lg:col-span-2">
          <Card className="overflow-hidden border-primary/5 shadow-xs">
            <CardHeader className="bg-muted py-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoItem
                icon={<Mail />}
                label="Email Address"
                value={user.email}
              />
              <InfoItem
                icon={<Calendar />}
                label="Member Since"
                value={joinedDate}
              />
              <InfoItem
                icon={<Shield />}
                label="Account Role"
                value={user.role}
                className="capitalize"
              />
              <InfoItem
                icon={<CreditCard />}
                label="Stripe ID"
                value={user.stripe_user_id || "Not connected"}
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-primary/5 shadow-xs">
            <CardHeader className="bg-muted py-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Company Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoItem
                icon={<Building2 />}
                label="Company Name"
                value={user.company_name || "N/A"}
              />
              <InfoItem
                icon={<Globe />}
                label="Website"
                value={user.website || "N/A"}
                isLink={!!user.website}
              />
              <InfoItem
                icon={<CreditCard />}
                label="Price Level (Jewelry)"
                value={user.price_level_jewelries || "Standard"}
              />
              <InfoItem
                icon={<CreditCard />}
                label="Price Level (Stones)"
                value={user.price_level_stones || "Standard"}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact & Misc */}
        <div className="space-y-8">
          <Card className="h-full overflow-hidden border-primary/5 shadow-xs">
            <CardHeader className="bg-muted py-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Contact Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="px-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Address
                </h4>
                <div className="space-y-1">
                  <p className="font-medium">
                    {user.address_1 || "No address provided"}
                  </p>
                  {user.address_2 && (
                    <p className="text-sm text-muted-foreground">
                      {user.address_2}
                    </p>
                  )}
                  {(user.city || user.state || user.zip) && (
                    <p className="text-sm text-muted-foreground">
                      {[user.city, user.state, user.zip]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {user.country && (
                    <p className="text-sm text-muted-foreground">
                      {user.country}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="px-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Phone Numbers
                </h4>
                <div className="space-y-3">
                  <PhoneLink
                    icon={<Phone className="h-4 w-4" />}
                    label="Primary"
                    number={user.phone_1_number}
                    ext={user.phone_1_ext}
                  />
                  <PhoneLink
                    icon={<Phone className="h-4 w-4" />}
                    label="Secondary"
                    number={user.phone_2_number}
                    ext={user.phone_2_ext}
                  />
                  <PhoneLink
                    icon={<Phone className="h-4 w-4" />}
                    label="Mobile"
                    number={user.cell_number}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoItem({
  icon,
  label,
  value,
  className,
  isLink,
}: {
  icon: React.ReactNode
  label: string
  value: string | null
  className?: string
  isLink?: boolean
}) {
  return (
    <div className="group space-y-1.5 border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/50">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="origin-left scale-75">{icon}</span>
        <span className="text-xs font-bold tracking-widest uppercase">
          {label}
        </span>
      </div>
      <div className="flex items-center justify-between">
        {isLink ? (
          <a
            href={value?.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-medium text-primary hover:underline",
              className
            )}
          >
            {value}
          </a>
        ) : (
          <p className={cn("font-medium", className)}>{value || "—"}</p>
        )}
      </div>
    </div>
  )
}

function PhoneLink({
  icon,
  label,
  number,
  ext,
}: {
  icon: React.ReactNode
  label: string
  number: string | null
  ext?: string | null
}) {
  if (!number) return null
  return (
    <div className="group flex items-center justify-between p-2 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center border bg-background text-muted-foreground shadow-xs transition-colors group-hover:text-primary">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <a
            href={`tel:${number}`}
            className="font-semibold transition-colors hover:text-primary"
          >
            {number}{" "}
            {ext && (
              <span className="text-xs font-normal text-muted-foreground">
                Ext: {ext}
              </span>
            )}
          </a>
        </div>
      </div>
    </div>
  )
}
