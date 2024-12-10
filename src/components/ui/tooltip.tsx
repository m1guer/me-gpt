"use client"

import React from "react"

import {
  Button,
  composeRenderProps,
  OverlayArrow,
  Tooltip as TooltipPrimitive,
  type TooltipProps as TooltipPrimitiveProps,
  TooltipTrigger
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"
import { tv } from "tailwind-variants"

const tooltipStyles = tv({
  base: ["group rounded-lg [&_strong]:font-medium border px-2.5 py-1.5 text-sm will-change-transform dark:shadow-none"],
  variants: {
    intent: {
      default: "bg-overlay text-overlay-fg **:[.arx]:fill-overlay [&_.arx]:stroke-border",
      inverse:
        "border-transparent bg-fg text-bg dark:[&_.text-muted-fg]:text-fg/70 [&_.text-muted-fg]:text-bg/70 dark:[&_.arx]:fill-white [&_.arx]:fill-fg [&_.arx]:stroke-transparent"
    },
    isEntering: {
      true: [
        "animate-in fade-in",
        "data-[placement=left]:slide-in-from-right-1 data-[placement=right]:slide-in-from-left-1 data-[placement=top]:slide-in-from-bottom-1 data-[placement=bottom]:slide-in-from-top-1"
      ]
    },
    isExiting: {
      true: [
        "animate-in fade-in direction-reverse",
        "data-[placement=left]:slide-out-to-right-1 data-[placement=right]:slide-out-to-left-1 data-[placement=top]:slide-out-to-bottom-1 data-[placement=bottom]:slide-out-to-top-1"
      ]
    }
  },
  defaultVariants: {
    intent: "default"
  }
})

const Tooltip = (props: React.ComponentProps<typeof TooltipTrigger>) => <TooltipTrigger {...props} />

interface ContentProps extends Omit<TooltipPrimitiveProps, "children">, VariantProps<typeof tooltipStyles> {
  showArrow?: boolean
  children: React.ReactNode
}

const Content = ({ offset = 10, showArrow = true, intent = "default", children, ...props }: ContentProps) => {
  return (
    <TooltipPrimitive
      {...props}
      offset={offset}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tooltipStyles({
          ...renderProps,
          intent,
          className
        })
      )}
    >
      {showArrow && (
        <OverlayArrow>
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            className="arx group-data-[placement=left]:-rotate-90 group-data-[placement=right]:rotate-90 group-data-[placement=bottom]:rotate-180 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
      )}
      {children}
    </TooltipPrimitive>
  )
}

Tooltip.Trigger = Button
Tooltip.Content = Content

export { Tooltip }
