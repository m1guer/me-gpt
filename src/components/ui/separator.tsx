"use client"

import * as React from "react"

import { Separator as Divider, type SeparatorProps as DividerProps } from "react-aria-components"
import { tv } from "tailwind-variants"

const separatorStyles = tv({
  base: "bg-border shrink-0 forced-colors:bg-[ButtonBorder]",
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "w-px"
    }
  },
  defaultVariants: {
    orientation: "horizontal"
  }
})

interface SeparatorProps extends DividerProps {
  className?: string
  ref?: React.RefObject<DividerProps>
}

const Separator = ({ className, ref, ...props }: SeparatorProps) => {
  return (
    <Divider
      ref={ref}
      {...props}
      className={separatorStyles({
        orientation: props.orientation,
        className: className
      })}
    />
  )
}

export { Separator }
