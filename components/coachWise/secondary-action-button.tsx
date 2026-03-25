"use client"

import * as React from "react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SecondaryActionButtonIcon = React.ComponentType<{
  className?: string
}>

type SecondaryActionButtonBaseProps = {
  label: React.ReactNode
  icon?: SecondaryActionButtonIcon
  className?: string
  iconClassName?: string
}

type SecondaryActionButtonLinkProps = SecondaryActionButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, "href" | "children" | "className"> & {
    href: string
    onClick?: never
  }

type SecondaryActionButtonButtonProps = SecondaryActionButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: never
  }

export type SecondaryActionButtonProps =
  | SecondaryActionButtonLinkProps
  | SecondaryActionButtonButtonProps

export const secondaryActionButtonClassName = cn(
  buttonVariants({ variant: "outline", size: "default" }),
  "shrink-0 cursor-pointer rounded-sm border-neutral-200/80 bg-neutral-100/85 px-3 text-[13px] font-normal text-neutral-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-neutral-300/80 hover:bg-neutral-200/55 hover:text-neutral-800"
)

function isLinkProps(
  props: SecondaryActionButtonProps
): props is SecondaryActionButtonLinkProps {
  return "href" in props && typeof props.href === "string"
}

export const SecondaryActionButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  SecondaryActionButtonProps
>(function SecondaryActionButton(props, ref) {
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
        className={cn(secondaryActionButtonClassName, className)}
        {...linkProps}
      >
        {content}
      </Link>
    )
  }

  const buttonPropsSource = props as SecondaryActionButtonButtonProps
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
      className={cn(secondaryActionButtonClassName, className)}
      {...buttonProps}
    >
      {content}
    </button>
  )
})

SecondaryActionButton.displayName = "SecondaryActionButton"
