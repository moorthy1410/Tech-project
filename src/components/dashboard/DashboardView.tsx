import React from 'react';
import { useSurvey } from '../../context/SurveyContext';
import {
  TrendingUp,
  Smile,
  Users,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
  BarChart,
  MessageSquare,
  Play,
  Share2,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    surveys,
    responses,
    metrics,
    setActiveTab,
    setEditingSurvey,
    openTakerModal,
    openShareModal
  } = useSurvey();

  const publishedSurveys = surveys.filter(s => s.status === 'published');
  const recentResponses = responses.slice(0, 5);

  // NPS breakdown
  const npsResponses = responses.filter(r => typeof r.npsScore === 'number');
  const promoters = npsResponses.filter(r => (r.npsScore ?? 0) >= 9).length;
  const passives = npsResponses.filter(r => (r.npsScore ?? 0) >= 7 && (r.npsScore ?? 0) <= 8).length;
  const detractors = npsResponses.filter(r => (r.npsScore ?? 0) <= 6).length;
  const totalNps = Math.max(1, npsResponses.length);
  const promoterPct = Math.round((promoters / totalNps) * 100);
  const passivePct = Math.round((passives / totalNps) * 100);
  const detractorPct = Math.round((detractors / totalNps) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              Customer Experience Command Center
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Live Feedback Stream
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-1">
            Continuous sentiment orchestration, real-time NPS telemetry, and respondent verification across all active campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {publishedSurveys.length > 0 && (
            <button
              onClick={() => openTakerModal(publishedSurveys[0])}
              className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Responder</span>
            </button>
          )}

          <button
            onClick={() => {
              const newS = {
                id: `srv-${Date.now().toString(36)}`,
                title: 'Customer Feedback Survey',
                description: 'Collect key customer insights',
                category: 'Product Feedback',
                status: 'draft' as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'Current User',
                tags: ['General'],
                allowAnonymous: false,
                questions: [
                  {
                    id: `q-${Date.now().toString(36)}-1`,
                    type: 'rating_stars' as const,
                    title: 'How satisfied are you with our service?',
                    required: true,
                    scale: 5
                  }
                ]
              };
              setEditingSurvey(newS);
              setActiveTab('studio');
            }}
            className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Studio Builder</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* NPS Scorecard */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
              Net Promoter Score
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0F172A] tnum tracking-tight">
              {metrics.npsScore > 0 ? `+${metrics.npsScore}` : metrics.npsScore}
            </span>
            <span className="text-xs font-semibold text-[#10B981] flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12 pts
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#475569] border-t border-[#F1F5F9] pt-2.5">
            <span className="text-emerald-700 font-medium">{promoterPct}% Promoters</span>
            <span className="text-slate-400 font-medium">{passivePct}% Passives</span>
            <span className="text-rose-600 font-medium">{detractorPct}% Detractors</span>
          </div>
        </div>

        {/* Average CSAT */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
              Customer Satisfaction
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0F172A] tnum tracking-tight">
              {metrics.avgCsat}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
            <span className="text-xs font-semibold text-[#10B981] flex items-center ml-auto">
              <ArrowUpRight className="w-3.5 h-3.5" /> +0.4
            </span>
          </div>
          <div className="mt-3 text-[11px] text-[#475569] border-t border-[#F1F5F9] pt-2.5 flex items-center justify-between">
            <span>Overall Rating Health</span>
            <span className="font-semibold text-emerald-600">Excellent (94%)</span>
          </div>
        </div>

        {/* Total Responses */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
              Total Responses
            </span>
            <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0F172A] tnum tracking-tight">
              {metrics.totalResponses}
            </span>
            <span className="text-xs font-semibold text-[#10B981] flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +28% MoM
            </span>
          </div>
          <div className="mt-3 text-[11px] text-[#475569] border-t border-[#F1F5F9] pt-2.5 flex items-center justify-between">
            <span>Across Active Surveys</span>
            <span className="font-medium text-slate-600">100% verified</span>
          </div>
        </div>

        {/* Completion Velocity */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
              Completion Velocity
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0F172A] tnum tracking-tight">
              {metrics.avgCompletionRate}%
            </span>
            <span className="text-xs font-semibold text-[#10B981] flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> High
            </span>
          </div>
          <div className="mt-3 text-[11px] text-[#475569] border-t border-[#F1F5F9] pt-2.5 flex items-center justify-between">
            <span>Avg Drop-off Rate</span>
            <span className="font-semibold text-slate-700">6.2% (Low friction)</span>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown & Sentiment Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NPS Detailed Distribution Gauge */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
                Net Promoter Breakdown & Category Distribution
              </h2>
              <p className="text-xs text-[#475569]">
                Continuous categorization of responder likelihood to recommend based on standard 0–10 scale.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1"
            >
              <span>View Deep Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Stack Bar */}
          <div className="space-y-2 mt-4">
            <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100 p-0.5">
              <div
                style={{ width: `${promoterPct}%` }}
                className="bg-[#10B981] h-full rounded-l-full transition-all duration-500"
                title={`Promoters: ${promoterPct}%`}
              />
              <div
                style={{ width: `${passivePct}%` }}
                className="bg-[#94A3B8] h-full transition-all duration-500"
                title={`Passives: ${passivePct}%`}
              />
              <div
                style={{ width: `${detractorPct}%` }}
                className="bg-[#EF4444] h-full rounded-r-full transition-all duration-500"
                title={`Detractors: ${detractorPct}%`}
              />
            </div>

            {/* Legend Cards */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-900">Promoters (9-10)</span>
                  <span className="text-xs font-bold text-emerald-700 tnum">{promoters}</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1 font-medium tnum">{promoterPct}% of total</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Loyal advocates driving organic growth</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">Passives (7-8)</span>
                  <span className="text-xs font-bold text-slate-700 tnum">{passives}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-medium tnum">{passivePct}% of total</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Satisfied but vulnerable to competition</p>
              </div>

              <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-900">Detractors (0-6)</span>
                  <span className="text-xs font-bold text-rose-700 tnum">{detractors}</span>
                </div>
                <p className="text-[11px] text-rose-700 mt-1 font-medium tnum">{detractorPct}% of total</p>
                <p className="text-[10px] text-rose-600 mt-0.5">Urgent triage needed to prevent churn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Health Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
                Sentiment Health
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Text & Rating AI</span>
            </div>
            <p className="text-xs text-[#475569] mb-4">
              Algorithmic sentiment scoring synthesized from open-ended feedback comments.
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Positive Feedback
                  </span>
                  <span className="font-bold text-slate-900 tnum">{metrics.sentimentBreakdown.positive} responses</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${(metrics.sentimentBreakdown.positive / Math.max(1, responses.length)) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Neutral Feedback
                  </span>
                  <span className="font-bold text-slate-900 tnum">{metrics.sentimentBreakdown.neutral} responses</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-slate-400 h-2 rounded-full"
                    style={{
                      width: `${(metrics.sentimentBreakdown.neutral / Math.max(1, responses.length)) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-rose-600">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Negative / Escalation
                  </span>
                  <span className="font-bold text-slate-900 tnum">{metrics.sentimentBreakdown.negative} responses</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-rose-500 h-2 rounded-full"
                    style={{
                      width: `${(metrics.sentimentBreakdown.negative / Math.max(1, responses.length)) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-950">Customer Satisfaction Health: High</span>
            </div>
            <button
              onClick={() => setActiveTab('inbox')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Open Inbox &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Active Surveys Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
              Active Campaigns & Deployment Status
            </h2>
            <p className="text-xs text-[#475569]">
              Live status, target completion rates, and respondent distribution.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('surveys')}
            className="text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1"
          >
            <span>Manage All Surveys</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569]">
              <tr>
                <th className="px-5 py-3 font-semibold">Survey Name</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Questions</th>
                <th className="px-4 py-3 font-semibold">Target / Responses</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {surveys.slice(0, 4).map(survey => {
                const surveyResponses = responses.filter(r => r.surveyId === survey.id);
                const count = surveyResponses.length;
                const target = survey.responseTarget || 100;
                const pct = Math.min(100, Math.round((count / target) * 100));

                return (
                  <tr key={survey.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#0F172A]">{survey.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Created by {survey.createdBy}</span>
                        <span>•</span>
                        <span>{new Date(survey.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      {survey.status === 'published' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                          Live
                        </span>
                      ) : survey.status === 'draft' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          Paused
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[11px]">
                        {survey.category}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 font-medium tnum">
                      {survey.questions.length} items
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 tnum">{count}</span>
                        <span className="text-slate-400 text-[11px]">/ {target}</span>
                        <span className="text-[11px] font-medium text-emerald-600 ml-auto tnum">{pct}%</span>
                      </div>
                      <div className="w-28 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="bg-[#4F46E5] h-1.5 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => openTakerModal(survey)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                        title="Test responder flow"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSurvey(survey);
                          setActiveTab('studio');
                        }}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit in Studio"
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openShareModal(survey)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                        title="Share link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Feedback Stream Cards */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
              Incoming Feedback Stream
            </h2>
            <p className="text-xs text-[#475569]">
              Latest verified responses with respondent sentiments and satisfaction ratings.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('inbox')}
            className="text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1"
          >
            <span>Open Feedback Inbox ({responses.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentResponses.map(resp => {
            const commentAnswer = resp.answers.find(a => typeof a.value === 'string' && a.value.length > 15);
            return (
              <div
                key={resp.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
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

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(resp.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-900">{resp.respondentName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{resp.respondentCompany || resp.respondentEmail}</p>

                  {commentAnswer ? (
                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{commentAnswer.value}"
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 mt-2.5">
                      Completed {resp.answers.length} questionnaire items.
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 truncate">{resp.surveyTitle}</span>
                  {typeof resp.npsScore === 'number' && (
                    <span className="font-bold text-indigo-600 text-xs tnum">
                      NPS {resp.npsScore}/10
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
