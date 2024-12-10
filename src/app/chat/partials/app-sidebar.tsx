"use client"

import * as React from "react"

import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Menu } from "@/components/ui/menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarLink,
  SidebarSection,
  SidebarSectionGroup
} from "@/components/ui/sidebar"
import { IconArchive2, IconBrandApple, IconDotsHorizontal, IconHighlight, IconTrash, IconUpload } from "justd-icons"

import messages from "../messages/messages.json"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link
          className="flex items-center group-data-[collapsible=dock]:size-10 group-data-[collapsible=dock]:justify-center gap-x-2"
          href="/chat"
        >
          <IconBrandApple className="size-5" />
          <SidebarLabel className="font-medium">Apple</SidebarLabel>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarSectionGroup>
          <SidebarSection>
            <Button appearance="outline" onPress={() => alert("New Chat")}>
              <IconHighlight />
              <SidebarLabel>New Chat</SidebarLabel>
            </Button>
          </SidebarSection>
          <SidebarSection title="Recent Chats">
            {messages.slice(0, 10).map((item) => (
              <SidebarItem key={item.id}>
                {({ isCollapsed, isHovered }) => (
                  <>
                    <SidebarLink href="#discount">
                      <SidebarLabel>{item.message}</SidebarLabel>
                    </SidebarLink>
                    {!isCollapsed && isHovered && (
                      <Menu>
                        <Menu.Trigger aria-label="Manage">
                          <IconDotsHorizontal />
                        </Menu.Trigger>
                        <Menu.Content offset={0} placement="right top">
                          <Menu.Item href="#edit">
                            <IconHighlight />
                            Edit
                          </Menu.Item>
                          <Menu.Item href="#share">
                            <IconUpload />
                            Share
                          </Menu.Item>
                          <Menu.Item href="#archive">
                            <IconArchive2 />
                            Archive
                          </Menu.Item>
                          <Menu.Item isDanger={true} href="#delete">
                            <IconTrash />
                            Delete
                          </Menu.Item>
                        </Menu.Content>
                      </Menu>
                    )}
                  </>
                )}
              </SidebarItem>
            ))}
          </SidebarSection>
        </SidebarSectionGroup>
      </SidebarContent>

      <SidebarFooter>
        <ThemeSwitcher />
      </SidebarFooter>
    </Sidebar>
  )
}
