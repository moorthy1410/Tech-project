import React, { useState, useEffect } from 'react';
import { SurveyProvider, useSurvey } from './context/SurveyContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { SurveysListView } from './components/surveys/SurveysListView';
import { SurveyStudioView } from './components/studio/SurveyStudioView';
import { FeedbackInboxView } from './components/inbox/FeedbackInboxView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { TeamView } from './components/team/TeamView';
import { SurveyTakerModal } from './components/taker/SurveyTakerModal';
import { ShareModal } from './components/common/ShareModal';
import { CommandPalette } from './components/common/CommandPalette';

const MainLayout: React.FC = () => {
  const { activeTab, surveys, openTakerModal } = useSurvey();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Check for direct hashtag survey routing (e.g. #survey=srv-1)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#survey=')) {
        const surveyId = hash.replace('#survey=', '');
        const targetSurvey = surveys.find(s => s.id === surveyId);
        if (targetSurvey) {
          openTakerModal(targetSurvey);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [surveys, openTakerModal]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex">
      {/* Collapsible Sidebar Rail */}
      <Sidebar />

      {/* Main Content Area */}
      {/* Uses ml-16 on mobile/collapsed or ml-60 default; Sidebar manages inner fixed position */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200 pl-16 md:pl-60">
        {/* Top Sticky Header */}
        <Header onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        {/* Scrollable Work View */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto pb-16">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'surveys' && <SurveysListView />}
          {activeTab === 'studio' && <SurveyStudioView />}
          {activeTab === 'inbox' && <FeedbackInboxView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'team' && <TeamView />}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <SurveyTakerModal />
      <ShareModal />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SurveyProvider>
      <MainLayout />
    </SurveyProvider>
  );
}
