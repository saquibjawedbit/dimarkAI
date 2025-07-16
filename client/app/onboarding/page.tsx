"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Bot,
  ArrowRight,
  ArrowLeft,
  Check,
  Building,
  Users,
  DollarSign,
  Target,
  Sparkles,
  ShoppingBag,
  Utensils,
  Dumbbell,
  Camera,
  Coffee,
  Briefcase,
  Heart,
  Car,
  Home,
  Palette,
  Music,
  BookOpen,
  Plane,
} from "lucide-react"

const businessTypes = [
  { id: "ecommerce", name: "E-commerce", icon: ShoppingBag, color: "bg-blue-500" },
  { id: "restaurant", name: "Restaurant", icon: Utensils, color: "bg-green-500" },
  { id: "fitness", name: "Fitness & Gym", icon: Dumbbell, color: "bg-purple-500" },
  { id: "photography", name: "Photography", icon: Camera, color: "bg-pink-500" },
  { id: "coffee", name: "Coffee Shop", icon: Coffee, color: "bg-orange-500" },
  { id: "consulting", name: "Consulting", icon: Briefcase, color: "bg-indigo-500" },
  { id: "healthcare", name: "Healthcare", icon: Heart, color: "bg-red-500" },
  { id: "automotive", name: "Automotive", icon: Car, color: "bg-gray-500" },
  { id: "realestate", name: "Real Estate", icon: Home, color: "bg-emerald-500" },
  { id: "creative", name: "Creative Services", icon: Palette, color: "bg-yellow-500" },
  { id: "entertainment", name: "Entertainment", icon: Music, color: "bg-violet-500" },
  { id: "education", name: "Education", icon: BookOpen, color: "bg-cyan-500" },
  { id: "travel", name: "Travel & Tourism", icon: Plane, color: "bg-teal-500" },
]

const budgetRanges = [
  { id: "small", label: "$100 - $500/month", description: "Perfect for small local businesses" },
  { id: "medium", label: "$500 - $2,000/month", description: "Great for growing businesses" },
  { id: "large", label: "$2,000 - $10,000/month", description: "Ideal for established companies" },
  { id: "enterprise", label: "$10,000+/month", description: "For large enterprises and agencies" },
]

const goals = [
  { id: "awareness", name: "Brand Awareness", description: "Get your business known in your area" },
  { id: "leads", name: "Generate Leads", description: "Collect contact information from potential customers" },
  { id: "sales", name: "Drive Sales", description: "Increase direct sales and revenue" },
  { id: "traffic", name: "Website Traffic", description: "Bring more visitors to your website" },
  { id: "engagement", name: "Social Engagement", description: "Build a community around your brand" },
  { id: "app", name: "App Downloads", description: "Promote your mobile application" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessDescription: "",
    targetAudience: "",
    budget: "",
    goals: [] as string[],
    experience: "",
    website: "",
    location: "",
  })

  const totalSteps = 6

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBusinessTypeSelect = (typeId: string) => {
    setFormData({ ...formData, businessType: typeId })
  }

  const handleBudgetSelect = (budgetId: string) => {
    setFormData({ ...formData, budget: budgetId })
  }

  const handleGoalToggle = (goalId: string) => {
    const updatedGoals = formData.goals.includes(goalId)
      ? formData.goals.filter((g) => g !== goalId)
      : [...formData.goals, goalId]
    setFormData({ ...formData, goals: updatedGoals })
  }

  const handleFinish = () => {
    console.log("Onboarding completed:", formData)
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.businessName.trim() !== ""
      case 1:
        return formData.businessType !== ""
      case 2:
        return formData.businessDescription.trim() !== ""
      case 3:
        return formData.budget !== ""
      case 4:
        return formData.goals.length > 0
      case 5:
        return formData.targetAudience.trim() !== ""
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell us about your business</h2>
              <p className="text-gray-600 text-lg">Let's start with the basics so we can personalize your experience</p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Location (Optional)
                </label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, State/Country"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What type of business do you run?</h2>
              <p className="text-gray-600 text-lg">This helps us create more targeted and effective ads for you</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {businessTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    formData.businessType === type.id ? "ring-2 ring-blue-500 shadow-lg bg-blue-50" : "hover:shadow-md"
                  }`}
                  onClick={() => handleBusinessTypeSelect(type.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">{type.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Describe your business</h2>
              <p className="text-gray-600 text-lg">
                Tell us what makes your business unique. This helps our AI create better ads.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Textarea
                placeholder="Describe what your business does, what products/services you offer, and what makes you different from competitors..."
                value={formData.businessDescription}
                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              />
              <p className="text-sm text-gray-500 mt-2">{formData.businessDescription.length}/500 characters</p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What's your advertising budget?</h2>
              <p className="text-gray-600 text-lg">
                Choose a range that fits your business. You can always adjust this later.
              </p>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {budgetRanges.map((budget) => (
                <Card
                  key={budget.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    formData.budget === budget.id ? "ring-2 ring-blue-500 shadow-lg bg-blue-50" : "hover:shadow-md"
                  }`}
                  onClick={() => handleBudgetSelect(budget.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{budget.label}</h3>
                        <p className="text-gray-600 text-sm">{budget.description}</p>
                      </div>
                      {formData.budget === budget.id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What are your main goals?</h2>
              <p className="text-gray-600 text-lg">Select all that apply. We'll optimize your campaigns accordingly.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {goals.map((goal) => (
                <Card
                  key={goal.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    formData.goals.includes(goal.id) ? "ring-2 ring-blue-500 shadow-lg bg-blue-50" : "hover:shadow-md"
                  }`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">{goal.name}</h3>
                        <p className="text-gray-600 text-sm">{goal.description}</p>
                      </div>
                      {formData.goals.includes(goal.id) && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ml-4">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Who is your target audience?</h2>
              <p className="text-gray-600 text-lg">
                Describe your ideal customers. The more specific, the better our AI can target them.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience Description *
                </label>
                <Textarea
                  id="targetAudience"
                  placeholder="Example: Women aged 25-45 who are interested in fitness and healthy living, live in urban areas, and have disposable income for premium products..."
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Advertising Experience (Optional)
                </label>
                <select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your experience level</option>
                  <option value="none">No experience</option>
                  <option value="beginner">Beginner (tried a few times)</option>
                  <option value="intermediate">Intermediate (run campaigns regularly)</option>
                  <option value="advanced">Advanced (expert level)</option>
                </select>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-indigo-400/40 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-40 left-20 w-6 h-6 bg-purple-400/20 rounded-full animate-float-fast"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-blue-500/30 rounded-full animate-float-slow"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  DiMark AI
                </span>
              </div>

              <Badge variant="outline" className="bg-white/50 border-gray-300">
                Step {currentStep + 1} of {totalSteps}
              </Badge>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="px-4 mb-8">
          <div className="container mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 pb-8">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardContent className="p-8 md:p-12">{renderStep()}</CardContent>
            </Card>
          </div>
        </main>

        {/* Navigation */}
        <footer className="px-4 pb-8">
          <div className="container mx-auto max-w-4xl">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="rounded-full px-6 py-3 bg-white/50 border-gray-300 hover:bg-white hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep === totalSteps - 1 ? (
                <Button
                  onClick={handleFinish}
                  disabled={!isStepValid()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Setup
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
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
      `}</style>
    </div>
  )
}
