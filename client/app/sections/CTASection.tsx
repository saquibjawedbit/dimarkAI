import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import React from "react"

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white animate-fade-in-up">
                Ready to{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Automate</span>{" "}Your Ads?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-100">
                Join thousands of small businesses already growing with DiMark AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto mb-6 animate-fade-in-up delay-200">
                <Input
                  type="email"
                  placeholder="Enter your business email"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-full px-6 py-4 text-lg backdrop-blur-sm focus:bg-white/30 transition-all duration-300"
                />
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 whitespace-nowrap"
                >
                  Get Started
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm text-blue-200 animate-fade-in-up delay-300">
                <div className="flex items-center group">
                  <Shield className="w-4 h-4 mr-2 text-green-300 group-hover:scale-110 transition-transform duration-300" />
                  No credit card required
                </div>
                <span>•</span>
                <span>14-day free trial</span>
                <span>•</span>
                <span>Cancel anytime</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
