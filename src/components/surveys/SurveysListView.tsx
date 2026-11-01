import React, { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { Survey, SurveyStatus } from '../../types';
import {
  Search,
  Plus,
  Play,
  Layers,
  Share2,
  Copy,
  Trash2,
  MoreVertical,
  Filter,
  CheckCircle2,
  PauseCircle,
  FileEdit,
  Clock,
  ArrowUpDown
} from 'lucide-react';

export const SurveysListView: React.FC = () => {
  const {
    surveys,
    responses,
    deleteSurvey,
    duplicateSurvey,
    updateSurveyStatus,
    setEditingSurvey,
    setActiveTab,
    openTakerModal,
    openShareModal
  } = useSurvey();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SurveyStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const categories = Array.from(new Set(surveys.map(s => s.category)));

  const filteredSurveys = surveys.filter(s => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateNew = () => {
    const newSurvey: Survey = {
      id: `srv-${Date.now().toString(36)}`,
      title: 'Customer Feedback & Insights Survey',
      description: 'Structured questionnaire to measure sentiment, workflow blockers, and NPS.',
      category: 'Product Feedback',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Sarah Chen',
      tags: ['Feedback', '2026'],
      responseTarget: 100,
      allowAnonymous: false,
      questions: [
        {
          id: `q-${Date.now().toString(36)}-1`,
          type: 'nps',
          title: 'How likely are you to recommend our product to a colleague?',
          description: '0 = Not likely, 10 = Extremely likely',
          required: true,
          scale: 10
        },
        {
          id: `q-${Date.now().toString(36)}-2`,
          type: 'rating_stars',
          title: 'How satisfied are you with overall product usability?',
          required: true,
          scale: 5
        },
        {
          id: `q-${Date.now().toString(36)}-3`,
          type: 'text',
          title: 'What specific improvement would help your day-to-day workflow?',
          required: false
        }
      ]
    };
    setEditingSurvey(newSurvey);
    setActiveTab('studio');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Surveys & Questionnaires Directory
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Manage deployed surveys, edit question logic, and monitor response fulfillment quotas.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Survey</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'published', 'draft', 'paused'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === tab
                  ? 'bg-indigo-50 text-[#4F46E5] font-semibold border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              {tab === 'published' ? 'Live' : tab}
              <span className="ml-1.5 text-[11px] text-slate-400 tnum">
                (
                {tab === 'all'
                  ? surveys.length
                  : surveys.filter(s => s.status === tab).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Search and Category select */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filter by title or tag..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Survey Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSurveys.map(survey => {
          const surveyResponses = responses.filter(r => r.surveyId === survey.id);
          const count = surveyResponses.length;
          const target = survey.responseTarget || 100;
          const pct = Math.min(100, Math.round((count / target) * 100));

          return (
            <div
              key={survey.id}
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs hover:border-[#CBD5E1] transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {survey.status === 'published' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        Live & Collecting
                      </span>
                    ) : survey.status === 'draft' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        Draft Composer
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Paused
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {survey.category}
                    </span>
                  </div>

                  {/* Context menu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === survey.id ? null : survey.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === survey.id && (
                      <div
                        className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 text-xs text-slate-700"
                        onMouseLeave={() => setActiveMenuId(null)}
                      >
                        <button
                          onClick={() => {
                            setEditingSurvey(survey);
                            setActiveTab('studio');
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <FileEdit className="w-3.5 h-3.5 text-slate-400" />
                          <span>Edit in Studio</span>
                        </button>

                        <button
                          onClick={() => {
                            duplicateSurvey(survey.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Duplicate Survey</span>
                        </button>

                        <button
                          onClick={() => {
                            openShareModal(survey);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Share2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Share / Embed Code</span>
                        </button>

                        <div className="border-t border-slate-100 my-1" />

                        {survey.status === 'published' ? (
                          <button
                            onClick={() => {
                              updateSurveyStatus(survey.id, 'paused');
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-amber-50 text-amber-700 flex items-center gap-2"
                          >
                            <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pause Collection</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              updateSurveyStatus(survey.id, 'published');
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Publish Live</span>
                          </button>
                        )}

                        <div className="border-t border-slate-100 my-1" />

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${survey.title}"?`)) {
                              deleteSurvey(survey.id);
                              setActiveMenuId(null);
                            }
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Delete Survey</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Survey Title & Description */}
                <h3 className="font-bold text-sm text-[#0F172A] tracking-tight">{survey.title}</h3>
                <p className="text-xs text-[#475569] mt-1 line-clamp-2">{survey.description}</p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {survey.tags.map(t => (
                    <span key={t} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                      #{t}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-400 ml-auto font-medium">
                    {survey.questions.length} questions
                  </span>
                </div>
              </div>

              {/* Progress and Actions Bottom Section */}
              <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Response Fulfillment</span>
                  <span className="font-bold text-slate-900 tnum">
                    {count} <span className="text-slate-400 font-normal">/ {target} ({pct}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#4F46E5] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Action button row */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Updated {new Date(survey.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openTakerModal(survey)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      title="Experience this survey as an end user"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Take Live</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingSurvey(survey);
                        setActiveTab('studio');
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Studio</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
          <p className="text-sm font-semibold text-slate-800">No matching surveys found</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing your filters or create a new survey.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setSelectedCategory('all');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
