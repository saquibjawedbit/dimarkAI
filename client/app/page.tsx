"use client"

import { useState, useEffect } from "react"
import "../styles/landing.css"
import HeroSection from "./sections/HeroSection"
import StatsSection from "./sections/StatsSection"
import HowItWorksSection from "./sections/HowItWorksSection"
import FeaturesSection from "./sections/FeaturesSection"
import IndustriesSection from "./sections/IndustriesSection"
import TestimonialsSection from "./sections/TestimonialsSection"
import PricingSection from "./sections/PricingSection"
import FAQSection from "./sections/FAQSection"
import CTASection from "./sections/CTASection"
import FooterSection from "./sections/FooterSection"
import { Bot } from "lucide-react"
import { Button } from "../components/ui/button"
import Link from "next/link"


export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(true)


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-indigo-400/40 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-40 left-20 w-6 h-6 bg-purple-400/20 rounded-full animate-float-fast"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-blue-500/30 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-5 h-5 bg-indigo-300/25 rounded-full animate-float-medium"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-500/35 rounded-full animate-float-fast"></div>

        {/* Gradient Waves */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full animate-wave-1"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full animate-wave-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-300/5 to-blue-300/5 rounded-full animate-wave-3"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] animate-grid-move"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                DiMark AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 hover:scale-105 transform"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 hover:scale-105 transform"
              >
                How It Works
              </a>
              <a
                href="#industries"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 hover:scale-105 transform"
              >
                Industries
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 hover:scale-105 transform"
              >
                Reviews
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 hover:scale-105 transform"
              >
                Pricing
              </a>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-full bg-white/50 border-gray-300 hover:bg-white hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <HeroSection isVisible={isVisible} />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <IndustriesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}
