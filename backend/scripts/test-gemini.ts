/**
 * Test script for Gemini AI integration
 * This script tests the Gemini service without requiring a full server setup
 */

import dotenv from 'dotenv';
import { GeminiService } from '../ads-server/services/gemini.service';

// Load environment variables
dotenv.config();

async function testGeminiService() {
  console.log('🧪 Testing Gemini AI Service...\n');

  try {
    // Initialize the service
    const geminiService = new GeminiService();
    
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthCheck = await geminiService.healthCheck();
    console.log('Health Check Result:', healthCheck ? '✅ Healthy' : '❌ Unhealthy');
    
    if (!healthCheck) {
      console.log('❌ Gemini service is not healthy. Please check your API key and internet connection.');
      return;
    }
    
    // Test 2: Rephrase Text
    console.log('\n2. Testing Text Rephrasing...');
    const rephraseRequest = {
      text: 'Buy our amazing product now! It\'s the best deal you\'ll find.',
      targetAudience: 'young professionals',
      tone: 'persuasive' as const,
      platform: 'facebook' as const
    };
    
    const rephraseResult = await geminiService.rephraseText(rephraseRequest);
    
    if (rephraseResult.success) {
      console.log('✅ Rephrase Test Successful!');
      console.log('Original:', rephraseRequest.text);
      console.log('Rephrased:', rephraseResult.data?.generatedText);
      if (rephraseResult.data?.suggestions && rephraseResult.data.suggestions.length > 0) {
        console.log('Alternatives:', rephraseResult.data.suggestions.slice(0, 2));
      }
    } else {
      console.log('❌ Rephrase Test Failed:', rephraseResult.error);
    }
    
    // Test 3: Generate Ad Text
    console.log('\n3. Testing Ad Text Generation...');
    const generateRequest = {
      productName: 'EcoFriendly Water Bottle',
      description: 'A sustainable, BPA-free water bottle made from recycled materials',
      targetAudience: 'environmentally conscious consumers',
      campaignObjective: 'conversions' as const,
      tone: 'friendly' as const,
      platform: 'facebook' as const,
      adFormat: 'single_image' as const,
      callToAction: 'Shop Now',
      budget: 500
    };
    
    const generateResult = await geminiService.generateAdText(generateRequest);
    
    if (generateResult.success) {
      console.log('✅ Generate Test Successful!');
      console.log('Generated Ad Text:\n', generateResult.data?.generatedText);
      if (generateResult.data?.suggestions && generateResult.data.suggestions.length > 0) {
        console.log('Alternative Version:\n', generateResult.data.suggestions[0]);
      }
    } else {
      console.log('❌ Generate Test Failed:', generateResult.error);
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_KEY')) {
        console.log('\n💡 Solution: Add your Gemini API key to the .env file:');
        console.log('   GEMINI_API_KEY=your_api_key_here');
      } else if (error.message.includes('fetch')) {
        console.log('\n💡 Solution: Check your internet connection and API key validity');
      }
    }
  }
}

// Run the test
testGeminiService().catch(console.error);
