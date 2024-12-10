"use client"

import { useEffect, useState } from "react"

import { ChatForm } from "@/app/chat/messages/chat-form"
import { Idle } from "@/app/chat/messages/idle"
import { Thinking } from "@/app/chat/messages/thinking"
import { cn } from "@/components/ui/primitive"
import { useScrollToBottom } from "@/utils/use-scroll-to-bottom"
import { motion } from "framer-motion"
import { IconBrain } from "justd-icons"

import _messages from "./messages.json"

interface Message {
  id: string
  role: string
  message: string
}

export function Messages() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>(_messages)
  const [message, setMessage] = useState("")
  const [lastAnimatedId, setLastAnimatedId] = useState<string | null>(null)

  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>()

  const addMessage = (role: string, messageContent: string) => {
    const newId = String(messages.length + 1)
    setMessages((prev) => [...prev, { id: newId, role, message: messageContent }])
    setLastAnimatedId(newId) // Update the last animated ID
  }

  function action(value: string) {
    if (!value.trim()) return

    // Add the user's message
    addMessage("user", value)

    // Clear the input field
    setMessage("")

    // Simulate a delay to show the "Thinking" component
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false) // End "Thinking"
      setTimeout(() => {
        // Add the assistant's reply after "Thinking" ends
        addMessage(
          "assistant",
          "Albert Einstein developed the theory of relativity, fundamentally altering our understanding of space, time, and gravity. This groundbreaking work laid the foundation for modern physics, influencing countless scientific advancements and reshaping humanity's perspective of the universe."
        )
      }, 100) // Slight delay to ensure smooth transition
    }, 2000) // Adjust delay time for "Thinking"
  }

  return (
    <div className="mx-auto max-w-2xl gap-y-6 flex flex-col justify-between h-dvh">
      <div className="shrink-0 min-w-[24px] min-h-10" />
      {messages.length > 0 ? (
        <div ref={messagesContainerRef} className="flex overflow-y-auto flex-1 pr-8 pt-4 flex-col gap-y-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isNew={lastAnimatedId === message.id} // Only animate the last message
            />
          ))}
          {isLoading && <Thinking />}
          <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-20" />
        </div>
      ) : (
        <Idle />
      )}
      <ChatForm value={message} onChange={setMessage} onSubmit={action} />
    </div>
  )
}

interface MessageProps extends React.ComponentProps<"div"> {
  message: Message
  isNew: boolean // Indicates if this is a newly added message
}

function Message({ message, isNew, ...props }: MessageProps) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    if (isNew && message.role === "assistant") {
      setDisplayedText("") // Reset displayed text
      let index = 0
      const interval = setInterval(() => {
        if (index < message.message.length) {
          setDisplayedText((prev) => prev + message.message[index])
          index++
        } else {
          clearInterval(interval)
        }
      }, 20) // Adjust delay between characters
      return () => clearInterval(interval)
    } else {
      setDisplayedText(message.message) // Show full message for old or non-animated messages
    }
  }, [message, isNew])
  return (
    <div className="flex items-start gap-2">
      {message.role !== "user" && (
        <div className="flex items-center inset-ring-1 inset-ring-primary/10 justify-center size-10 bg-secondary/80 rounded-full">
          <IconBrain className="text-fg size-6" />
        </div>
      )}
      <div
        className={cn("flex leading-relaxed text-sm", message.role === "user" ? "justify-end w-full" : "justify-start")}
        {...props}
      >
        <motion.div
          initial={{ opacity: isNew ? 0 : 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: isNew ? 0.3 : 0 }}
          className={cn(
            "rounded-xl p-3 shadow-md max-w-sm",
            message.role === "user" ? "bg-secondary/80 text-fg" : "bg-secondary text-fg"
          )}
        >
          <p>{displayedText}</p>
        </motion.div>
      </div>
    </div>
  )
}
