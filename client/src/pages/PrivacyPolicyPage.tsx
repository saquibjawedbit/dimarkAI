import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Welcome to our Facebook Ads Management Platform. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our service. Please read this 
              privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
            <p className="mb-4">
              We may collect personal information that you provide to us such as:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Name and contact information</li>
              <li>Email address</li>
              <li>Facebook account information</li>
              <li>Business information related to your advertising accounts</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Facebook Data</h3>
            <p className="mb-4">
              When you connect your Facebook account, we may access and store:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Facebook Pages you manage</li>
              <li>Facebook Ads accounts you have access to</li>
              <li>Campaign, ad set, and creative data</li>
              <li>Performance metrics and analytics</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.3 Usage Data</h3>
            <p>
              We automatically collect certain information when you use our service, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Log data (IP address, browser type, pages visited)</li>
              <li>Device information</li>
              <li>Usage patterns and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Provide, operate, and maintain our service</li>
              <li>Manage your Facebook advertising campaigns</li>
              <li>Improve, personalize, and expand our service</li>
              <li>Understand and analyze how you use our service</li>
              <li>Communicate with you about your account and our service</li>
              <li>Detect and prevent fraud or security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Facebook Integration</h2>
            <p className="mb-4">
              Our service integrates with Facebook's Marketing API to manage your advertising campaigns. 
              This integration is governed by:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Facebook's Data Policy</li>
              <li>Facebook's Terms of Service</li>
              <li>Facebook's Platform Terms</li>
            </ul>
            <p>
              We only access Facebook data that you explicitly authorize through Facebook's permission system.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties except:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in our operations (under strict confidentiality)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your 
              information against unauthorized access, alteration, disclosure, or destruction. However, 
              no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p>
              We retain your information only as long as necessary to provide our service and comply 
              with legal obligations. You can request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Portability of your data</li>
              <li>Restriction of processing</li>
              <li>Objection to processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience, analyze 
              usage, and personalize content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Third-Party Services</h2>
            <p>
              Our service may contain links to third-party websites or services. We are not responsible 
              for the privacy practices of these third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Children's Privacy</h2>
            <p>
              Our service is not intended for individuals under the age of 13. We do not knowingly 
              collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@example.com</p>
              <p><strong>Address:</strong> [Your Company Address]</p>
              <p><strong>Phone:</strong> [Your Phone Number]</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Compliance</h2>
            <p>
              This Privacy Policy is designed to comply with applicable privacy laws including GDPR, 
              CCPA, and other regional privacy regulations. We are committed to protecting your privacy 
              and handling your data responsibly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
