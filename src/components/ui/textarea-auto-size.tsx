import { cn } from "@/components/ui/primitive"
import TextareaAutosize from "react-textarea-autosize"

export function TextareaAutoSize({ className, ...props }: React.ComponentPropsWithoutRef<typeof TextareaAutosize>) {
  return (
    <TextareaAutosize
      className={cn("w-full resize-none max-h-56 min-h-20 p-3 focus:outline-hidden rounded-xl", className)}
      {...props}
    />
  )
}
