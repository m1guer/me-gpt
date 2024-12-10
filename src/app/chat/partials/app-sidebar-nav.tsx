"use client"

import * as React from "react"

import { UserMenu } from "@/app/chat/partials/user-menu"
import { Button } from "@/components/ui/button"
import { Menu } from "@/components/ui/menu"
import { SidebarNav, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Tooltip } from "@/components/ui/tooltip"
import { IconChevronLgDown, IconHighlight } from "justd-icons"

export function AppSidebarNav() {
  const { state, isMobile } = useSidebar()
  return (
    <SidebarNav isSticky>
      <span className="flex items-center gap-x-2">
        <SidebarTrigger className="-mx-2" />
        {(state === "collapsed" || isMobile) && (
            <Tooltip>
              <Button size="small" appearance="plain">
                <IconHighlight />
              </Button>
              <Tooltip.Content>
                <h3 className="text-sm font-semibold">New Chat</h3>
                <p className="text-sm">Get creative suggestions for your projects.</p>
              </Tooltip.Content>
            </Tooltip>
          )}
        <Menu>
          <Button appearance="plain" aria-label="Model">
            <span className="text-sm font-medium">GPT-4</span>
            <IconChevronLgDown className="size-4 text-muted-fg" />
          </Button>
          <Menu.Content>
            <Menu.Item>GPT-4</Menu.Item>
            <Menu.Item>GPT-3.5</Menu.Item>
            <Menu.Item>GPT-3</Menu.Item>
            <Menu.Item>GPT-2</Menu.Item>
          </Menu.Content>
        </Menu>
      </span>
      <UserMenu />
    </SidebarNav>
  )
}
