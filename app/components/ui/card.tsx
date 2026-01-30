import * as React from "react"
import { cn } from "@/lib/utils"

type CardProps = React.ComponentProps<"div"> & {
  variant?: "default" | "glass" | "glassColor"
  tint?: "blue" | "pink" | "green" | "orange" | "purple"
}

const tintMap: Record<NonNullable<CardProps["tint"]>, string> = {
  blue: "from-blue-500/20 via-cyan-500/10 to-indigo-500/15",
  pink: "from-fuchsia-500/20 via-pink-500/10 to-purple-500/15",
  green: "from-emerald-500/18 via-lime-500/10 to-teal-500/14",
  orange: "from-orange-500/18 via-amber-500/10 to-rose-500/12",
  purple: "from-violet-500/20 via-indigo-500/10 to-fuchsia-500/14",
}

function Card({
  className,
  variant = "default",
  tint = "blue",
  ...props
}: CardProps) {
  const isGlass = variant === "glass" || variant === "glassColor"

  return (
    <div
      data-slot="card"
      className={cn(
        // Base layout (keep your structure)
        "relative flex flex-col gap-6 rounded-2xl border py-6 shadow-sm transition",
        // Nice hover behavior for all cards
        "hover:-translate-y-0.5 hover:shadow-lg",
        "focus-within:ring-2 focus-within:ring-blue-500/40",

        // Default (your current behavior, slightly modernized)
        variant === "default" && "bg-card text-card-foreground",

        // Glass (light frosted)
        variant === "glass" &&
          "bg-white/55 text-slate-900 border-white/40 backdrop-blur-xl backdrop-saturate-150 shadow-black/5",

        // Glass + color tint behind it
        variant === "glassColor" &&
          "bg-white/22 text-slate-900 border-white/35 backdrop-blur-2xl backdrop-saturate-200 shadow-black/10",

        className
      )}
      {...props}
    >
      {/* Color tint layer (only for glassColor) */}
      {variant === "glassColor" && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br",
            tintMap[tint]
          )}
        />
      )}

      {/* Frosted highlight sheen (glass variants) */}
      {isGlass && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
        />
      )}

      {/* Hover glow blobs (glass variants) */}
      {isGlass && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-white/35 blur-2xl opacity-0 transition group-hover:opacity-100"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-white/25 blur-2xl opacity-0 transition group-hover:opacity-100"
          />
          {/* Bottom sheen line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
          />
        </>
      )}

      {/* Content */}
      {props.children}
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm text-slate-700/80",
        // keep original token for non-glass themes too
        "dark:text-slate-200/70",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
