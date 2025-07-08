import React, { useState } from 'react';
import { Brain, Image, Edit3, RefreshCw, Target, Sliders, Loader, Facebook, Eye, Save, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export const AdCreatorPage: React.FC = () => {
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    goal: '',
    productDescription: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Ad Creator</h1>
          <p className="text-gray-600 mb-8">
            Let our AI create high-performing Facebook ads for your business in seconds.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain size={20} className="mr-2 text-primary-600" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <Input
                      label="Business Name"
                      name="businessName"
                      value={businessInfo.businessName}
                      onChange={handleInputChange}
                      placeholder="e.g., FashionCo"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                      </label>
                      <select
                        name="industry"
                        value={businessInfo.industry}
                        onChange={(e) => handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                        className="w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200"
                      >
                        <option value="">Select your industry</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="saas">SaaS</option>
                        <option value="realEstate">Real Estate</option>
                        <option value="education">Education</option>
                        <option value="fitness">Health & Fitness</option>
                        <option value="travel">Travel & Hospitality</option>
                        <option value="finance">Finance</option>
                        <option value="food">Food & Beverage</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad Goal
                      </label>
                      <select
                        name="goal"
                        value={businessInfo.goal}
                        onChange={(e) => handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                        className="w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200"
                      >
                        <option value="">Select your goal</option>
                        <option value="awareness">Brand Awareness</option>
                        <option value="traffic">Website Traffic</option>
                        <option value="engagement">Post Engagement</option>
                        <option value="leads">Lead Generation</option>
                        <option value="sales">Sales & Conversions</option>
                        <option value="app">App Installs</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Audience
                      </label>
                      <input
                        name="targetAudience"
                        value={businessInfo.targetAudience}
                        onChange={handleInputChange}
                        placeholder="e.g., Women, 25-34, interested in fitness"
                        className="w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200 p-2.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product/Service Description
                      </label>
                      <textarea
                        name="productDescription"
                        value={businessInfo.productDescription}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Describe your product or service that you want to advertise..."
                        className="w-full rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200 p-2.5"
                      />
                    </div>
                    
                    <Button
                      variant="primary"
                      fullWidth
                      leftIcon={<Brain size={18} />}
                      isLoading={isGenerating}
                      onClick={handleGenerate}
                      type="button"
                    >
                      {isGenerating ? 'Generating...' : generated ? 'Regenerate' : 'Generate Ad'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              {!generated && !isGenerating ? (
                <div className="h-full flex items-center justify-center bg-white rounded-xl border border-gray-200 p-8">
                  <div className="text-center max-w-md">
                    <Brain size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Ready to create your ad</h2>
                    <p className="text-gray-600">
                      Fill in your business information and click "Generate Ad" to let our AI create a high-converting Facebook ad for you.
                    </p>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="h-full flex items-center justify-center bg-white rounded-xl border border-gray-200 p-8">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin mx-auto"></div>
                      <Brain size={32} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-600" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-900 mb-2">AI is working its magic</h2>
                    <p className="text-gray-600">
                      Creating ad variations based on your business information...
                    </p>
                    <div className="flex justify-center space-x-2 mt-4">
                      <span className="inline-block w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                      <span className="inline-block w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="inline-block w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Generated Ad Variations</h2>
                    <div className="flex space-x-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<RefreshCw size={16} />}
                      >
                        Regenerate
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Save size={16} />}
                      >
                        Save All
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/2">
                        <img
                          src="https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg"
                          alt="Generated ad image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:w-1/2 p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold text-gray-900 mr-2">Variation 1</h3>
                              <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                Recommended
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">FashionCo • Sponsored</p>
                          </div>
                          <Facebook size={20} className="text-[#1877F2]" />
                        </div>
                        
                        <div className="mb-4 flex-grow">
                          <h4 className="text-lg font-bold mb-2">Transform Your Summer Style: 20% Off New Arrivals!</h4>
                          <p className="text-gray-700 mb-2">
                            Beat the heat with our breathable summer collection. Limited time offer: 20% off your first order with code SUMMER20.
                          </p>
                          <p className="text-[#1877F2] font-medium text-sm">Shop Now</p>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<Edit3 size={16} />}
                            fullWidth
                          >
                            Edit
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Send size={16} />}
                            fullWidth
                          >
                            Publish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">Variation 2</h3>
                            <p className="text-xs text-gray-500">FashionCo • Sponsored</p>
                          </div>
                          <Facebook size={16} className="text-[#1877F2]" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold mb-1">Summer Essentials You Can't Miss!</h4>
                          <p className="text-sm text-gray-700 mb-1">
                            Elevate your wardrobe with our new summer essentials. Effortless style for every occasion.
                          </p>
                          <p className="text-xs text-[#1877F2] font-medium">Shop Collection</p>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<Edit3 size={14} />}
                            className="text-xs py-1 px-2 h-8"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Send size={14} />}
                            className="text-xs py-1 px-2 h-8"
                          >
                            Publish
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">Variation 3</h3>
                            <p className="text-xs text-gray-500">FashionCo • Sponsored</p>
                          </div>
                          <Facebook size={16} className="text-[#1877F2]" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold mb-1">Summer Flash Sale: 48 Hours Only!</h4>
                          <p className="text-sm text-gray-700 mb-1">
                            Don't miss out! 48-hour flash sale with up to 40% off our summer favorites. Limited stock available.
                          </p>
                          <p className="text-xs text-[#1877F2] font-medium">Shop Sale</p>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<Edit3 size={14} />}
                            className="text-xs py-1 px-2 h-8"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Send size={14} />}
                            className="text-xs py-1 px-2 h-8"
                          >
                            Publish
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target size={20} className="mr-2 text-primary-600" />
                        Recommended Targeting
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Demographics</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span className="text-gray-600">Age:</span>
                              <span className="font-medium">25-34</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Gender:</span>
                              <span className="font-medium">Women</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium">Urban areas</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Interests</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Fashion', 'Online shopping', 'Summer trends', 'Accessories', 'Style'].map((tag, i) => (
                              <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Behaviors</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Online shoppers', 'Fashion enthusiasts', 'Engaged shoppers', 'Mobile users'].map((tag, i) => (
                              <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Sliders size={16} />}
                        >
                          Customize Targeting
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};