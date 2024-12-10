"use client"

import { Button } from "@/components/ui/button"
import { TextareaAutoSize } from "@/components/ui/textarea-auto-size"
import { IconArrowUp, IconGlobe2, IconMic, IconPaperclip2 } from "justd-icons"
import { AnimatePresence, motion } from "motion/react"
import { FileTrigger, Form } from "react-aria-components"

interface ChatFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
}

export function ChatForm({ value, onChange, onSubmit }: ChatFormProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(value)
  }

  return (
    <div className="mt-auto bg-bg sticky bottom-6">
      <Form onSubmit={handleSubmit}>
        <div className="group border focus-within:border-primary/10 duration-200 bg-secondary rounded-lg">
          <TextareaAutoSize onChange={handleChange} value={value} placeholder="Type your message here..." />

          <div className="flex items-center justify-between gap-x-2 p-3">
            <div className="flex items-center gap-x-2">
              <FileTrigger>
                <IconPaperclip2 />
              </FileTrigger>
              <FileTrigger>
                <IconGlobe2 />
              </FileTrigger>
            </div>
            <Button type="submit" size="square-petite" shape="circle" className="*:data-[slot=icon]:size-5">
              <AnimatePresence mode="wait" initial={false}>
                {value === "" ? (
                  <motion.span key="mic" variants={variants} initial="hidden" animate="visible" exit="hidden">
                    <IconMic />
                  </motion.span>
                ) : (
                  <motion.span key="enter" variants={variants} initial="hidden" animate="visible" exit="hidden">
                    <IconArrowUp />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}

const variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1 }
}
