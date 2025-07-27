"use client"

import { useState, useEffect } from "react"
import "../styles/landing.css"
import HeroSection from "./_sections/HeroSection"
import StatsSection from "./_sections/StatsSection"
import HowItWorksSection from "./_sections/HowItWorksSection"
import FeaturesSection from "./_sections/FeaturesSection"
import IndustriesSection from "./_sections/IndustriesSection"
import TestimonialsSection from "./_sections/TestimonialsSection"
import PricingSection from "./_sections/PricingSection"
import FAQSection from "./_sections/FAQSection"
import CTASection from "./_sections/CTASection"
import FooterSection from "./_sections/FooterSection"
import { Bot } from "lucide-react"
import { Button } from "../components/ui/button"
import Link from "next/link"


export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(true)


  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 bg-white border-b border-black sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-black">
                DiMark AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-black hover:text-gray-700 transition-colors duration-300 hover:scale-105 transform"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-black hover:text-gray-700 transition-colors duration-300 hover:scale-105 transform"
              >
                How It Works
              </a>
              <a
                href="#industries"
                className="text-black hover:text-gray-700 transition-colors duration-300 hover:scale-105 transform"
              >
                Industries
              </a>
              <a
                href="#testimonials"
                className="text-black hover:text-gray-700 transition-colors duration-300 hover:scale-105 transform"
              >
                Reviews
              </a>
              <a
                href="#pricing"
                className="text-black hover:text-gray-700 transition-colors duration-300 hover:scale-105 transform"
              >
                Pricing
              </a>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-full bg-white border-black text-black hover:bg-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105"
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
