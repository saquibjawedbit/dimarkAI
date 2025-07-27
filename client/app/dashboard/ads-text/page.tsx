'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Copy, RefreshCw, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { geminiService, RephraseTextRequest, GenerateTextRequest, GeminiOptions } from '@/lib/services/gemini';
import MarkdownRenderer from './MarkdownRenderer';

export const GeminiTextGenerator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'rephrase' | 'generate'>('rephrase');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<GeminiOptions | null>(null);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [copiedText, setCopiedText] = useState<string | null>(null);

    // Auto-clear copied text notification
    useEffect(() => {
        if (copiedText) {
            const timer = setTimeout(() => {
                setCopiedText(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [copiedText]);

    // Rephrase form state
    const [rephraseText, setRephraseText] = useState('');
    const [rephraseAudience, setRephraseAudience] = useState('');
    const [rephraseTone, setRephraseTone] = useState<'professional' | 'casual' | 'friendly' | 'urgent' | 'persuasive'>('persuasive');
    const [rephrasePlatform, setRephrasePlatform] = useState<'facebook' | 'instagram' | 'general'>('facebook');

        // New fields for business info
    const [businessType, setBusinessType] = useState('');
    const [productsServices, setProductsServices] = useState('');
    const [location, setLocation] = useState('');
    const [brandTone, setBrandTone] = useState('');
    const [offerDetails, setOfferDetails] = useState('');
    const [festiveContext, setFestiveContext] = useState('');
    const [preferredRegionalLanguage, setPreferredRegionalLanguage] = useState('');

    // Load options on component mount
    useEffect(() => {
        const loadOptions = async () => {
            try {
                const response = await geminiService.getOptions();
                if (response.success && response.data) {
                    setOptions(response.data);
                }
            } catch (error) {
                console.error('Failed to load options:', error);
            }
        };
        loadOptions();
    }, []);

    const handleRephraseText = async () => {
        if (!rephraseText.trim()) {
            setError('Please enter text to rephrase');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const request: RephraseTextRequest = {
                text: rephraseText,
                targetAudience: rephraseAudience || undefined,
                tone: rephraseTone,
                platform: rephrasePlatform,
            };

            const response = await geminiService.rephraseText(request);

            if (response.success) {
                // Use new response structure directly, with type assertion
                const data = response.data as {
                    generatedText?: string;
                    originalText?: string;
                    explanation?: string;
                    key_improvements?: string[];
                    suggestions?: string[];
                    hashtags?: string[];
                    tips?: string[];
                    metadata?: any;
                } || {};
                const formattedResult = {
                    generatedText: data.generatedText || '',
                    originalText: data.originalText || rephraseText,
                    explanation: data.explanation || '',
                    key_improvements: data.key_improvements || [],
                    suggestions: data.suggestions || [],
                    hashtags: data.hashtags || [],
                    tips: data.tips || [],
                    metadata: data.metadata || {
                        tone: rephraseTone,
                        platform: rephrasePlatform,
                        audience: rephraseAudience || 'General',
                        objective: 'rephrase'
                    }
                };
                setResult(formattedResult);
            } else {
                setError(response.error || 'Failed to rephrase text');
            }
        } catch (error) {
            console.error('Error rephrasing text:', error);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateText = async () => {

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const request: any = {
                targetAudience: rephraseAudience,
                businessType: businessType,
                productsServices: productsServices,
                location: location,
                brandTone: rephraseTone,
                offerDetails: offerDetails,
                festiveContext: festiveContext,
                preferredRegionalLanguage: preferredRegionalLanguage,
            };

            const response = await geminiService.generateAdText(request);

            if (response.success) {
                // Use new response structure directly, with type assertion
                const data = response.data as {
                    generatedText?: string;
                    headline?: string;
                    description?: string;
                    explanation?: string;
                    key_improvements?: string[];
                    suggestions?: string[];
                    hashtags?: string[];
                    tips?: string[];
                    metadata?: any;
                } || {};
                const formattedResult = {
                    generatedText: data.generatedText || '',
                    headline: data.headline || '',
                    explanation: data.explanation || '',
                    key_improvements: data.key_improvements || [],
                    suggestions: data.suggestions || [],
                    hashtags: data.hashtags || [],
                    tips: data.tips || [],
                };
                setResult(formattedResult);
            } else {
                setError(response.error || 'Failed to generate ad text');
            }
        } catch (error) {
            console.error('Error generating ad text:', error);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-black mb-2">AI Ad Text Generator</h1>
                <p className="text-black">
                    Use AI to create and rephrase compelling Facebook ad copy that drives results
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-black mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('rephrase')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'rephrase'
                            ? 'border-black text-black'
                            : 'border-transparent text-gray-500 hover:text-black hover:border-black'
                            }`}
                    >
                        <div className="flex items-center">
                            <RefreshCw size={16} className="mr-2" />
                            Rephrase Text
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('generate')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'generate'
                            ? 'border-black text-black'
                            : 'border-transparent text-gray-500 hover:text-black hover:border-black'
                            }`}
                    >
                        <div className="flex items-center">
                            <Sparkles size={16} className="mr-2" />
                            Generate New Text
                        </div>
                    </button>
                </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card className="border border-black bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center text-black">
                            <Wand2 size={20} className="mr-2" />
                            {activeTab === 'rephrase' ? 'Rephrase Existing Text' : 'Generate New Ad Text'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {activeTab === 'rephrase' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                                    <input
                                        type="text"
                                        value={businessType}
                                        onChange={(e) => setBusinessType(e.target.value)}
                                        placeholder="e.g., Retail, Restaurant, Tech Startup"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Products & Services</label>
                                    <input
                                        type="text"
                                        value={productsServices}
                                        onChange={(e) => setProductsServices(e.target.value)}
                                        placeholder="e.g., Shoes, Consulting, Food Delivery"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g., Mumbai, Delhi, Online"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Tone</label>
                                    <input
                                        type="text"
                                        value={brandTone}
                                        onChange={(e) => setBrandTone(e.target.value)}
                                        placeholder="e.g., Friendly, Professional, Youthful"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Offer Details</label>
                                    <input
                                        type="text"
                                        value={offerDetails}
                                        onChange={(e) => setOfferDetails(e.target.value)}
                                        placeholder="e.g., 20% Off, Free Delivery, Buy 1 Get 1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Festive Context</label>
                                    <input
                                        type="text"
                                        value={festiveContext}
                                        onChange={(e) => setFestiveContext(e.target.value)}
                                        placeholder="e.g., Diwali, Christmas, Summer Sale"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Regional Language</label>
                                    <input
                                        type="text"
                                        value={preferredRegionalLanguage}
                                        onChange={(e) => setPreferredRegionalLanguage(e.target.value)}
                                        placeholder="e.g., Hindi, Marathi, Tamil"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Text to Rephrase *</label>
                                    <textarea
                                        value={rephraseText}
                                        onChange={(e) => setRephraseText(e.target.value)}
                                        placeholder="Enter your existing ad text that you want to improve..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                        rows={6}
                                        maxLength={options?.limits?.maxTextLength || 1000}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {rephraseText.length}/{options?.limits?.maxTextLength || 1000} characters
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                                    <input
                                        type="text"
                                        value={rephraseAudience}
                                        onChange={(e) => setRephraseAudience(e.target.value)}
                                        placeholder="e.g., young professionals, fitness enthusiasts, parents..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                                        <select
                                            value={rephraseTone}
                                            onChange={(e) => setRephraseTone(e.target.value as any)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            {options?.tones?.map((t: string) => (
                                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                                        <select
                                            value={rephrasePlatform}
                                            onChange={(e) => setRephrasePlatform(e.target.value as any)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            {options?.platforms?.map((p: string) => (
                                                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleRephraseText}
                                    disabled={loading || !rephraseText.trim()}
                                    className="w-full"
                                >
                                    {loading ? 'Rephrasing...' : 'Rephrase Text'}
                                </Button>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                                    <input
                                        type="text"
                                        value={businessType}
                                        onChange={(e) => setBusinessType(e.target.value)}
                                        placeholder="e.g., Retail, Restaurant, Tech Startup"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Products & Services</label>
                                    <input
                                        type="text"
                                        value={productsServices}
                                        onChange={(e) => setProductsServices(e.target.value)}
                                        placeholder="e.g., Shoes, Consulting, Food Delivery"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g., Mumbai, Delhi, Online"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Tone</label>
                                    <input
                                        type="text"
                                        value={brandTone}
                                        onChange={(e) => setBrandTone(e.target.value)}
                                        placeholder="e.g., Friendly, Professional, Youthful"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Offer Details</label>
                                    <input
                                        type="text"
                                        value={offerDetails}
                                        onChange={(e) => setOfferDetails(e.target.value)}
                                        placeholder="e.g., 20% Off, Free Delivery, Buy 1 Get 1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Festive Context</label>
                                    <input
                                        type="text"
                                        value={festiveContext}
                                        onChange={(e) => setFestiveContext(e.target.value)}
                                        placeholder="e.g., Diwali, Christmas, Summer Sale"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Regional Language</label>
                                    <input
                                        type="text"
                                        value={preferredRegionalLanguage}
                                        onChange={(e) => setPreferredRegionalLanguage(e.target.value)}
                                        placeholder="e.g., Hindi, Marathi, Tamil"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                                    <input
                                        type="text"
                                        value={rephraseAudience}
                                        onChange={(e) => setRephraseAudience(e.target.value)}
                                        placeholder="e.g., young professionals, fitness enthusiasts, parents..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                                        <select
                                            value={rephraseTone}
                                            onChange={(e) => setRephraseTone(e.target.value as any)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            {options?.tones?.map((t: string) => (
                                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                                        <select
                                            value={rephrasePlatform}
                                            onChange={(e) => setRephrasePlatform(e.target.value as any)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            {options?.platforms?.map((p: string) => (
                                                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleGenerateText}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? 'Generating...' : 'Generate Ad Text'}
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Results */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CheckCircle size={20} className="mr-2" />
                            Generated Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                                <div className="flex items-center">
                                    <AlertCircle size={16} className="text-red-500 mr-2" />
                                    <p className="text-red-800">{error}</p>
                                </div>
                            </div>
                        )}

                        {copiedText && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                                <div className="flex items-center">
                                    <CheckCircle size={16} className="text-green-500 mr-2" />
                                    <p className="text-green-800">Copied to clipboard: {copiedText}</p>
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-6">
                                {/* Check if result is a string (raw JSON) */}
                                {typeof result === 'string' ? (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                        <h3 className="font-semibold text-red-800 mb-2">Raw JSON Response (Parsing Failed)</h3>
                                        <pre className="text-red-700 whitespace-pre-wrap text-sm">
                                            {result}
                                        </pre>
                                        <p className="text-red-600 mt-2 text-sm">
                                            The response couldn't be parsed properly. Please check the backend response format.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Main Result - Markdown rendered */}
                                        <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-green-800 text-lg">
                                                    {activeTab === 'rephrase' ? '✨ Rephrased Text' : '✨ Generated Ad Text'}
                                                </h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(result.generatedText || '')}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <Copy size={14} />
                                                </Button>
                                            </div>
                                            <div className="text-green-900 whitespace-pre-wrap font-medium">
                                                {/* Markdown rendering for output */}
                                                {result.generatedText ? (
                                                    <MarkdownRenderer content={result.generatedText} />
                                                ) : 'No generated text available'}
                                            </div>
                                        </div>

                                        {/* AI Explanation Section */}
                                        {result.explanation && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                                <h3 className="font-semibold text-blue-800 mb-3 text-lg">🧠 AI Explanation</h3>
                                                <div className="text-blue-900">
                                                    <MarkdownRenderer content={result.explanation} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Key Improvements Section */}
                                        {result.key_improvements && result.key_improvements.length > 0 && (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4">
                                                <h3 className="font-semibold text-emerald-800 mb-3 text-lg">🚀 Key Improvements</h3>
                                                <div className="space-y-2">
                                                    {result.key_improvements.map((improvement: string, index: number) => (
                                                        <div key={index} className="flex items-start">
                                                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                            <div className="text-emerald-900">{improvement}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Alternative Variations */}
                                        {result.suggestions && result.suggestions.length > 0 && (
                                            <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                                                <h3 className="font-semibold text-purple-800 mb-3 text-lg">🎯 Alternative Variations</h3>
                                                <div className="space-y-3">
                                                    {result.suggestions.map((suggestion: string, index: number) => (
                                                        <div key={index} className="bg-white border border-purple-200 rounded-md p-3">
                                                            <div className="flex justify-between items-start">
                                                                <div className="text-purple-900 whitespace-pre-wrap flex-1">
                                                                    <div className="font-medium text-purple-700 mb-1">Option {index + 1}:</div>
                                                                    {suggestion}
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => copyToClipboard(suggestion)}
                                                                    className="text-purple-600 hover:text-purple-800 ml-2"
                                                                >
                                                                    <Copy size={14} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Hashtags Section */}
                                        {result.hashtags && result.hashtags.length > 0 && (
                                            <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4">
                                                <h3 className="font-semibold text-indigo-800 mb-3 text-lg">#️⃣ Suggested Hashtags</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.hashtags.map((hashtag: string, index: number) => (
                                                        <span
                                                            key={index}
                                                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-indigo-200 transition-colors"
                                                            onClick={() => copyToClipboard(hashtag)}
                                                        >
                                                            {hashtag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tips Section */}
                                        {result.tips && result.tips.length > 0 && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                                                <h3 className="font-semibold text-amber-800 mb-3 text-lg">💡 Pro Tips</h3>
                                                <div className="space-y-2">
                                                    {result.tips.map((tip: string, index: number) => (
                                                        <div key={index} className="flex items-start">
                                                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                            <div className="text-amber-900">{tip}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </>
                                )}
                            </div>
                        )}

                        {!result && !error && !loading && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Wand2 size={24} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Ready to Generate
                                </h3>
                                <p className="text-gray-500">
                                    Fill out the form and click generate to create AI-powered ad copy
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center py-12">
                                <div className="w-8 h-8 mx-auto border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600">
                                    {activeTab === 'rephrase' ? 'Rephrasing your text...' : 'Generating ad copy...'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default function AdsTextPage() {
    return <GeminiTextGenerator />;
}
