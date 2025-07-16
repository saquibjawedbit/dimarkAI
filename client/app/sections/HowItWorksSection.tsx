import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Bot, BarChart3 } from "lucide-react"
import React from "react"

const steps = [
  {
    step: "01",
    title: "Connect your Facebook Page",
    description: "Securely link your Facebook Business account with our one-click integration.",
    icon: Facebook,
    gradient: "from-blue-500 to-indigo-600",
    delay: "delay-100",
  },
  {
    step: "02",
    title: "AI Agent generates tailored ads",
    description: "Our intelligent system analyzes your brand and creates high-converting ad campaigns.",
    icon: Bot,
    gradient: "from-indigo-500 to-purple-600",
    delay: "delay-200",
  },
  {
    step: "03",
    title: "Live monitoring & optimization",
    description: "Watch as AI continuously optimizes your campaigns for maximum ROI in real-time.",
    icon: BarChart3,
    gradient: "from-green-500 to-emerald-600",
    delay: "delay-300",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-fade-in-up">
            How It{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-600 animate-fade-in-up delay-100">
            Three simple steps to automated Facebook ad success
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((item, index) => (
            <Card
              key={index}
              className={`bg-white border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group animate-fade-in-up ${item.delay}`}
            >
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
