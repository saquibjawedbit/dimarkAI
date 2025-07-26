"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Bot,
    Upload,
    Sparkles,
    Download,
    Share2,
    Copy,
    Palette,
    Zap,
    ArrowLeft,
    RefreshCw,
    Eye,
    ArrowRight,
} from "lucide-react"
import axiosClient from "@/api/axiosClient"
import { ApiEndpoints } from "@/api/endpoints/apiConfig"


const bannerSizes = [
    { name: "Social Media Square", dimensions: "1080x1080", ratio: "1:1" },
    { name: "Facebook Cover", dimensions: "1200x630", ratio: "16:9" },
    { name: "Instagram Story", dimensions: "1080x1920", ratio: "9:16" },
    { name: "LinkedIn Banner", dimensions: "1584x396", ratio: "4:1" },
    { name: "Twitter Header", dimensions: "1500x500", ratio: "3:1" },
    { name: "YouTube Thumbnail", dimensions: "1280x720", ratio: "16:9" },
    { name: "Email Header", dimensions: "600x200", ratio: "3:1" },
    { name: "Web Banner", dimensions: "728x90", ratio: "8:1" },
]

export default function BannerDesignPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedBanners, setGeneratedBanners] = useState<string[]>([
    ])
    const [selectedBanner, setSelectedBanner] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        productImage: null as File | null,
        businessType: "",
        productDescription: "",
        targetAudience: "",
        additionalInformation: "",
        useCase: "",
        festivalOrSeason: "",
    })

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setFormData({ ...formData, productImage: file })
        }
    }

    const generateBanners = async () => {
        setIsGenerating(true)

        const response = await axiosClient.post(
            ApiEndpoints.generateDesigns, formData
        );

        setGeneratedBanners(response.data.data);
        setIsGenerating(false)
        setCurrentStep(3)
    }

    return (
        <div className="min-h-screen relative bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-100 animate-gradient-move overflow-x-hidden flex flex-col items-center px-16">
            {/* Floating Help Button */}
            <button
                className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl rounded-full p-4 flex items-center gap-2 hover:scale-110 transition-transform duration-300"
                title="Get Help or Tips"
            >
                <Sparkles className="w-6 h-6 animate-spin-slow" />
            </button>
            <div className="container mx-auto py-12 flex flex-col items-center justify-center">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-10">
                    <div className="flex items-center space-x-6">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-xl border-2 transition-all duration-500 ${currentStep >= step ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-400 animate-step-pop" : "bg-gray-100 text-gray-400 border-gray-300"}`}
                                >
                                    {step === 1 && <Palette className="w-5 h-5 mr-1" />}
                                    {step === 2 && <Bot className="w-5 h-5 mr-1" />}
                                    {step === 3 && <Download className="w-5 h-5 mr-1" />}
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div
                                        className={`w-20 h-1 mx-3 rounded transition-all duration-500 ${currentStep > step ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gray-200"}`}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Labels */}
                <div className="flex justify-center mb-14">
                    <div className="flex space-x-24 text-base font-semibold">
                        <span className={currentStep >= 1 ? "text-indigo-600 drop-shadow-lg" : "text-gray-400"}>
                            <Palette className="inline w-4 h-4 mr-1" /> Input Content
                        </span>
                        <span className={currentStep >= 2 ? "text-indigo-600 drop-shadow-lg" : "text-gray-400"}>
                            <Bot className="inline w-4 h-4 mr-1" /> Generate Designs
                        </span>
                        <span className={currentStep >= 3 ? "text-indigo-600 drop-shadow-lg" : "text-gray-400"}>
                            <Download className="inline w-4 h-4 mr-1" /> Select & Download
                        </span>
                    </div>
                </div>

                {/* Step 1: Input Content */}
                {currentStep === 1 && (
                    <div className="max-w-4xl mx-auto">
                        <Card className="shadow-xl border-0">
                            <CardHeader className="text-center pb-6">
                                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                                    <Palette className="w-6 h-6 mr-2 text-blue-500" />
                                    Create Your Banner Content
                                </CardTitle>
                                <p className="text-gray-600 mt-2">
                                    Provide your product details and marketing message to generate unique banner designs
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <Tabs defaultValue="upload" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="upload">Upload Product Image</TabsTrigger>
                                        <TabsTrigger value="describe">Describe Product</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="upload" className="space-y-4">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-300">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            {formData.productImage ? (
                                                <div className="space-y-4">
                                                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg overflow-hidden">
                                                        <img
                                                            src={URL.createObjectURL(formData.productImage) || "/placeholder.svg"}
                                                            alt="Product"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <p className="text-sm text-gray-600">{formData.productImage.name}</p>
                                                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-2">
                                                        <RefreshCw className="w-4 h-4 mr-2" />
                                                        Change Image
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                                                    <div>
                                                        <p className="text-lg font-medium text-gray-900">Upload your product image</p>
                                                        <p className="text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                    </div>
                                                    <Button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="bg-blue-500 hover:bg-blue-600"
                                                    >
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        Choose File
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="describe" className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                                            <Textarea
                                                placeholder="Describe your product in detail. Include features, benefits, colors, style, and any unique selling points..."
                                                value={formData.productDescription}
                                                onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                                                className="min-h-[120px]"
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                                        <Input
                                            placeholder="e.g., Retail, Restaurant, Tech Startup"
                                            value={formData.businessType}
                                            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                            className="text-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience *</label>
                                        <Input
                                            placeholder="e.g., Young Adults, Parents, Professionals"
                                            value={formData.targetAudience}
                                            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                            className="text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Use Case (Optional)</label>
                                        <Input
                                            placeholder="e.g., Social Media Ad, Website Banner, Email Campaign"
                                            value={formData.useCase}
                                            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Festival or Season (Optional)</label>
                                        <Input
                                            placeholder="e.g., Diwali, Christmas, Summer, Winter"
                                            value={formData.festivalOrSeason}
                                            onChange={(e) => setFormData({ ...formData, festivalOrSeason: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information (Optional)</label>
                                    <Textarea
                                        placeholder="Any extra details, instructions, or preferences for the design..."
                                        value={formData.additionalInformation}
                                        onChange={(e) => setFormData({ ...formData, additionalInformation: e.target.value })}
                                        className="min-h-[80px]"
                                    />
                                </div>

                                <div className="flex justify-center pt-6">
                                    <Button
                                        onClick={() => {
                                            setCurrentStep(2)
                                            generateBanners()
                                        }}
                                        disabled={
                                            !formData.businessType ||
                                            !formData.targetAudience ||
                                            !(formData.productDescription || formData.productImage)
                                        }
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        Generate Banners
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 2: Generate Designs */}
                {currentStep === 2 && (
                    <div className="max-w-2xl mx-auto text-center">
                        <Card className="shadow-xl border-0">
                            <CardContent className="p-12">
                                <div className="space-y-6">
                                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                                        <Bot className="w-10 h-10 text-white animate-pulse" />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI is Creating Your Banners</h2>
                                        <p className="text-gray-600">
                                            Our AI is analyzing your content and generating 8 unique banner designs optimized for different
                                            marketing channels.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-center">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-500">This usually takes 30-60 seconds...</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 3: Select & Download */}
                {currentStep === 3 && (
                    <div className="space-y-10 w-full">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-indigo-900 mb-2 drop-shadow-lg">Your Banner Designs Are Ready!</h2>
                            <p className="text-gray-600 text-lg">
                                Choose from <span className="font-bold text-blue-600">8 unique AI-generated designs</span>. Click on any banner to preview and download.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
                            {generatedBanners.map((banner, idx) => (
                                <Card
                                    key={idx}
                                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${selectedBanner === banner ? "ring-2 ring-blue-500 shadow-lg" : ""}`}
                                    onClick={() => setSelectedBanner(banner)}
                                >
                                    <CardContent className="p-0 relative overflow-hidden rounded-lg">
                                        <div className="relative h-56 flex items-center justify-center bg-white rounded-lg">
                                            <img
                                                src={banner}
                                                alt={`Generated Banner ${idx + 1}`}
                                                className="object-contain w-full h-full rounded-lg"
                                            />
                                            {selectedBanner === banner && (
                                                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg">Selected</span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {selectedBanner && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                <Card className="shadow-2xl border-0 animate-pop-in relative max-w-2xl w-full">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between text-xl text-indigo-900">
                                            <div className="flex items-center">
                                                <button
                                                    className="mr-4 text-gray-500 hover:text-indigo-600 text-2xl font-bold bg-white bg-opacity-80 rounded-full shadow-lg p-1"
                                                    onClick={() => setSelectedBanner(null)}
                                                    aria-label="Close"
                                                >
                                                    &times;
                                                </button>
                                                <span>Selected Design</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-indigo-50"
                                                    onClick={() => {
                                                        if (selectedBanner) {
                                                            window.open(selectedBanner, '_blank', 'noopener,noreferrer');
                                                        }
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Preview
                                                </Button>
                                                <Button variant="outline" size="sm" className="hover:bg-indigo-50">
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Duplicate
                                                </Button>
                                                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </Button>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="font-semibold text-indigo-900 mb-4">Design Details</h4>
                                                <div className="space-y-3 text-base">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Format:</span>
                                                        <span className="font-bold text-blue-600">PNG, JPG, SVG</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-indigo-900 mb-4">Preview</h4>
                                                <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                    <img src={selectedBanner} alt="Selected Banner" className="object-contain w-full h-full" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                                            <div>
                                                <h4 className="font-semibold text-indigo-900 mb-4">Download Options</h4>
                                                <div className="space-y-2">
                                                    <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        High Resolution PNG
                                                    </Button>
                                                    <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Web Optimized JPG
                                                    </Button>
                                                    <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Vector SVG
                                                    </Button>
                                                    <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100">
                                                        <Share2 className="w-4 h-4 mr-2" />
                                                        Share Link
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        <div className="flex justify-center space-x-6 mt-8">
                            <Button variant="outline" onClick={() => setCurrentStep(1)} size="lg" className="px-8 py-3 text-lg font-semibold hover:bg-indigo-50">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Create New Banner
                            </Button>

                            <Button
                                onClick={generateBanners}
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Generate More Designs
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
