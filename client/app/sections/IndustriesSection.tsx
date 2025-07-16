import { ShoppingBag, Utensils, Dumbbell, Camera, Coffee, Building } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import React from "react"

const industries = [
  { name: "E-commerce", icon: ShoppingBag, color: "text-blue-600" },
  { name: "Restaurants", icon: Utensils, color: "text-green-600" },
  { name: "Fitness", icon: Dumbbell, color: "text-purple-600" },
  { name: "Photography", icon: Camera, color: "text-pink-600" },
  { name: "Coffee Shops", icon: Coffee, color: "text-orange-600" },
  { name: "Real Estate", icon: Building, color: "text-indigo-600" },
]

export default function IndustriesSection() {
  return (
    <section id="industries" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-fade-in-up">
            Perfect for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Every Industry</span>
          </h2>
          <p className="text-xl text-gray-600 animate-fade-in-up delay-100">
            DiMark AI adapts to your business type and creates industry-specific campaigns
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
          {industries.map((industry, index) => (
            <Card
              key={index}
              className={`bg-white border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group animate-fade-in-up delay-${index * 50}`}
            >
              <CardContent className="p-6 text-center">
                <industry.icon
                  className={`w-8 h-8 ${industry.color} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                />
                <h3 className="text-sm font-semibold text-gray-900">{industry.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
