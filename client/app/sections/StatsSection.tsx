import { Users, TrendingUp, Clock, Award } from "lucide-react"
import React from "react"

const stats = [
  { number: "10,000+", label: "Active Users", icon: Users },
  { number: "500%", label: "Average ROI Increase", icon: TrendingUp },
  { number: "24/7", label: "AI Monitoring", icon: Clock },
  { number: "99.9%", label: "Uptime", icon: Award },
]

export default function StatsSection() {
  return (
    <section className="py-16 bg-white/50 backdrop-blur-sm relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className={`text-center group animate-fade-in-up delay-${index * 100}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
