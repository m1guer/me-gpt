import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Menu } from "@/components/ui/menu"
import { IconChevronLgDown, IconDeviceDesktop2, IconMoon, IconSun } from "justd-icons"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  return (
    <Menu>
      <Button appearance="plain" className="group w-full justify-between">
        <div className="flex gap-x-2 items-center">
          {theme === "light" ? <IconSun /> : theme === "dark" ? <IconMoon /> : <IconDeviceDesktop2 />}
          Theme
        </div>
        <IconChevronLgDown className="group-data-pressed:rotate-180 duration-200 size-4" />
      </Button>
      <Menu.Content
        className="sm:min-w-(--trigger-width)"
        selectionMode="single"
        selectedKeys={theme}
        onAction={(v) => setTheme(v as string)}
      >
        <Menu.Checkbox id="light">Light</Menu.Checkbox>
        <Menu.Checkbox id="dark">Dark</Menu.Checkbox>
        <Menu.Checkbox id="system">System</Menu.Checkbox>
      </Menu.Content>
    </Menu>
  )
}
