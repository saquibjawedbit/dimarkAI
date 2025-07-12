import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Wand2, Copy, RefreshCw, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { geminiService, RephraseTextRequest, GenerateTextRequest, GeminiOptions } from '../../services/gemini';

export const GeminiTextGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rephrase' | 'generate'>('rephrase');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<GeminiOptions | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Rephrase form state
  const [rephraseText, setRephraseText] = useState('');
  const [rephraseAudience, setRephraseAudience] = useState('');
  const [rephraseTone, setRephraseTone] = useState<'professional' | 'casual' | 'friendly' | 'urgent' | 'persuasive'>('persuasive');
  const [rephrasePlatform, setRephrasePlatform] = useState<'facebook' | 'instagram' | 'general'>('facebook');

  // Generate form state
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [campaignObjective, setCampaignObjective] = useState<'brand_awareness' | 'reach' | 'traffic' | 'engagement' | 'app_installs' | 'video_views' | 'lead_generation' | 'conversions'>('conversions');
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'urgent' | 'persuasive'>('persuasive');
  const [platform, setPlatform] = useState<'facebook' | 'instagram' | 'general'>('facebook');
  const [adFormat, setAdFormat] = useState<'single_image' | 'video' | 'carousel' | 'collection'>('single_image');
  const [callToAction, setCallToAction] = useState('');
  const [budget, setBudget] = useState<number | undefined>(undefined);
  const [additionalContext, setAdditionalContext] = useState('');

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
        setResult(response.data);
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
    if (!productName.trim()) {
      setError('Please enter a product name');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const request: GenerateTextRequest = {
        productName,
        description: description || undefined,
        targetAudience: targetAudience || undefined,
        campaignObjective,
        tone,
        platform,
        adFormat,
        callToAction: callToAction || undefined,
        budget,
        additionalContext: additionalContext || undefined,
      };

      const response = await geminiService.generateAdText(request);

      if (response.success) {
        setResult(response.data);
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
    // You might want to show a toast notification here
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Ad Text Generator</h1>
        <p className="text-gray-600">
          Use AI to create and rephrase compelling Facebook ad copy that drives results
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('rephrase')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rephrase'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <RefreshCw size={16} className="mr-2" />
              Rephrase Text
            </div>
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'generate'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wand2 size={20} className="mr-2" />
              {activeTab === 'rephrase' ? 'Rephrase Existing Text' : 'Generate New Ad Text'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeTab === 'rephrase' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text to Rephrase *
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tone
                    </label>
                    <select
                      value={rephraseTone}
                      onChange={(e) => setRephraseTone(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      {options?.tones?.map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      value={rephrasePlatform}
                      onChange={(e) => setRephrasePlatform(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      {options?.platforms?.map((p) => (
                        <option key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleRephraseText}
                  disabled={loading || !rephraseText.trim()}
                  className="w-full"
                  leftIcon={loading ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                >
                  {loading ? 'Rephrasing...' : 'Rephrase Text'}
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product/Service Name *
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter your product or service name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    maxLength={options?.limits?.maxProductNameLength || 100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product or service..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    rows={4}
                    maxLength={options?.limits?.maxDescriptionLength || 500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., young professionals, fitness enthusiasts, parents..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Objective
                    </label>
                    <select
                      value={campaignObjective}
                      onChange={(e) => setCampaignObjective(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      {options?.campaignObjectives?.map((obj) => (
                        <option key={obj} value={obj}>
                          {obj.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      {options?.tones?.map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      {options?.platforms?.map((p) => (
                        <option key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Format
                    </label>
                    <select
                      value={adFormat}
                      onChange={(e) => setAdFormat(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      {options?.adFormats?.map((format) => (
                        <option key={format} value={format}>
                          {format.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Call to Action
                    </label>
                    <input
                      type="text"
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                      placeholder="e.g., Shop Now, Learn More, Sign Up..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      value={budget || ''}
                      onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g., 1000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Context
                  </label>
                  <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Any additional requirements or context..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    maxLength={options?.limits?.maxAdditionalContextLength || 300}
                  />
                </div>

                <Button
                  onClick={handleGenerateText}
                  disabled={loading || !productName.trim()}
                  className="w-full"
                  leftIcon={loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
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

            {result && (
              <div className="space-y-6">
                {/* Main Result */}
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-green-800">
                      {activeTab === 'rephrase' ? 'Rephrased Text' : 'Generated Ad Text'}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.generatedText)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                  <div className="text-green-900 whitespace-pre-wrap">
                    {result.generatedText}
                  </div>
                </div>

                {/* Original Text (for rephrase) */}
                {activeTab === 'rephrase' && result.originalText && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Original Text</h3>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {result.originalText}
                    </div>
                  </div>
                )}

                {/* Alternative Suggestions */}
                {result.suggestions && result.suggestions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Alternative Variations</h3>
                    <div className="space-y-3">
                      {result.suggestions.map((suggestion: string, index: number) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div className="text-blue-900 whitespace-pre-wrap flex-1">
                              {suggestion}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(suggestion)}
                              className="text-blue-600 hover:text-blue-800 ml-2"
                            >
                              <Copy size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {result.metadata && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Generation Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Tone:</span>
                        <span className="ml-2 font-medium">{result.metadata.tone}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Platform:</span>
                        <span className="ml-2 font-medium">{result.metadata.platform}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Audience:</span>
                        <span className="ml-2 font-medium">{result.metadata.audience}</span>
                      </div>
                      {result.metadata.objective && (
                        <div>
                          <span className="text-gray-600">Objective:</span>
                          <span className="ml-2 font-medium">{result.metadata.objective}</span>
                        </div>
                      )}
                    </div>
                  </div>
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
