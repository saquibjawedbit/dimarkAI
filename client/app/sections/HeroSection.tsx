import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles, CheckCircle } from "lucide-react"
import React from "react"
import DashboardPreviewSection from "./DashboardPreviewSection"

interface HeroSectionProps {
  isVisible: boolean
}

export default function HeroSection({ isVisible }: HeroSectionProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-8 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full px-4 py-2 border-0 animate-fade-in-up">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                AI-Powered Marketing Revolution
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-gray-900">
                Let AI Run Your{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-text">
                  Facebook Ads
                </span>{" "}
                — Smarter, Faster, Better.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl animate-fade-in-up delay-200">
                DiMark AI automates ad generation, publishing, and optimization using cutting-edge AI agents — built specifically for small businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-4 text-lg bg-white/80 border-gray-300 hover:bg-white hover:shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-2" />
                  See How It Works
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-500 animate-fade-in-up delay-500">
                <div className="flex items-center group">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                  No setup fees
                </div>
                <div className="flex items-center group">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                  Cancel anytime
                </div>
                <div className="flex items-center group">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                  14-day free trial
                </div>
              </div>
            </div>
            <DashboardPreviewSection progressValue={80} />   
          </div>
        </div>
      </div>
    </section>
  )
}
