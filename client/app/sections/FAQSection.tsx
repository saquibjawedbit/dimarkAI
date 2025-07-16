import { Card, CardContent } from "@/components/ui/card"

const faqs = [
  {
    question: "How does DiMark AI create ads?",
    answer:
      "Our AI analyzes your business, industry trends, and successful ad patterns to generate compelling ad copy and select optimal targeting parameters automatically.",
  },
  {
    question: "Do I need Facebook advertising experience?",
    answer:
      "Not at all! DiMark AI is designed for business owners with no advertising experience. Our AI handles all the technical aspects while you focus on running your business.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Most customers see improved performance within the first week. Our AI continuously optimizes your campaigns, so results improve over time as it learns more about your audience.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.",
  },
]

export default function FAQSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-fade-in-up">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Questions</span>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className={`bg-white border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up delay-${index * 100}`}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
