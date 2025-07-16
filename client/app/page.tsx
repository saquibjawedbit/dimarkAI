"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bot,
  ArrowRight,
  Play,
  Facebook,
  Zap,
  Target,
  BarChart3,
  Brain,
  Sparkles,
  Shield,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Clock,
  Award,
  Building,
  Coffee,
  ShoppingBag,
  Dumbbell,
  Camera,
  Utensils,
} from "lucide-react"

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  const testimonials = [
    {
      quote: "DiMark AI transformed our marketing completely. We saw a 300% increase in ROI within just 2 months.",
      name: "Sarah Chen",
      business: "Bloom Boutique",
      avatar: "SC",
      rating: 5,
    },
    {
      quote: "The AI knows exactly what our customers want. Our engagement rates have never been higher.",
      name: "Marcus Rodriguez",
      business: "Local Fitness Studio",
      avatar: "MR",
      rating: 5,
    },
    {
      quote: "From 10 hours a week on ads to zero. DiMark AI handles everything while I focus on my business.",
      name: "Emma Thompson",
      business: "Artisan Coffee Co.",
      avatar: "ET",
      rating: 5,
    },
  ]

  const industries = [
    { name: "E-commerce", icon: ShoppingBag, color: "text-blue-600" },
    { name: "Restaurants", icon: Utensils, color: "text-green-600" },
    { name: "Fitness", icon: Dumbbell, color: "text-purple-600" },
    { name: "Photography", icon: Camera, color: "text-pink-600" },
    { name: "Coffee Shops", icon: Coffee, color: "text-orange-600" },
    { name: "Real Estate", icon: Building, color: "text-indigo-600" },
  ]

  const stats = [
    { number: "10,000+", label: "Active Users", icon: Users },
    { number: "500%", label: "Average ROI Increase", icon: TrendingUp },
    { number: "24/7", label: "AI Monitoring", icon: Clock },
    { number: "99.9%", label: "Uptime", icon: Award },
  ]

  useEffect(() => {
    setIsVisible(true)
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    // Animate progress bar
    const progressTimer = setTimeout(() => {
      setProgressValue(75)
    }, 1500)

    return () => {
      clearInterval(timer)
      clearTimeout(progressTimer)
    }
  }, [])

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
              <Button
                variant="outline"
                className="rounded-full bg-white/50 border-gray-300 hover:bg-white hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
                  DiMark AI automates ad generation, publishing, and optimization using cutting-edge AI agents — built
                  specifically for small businesses.
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

              <div
                className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl border border-gray-200/50 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Campaign Dashboard</h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="text-2xl font-bold text-blue-600 animate-count-up">$2,847</div>
                        <div className="text-sm text-gray-600">Revenue Generated</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="text-2xl font-bold text-green-600 animate-count-up">4.2x</div>
                        <div className="text-sm text-gray-600">ROAS</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">AI Optimization</span>
                        <span className="text-green-500 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Active
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-2000 ease-out"
                          style={{ width: `${progressValue}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 text-right">{progressValue}% Optimized</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-float"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-30 animate-float-delayed"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* How It Works Section */}
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
            {[
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
            ].map((item, index) => (
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

      {/* Features Grid */}
      <section id="features" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-fade-in-up">
              Powerful{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up delay-100">
              Everything you need to dominate Facebook advertising
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Sparkles,
                title: "Smart Ad Generator",
                description: "AI creates compelling ad copy and visuals that convert",
                gradient: "from-yellow-500 to-orange-600",
                delay: "delay-100",
              },
              {
                icon: Zap,
                title: "Real-Time Optimization",
                description: "Continuous performance monitoring and automatic adjustments",
                gradient: "from-blue-500 to-indigo-600",
                delay: "delay-200",
              },
              {
                icon: Target,
                title: "Target Audience Matching",
                description: "Precision targeting based on your ideal customer profile",
                gradient: "from-green-500 to-emerald-600",
                delay: "delay-300",
              },
              {
                icon: BarChart3,
                title: "Visual Performance Dashboards",
                description: "Beautiful analytics that make sense of your data",
                gradient: "from-blue-500 to-cyan-600",
                delay: "delay-100",
              },
              {
                icon: Brain,
                title: "AI Trained on Top-Performing Ads",
                description: "Learn from millions of successful campaigns",
                gradient: "from-pink-500 to-rose-600",
                delay: "delay-200",
              },
              {
                icon: Bot,
                title: "Zero Ad Expertise Required",
                description: "No marketing knowledge needed - AI handles everything",
                gradient: "from-indigo-500 to-purple-600",
                delay: "delay-300",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 group animate-fade-in-up ${feature.delay}`}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-fade-in-up">
              Perfect for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Every Industry
              </span>
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

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-fade-in-up">
              What Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Customers
              </span>{" "}
              Say
            </h2>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <Card className="bg-white border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardContent className="p-12 text-center">
                <div className="mb-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 text-yellow-400 fill-current animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-2xl text-gray-700 leading-relaxed italic animate-fade-in">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-4 animate-fade-in delay-200">
                  <Avatar className="w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg">
                      {testimonials[currentTestimonial].avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</p>
                    <p className="text-gray-600">{testimonials[currentTestimonial].business}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                    index === currentTestimonial
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-fade-in-up">
              Simple{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up delay-100">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$29",
                period: "/month",
                description: "Perfect for small businesses just getting started",
                features: ["Up to 3 campaigns", "Basic AI optimization", "Email support", "Dashboard analytics"],
                popular: false,
              },
              {
                name: "Professional",
                price: "$79",
                period: "/month",
                description: "Best for growing businesses with multiple campaigns",
                features: [
                  "Unlimited campaigns",
                  "Advanced AI optimization",
                  "Priority support",
                  "Advanced analytics",
                  "A/B testing",
                  "Custom audiences",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$199",
                period: "/month",
                description: "For agencies and large businesses",
                features: [
                  "Everything in Professional",
                  "White-label solution",
                  "Dedicated account manager",
                  "Custom integrations",
                  "Advanced reporting",
                  "24/7 phone support",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 animate-fade-in-up delay-${index * 100} ${
                  plan.popular ? "ring-2 ring-blue-500 shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full rounded-full py-3 transition-all duration-300 transform hover:scale-105 ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-fade-in-up">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
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
            ].map((faq, index) => (
              <Card
                key={index}
                className={`bg-white border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up delay-${index * 100}`}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white animate-fade-in-up">
                  Ready to{" "}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Automate
                  </span>{" "}
                  Your Ads?
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

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-3 mb-4 md:mb-0 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                DiMark AI
              </span>
            </div>

            <div className="flex space-x-8 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition-colors duration-300 hover:scale-105 transform">
                Features
              </a>
              <a href="#pricing" className="hover:text-white transition-colors duration-300 hover:scale-105 transform">
                Pricing
              </a>
              <a href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 transform">
                Contact
              </a>
              <a href="#privacy" className="hover:text-white transition-colors duration-300 hover:scale-105 transform">
                Privacy
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 DiMark AI. All rights reserved. Powered by DiMark AI
            </p>

            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110 group"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110 group"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110 group"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-10px) translateX(5px);
          }
          66% {
            transform: translateY(5px) translateX(-5px);
          }
        }

        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(10px);
          }
        }

        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-8px) translateX(8px);
          }
          75% {
            transform: translateY(8px) translateX(-8px);
          }
        }

        @keyframes wave-1 {
          0%, 100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateX(30px) translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateX(-20px) translateY(20px) rotate(240deg);
          }
        }

        @keyframes wave-2 {
          0%, 100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(-40px) translateY(-40px) rotate(180deg);
          }
        }

        @keyframes wave-3 {
          0%, 100% {
            transform: translateX(-50%) translateY(-50%) rotate(0deg);
          }
          33% {
            transform: translateX(-50%) translateY(-50%) rotate(120deg);
          }
          66% {
            transform: translateX(-50%) translateY(-50%) rotate(240deg);
          }
        }

        @keyframes grid-move {
          0% {
            transform: translateX(0px) translateY(0px);
          }
          100% {
            transform: translateX(20px) translateY(20px);
          }
        }

        @keyframes gradient-text {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }

        .animate-wave-1 {
          animation: wave-1 20s ease-in-out infinite;
        }

        .animate-wave-2 {
          animation: wave-2 25s ease-in-out infinite;
        }

        .animate-wave-3 {
          animation: wave-3 30s ease-in-out infinite;
        }

        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }

        .animate-gradient-text {
          animation: gradient-text 3s ease infinite;
        }

        .delay-50 {
          animation-delay: 0.05s;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  )
}
