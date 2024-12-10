"use client"

import * as React from "react"

import { IconChevronLgLeft, IconHamburger, IconSidebarFill } from "justd-icons"
import type { LinkRenderProps, PressEvent } from "react-aria-components"
import {
  Button as Trigger,
  composeRenderProps,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Header,
  Heading,
  Link,
  Text
} from "react-aria-components"
import { tv } from "tailwind-variants"

import { Badge } from "./badge"
import { Button } from "./button"
import { cn, useMediaQuery } from "./primitive"
import { Separator } from "./separator"
import { Sheet } from "./sheet"
import { Tooltip } from "./tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  isOpenOnMobile: boolean
  setIsOpenOnMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

const useSidebar = () => {
  const context = React.use(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar.")
  }

  return context
}

interface SidebarProviderProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const SidebarProvider = ({
  defaultOpen = true,
  isOpen: openProp,
  onOpenChange: setOpenProp,
  className,
  children,
  ref,
  ...props
}: SidebarProviderProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [openMobile, setOpenMobile] = React.useState(false)

  const [internalOpenState, setInternalOpenState] = React.useState(defaultOpen)
  const open = openProp ?? internalOpenState
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value

      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        setInternalOpenState(openState)
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      isOpenOnMobile: openMobile,
      setIsOpenOnMobile: setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext value={contextValue}>
      <div
        className={cn(
          "**:data-[slot=icon]:shrink-0",
          "[--sidebar-width:17rem] [--sidebar-width-mobile:18rem] [--sidebar-width-dock:3.25rem]",
          "[--sidebar-border:color-mix(in_oklch,var(--color-sidebar)_25%,black_6%)]",
          "dark:[--sidebar-border:color-mix(in_oklch,var(--color-sidebar)_55%,white_10%)]",
          "[--sidebar-accent:color-mix(in_oklab,var(--color-sidebar)_95%,black_5%)]",
          "dark:[--sidebar-accent:color-mix(in_oklab,var(--color-sidebar)_85%,white_15%)]",
          "flex min-h-svh w-full text-sidebar-fg",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    </SidebarContext>
  )
}

const gap = tv({
  base: [
    "w-(--sidebar-width) group-data-[sidebar-collapsible=hidden]/sidebar-container:w-0",
    "duration-200 relative h-svh bg-transparent transition-[width] ease-linear",
    "group-data-[sidebar-side=right]/sidebar-container:rotate-180"
  ],
  variants: {
    intent: {
      default: "group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock)",
      fleet: "group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock)",
      float:
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var(--sidebar-width-dock)+theme(spacing.4))]",
      inset:
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var(--sidebar-width-dock)+theme(spacing.2))]"
    }
  }
})

const sidebar = tv({
  base: [
    "duration-200 fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] ease-linear md:flex",
    "bg-bg min-h-screen",
    "**:data-[slot=disclosure]:border-0 **:data-[slot=disclosure]:px-2",
    "[--bg-sidebar-container:(--color-sidebar)]"
  ],
  variants: {
    side: {
      left: "left-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:left-[calc(var(--sidebar-width)*-1)]",
      right: "right-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:right-[calc(var(--sidebar-width)*-1)]"
    },
    intent: {
      float: "p-2 group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var+theme(spacing.4)+2px)]",
      inset: [
        "p-2 group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var(--sidebar-width-dock)+theme(spacing.2)+2px)]",
        "[--bg-sidebar-container:(--color-bg)]"
      ],
      fleet: [
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock)",
        "**:data-sidebar-section:px-0 **:data-sidebar-disclosure:px-0 **:data-sidebar-section:gap-y-0 **:data-sidebar-disclosure:gap-y-0",
        "group-data-[sidebar-side=right]/sidebar-container:border-l group-data-[sidebar-side=left]/sidebar-container:border-r"
      ],
      default: [
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock) group-data-[sidebar-side=left]/sidebar-container:border-(--sidebar-border)",
        "group-data-[sidebar-side=right]/sidebar-container:border-l group-data-[sidebar-side=left]/sidebar-container:border-r"
      ]
    }
  }
})

interface SidebarProps extends React.ComponentProps<"div"> {
  intent?: "default" | "float" | "inset" | "fleet"
  collapsible?: "hidden" | "dock" | "none"
  side?: "left" | "right"
  closeButton?: boolean
}

const Sidebar = ({
  closeButton = true,
  collapsible = "hidden",
  side = "left",
  intent = "default",
  className,
  ...props
}: SidebarProps) => {
  const { isMobile, state, isOpenOnMobile, setIsOpenOnMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-sidebar-collapsible="none"
        className={cn("flex h-full peer w-(--sidebar-width) flex-col border-r bg-sidebar text-sidebar-fg ", className)}
        {...props}
      />
    )
  }

  if (isMobile) {
    return (
      <Sheet isOpen={isOpenOnMobile} onOpenChange={setIsOpenOnMobile} {...props}>
        <Sheet.Content
          closeButton={closeButton}
          aria-label="Sidebar"
          data-sidebar-intent="default"
          classNames={{
            content: "bg-sidebar w-(--sidebar-width-mobile) text-sidebar-fg [&>button]:hidden"
          }}
          isStack={intent === "float"}
          side={side}
        >
          <Sheet.Body className="px-0">{props.children}</Sheet.Body>
        </Sheet.Content>
      </Sheet>
    )
  }

  return (
    <div
      data-sidebar-state={state}
      data-sidebar-collapsible={state === "collapsed" ? collapsible : ""}
      data-sidebar-intent={intent}
      data-sidebar-side={side}
      className="group/sidebar-container peer hidden md:block text-sidebar-fg"
      {...props}
    >
      <div className={gap({ intent })} />
      <div
        className={sidebar({
          side,
          intent,
          className
        })}
        {...props}
      >
        <div
          data-sidebar="default"
          className="flex h-full group-data-[sidebar-intent=inset]/sidebar-container:bg-bg bg-sidebar text-sidebar-fg w-full flex-col group-data-[sidebar-intent=float]/sidebar-container:rounded-lg group-data-[sidebar-intent=float]/sidebar-container:border group-data-[sidebar-intent=float]/sidebar-container:border-(--sidebar-border) group-data-[sidebar-intent=float]/sidebar-container:shadow-xs"
        >
          {props.children}
        </div>
      </div>
    </div>
  )
}

const header = tv({
  base: "flex flex-col mb-2 **:data-[slot=sidebar-label-mask]:hidden",
  variants: {
    collapsed: {
      false: "px-5 py-[calc(var(--spacing)*4)]",
      true: "p-5 mt-2 md:p-0 md:size-9 group-data-[sidebar-intent=float]/sidebar-container:mt-2 md:rounded-lg md:hover:bg-(--sidebar-accent) md:mx-auto md:justify-center md:items-center"
    }
  }
})

const SidebarHeader = ({ className, ref, ...props }: React.ComponentProps<"div">) => {
  const { state } = React.use(SidebarContext)!
  return (
    <div
      ref={ref}
      data-sidebar-header="true"
      className={header({ collapsed: state === "collapsed", className })}
      {...props}
    />
  )
}

const footer = tv({
  base: [
    "flex flex-col mt-auto p-2",
    "in-data-[sidebar-intent=fleet]:mt-0 in-data-[sidebar-intent=fleet]:p-0",
    "in-data-[sidebar-intent=fleet]:**:data-[slot=menu-trigger]:rounded-none",
    "**:data-[slot=menu-trigger]:relative **:data-[slot=menu-trigger]:overflow-hidden",
    "**:data-[slot=menu-trigger]:rounded-lg",
    "**:data-[slot=menu-trigger]:outline-hidden **:data-[slot=menu-trigger]:cursor-default **:data-[slot=menu-trigger]:p-2 **:data-[slot=menu-trigger]:items-center sm:**:data-[slot=menu-trigger]:text-sm **:data-[slot=menu-trigger]:flex **:data-[slot=menu-trigger]:gap-x-2",
    "**:data-[slot=menu-trigger]:data-hovered:bg-(--sidebar-accent) **:data-[slot=menu-trigger]:data-hovered:text-fg"
  ],
  variants: {
    collapsed: {
      false: [
        "**:data-[slot=avatar]:size-8 **:data-[slot=avatar]:*:size-8",
        "**:data-[slot=menu-trigger]:w-full **:data-[slot=menu-trigger]:**:data-[slot=chevron]:transition-transform **:data-[slot=menu-trigger]:data-pressed:**:data-[slot=chevron]:rotate-180 **:data-[slot=menu-trigger]:**:data-[slot=chevron]:ml-auto"
      ],
      true: [
        "**:data-[slot=avatar]:size-6 **:data-[slot=avatar]:*:size-6",
        "**:data-[slot=menu-label]:hidden **:data-[slot=chevron]:hidden",
        "**:data-[slot=menu-trigger]:size-8 **:data-[slot=menu-trigger]:grid **:data-[slot=menu-trigger]:place-content-center"
      ]
    }
  }
})

const SidebarFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  return <div data-sidebar-footer="true" className={footer({ collapsed, className })} {...props} />
}

const SidebarContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { state } = useSidebar()
  return (
    <div
      data-sidebar-content="true"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto scroll-mb-96",
        state === "collapsed" && "items-center",
        className
      )}
      {...props}
    />
  )
}

const SidebarSectionGroup = ({ className, ...props }: React.ComponentProps<"section">) => {
  return <section data-sidebar-section-group="true" className={cn("flex flex-col gap-y-6", className)} {...props} />
}

const SidebarSection = ({ className, ...props }: React.ComponentProps<"div"> & { title?: string }) => {
  const { state } = useSidebar()
  return (
    <div data-sidebar-section="true" className={cn("flex flex-col px-2 gap-y-0.5", className)} {...props}>
      {state !== "collapsed" && "title" in props && (
        <Header className="duration-200 flex shrink-0 items-center rounded-md px-2.5 text-xs font-medium text-sidebar-fg/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear data-focus-visible:ring-2 *:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0 group-data-[sidebar-collapsible=dock]/sidebar-container:-mt-8 group-data-[sidebar-collapsible=dock]/sidebar-container:opacity-0">
          {props.title}
        </Header>
      )}
      {props.children}
    </div>
  )
}

const sidebarItem = tv({
  base: [
    "text-sidebar-fg/70 relative px-2.5 py-[calc(var(--spacing)*1.7)] overflow-hidden gap-x-2 w-full group cursor-pointer flex items-center sm:text-sm rounded-lg outline-hidden",
    "**:data-[slot=menu-trigger]:absolute **:data-[slot=menu-trigger]:h-full **:data-[slot=menu-trigger]:items-center **:data-[slot=menu-trigger]:w-[calc(var(--sidebar-width)-90%)] **:data-[slot=menu-trigger]:right-0 **:data-[slot=menu-trigger]:flex **:data-[slot=menu-trigger]:justify-end **:data-[slot=menu-trigger]:pr-2.5",
    "**:data-[slot=menu-trigger]:hidden",
    "**:data-[slot=icon]:size-4 **:data-[slot=avatar]:size-4 **:data-[slot=avatar]:*:size-4 **:data-[slot=icon]:shrink-0 **:data-[slot=avatar]:shrink-0",
    "**:data-[slot=menu-trigger]:bg-gradient-to-l **:data-[slot=menu-trigger]:from-(--sidebar-accent) **:data-[slot=menu-trigger]:from-65%",
    "in-data-[sidebar-intent=fleet]:rounded-none"
  ],
  variants: {
    collapsed: {
      true: "size-9 justify-center p-0 gap-x-0"
    },
    isCurrent: {
      true: "bg-primary text-primary-fg **:data-[slot=icon]:text-primary-fg **:data-[slot=menu-trigger]:from-primary data-hovered:bg-primary data-hovered:text-primary-fg [&_.text-muted-fg]:text-primary-fg/80"
    },
    isActive: {
      true: "bg-(--sidebar-accent) text-sidebar-fg **:data-[slot=menu-trigger]:flex"
    },
    isDisabled: {
      true: "opacity-50 cursor-default"
    }
  }
})

interface SidebarItemProps extends Omit<React.ComponentProps<typeof Link>, "children"> {
  isCurrent?: boolean
  tooltip?: React.ReactNode | string
  children?:
    | React.ReactNode
    | ((values: LinkRenderProps & { defaultChildren: React.ReactNode; isCollapsed: boolean }) => React.ReactNode)
  badge?: string | number | undefined
}

const SidebarItem = ({ isCurrent, tooltip, children, badge, className, ref, ...props }: SidebarItemProps) => {
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile
  const link = (
    <Link
      ref={ref}
      data-sidebar-item="true"
      aria-current={isCurrent ? "page" : undefined}
      className={composeRenderProps(className, (cls, renderProps) =>
        sidebarItem({
          ...renderProps,
          isCurrent,
          collapsed: isCollapsed,
          isActive: renderProps.isPressed || renderProps.isFocusVisible || renderProps.isHovered,
          className: cls
        })
      )}
      {...props}
    >
      {(values) => (
        <>
          {typeof children === "function" ? children({ ...values, isCollapsed }) : children}

          {badge && (
            <>
              {state !== "collapsed" ? (
                <Badge
                  shape="square"
                  intent="primary"
                  data-slot="sidebar-badge"
                  className="w-auto inset-y-1/2 text-[10px] dark:group-data-current:bg-[color-mix(in_oklab,var(--color-primary)_20%,white_15%)] group-data-current:bg-[color-mix(in_oklab,var(--color-primary)_20%,white_20%)] group-data-current:text-primary-fg inset-ring-1 inset-ring-primary/20 group-data-current:inset-ring-transparent dark:group-data-current:text-current transition-colors -translate-y-1/2 absolute right-1.5 h-5.5"
                >
                  {badge}
                </Badge>
              ) : (
                <div aria-hidden className="size-1.5 rounded-full absolute right-1 top-1 bg-primary" />
              )}
            </>
          )}
        </>
      )}
    </Link>
  )

  return isCollapsed && tooltip ? (
    <Tooltip delay={0}>
      {link}
      <Tooltip.Content
        className="**:data-[slot=sidebar-label-mask]:hidden **:data-[slot=icon]:hidden"
        intent="inverse"
        showArrow={false}
        placement="right"
      >
        {tooltip}
      </Tooltip.Content>
    </Tooltip>
  ) : (
    link
  )
}

const SidebarLink = ({ className, ...props }: React.ComponentProps<typeof Link>) => {
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  return (
    <Link
      className={cn(
        "flex items-center focus:outline-hidden w-full gap-x-2",
        collapsed && "absolute inset-0 size-full",
        className
      )}
      {...props}
    />
  )
}

const SidebarInset = ({ className, ref, ...props }: React.ComponentProps<"main">) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col inset-ring-1 inset-ring-transparent peer-data-[sidebar-intent=inset]:inset-ring-(--sidebar-border)",
        "bg-bg peer-data-[sidebar-intent=inset]:bg-sidebar",
        "peer-data-[sidebar-intent=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[sidebar-intent=inset]:m-2 md:peer-data-[sidebar-state=collapsed]:peer-data-[sidebar-intent=inset]:ml-2 md:peer-data-[sidebar-intent=inset]:ml-0 md:peer-data-[sidebar-intent=inset]:rounded-xl md:peer-data-[sidebar-intent=inset]:shadow-xs",
        className
      )}
      {...props}
    />
  )
}

const SidebarDisclosureGroup = ({
  allowsMultipleExpanded = true,
  className,
  ...props
}: React.ComponentProps<typeof DisclosureGroup>) => {
  return (
    <DisclosureGroup
      data-sidebar-disclosure-group="true"
      allowsMultipleExpanded={allowsMultipleExpanded}
      className={cn("flex flex-col gap-y-0.5", className)}
      {...props}
    />
  )
}

const SidebarDisclosure = ({ className, ...props }: React.ComponentProps<typeof Disclosure>) => {
  return <Disclosure data-sidebar-disclosure="true" className={cn("px-2", className)} {...props} />
}

const sidebarDisclosureTrigger = tv({
  base: [
    "text-sidebar-fg/70 relative px-2.5 py-[calc(var(--spacing)*1.7)] overflow-hidden gap-x-2 w-full group cursor-pointer flex items-center sm:text-sm rounded-lg outline-hidden",
    "in-data-[sidebar-intent=fleet]:rounded-none in-data-[sidebar-intent=fleet]:**:data-[slot=chevron]:hidden in-data-[sidebar-intent=fleet]:py-2"
  ],
  variants: {
    collapsed: {
      true: "size-9 justify-center p-0 gap-x-0"
    },
    isActive: {
      true: "bg-(--sidebar-accent) text-sidebar-fg"
    },
    isDisabled: {
      true: "opacity-50 cursor-default"
    }
  }
})

const SidebarDisclosureTrigger = ({ className, ...props }: React.ComponentProps<typeof Button>) => {
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  return (
    <Heading level={3}>
      <Trigger
        slot="trigger"
        className={composeRenderProps(className, (className, renderProps) =>
          sidebarDisclosureTrigger({
            ...renderProps,
            collapsed,
            isActive: renderProps.isPressed || renderProps.isFocusVisible || renderProps.isHovered,
            className
          })
        )}
        {...props}
      >
        {(values) => (
          <>
            {typeof props.children === "function" ? props.children(values) : props.children}
            {state !== "collapsed" && (
              <IconChevronLgLeft
                data-slot="chevron"
                className="ml-auto z-10 size-3.5 group-aria-expanded:-rotate-90 transition-transform"
              />
            )}
          </>
        )}
      </Trigger>
    </Heading>
  )
}

const SidebarDisclosurePanel = ({ className, ...props }: React.ComponentProps<typeof DisclosurePanel>) => {
  return (
    <DisclosurePanel
      data-sidebar-disclosure-panel="true"
      className={cn(
        [
          // 'in-data-[sidebar-intent=fleet]:**:data-sidebar-disclosure:*:[h3]:**:[[slot=trigger]]:pl-[calc(var(--sidebar-width)-90%)]',
          //   "in-data-[sidebar-intent=fleet]:**:data-sidebar-disclosure-group:**:[[slot=trigger]]:pl-9",
          // "in-data-[sidebar-intent=fleet]:**:data-sidebar-disclosure:pl-4",
          // "in-data-[sidebar-intent=fleet]:**:data-sidebar-item:pl-4",
          // "in-data-[sidebar-intent=fleet]:**:data-sidebar-disclosure:**:data-sidebar-disclosure-panel:pl-9",
          // "in-data-[sidebar-intent=fleet]:**:data-sidebar-disclosure-group:**:data-sidebar-disclosure:pl-9"
        ],
        className
      )}
      {...props}
    />
  )
}

const SidebarSeparator = ({ className, ...props }: React.ComponentProps<typeof Separator>) => {
  return (
    <Separator className={cn("mx-auto my-2 w-[calc(var(--sidebar-width)-theme(spacing.6))]", className)} {...props} />
  )
}

const SidebarTrigger = ({ onPress, ...props }: React.ComponentProps<typeof Trigger>) => {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      aria-label={props["aria-label"] || "Toggle Sidebar"}
      data-sidebar-trigger="true"
      appearance="plain"
      size="square-petite"
      onPress={(event: PressEvent) => {
        onPress?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <IconSidebarFill className="md:inline hidden" />
      <IconHamburger className="md:hidden inline" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

const SidebarRail = ({ className, ref, ...props }: React.ComponentProps<"button">) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      className={cn(
        "absolute outline-hidden inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] data-hovered:after:bg-transparent group-data-[sidebar-side=left]/sidebar-container:-right-4 group-data-[sidebar-side=right]/sidebar-container:left-0 sm:flex",
        "in-data-[sidebar-side=left]:cursor-w-resize in-data-[sidebar-side=right]:cursor-e-resize",
        "[[data-sidebar-side=left][data-sidebar-state=collapsed]_&]:cursor-e-resize [[data-sidebar-side=right][data-sidebar-state=collapsed]_&]:cursor-w-resize",
        "group-data-[sidebar-collapsible=hidden]/sidebar-container:translate-x-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:after:left-full group-data-[sidebar-collapsible=hidden]/sidebar-container:hover:bg-secondary",
        "[[data-sidebar-side=left][data-sidebar-collapsible=hidden]_&]:-right-2 [[data-sidebar-side=right][data-sidebar-collapsible=hidden]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
}

const SidebarLabel = ({ className, ...props }: React.ComponentProps<typeof Text>) => {
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  if (!collapsed) {
    return (
      <Text slot="label" className={cn("flex flex-1 w-full overflow-hidden whitespace-nowrap", className)} {...props}>
        {props.children}
      </Text>
    )
  }
  return null
}

const navStyles = tv({
  base: "md:w-full justify-between sm:justify-start h-[3.57rem] px-4 border-b sm:border-b-0 flex items-center gap-x-2",
  variants: {
    isSticky: {
      true: "sticky top-0 z-40"
    }
  }
})

interface SidebarNavProps extends React.ComponentProps<"nav"> {
  isSticky?: boolean
}

const SidebarNav = ({ isSticky = false, className, ...props }: SidebarNavProps) => {
  return <nav data-slot="sidebar-nav" {...props} className={navStyles({ isSticky, className })} />
}

export {
  SidebarProvider,
  SidebarNav,
  SidebarHeader,
  SidebarContent,
  SidebarSectionGroup,
  SidebarSection,
  SidebarItem,
  SidebarLink,
  SidebarFooter,
  Sidebar,
  SidebarDisclosureGroup,
  SidebarDisclosure,
  SidebarSeparator,
  SidebarDisclosureTrigger,
  SidebarDisclosurePanel,
  SidebarTrigger,
  SidebarLabel,
  SidebarInset,
  SidebarRail,
  useSidebar
}
