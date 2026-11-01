import React, { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { SurveyResponse } from '../../types';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  MessageSquare,
  Sparkles,
  Building,
  Mail,
  User,
  Star,
  X,
  FileText,
  Trash2,
  Share2,
  ThumbsUp,
  Tag
} from 'lucide-react';

export const FeedbackInboxView: React.FC = () => {
  const { responses, surveys, updateResponseNotes, deleteResponse } = useSurvey();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurveyFilter, setSelectedSurveyFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(responses[0] || null);
  const [notesInput, setNotesInput] = useState('');

  const filteredResponses = responses.filter(r => {
    const matchesSearch =
      r.respondentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.respondentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.respondentCompany && r.respondentCompany.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.answers.some(a => typeof a.value === 'string' && a.value.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSurvey = selectedSurveyFilter === 'all' || r.surveyId === selectedSurveyFilter;
    const matchesSentiment = sentimentFilter === 'all' || r.sentiment === sentimentFilter;

    return matchesSearch && matchesSurvey && matchesSentiment;
  });

  const handleSelectResponse = (resp: SurveyResponse) => {
    setSelectedResponse(resp);
    setNotesInput(resp.notes || '');
  };

  const handleSaveNotes = () => {
    if (!selectedResponse) return;
    updateResponseNotes(selectedResponse.id, notesInput, true);
    setSelectedResponse(prev => prev ? { ...prev, notes: notesInput, reviewed: true } : null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Customer Feedback Inbox & Stream
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Individual respondent records, customer sentiment scoring, and operational triage notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs tnum">
            {filteredResponses.length} of {responses.length} responses
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Sentiment filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'positive', 'neutral', 'negative'] as const).map(sent => (
            <button
              key={sent}
              onClick={() => setSentimentFilter(sent)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                sentimentFilter === sent
                  ? 'bg-indigo-50 text-[#4F46E5] font-semibold border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              {sent}
              <span className="ml-1.5 text-[10px] text-slate-400 tnum">
                (
                {sent === 'all'
                  ? responses.length
                  : responses.filter(r => r.sentiment === sent).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Search & Survey filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search comments or respondents..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedSurveyFilter}
            onChange={e => setSelectedSurveyFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">All Surveys</option>
            {surveys.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content: Response Stream + 320px Contextual Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Response List (7 cols or 8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-2.5">
          {filteredResponses.map(resp => {
            const isSelected = selectedResponse?.id === resp.id;
            const textAnswer = resp.answers.find(a => typeof a.value === 'string' && a.value.length > 10);

            return (
              <div
                key={resp.id}
                onClick={() => handleSelectResponse(resp)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#4F46E5] ring-2 ring-indigo-100 shadow-sm'
                    : 'border-[#E2E8F0] hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        resp.sentiment === 'positive'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : resp.sentiment === 'negative'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {resp.sentiment}
                    </span>

                    <span className="font-semibold text-xs text-slate-900">{resp.respondentName}</span>
                    {resp.respondentCompany && (
                      <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                        • {resp.respondentCompany}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {typeof resp.npsScore === 'number' && (
                      <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded tnum">
                        NPS {resp.npsScore}/10
                      </span>
                    )}
                    {typeof resp.csatRating === 'number' && (
                      <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded tnum">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {resp.csatRating}.0
                      </span>
                    )}
                  </div>
                </div>

                {textAnswer && (
                  <p className="text-xs text-slate-700 mt-2 line-clamp-2 bg-slate-50/80 p-2 rounded-lg border border-slate-100 font-normal">
                    "{textAnswer.value}"
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span className="truncate max-w-xs">{resp.surveyTitle}</span>
                  <div className="flex items-center gap-2">
                    {resp.reviewed && (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Reviewed
                      </span>
                    )}
                    <span>{new Date(resp.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredResponses.length === 0 && (
            <div className="bg-white p-10 rounded-xl border border-slate-200 text-center">
              <p className="text-sm font-semibold text-slate-700">No responses match this filter</p>
              <p className="text-xs text-slate-400 mt-1">Try switching surveys or clearing the sentiment filter.</p>
            </div>
          )}
        </div>

        {/* Right Column: 320px Contextual Inspector Drawer */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-20 bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          {selectedResponse ? (
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        selectedResponse.sentiment === 'positive'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : selectedResponse.sentiment === 'negative'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {selectedResponse.sentiment} sentiment
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      #{selectedResponse.id.slice(-6)}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">
                    {selectedResponse.respondentName}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Delete this feedback submission record?')) {
                      deleteResponse(selectedResponse.id);
                      setSelectedResponse(null);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete response"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Respondent Metadata */}
              <div className="py-3 border-b border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{selectedResponse.respondentEmail}</span>
                </div>
                {selectedResponse.respondentCompany && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedResponse.respondentCompany}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Submitted {new Date(selectedResponse.submittedAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Questionnaire Item Responses */}
              <div className="py-3 border-b border-slate-100 space-y-3">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Full Questionnaire Answers:
                </p>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {selectedResponse.answers.map((ans, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
                        Question #{idx + 1}
                      </p>
                      <div className="font-medium text-slate-900 mt-1">
                        {Array.isArray(ans.value) ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ans.value.map((v, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px]">
                                {v}
                              </span>
                            ))}
                          </div>
                        ) : typeof ans.value === 'number' ? (
                          <span className="text-sm font-bold text-indigo-600 tnum">
                            {ans.value} / 10
                          </span>
                        ) : (
                          <span className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {String(ans.value)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes & Triage */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Internal Operational Notes</label>
                  {selectedResponse.reviewed && (
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Triage Complete
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                  placeholder="Add triage notes, follow-up actions, or customer success assignee..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-800"
                />
                <button
                  onClick={handleSaveNotes}
                  className="w-full py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs"
                >
                  Save Internal Note
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold">Select a response to view deep attributes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
