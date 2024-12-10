import { Heading } from "@/components/ui/heading"

export function Idle() {
  return (
    <div className="flex mt-auto flex-col">
      <Heading className="text-center mb-6">How can I assist you today?</Heading>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary/80 rounded-lg p-4">
          <h3 className="text-lg font-semibold">Generate Ideas</h3>
          <p className="text-sm">Get creative suggestions for your projects.</p>
        </div>
        <div className="bg-secondary/80 rounded-lg p-4">
          <h3 className="text-lg font-semibold">Answer Questions</h3>
          <p className="text-sm">Find solutions to your queries quickly.</p>
        </div>
        <div className="bg-secondary/80 rounded-lg p-4">
          <h3 className="text-lg font-semibold">Draft Content</h3>
          <p className="text-sm">Write compelling articles, emails, or posts.</p>
        </div>
        <div className="bg-secondary/80 rounded-lg p-4">
          <h3 className="text-lg font-semibold">Learn New Topics</h3>
          <p className="text-sm">Understand complex subjects with ease.</p>
        </div>
      </div>
    </div>
  )
}
