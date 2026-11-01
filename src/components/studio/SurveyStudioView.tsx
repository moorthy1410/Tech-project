import React, { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { Survey, SurveyQuestion, QuestionType } from '../../types';
import {
  Save,
  Play,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Star,
  CheckSquare,
  CircleDot,
  AlignLeft,
  ThumbsUp,
  Sliders,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  ArrowLeft,
  Settings,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const SurveyStudioView: React.FC = () => {
  const {
    editingSurvey,
    setEditingSurvey,
    saveSurvey,
    setActiveTab,
    openTakerModal,
    addQuestionToEditingSurvey,
    updateQuestionInEditingSurvey,
    removeQuestionFromEditingSurvey,
    reorderQuestionsInEditingSurvey,
    surveys
  } = useSurvey();

  // If no survey is selected for editing, fallback to first survey or empty
  const activeSurvey = editingSurvey || surveys[0];

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTabSub, setActiveTabSub] = useState<'questions' | 'settings'>('questions');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    activeSurvey?.questions[0]?.id || null
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!activeSurvey) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-800">No survey loaded in Studio</p>
        <button
          onClick={() => setActiveTab('surveys')}
          className="mt-4 px-3 py-1.5 text-xs font-semibold text-white bg-[#4F46E5] rounded-lg"
        >
          Select a Survey
        </button>
      </div>
    );
  }

  const handleManualSave = () => {
    saveSurvey(activeSurvey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const questionTypes: { type: QuestionType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: 'nps', label: 'Net Promoter Score (0-10)', icon: Sliders },
    { type: 'rating_stars', label: 'Star Rating (1-5)', icon: Star },
    { type: 'multiple_choice', label: 'Single Choice (Radio)', icon: CircleDot },
    { type: 'checkboxes', label: 'Multi-select Checkbox', icon: CheckSquare },
    { type: 'likert', label: 'Likert Agreement Scale', icon: Sliders },
    { type: 'text', label: 'Open Feedback Textarea', icon: AlignLeft },
    { type: 'thumbs', label: 'Thumbs Up / Down', icon: ThumbsUp }
  ];

  return (
    <div className="space-y-4">
      {/* Studio Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('surveys')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Back to Surveys Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#0F172A] tracking-tight truncate max-w-md">
                {activeSurvey.title}
              </h1>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                  activeSurvey.status === 'published'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {activeSurvey.status === 'published' ? 'Live' : activeSurvey.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Studio Composer • {activeSurvey.questions.length} questions • Auto-saving to LocalStorage
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {/* Sub tabs: Questions vs Settings */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setActiveTabSub('questions')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTabSub === 'questions' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Composer
            </button>
            <button
              onClick={() => setActiveTabSub('settings')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTabSub === 'settings' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Test Live Button */}
          <button
            onClick={() => openTakerModal(activeSurvey)}
            className="inline-flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            title="Open interactive test mode"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test Responder</span>
          </button>

          {/* Save Status / Button */}
          <button
            onClick={handleManualSave}
            className="inline-flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Survey</span>
              </>
            )}
          </button>
        </div>
      </div>

      {activeTabSub === 'settings' ? (
        /* Survey Settings View */
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs max-w-2xl space-y-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Campaign Configuration & Quotas</h2>
            <p className="text-xs text-slate-500">Configure survey metadata, publication state, and respondent rules.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Survey Title</label>
              <input
                type="text"
                value={activeSurvey.title}
                onChange={e => {
                  const updated = { ...activeSurvey, title: e.target.value };
                  setEditingSurvey(updated);
                  saveSurvey(updated);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={activeSurvey.description}
                onChange={e => {
                  const updated = { ...activeSurvey, description: e.target.value };
                  setEditingSurvey(updated);
                  saveSurvey(updated);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={activeSurvey.category}
                  onChange={e => {
                    const updated = { ...activeSurvey, category: e.target.value };
                    setEditingSurvey(updated);
                    saveSurvey(updated);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Publication Status</label>
                <select
                  value={activeSurvey.status}
                  onChange={e => {
                    const updated = { ...activeSurvey, status: e.target.value as Survey['status'] };
                    setEditingSurvey(updated);
                    saveSurvey(updated);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500 bg-white"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Live & Published</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed / Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Response Target Goal</label>
                <input
                  type="number"
                  value={activeSurvey.responseTarget || 100}
                  onChange={e => {
                    const updated = { ...activeSurvey, responseTarget: parseInt(e.target.value) || 100 };
                    setEditingSurvey(updated);
                    saveSurvey(updated);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col justify-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeSurvey.allowAnonymous}
                    onChange={e => {
                      const updated = { ...activeSurvey, allowAnonymous: e.target.checked };
                      setEditingSurvey(updated);
                      saveSurvey(updated);
                    }}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="font-semibold text-slate-700">Allow Anonymous Submissions</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-1">If enabled, respondents can skip email/company</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Questions Composer + Live Device Simulator */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Questions List & Builder (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Add Question Toolbar */}
            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Add Questionnaire Block
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {questionTypes.map(qt => {
                  const Icon = qt.icon;
                  return (
                    <button
                      key={qt.type}
                      onClick={() => {
                        addQuestionToEditingSurvey({
                          type: qt.type,
                          title: `New ${qt.label.split('(')[0].trim()}`,
                          required: true,
                          scale: qt.type === 'nps' ? 10 : 5
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 text-slate-700 text-xs font-medium transition-all"
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{qt.label.split('(')[0].trim()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions Sequence Cards */}
            <div className="space-y-3">
              {activeSurvey.questions.map((q, idx) => {
                const isSelected = activeQuestionId === q.id;

                return (
                  <div
                    key={q.id}
                    onClick={() => setActiveQuestionId(q.id)}
                    className={`bg-white rounded-xl border transition-all p-4 ${
                      isSelected
                        ? 'border-[#4F46E5] ring-2 ring-indigo-100 shadow-sm'
                        : 'border-[#E2E8F0] hover:border-slate-300'
                    }`}
                  >
                    {/* Top Row: Reorder & Type & Controls */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center tnum">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                          {q.type.replace('_', ' ')}
                        </span>
                        {q.required && (
                          <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={e => {
                            e.stopPropagation();
                            reorderQuestionsInEditingSurvey(idx, idx - 1);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === activeSurvey.questions.length - 1}
                          onClick={e => {
                            e.stopPropagation();
                            reorderQuestionsInEditingSurvey(idx, idx + 1);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            removeQuestionFromEditingSurvey(q.id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Question Title Editing */}
                    <div className="space-y-2 mt-2">
                      <input
                        type="text"
                        value={q.title}
                        onChange={e => updateQuestionInEditingSurvey(q.id, { title: e.target.value })}
                        placeholder="Enter question title..."
                        className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                      />

                      <input
                        type="text"
                        value={q.description || ''}
                        onChange={e => updateQuestionInEditingSurvey(q.id, { description: e.target.value })}
                        placeholder="Helper description / instructions (optional)..."
                        className="w-full text-[11px] text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-indigo-500 bg-slate-50/50"
                      />
                    </div>

                    {/* Options Editor for Multiple Choice & Checkboxes */}
                    {(q.type === 'multiple_choice' || q.type === 'checkboxes') && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        <p className="text-[11px] font-semibold text-slate-600">Selectable Choices:</p>
                        <div className="space-y-1.5">
                          {(q.options || []).map((opt, optIdx) => (
                            <div key={opt.id} className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-mono w-4">{optIdx + 1}.</span>
                              <input
                                type="text"
                                value={opt.label}
                                onChange={e => {
                                  const updatedOpts = [...(q.options || [])];
                                  updatedOpts[optIdx] = { ...opt, label: e.target.value };
                                  updateQuestionInEditingSurvey(q.id, { options: updatedOpts });
                                }}
                                className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-hidden focus:border-indigo-500"
                              />
                              <button
                                onClick={() => {
                                  const updatedOpts = (q.options || []).filter((_, i) => i !== optIdx);
                                  updateQuestionInEditingSurvey(q.id, { options: updatedOpts });
                                }}
                                className="text-slate-400 hover:text-rose-500 p-1"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            const newOpt = {
                              id: `opt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
                              label: `Option ${(q.options?.length || 0) + 1}`
                            };
                            updateQuestionInEditingSurvey(q.id, {
                              options: [...(q.options || []), newOpt]
                            });
                          }}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 mt-1"
                        >
                          <Plus className="w-3 h-3" /> Add Choice
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Device Simulator Frame (5 cols) */}
          <div className="lg:col-span-5 sticky top-20 bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">Live Device Simulator</span>
              </div>

              {/* Device switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}
                  title="Desktop View (1200px)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1 rounded ${previewDevice === 'tablet' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}
                  title="Mobile View (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulated Device Canvas */}
            <div className="flex justify-center bg-slate-100 p-3 rounded-lg overflow-hidden min-h-[460px] max-h-[640px] overflow-y-auto">
              <div
                className={`bg-white rounded-xl border border-slate-300 shadow-md p-4 transition-all duration-300 flex flex-col justify-between ${
                  previewDevice === 'mobile'
                    ? 'w-[320px] text-xs'
                    : previewDevice === 'tablet'
                    ? 'w-[400px] text-xs'
                    : 'w-full text-xs'
                }`}
              >
                <div>
                  {/* Mock survey header */}
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                      {activeSurvey.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">{activeSurvey.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{activeSurvey.description}</p>
                  </div>

                  {/* Render questions preview */}
                  <div className="space-y-4">
                    {activeSurvey.questions.map((q, idx) => (
                      <div key={q.id} className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
                        <p className="text-xs font-semibold text-slate-800">
                          {idx + 1}. {q.title} {q.required && <span className="text-rose-500">*</span>}
                        </p>
                        {q.description && <p className="text-[11px] text-slate-400 mt-0.5">{q.description}</p>}

                        {/* Interactive UI Mock */}
                        <div className="mt-2.5">
                          {q.type === 'nps' && (
                            <div className="flex items-center gap-1 overflow-x-auto py-1">
                              {Array.from({ length: 11 }).map((_, i) => (
                                <button
                                  key={i}
                                  className="w-6 h-6 rounded border border-slate-200 bg-white text-[10px] font-semibold text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 flex items-center justify-center shrink-0"
                                >
                                  {i}
                                </button>
                              ))}
                            </div>
                          )}

                          {q.type === 'rating_stars' && (
                            <div className="flex items-center gap-1.5 text-amber-400">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className="w-4 h-4 fill-amber-400" />
                              ))}
                            </div>
                          )}

                          {(q.type === 'multiple_choice' || q.type === 'likert') && (
                            <div className="space-y-1 mt-1 text-[11px]">
                              {(q.options || [
                                { id: '1', label: 'Strongly Disagree' },
                                { id: '2', label: 'Neutral' },
                                { id: '3', label: 'Strongly Agree' }
                              ]).map(opt => (
                                <label key={opt.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 cursor-pointer">
                                  <input type="radio" name={`mock-${q.id}`} className="text-indigo-600" />
                                  <span className="text-slate-700">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {q.type === 'checkboxes' && (
                            <div className="space-y-1 mt-1 text-[11px]">
                              {(q.options || [{ id: '1', label: 'Option A' }, { id: '2', label: 'Option B' }]).map(opt => (
                                <label key={opt.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 cursor-pointer">
                                  <input type="checkbox" className="text-indigo-600 rounded" />
                                  <span className="text-slate-700">{opt.label}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {q.type === 'text' && (
                            <textarea
                              rows={2}
                              disabled
                              placeholder="Respondent feedback will appear here..."
                              className="w-full text-[11px] p-2 bg-white border border-slate-200 rounded text-slate-400"
                            />
                          )}

                          {q.type === 'thumbs' && (
                            <div className="flex items-center gap-3">
                              <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700">
                                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" /> Yes
                              </button>
                              <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700">
                                <ThumbsUp className="w-3.5 h-3.5 text-rose-600 rotate-180" /> No
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device bottom CTA */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Step 1 of 1</span>
                  <button
                    onClick={() => openTakerModal(activeSurvey)}
                    className="px-3 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded text-xs shadow-xs"
                  >
                    Take Full Interactive Survey
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
