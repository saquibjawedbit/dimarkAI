import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout, DashboardHome, DashboardCampaigns, AdSetsManagement, AdsManagement, GeminiTextGenerator } from '../components/dashboard';

export const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
        <Route path="/home" element={<DashboardHome />} />
        <Route path="/campaigns" element={<DashboardCampaigns />} />
        <Route path="/campaigns/:campaignId/adsets" element={<AdSetsManagement />} />
        <Route path="/campaigns/:campaignId/adsets/:adsetId/ads" element={<AdsManagement />} />
        <Route path="/ai-text-generator" element={<GeminiTextGenerator />} />
        <Route path="/analytics" element={<div className="p-8 text-center text-gray-500">Analytics section coming soon...</div>} />
        <Route path="/settings" element={<div className="p-8 text-center text-gray-500">Settings section coming soon...</div>} />
      </Routes>
    </DashboardLayout>
  );
};