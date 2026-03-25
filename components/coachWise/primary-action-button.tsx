"use client"

import * as React from "react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PrimaryActionButtonIcon = React.ComponentType<{
  className?: string
}>

type PrimaryActionButtonBaseProps = {
  label: React.ReactNode
  icon?: PrimaryActionButtonIcon
  className?: string
  iconClassName?: string
}

type PrimaryActionButtonLinkProps = PrimaryActionButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, "href" | "children" | "className"> & {
    href: string
    onClick?: never
  }

type PrimaryActionButtonButtonProps = PrimaryActionButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: never
  }

export type PrimaryActionButtonProps =
  | PrimaryActionButtonLinkProps
  | PrimaryActionButtonButtonProps

export const primaryActionButtonClassName = cn(
  buttonVariants({ size: "sm" }),
  "shrink-0 cursor-pointer rounded-sm border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
)

function isLinkProps(
  props: PrimaryActionButtonProps
): props is PrimaryActionButtonLinkProps {
  return "href" in props && typeof props.href === "string"
}

export const PrimaryActionButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  PrimaryActionButtonProps
>(function PrimaryActionButton(props, ref) {
  const { label, icon: Icon, className, iconClassName } = props

  const content = (
    <>
      {Icon ? <Icon className={cn("size-4", iconClassName)} /> : null}
      {label}
    </>
  )

  if (isLinkProps(props)) {
    const {
      href,
      label: _label,
      icon: _icon,
      className: _className,
      iconClassName: _iconClassName,
      ...linkProps
    } = props

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cn(primaryActionButtonClassName, className)}
        {...linkProps}
      >
        {content}
      </Link>
    )
  }

  const buttonPropsSource = props as PrimaryActionButtonButtonProps
  const {
    type = "button",
    label: _label,
    icon: _icon,
    className: _className,
    iconClassName: _iconClassName,
    ...buttonProps
  } = buttonPropsSource

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={cn(primaryActionButtonClassName, className)}
      {...buttonProps}
    >
      {content}
    </button>
  )
})

PrimaryActionButton.displayName = "PrimaryActionButton"
