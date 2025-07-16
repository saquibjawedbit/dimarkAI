import { FeatureCard } from "../../components/landing/featureCard"
import { features } from "./constants/features"
import { Feature } from "./types"

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-fade-in-up">
            Powerful{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-gray-600 animate-fade-in-up delay-100">
            Everything you need to dominate Facebook advertising
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature: Feature, index: number) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
