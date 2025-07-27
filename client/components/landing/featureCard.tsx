import { Feature } from "@/app/_sections/types"
import { Card, CardContent } from "../ui/card"

export function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon
  return (
    <Card
      className={`bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 group animate-fade-in-up ${feature.delay}`}
    >
      <CardContent className="p-6">
        <div
          className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
      </CardContent>
    </Card>
  )
}