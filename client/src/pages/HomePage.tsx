import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Rocket, Target, BarChart2, RefreshCw, Zap, Award, CheckCircle, PenTool, Image, Send, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-900 to-primary-800 text-white pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <div className="inline-flex items-center bg-primary-700 rounded-full px-3 py-1 mb-6">
                <Rocket size={16} className="mr-2 text-accent" />
                <span className="text-sm font-medium">AI-Powered Facebook Ads</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Create, Optimize & Scale Facebook Ads with <span className="text-accent">AI</span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-lg">
                DiMark AI uses advanced artificial intelligence to generate, publish, and optimize Facebook ad campaigns in real-time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" variant="accent">
                    Get Started Free
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="secondary">
                    How It Works
                  </Button>
                </a>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-800 bg-primary-300 flex items-center justify-center text-primary-800 font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Trusted by 1,000+ businesses</p>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                <div className="bg-white p-6 rounded-xl shadow-2xl transform rotate-3 z-10">
                  <img
                    src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg"
                    alt="AI-generated Facebook ad"
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="mt-4">
                    <h3 className="text-gray-900 font-bold text-lg">Summer Collection Launch</h3>
                    <p className="text-gray-600">Discover our new summer styles with 20% off your first order!</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-primary-600 font-medium">Generated in 15 seconds</span>
                      <div className="flex items-center">
                        <Target size={16} className="text-success mr-1" />
                        <span className="text-sm text-gray-700">CTR: 4.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-12 -left-6 bg-accent/10 backdrop-blur-sm p-4 rounded-lg border border-accent/30 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Brain size={20} className="text-accent" />
                    <span className="text-accent font-medium">AI Writing 99% complete...</span>
                  </div>
                </div>
                <div className="absolute bottom-4 -right-4 bg-primary-600/10 backdrop-blur-sm p-4 rounded-lg border border-primary-600/30 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <BarChart2 size={20} className="text-primary-600" />
                    <span className="text-primary-600 font-medium">+156% ROAS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need For Facebook Ads Success
            </h2>
            <p className="text-gray-600 text-lg">
              Our AI-powered platform handles everything from creative generation to optimization and scaling.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  <PenTool size={24} />
                </div>
                <CardTitle>AI Ad Copy Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate compelling ad copy, headlines, and CTAs tailored to your brand's voice and target audience in seconds.
                </p>
                <ul className="mt-4 space-y-2">
                  {['Multiple variations', 'Brand voice matching', 'Conversion-focused copy'].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle size={16} className="text-success mr-2" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  <Image size={24} />
                </div>
                <CardTitle>AI Visual Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create eye-catching ad creatives and images that match your branding and increase engagement.
                </p>
                <ul className="mt-4 space-y-2">
                  {['Brand-aligned visuals', 'Multiple formats', 'A/B testing ready'].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle size={16} className="text-success mr-2" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  <Send size={24} />
                </div>
                <CardTitle>One-Click Publishing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Publish your AI-generated ads directly to Facebook with just one click. No need to switch platforms.
                </p>
                <ul className="mt-4 space-y-2">
                  {['Direct FB integration', 'Scheduling options', 'Multi-account support'].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle size={16} className="text-success mr-2" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  <Target size={24} />
                </div>
                <CardTitle>Audience Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI analyzes performance data to automatically refine your target audience for maximum ROI.
                </p>
                <ul className="mt-4 space-y-2">
                  {['Smart segmentation', 'Look-alike audiences', 'Performance-based targeting'].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle size={16} className="text-success mr-2" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  <TrendingUp size={24} />
                </div>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive analytics dashboard with real-time data visualization and actionable insights.
                </p>
                <ul className="mt-4 space-y-2">
                  {['Real-time metrics', 'Custom reports', 'Performance forecasting'].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle size={16} className="text-success mr-2" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  <RefreshCw size={24} />
                </div>
                <CardTitle>Smart Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automatically allocate your ad spend across campaigns and audience segments for optimal results.
                </p>
                <ul className="mt-4 space-y-2">
                  {['Performance-based allocation', 'Budget recommendations', 'Spend alerts'].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle size={16} className="text-success mr-2" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How DiMark AI Works
            </h2>
            <p className="text-gray-600 text-lg">
              Our powerful AI platform makes Facebook advertising simple, effective, and data-driven.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mx-auto mb-6">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Configure</h3>
              <p className="text-gray-600">
                Connect your Facebook ad account and provide basic information about your business and target audience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mx-auto mb-6">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate & Publish</h3>
              <p className="text-gray-600">
                Use our AI to create ad copy, visuals, and targeting options, then publish directly to Facebook with one click.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mx-auto mb-6">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Optimize & Scale</h3>
              <p className="text-gray-600">
                Our AI continuously analyzes performance data to optimize your campaigns and provide actionable insights.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/signup">
              <Button size="lg" variant="primary">
                Start Creating Ads
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Marketers Worldwide
            </h2>
            <p className="text-gray-600 text-lg">
              See what our customers have to say about their experience with DiMark AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                title: 'Marketing Director, FashionCo',
                image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
                quote: 'DiMark AI has transformed our Facebook advertising strategy. We\'ve seen a 43% increase in ROAS since implementing their platform.'
              },
              {
                name: 'Michael Chen',
                title: 'Digital Marketing Manager, TechStart',
                image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
                quote: 'The AI-generated ads consistently outperform our manually created ones. We\'re saving time and money while getting better results.'
              },
              {
                name: 'Jessica Williams',
                title: 'E-commerce Owner, HomeStyle',
                image: 'https://images.pexels.com/photos/3754825/pexels-photo-3754825.jpeg',
                quote: 'As a small business owner, I don\'t have time to become a Facebook ads expert. DiMark AI levels the playing field for us.'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 text-lg">
              Choose the plan that works best for your business needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">
                Perfect for small businesses just getting started with Facebook ads.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  '25 AI-generated ads per month',
                  '1 Facebook ad account',
                  'Basic audience optimization',
                  'Email support'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={18} className="text-success mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button variant="secondary" fullWidth>
                  Get Started
                </Button>
              </Link>
            </div>
            
            <div className="border-2 border-primary-600 rounded-xl p-8 shadow-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-4">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">
                Ideal for growing businesses looking to scale their Facebook ads.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited AI-generated ads',
                  '3 Facebook ad accounts',
                  'Advanced audience optimization',
                  'AI budget allocation',
                  'Priority support'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={18} className="text-success mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button variant="primary" fullWidth>
                  Get Started
                </Button>
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$249</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">
                For agencies and large companies with advanced needs.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited AI-generated ads',
                  '10 Facebook ad accounts',
                  'Custom audience strategies',
                  'Advanced analytics & reporting',
                  'Dedicated account manager',
                  'API access'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={18} className="text-success mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button variant="secondary" fullWidth>
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Facebook Advertising?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of businesses using DiMark AI to create high-performing Facebook ads.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" variant="accent">
                  Start Your Free Trial
                </Button>
              </Link>
              <a href="#contact">
                <Button size="lg" variant="secondary">
                  Schedule a Demo
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};