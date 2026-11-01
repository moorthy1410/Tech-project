import React, { createContext, useContext, useState, useEffect } from 'react';
import { Survey, SurveyResponse, TeamMember, UserRole, WorkspaceMetrics, SurveyQuestion } from '../types';
import { INITIAL_SURVEYS, INITIAL_RESPONSES, INITIAL_TEAM_MEMBERS } from '../data/mockData';

interface SurveyContextType {
  surveys: Survey[];
  responses: SurveyResponse[];
  teamMembers: TeamMember[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: 'dashboard' | 'surveys' | 'studio' | 'inbox' | 'analytics' | 'team';
  setActiveTab: (tab: 'dashboard' | 'surveys' | 'studio' | 'inbox' | 'analytics' | 'team') => void;
  selectedSurveyId: string | null;
  setSelectedSurveyId: (id: string | null) => void;
  editingSurvey: Survey | null;
  setEditingSurvey: (survey: Survey | null) => void;
  metrics: WorkspaceMetrics;

  // CRUD
  saveSurvey: (survey: Survey) => void;
  deleteSurvey: (id: string) => void;
  duplicateSurvey: (id: string) => void;
  updateSurveyStatus: (id: string, status: Survey['status']) => void;

  // Question editing within studio
  addQuestionToEditingSurvey: (question: Partial<SurveyQuestion>) => void;
  updateQuestionInEditingSurvey: (questionId: string, updates: Partial<SurveyQuestion>) => void;
  removeQuestionFromEditingSurvey: (questionId: string) => void;
  reorderQuestionsInEditingSurvey: (sourceIndex: number, destIndex: number) => void;

  // Responses
  submitResponse: (response: Omit<SurveyResponse, 'id' | 'submittedAt' | 'sentiment'>) => void;
  updateResponseNotes: (responseId: string, notes: string, reviewed?: boolean) => void;
  deleteResponse: (responseId: string) => void;

  // Team
  addTeamMember: (member: Omit<TeamMember, 'id' | 'lastActive'>) => void;
  removeTeamMember: (id: string) => void;

  // Interactive Live Taker Modal
  takerSurvey: Survey | null;
  openTakerModal: (survey: Survey) => void;
  closeTakerModal: () => void;

  // Share Modal
  sharingSurvey: Survey | null;
  openShareModal: (survey: Survey) => void;
  closeShareModal: () => void;

  // Reset to default
  resetAllData: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SURVEYS: 'nexus_surveys_v1',
  RESPONSES: 'nexus_responses_v1',
  TEAM: 'nexus_team_v1',
  ROLE: 'nexus_user_role_v1'
};

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage or Fallback
  const [surveys, setSurveys] = useState<Survey[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SURVEYS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_SURVEYS;
  });

  const [responses, setResponses] = useState<SurveyResponse[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESPONSES);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_RESPONSES;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TEAM);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_TEAM_MEMBERS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (stored === 'admin' || stored === 'contributor' || stored === 'analyst') {
        return stored;
      }
    } catch {
      // ignore
    }
    return 'admin';
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'surveys' | 'studio' | 'inbox' | 'analytics' | 'team'>('dashboard');
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);

  // Modals
  const [takerSurvey, setTakerSurvey] = useState<Survey | null>(null);
  const [sharingSurvey, setSharingSurvey] = useState<Survey | null>(null);

  // Persist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
    } catch {
      // ignore
    }
  }, [surveys]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
    } catch {
      // ignore
    }
  }, [responses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(teamMembers));
    } catch {
      // ignore
    }
  }, [teamMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
    } catch {
      // ignore
    }
  }, [currentRole]);

  // Calculate Metrics
  const metrics: WorkspaceMetrics = React.useMemo(() => {
    const totalSurveys = surveys.length;
    const activeSurveys = surveys.filter(s => s.status === 'published').length;
    const totalResponses = responses.length;

    // Calculate NPS
    const npsValues = responses
      .filter(r => typeof r.npsScore === 'number')
      .map(r => r.npsScore as number);
    
    let npsScore = 0;
    if (npsValues.length > 0) {
      const promoters = npsValues.filter(v => v >= 9).length;
      const detractors = npsValues.filter(v => v <= 6).length;
      npsScore = Math.round(((promoters - detractors) / npsValues.length) * 100);
    }

    // Calculate Avg CSAT (stars)
    const csatValues = responses
      .filter(r => typeof r.csatRating === 'number')
      .map(r => r.csatRating as number);
    const avgCsat = csatValues.length > 0
      ? Number((csatValues.reduce((a, b) => a + b, 0) / csatValues.length).toFixed(1))
      : 4.8;

    // Calculate completion rate based on targets
    const avgCompletionRate = surveys.length > 0
      ? Math.min(100, Math.round((totalResponses / Math.max(1, surveys.reduce((acc, s) => acc + (s.responseTarget || 100), 0))) * 100 * 3.5))
      : 84;

    // Sentiment breakdown
    const positive = responses.filter(r => r.sentiment === 'positive').length;
    const neutral = responses.filter(r => r.sentiment === 'neutral').length;
    const negative = responses.filter(r => r.sentiment === 'negative').length;

    return {
      totalSurveys,
      activeSurveys,
      totalResponses,
      avgCompletionRate: Math.max(72, avgCompletionRate),
      npsScore,
      avgCsat,
      sentimentBreakdown: { positive, neutral, negative }
    };
  }, [surveys, responses]);

  // Survey CRUD
  const saveSurvey = (survey: Survey) => {
    setSurveys(prev => {
      const idx = prev.findIndex(s => s.id === survey.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...survey, updatedAt: new Date().toISOString() };
        return next;
      }
      return [{ ...survey, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev];
    });
  };

  const deleteSurvey = (id: string) => {
    setSurveys(prev => prev.filter(s => s.id !== id));
    if (selectedSurveyId === id) setSelectedSurveyId(null);
    if (editingSurvey?.id === id) setEditingSurvey(null);
  };

  const duplicateSurvey = (id: string) => {
    const orig = surveys.find(s => s.id === id);
    if (!orig) return;
    const copy: Survey = {
      ...orig,
      id: `srv-${Date.now().toString(36)}`,
      title: `${orig.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSurveys(prev => [copy, ...prev]);
  };

  const updateSurveyStatus = (id: string, status: Survey['status']) => {
    setSurveys(prev => prev.map(s => s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s));
  };

  // Editing in Studio
  const addQuestionToEditingSurvey = (partialQ: Partial<SurveyQuestion>) => {
    if (!editingSurvey) return;
    const newQ: SurveyQuestion = {
      id: `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      type: partialQ.type || 'rating_stars',
      title: partialQ.title || 'Untitled Question',
      description: partialQ.description || '',
      required: partialQ.required ?? true,
      options: partialQ.options || (partialQ.type === 'multiple_choice' || partialQ.type === 'checkboxes' ? [
        { id: 'opt-1', label: 'Option 1' },
        { id: 'opt-2', label: 'Option 2' },
        { id: 'opt-3', label: 'Option 3' }
      ] : undefined),
      scale: partialQ.scale || (partialQ.type === 'nps' ? 10 : 5)
    };
    const updated = {
      ...editingSurvey,
      questions: [...editingSurvey.questions, newQ],
      updatedAt: new Date().toISOString()
    };
    setEditingSurvey(updated);
    saveSurvey(updated);
  };

  const updateQuestionInEditingSurvey = (questionId: string, updates: Partial<SurveyQuestion>) => {
    if (!editingSurvey) return;
    const updatedQuestions = editingSurvey.questions.map(q => q.id === questionId ? { ...q, ...updates } : q);
    const updated = {
      ...editingSurvey,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString()
    };
    setEditingSurvey(updated);
    saveSurvey(updated);
  };

  const removeQuestionFromEditingSurvey = (questionId: string) => {
    if (!editingSurvey) return;
    const updatedQuestions = editingSurvey.questions.filter(q => q.id !== questionId);
    const updated = {
      ...editingSurvey,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString()
    };
    setEditingSurvey(updated);
    saveSurvey(updated);
  };

  const reorderQuestionsInEditingSurvey = (sourceIndex: number, destIndex: number) => {
    if (!editingSurvey) return;
    const items = [...editingSurvey.questions];
    const [reordered] = items.splice(sourceIndex, 1);
    items.splice(destIndex, 0, reordered);
    const updated = {
      ...editingSurvey,
      questions: items,
      updatedAt: new Date().toISOString()
    };
    setEditingSurvey(updated);
    saveSurvey(updated);
  };

  // Submit Response
  const submitResponse = (respData: Omit<SurveyResponse, 'id' | 'submittedAt' | 'sentiment'>) => {
    // Determine sentiment
    let sentiment: SurveyResponse['sentiment'] = 'positive';
    if (typeof respData.npsScore === 'number') {
      if (respData.npsScore <= 6) sentiment = 'negative';
      else if (respData.npsScore <= 8) sentiment = 'neutral';
      else sentiment = 'positive';
    } else if (typeof respData.csatRating === 'number') {
      if (respData.csatRating <= 2) sentiment = 'negative';
      else if (respData.csatRating === 3) sentiment = 'neutral';
      else sentiment = 'positive';
    }

    const newResponse: SurveyResponse = {
      ...respData,
      id: `resp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      submittedAt: new Date().toISOString(),
      sentiment,
      reviewed: false
    };

    setResponses(prev => [newResponse, ...prev]);
  };

  const updateResponseNotes = (responseId: string, notes: string, reviewed: boolean = true) => {
    setResponses(prev => prev.map(r => r.id === responseId ? { ...r, notes, reviewed } : r));
  };

  const deleteResponse = (responseId: string) => {
    setResponses(prev => prev.filter(r => r.id !== responseId));
  };

  // Team
  const addTeamMember = (memberData: Omit<TeamMember, 'id' | 'lastActive'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `usr-${Date.now().toString(36)}`,
      lastActive: 'Just joined'
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  // Modals
  const openTakerModal = (survey: Survey) => setTakerSurvey(survey);
  const closeTakerModal = () => setTakerSurvey(null);

  const openShareModal = (survey: Survey) => setSharingSurvey(survey);
  const closeShareModal = () => setSharingSurvey(null);

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.SURVEYS);
    localStorage.removeItem(STORAGE_KEYS.RESPONSES);
    localStorage.removeItem(STORAGE_KEYS.TEAM);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    setSurveys(INITIAL_SURVEYS);
    setResponses(INITIAL_RESPONSES);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setCurrentRole('admin');
  };

  return (
    <SurveyContext.Provider
      value={{
        surveys,
        responses,
        teamMembers,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        selectedSurveyId,
        setSelectedSurveyId,
        editingSurvey,
        setEditingSurvey,
        metrics,
        saveSurvey,
        deleteSurvey,
        duplicateSurvey,
        updateSurveyStatus,
        addQuestionToEditingSurvey,
        updateQuestionInEditingSurvey,
        removeQuestionFromEditingSurvey,
        reorderQuestionsInEditingSurvey,
        submitResponse,
        updateResponseNotes,
        deleteResponse,
        addTeamMember,
        removeTeamMember,
        takerSurvey,
        openTakerModal,
        closeTakerModal,
        sharingSurvey,
        openShareModal,
        closeShareModal,
        resetAllData
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) throw new Error('useSurvey must be used within SurveyProvider');
  return context;
};
