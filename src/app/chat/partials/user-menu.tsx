"use client"

import { Avatar } from "@/components/ui/avatar"
import { Menu } from "@/components/ui/menu"
import { IconCommandRegular, IconDashboard, IconHeadphones, IconLogout, IconSettings, IconShield } from "justd-icons"

export function UserMenu() {
  return (
    <Menu>
      <Menu.Trigger className="flex ml-auto items-center gap-x-2" aria-label="Profile" data-slot="menu-trigger">
        <Avatar shape="circle" alt="Robert" src="/robert.jpg" />
      </Menu.Trigger>
      <Menu.Content placement="bottom right" className="sm:min-w-56">
        <Menu.Item href="#dashboard">
          <IconDashboard />
          Customize Chat
        </Menu.Item>
        <Menu.Item href="#settings">
          <IconSettings />
          Settings
        </Menu.Item>
        <Menu.Item href="#security">
          <IconShield />
          Security
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item>
          <IconCommandRegular />
          Command Menu
        </Menu.Item>

        <Menu.Item href="#contact">
          <IconHeadphones />
          Customer Support
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item href="#logout">
          <IconLogout />
          Log out
        </Menu.Item>
      </Menu.Content>
    </Menu>
  )
}
