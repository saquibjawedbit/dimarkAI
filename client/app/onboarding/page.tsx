"use client"

import { useState, useEffect, useRef } from "react"
import { Upload } from "lucide-react"
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
  Briefcase,
} from "lucide-react"
import {
  businessTypes,
  budgetRanges,
  goals,
} from "./constants/constants"
import axiosClient from "@/api/axiosClient"
import { ApiEndpoints } from "@/api/endpoints/apiConfig"
import { toast } from "sonner"



export default function OnboardingPage() {
  const [showScanModal, setShowScanModal] = useState(false)
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
    presenceType: "", // online, offline, both
    numberOfStores: "",
    regions: "",
  })
  const [logoUrl, setLogoUrl] = useState<string>("")
  const [logoLoading, setLogoLoading] = useState(false)
  const [logoError, setLogoError] = useState("")
  const [customLogo, setCustomLogo] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const totalSteps = 9

  // Fetch logo when website changes and is a valid URL
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const fetchLogo = async () => {
      setLogoError("");
      setLogoUrl("");
      if (!formData.website || formData.website.length < 4) return;
      let url = formData.website.trim();
      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
      setShowScanModal(true);
      setLogoLoading(true);
      let logoData = {};
      try {
        const res = await axiosClient.get(
          `${ApiEndpoints.highQualityLogo}?url=${encodeURIComponent(url)}`
        );
        logoData = res.data.data || {};
      } catch (e) {
        setLogoError("Could not fetch logo");
      }
      // Always show scanning for at least 2.2s
      timeout = setTimeout(() => {
        setShowScanModal(false);
        setLogoLoading(false);
        const { ogImage, appleTouch, icon } = logoData as any;
        setLogoUrl(ogImage || appleTouch || icon || "");
      }, 2200);
    };
    if (formData.website) fetchLogo();
    return () => { if (timeout) clearTimeout(timeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.website]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      // If on regions step (7) and numberOfStores step (6) is hidden, skip back to presenceType (5)
      if (
        currentStep === 7 &&
        formData.presenceType !== "offline" &&
        formData.presenceType !== "both"
      ) {
        setCurrentStep(5);
      } else {
        setCurrentStep(currentStep - 1);
      }
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

  const handleFinish = async () => {
    try {
      await axiosClient.post(ApiEndpoints.onboard, {
        ...formData,
      })
    } catch (error) {
      console.error("Error during onboarding:", error)
      toast.error("Failed to complete onboarding. Please try again.")
      return;
    }

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
        return formData.presenceType !== ""
      case 6:
        // Only require numberOfStores if offline or both
        return formData.presenceType === "offline" || formData.presenceType === "both"
          ? formData.numberOfStores.trim() !== "" && !isNaN(Number(formData.numberOfStores))
          : true
      case 7:
        return formData.regions.trim() !== ""
      case 8:
        return formData.targetAudience.trim() !== ""
      default:
        return true
    }
  }

  // Auto-advance step 6 if not offline/both
  useEffect(() => {
    if (
      currentStep === 6 &&
      formData.presenceType !== "offline" &&
      formData.presenceType !== "both"
    ) {
      setCurrentStep(7);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, formData.presenceType]);

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
                  onChange={(e) => {
                    setFormData({ ...formData, website: e.target.value });
                    setCustomLogo("");
                  }}
                  className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {/* Logo preview and animation */}
                {formData.website && (
                  <>
                    {/* Scanning Modal */}
                    {showScanModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center gap-4 min-w-[320px] animate-fade-in-up">
                          <span className="relative w-20 h-20 flex items-center justify-center mb-2">
                            <span className="absolute w-20 h-20 rounded-full border-4 border-blue-400 border-dashed animate-spin-scan"></span>
                            <span className="absolute w-14 h-14 rounded-full bg-gradient-to-r from-blue-300 to-indigo-300 flex items-center justify-center shadow-lg">
                              <svg className="h-10 w-10 text-blue-600 animate-pulse" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                            </span>
                          </span>
                          <span className="block text-blue-700 font-bold text-lg">Scanning your website...</span>
                          <span className="block text-xs text-blue-400 mt-1">Looking for the best logo on your page</span>
                        </div>
                      </div>
                    )}
                    {/* Logo preview and upload */}
                    <div className="mt-4 flex items-center gap-4">
                      {customLogo ? (
                        <img src={customLogo} alt="Custom Logo" className="w-12 h-12 rounded-lg border object-contain" />
                      ) : logoUrl ? (
                        <img src={logoUrl} alt="Website Logo" className="w-12 h-12 rounded-lg border object-contain" />
                      ) : logoError ? (
                        <span className="text-red-500 text-sm">{logoError}</span>
                      ) : null}
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 px-3 py-2 text-sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4" /> Upload Logo
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = ev => {
                              setCustomLogo(ev.target?.result as string || "");
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </>
                )}
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
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Where does your business operate?</h2>
              <p className="text-gray-600 text-lg">Let us know if you have an online, offline, or both types of presence.</p>
            </div>
            <div className="flex justify-center gap-4">
              {[
                { value: "online", label: "Online Only" },
                { value: "offline", label: "Offline Only" },
                { value: "both", label: "Both" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={formData.presenceType === option.value ? "default" : "outline"}
                  className={`rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 ${formData.presenceType === option.value ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setFormData({ ...formData, presenceType: option.value })}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )
      case 6:
        // Only show if offline or both
        if (formData.presenceType === "offline" || formData.presenceType === "both") {
          return (
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">How many physical stores do you have?</h2>
                <p className="text-gray-600 text-lg">Enter the number of offline locations or stores.</p>
              </div>
              <div className="max-w-md mx-auto">
                <Input
                  id="numberOfStores"
                  type="number"
                  min="1"
                  placeholder="e.g. 3"
                  value={formData.numberOfStores}
                  onChange={(e) => setFormData({ ...formData, numberOfStores: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )
        } else {
          // If not offline/both, show nothing (auto-advance handled by useEffect)
          return null;
        }
      case 7:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Which regions or locations do you serve?</h2>
              <p className="text-gray-600 text-lg">List the cities, states, or countries where your business is present or delivers.</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Textarea
                id="regions"
                placeholder="e.g. Mumbai, Delhi, Bangalore, or All India, or International..."
                value={formData.regions}
                onChange={(e) => setFormData({ ...formData, regions: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
              />
            </div>
          </div>
        )
      case 8:
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
        @keyframes spin-scan {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-scan {
          animation: spin-scan 1.2s linear infinite;
        }
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
