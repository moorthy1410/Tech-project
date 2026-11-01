import React, { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { SurveyQuestion } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  Star,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Send,
  ThumbsUp,
  User,
  Mail,
  Building,
  RotateCcw
} from 'lucide-react';

export const SurveyTakerModal: React.FC = () => {
  const { takerSurvey, closeTakerModal, submitResponse } = useSurvey();

  const [currentStep, setCurrentStep] = useState(0); // 0 = Questions, length = Respondent details, length + 1 = Completed
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [respondentName, setRespondentName] = useState('Alex Morgan');
  const [respondentEmail, setRespondentEmail] = useState('alex.morgan@acme.com');
  const [respondentCompany, setRespondentCompany] = useState('Acme Technologies');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!takerSurvey) return null;

  const questions = takerSurvey.questions;
  const currentQuestion: SurveyQuestion | undefined = questions[currentStep];
  const isQuestionStep = currentStep < questions.length;
  const isRespondentStep = currentStep === questions.length;

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleSelectAnswer = (qId: string, val: string | number | string[]) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleCheckboxToggle = (qId: string, optionLabel: string) => {
    const current = (answers[qId] as string[]) || [];
    if (current.includes(optionLabel)) {
      setAnswers(prev => ({ ...prev, [qId]: current.filter(item => item !== optionLabel) }));
    } else {
      setAnswers(prev => ({ ...prev, [qId]: [...current, optionLabel] }));
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extract NPS score if any
    const npsQ = questions.find(q => q.type === 'nps');
    const npsScore = npsQ && typeof answers[npsQ.id] === 'number' ? (answers[npsQ.id] as number) : undefined;

    // Extract CSAT star rating if any
    const csatQ = questions.find(q => q.type === 'rating_stars');
    const csatRating = csatQ && typeof answers[csatQ.id] === 'number' ? (answers[csatQ.id] as number) : undefined;

    const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
      questionId: qId,
      value: val
    }));

    submitResponse({
      surveyId: takerSurvey.id,
      surveyTitle: takerSurvey.title,
      respondentName: isAnonymous ? 'Anonymous Responder' : (respondentName || 'Verified Respondent'),
      respondentEmail: isAnonymous ? 'anonymous@nexus.io' : (respondentEmail || 'verified@user.com'),
      respondentCompany: isAnonymous ? undefined : respondentCompany,
      answers: formattedAnswers,
      npsScore,
      csatRating,
      reviewed: false
    });

    setIsSubmitted(true);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const progressPercent = Math.round(((currentStep + 1) / (questions.length + 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header with progress bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">Live Respondent Mode</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium truncate max-w-xs">{takerSurvey.title}</span>
          </div>

          <button
            onClick={closeTakerModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Progress bar */}
        {!isSubmitted && (
          <div className="w-full bg-slate-100 h-1">
            <div
              className="bg-[#4F46E5] h-1 transition-all duration-300"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSubmitted ? (
            /* Submission Success State */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Feedback Submitted Successfully!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Your response has been synchronized with LocalStorage and is now reflected in the Executive Overview, NPS Breakdown, and Feedback Inbox!
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(0);
                    setAnswers({});
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Submit Another Response</span>
                </button>

                <button
                  onClick={closeTakerModal}
                  className="px-5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Done & Return to Workspace
                </button>
              </div>
            </div>
          ) : isRespondentStep ? (
            /* Respondent Identification Step */
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Final Step
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Respondent Verification
                </h3>
                <p className="text-xs text-slate-500">
                  Please confirm your contact details to attach to your feedback.
                </p>
              </div>

              {takerSurvey.allowAnonymous && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span>Submit anonymously (do not record name or email)</span>
                  </label>
                </div>
              )}

              {!isAnonymous && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={respondentName}
                        onChange={e => setRespondentName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={respondentEmail}
                        onChange={e => setRespondentEmail(e.target.value)}
                        placeholder="alex.morgan@company.com"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Organization / Company</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={respondentCompany}
                        onChange={e => setRespondentCompany(e.target.value)}
                        placeholder="Company name"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : currentQuestion ? (
            /* Active Question Step */
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  {currentQuestion.required && (
                    <span className="text-rose-500 font-semibold">* Required</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {currentQuestion.title}
                </h3>
                {currentQuestion.description && (
                  <p className="text-xs text-slate-500 mt-1">{currentQuestion.description}</p>
                )}
              </div>

              {/* Interactive question inputs */}
              <div className="pt-2">
                {/* NPS 0 to 10 Scale */}
                {currentQuestion.type === 'nps' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-11 gap-1">
                      {Array.from({ length: 11 }).map((_, i) => {
                        const isVal = currentAnswer === i;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSelectAnswer(currentQuestion.id, i)}
                            className={`h-11 rounded-lg border font-bold text-xs flex flex-col items-center justify-center transition-all ${
                              isVal
                                ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-md scale-105'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50'
                            }`}
                          >
                            <span>{i}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                      <span>0 - Not at all likely</span>
                      <span>10 - Extremely likely</span>
                    </div>
                  </div>
                )}

                {/* Rating Stars 1 to 5 */}
                {currentQuestion.type === 'rating_stars' && (
                  <div className="flex items-center justify-center gap-3 py-4">
                    {[1, 2, 3, 4, 5].map(starNum => {
                      const isSelected = typeof currentAnswer === 'number' && currentAnswer >= starNum;
                      return (
                        <button
                          key={starNum}
                          type="button"
                          onClick={() => handleSelectAnswer(currentQuestion.id, starNum)}
                          className="p-2 rounded-xl hover:bg-amber-50 transition-all hover:scale-110"
                        >
                          <Star
                            className={`w-9 h-9 transition-colors ${
                              isSelected
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Single Choice Radio */}
                {currentQuestion.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {(currentQuestion.options || []).map(opt => {
                      const isSelected = currentAnswer === opt.label;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectAnswer(currentQuestion.id, opt.label)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-[#4F46E5] bg-indigo-50/60 text-[#4F46E5] ring-1 ring-indigo-200'
                              : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Multi-select Checkboxes */}
                {currentQuestion.type === 'checkboxes' && (
                  <div className="space-y-2">
                    {(currentQuestion.options || []).map(opt => {
                      const checkedList = (currentAnswer as string[]) || [];
                      const isChecked = checkedList.includes(opt.label);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleCheckboxToggle(currentQuestion.id, opt.label)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${
                            isChecked
                              ? 'border-[#4F46E5] bg-indigo-50/60 text-[#4F46E5] ring-1 ring-indigo-200'
                              : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isChecked ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-300'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Likert Scale */}
                {currentQuestion.type === 'likert' && (
                  <div className="space-y-2">
                    {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map(scaleVal => {
                      const isSelected = currentAnswer === scaleVal;
                      return (
                        <button
                          key={scaleVal}
                          type="button"
                          onClick={() => handleSelectAnswer(currentQuestion.id, scaleVal)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-[#4F46E5] bg-indigo-50/70 text-indigo-700 font-semibold'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{scaleVal}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Open text area */}
                {currentQuestion.type === 'text' && (
                  <textarea
                    rows={4}
                    value={(currentAnswer as string) || ''}
                    onChange={e => handleSelectAnswer(currentQuestion.id, e.target.value)}
                    placeholder="Type your detailed thoughts, suggestions, or comments here..."
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-500 text-slate-900"
                  />
                )}

                {/* Thumbs up / down */}
                {currentQuestion.type === 'thumbs' && (
                  <div className="flex items-center justify-center gap-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleSelectAnswer(currentQuestion.id, 'up')}
                      className={`flex flex-col items-center gap-2 p-5 rounded-xl border transition-all ${
                        currentAnswer === 'up'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
                      }`}
                    >
                      <ThumbsUp className="w-8 h-8 text-emerald-600" />
                      <span className="text-xs font-bold">Yes / Thumbs Up</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectAnswer(currentQuestion.id, 'down')}
                      className={`flex flex-col items-center gap-2 p-5 rounded-xl border transition-all ${
                        currentAnswer === 'down'
                          ? 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-rose-300'
                      }`}
                    >
                      <ThumbsUp className="w-8 h-8 text-rose-600 rotate-180" />
                      <span className="text-xs font-bold">No / Needs Improvement</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Bottom Navigation */}
        {!isSubmitted && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={handlePrev}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {isRespondentStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
