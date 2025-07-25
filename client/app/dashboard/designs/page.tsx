"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
        "https://picsum.photos/200/300"
    ])
    const [selectedBanner, setSelectedBanner] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        productImage: null as File | null,
        productDescription: "",
        headline: "",
        offer: "",
        cta: "",
        targetSize: "1080x1080",
        style: "modern",
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

    const BannerPreview = ({ banner, isSelected = false, onClick }: any) => (
        <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
                }`}
            onClick={onClick}
        >
            <CardContent className="p-0 relative overflow-hidden rounded-lg">
                <div className={`${banner.colors[0]} p-6 h-64 flex items-center justify-between relative`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white/20 rounded-full"></div>
                        <div className="absolute bottom-4 left-4 w-12 h-12 border border-white/20 rounded"></div>
                    </div>

                    {/* Content Layout based on template style */}
                    {banner.layout === "left-aligned" && (
                        <div className="flex items-center space-x-6 z-10">
                            {banner.productImage && (
                                <div className="w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                                    <img
                                        src={banner.productImage || "/placeholder.svg"}
                                        alt="Product"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className={`text-xl font-bold ${banner.colors[1]} mb-2`}>{banner.headline}</h3>
                                {banner.offer && <p className={`text-sm ${banner.colors[1]} opacity-90 mb-3`}>{banner.offer}</p>}
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                >
                                    {banner.cta}
                                </Button>
                            </div>
                        </div>
                    )}

                    {banner.layout === "center-aligned" && (
                        <div className="text-center w-full z-10">
                            {banner.productImage && (
                                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 overflow-hidden">
                                    <img
                                        src={banner.productImage || "/placeholder.svg"}
                                        alt="Product"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <h3 className={`text-2xl font-bold ${banner.colors[1]} mb-2`}>{banner.headline}</h3>
                            {banner.offer && <p className={`text-sm ${banner.colors[1]} opacity-90 mb-4`}>{banner.offer}</p>}
                            <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                            >
                                {banner.cta}
                            </Button>
                        </div>
                    )}

                    {banner.layout === "right-aligned" && (
                        <div className="flex items-center space-x-6 z-10 w-full justify-end">
                            <div className="text-right">
                                <h3 className={`text-xl font-bold ${banner.colors[1]} mb-2`}>{banner.headline}</h3>
                                {banner.offer && <p className={`text-sm ${banner.colors[1]} opacity-90 mb-3`}>{banner.offer}</p>}
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                >
                                    {banner.cta}
                                </Button>
                            </div>
                            {banner.productImage && (
                                <div className="w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                                    <img
                                        src={banner.productImage || "/placeholder.svg"}
                                        alt="Product"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {banner.layout === "split" && (
                        <div className="flex items-center justify-between w-full z-10">
                            <div className="flex-1">
                                <h3 className={`text-xl font-bold ${banner.colors[1]} mb-2`}>{banner.headline}</h3>
                                {banner.offer && <p className={`text-sm ${banner.colors[1]} opacity-90 mb-3`}>{banner.offer}</p>}
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                >
                                    {banner.cta}
                                </Button>
                            </div>
                            {banner.productImage && (
                                <div className="w-32 h-32 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden ml-6">
                                    <img
                                        src={banner.productImage || "/placeholder.svg"}
                                        alt="Product"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Default layout for other types */}
                    {!["left-aligned", "center-aligned", "right-aligned", "split"].includes(banner.layout) && (
                        <div className="text-center w-full z-10">
                            <h3 className={`text-xl font-bold ${banner.colors[1]} mb-2`}>{banner.headline}</h3>
                            {banner.offer && <p className={`text-sm ${banner.colors[1]} opacity-90 mb-3`}>{banner.offer}</p>}
                            <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                            >
                                {banner.cta}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="p-3 bg-white border-t">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900 text-sm">{banner.name}</h4>
                            <p className="text-xs text-gray-500">{banner.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                            {banner.size}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="min-h-screen relative bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-100 animate-gradient-move">
            {/* Floating Help Button */}
            <button
                className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl rounded-full p-4 flex items-center gap-2 hover:scale-110 transition-transform duration-300"
                title="Get Help or Tips"
            >
                <Sparkles className="w-6 h-6 animate-spin-slow" />
            </button>
            <div className="container mx-auto py-12">
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Headline *</label>
                                        <Input
                                            placeholder="e.g., Summer Sale Now On!"
                                            value={formData.headline}
                                            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                            className="text-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action *</label>
                                        <Select value={formData.cta} onValueChange={(value) => setFormData({ ...formData, cta: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select CTA" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Shop Now">Shop Now</SelectItem>
                                                <SelectItem value="Buy Now">Buy Now</SelectItem>
                                                <SelectItem value="Learn More">Learn More</SelectItem>
                                                <SelectItem value="Get Started">Get Started</SelectItem>
                                                <SelectItem value="Sign Up">Sign Up</SelectItem>
                                                <SelectItem value="Download">Download</SelectItem>
                                                <SelectItem value="Contact Us">Contact Us</SelectItem>
                                                <SelectItem value="Book Now">Book Now</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Promotional Offer (Optional)</label>
                                    <Input
                                        placeholder="e.g., Up to 50% Off | Free Shipping | Limited Time Only"
                                        value={formData.offer}
                                        onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Size</label>
                                        <Select
                                            value={formData.targetSize}
                                            onValueChange={(value) => setFormData({ ...formData, targetSize: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bannerSizes.map((size) => (
                                                    <SelectItem key={size.dimensions} value={size.dimensions}>
                                                        {size.name} ({size.dimensions})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-6">
                                    <Button
                                        onClick={() => setCurrentStep(2)}
                                        disabled={!formData.headline || !formData.cta}
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

                                    <Button
                                        onClick={generateBanners}
                                        disabled={isGenerating}
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="w-5 h-5 mr-2" />
                                                Start Generation
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 3: Select & Download */}
                {currentStep === 3 && (
                    <div className="space-y-10">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-indigo-900 mb-2 drop-shadow-lg">Your Banner Designs Are Ready!</h2>
                            <p className="text-gray-600 text-lg">
                                Choose from <span className="font-bold text-blue-600">8 unique AI-generated designs</span>. Click on any banner to preview and download.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {generatedBanners.map((banner) => (
                                <div className="relative group">
                                    <span className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">Click to select</span>
                                    <img src={banner} />
                                </div>
                            ))}
                        </div>

                        {selectedBanner && (
                            <Card className="shadow-2xl border-0 animate-pop-in">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between text-xl text-indigo-900">
                                        {/* <span>Selected Design: <span className="font-bold text-blue-600">{selectedBanner.name}</span></span> */}
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" className="hover:bg-indigo-50">
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
