import { Loader } from "@/components/ui/loader"
import { motion } from "motion/react"

export const Thinking = () => {
  return (
    <motion.div
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      className="flex items-center gap-3"
    >
      <div className="flex items-center inset-ring-1 inset-ring-primary/10 justify-center size-10 bg-secondary/80 rounded-full">
        <Loader className="text-fg size-5" />
      </div>
      <p className="text-sm text-muted-fg">Thinking...</p>
    </motion.div>
  )
}
