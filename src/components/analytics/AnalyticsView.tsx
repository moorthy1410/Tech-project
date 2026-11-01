import React, { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import {
  TrendingUp,
  Download,
  Share2,
  Copy,
  Star,
  CheckCircle2,
  Sparkles,
  BarChart3,
  PieChart,
  Calendar,
  FileSpreadsheet,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { surveys, responses, metrics } = useSurvey();
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('all');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const activeResponses = selectedSurveyId === 'all'
    ? responses
    : responses.filter(r => r.surveyId === selectedSurveyId);

  // NPS breakdown for selected scope
  const npsValues = activeResponses
    .filter(r => typeof r.npsScore === 'number')
    .map(r => r.npsScore as number);

  const totalNpsCount = Math.max(1, npsValues.length);
  const promoters = npsValues.filter(v => v >= 9).length;
  const passives = npsValues.filter(v => v >= 7 && v <= 8).length;
  const detractors = npsValues.filter(v => v <= 6).length;

  const currentNpsScore = npsValues.length > 0
    ? Math.round(((promoters - detractors) / totalNpsCount) * 100)
    : 0;

  const promoterPct = Math.round((promoters / totalNpsCount) * 100);
  const passivePct = Math.round((passives / totalNpsCount) * 100);
  const detractorPct = Math.round((detractors / totalNpsCount) * 100);

  // CSAT 1-5 breakdown
  const csatValues = activeResponses
    .filter(r => typeof r.csatRating === 'number')
    .map(r => r.csatRating as number);
  const totalCsat = Math.max(1, csatValues.length);
  const csatDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = csatValues.filter(v => v === stars).length;
    return {
      stars,
      count,
      pct: Math.round((count / totalCsat) * 100)
    };
  });

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Survey', 'Respondent Name', 'Email', 'Company', 'NPS Score', 'CSAT Rating', 'Sentiment', 'Submitted At'];
    const rows = activeResponses.map(r => [
      r.id,
      `"${r.surveyTitle.replace(/"/g, '""')}"`,
      `"${r.respondentName.replace(/"/g, '""')}"`,
      r.respondentEmail,
      `"${(r.respondentCompany || '').replace(/"/g, '""')}"`,
      r.npsScore ?? '',
      r.csatRating ?? '',
      r.sentiment,
      r.submittedAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexus_feedback_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportToJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeResponses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nexus_feedback_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copySummary = () => {
    const text = `Nexus CX Analytics Report:
Scope: ${selectedSurveyId === 'all' ? 'All Surveys' : surveys.find(s => s.id === selectedSurveyId)?.title}
Total Responses: ${activeResponses.length}
NPS Score: ${currentNpsScore > 0 ? `+${currentNpsScore}` : currentNpsScore} (${promoterPct}% Promoters, ${detractorPct}% Detractors)
Average CSAT: ${metrics.avgCsat} / 5.0
Sentiment: ${metrics.sentimentBreakdown.positive} Pos, ${metrics.sentimentBreakdown.neutral} Neu, ${metrics.sentimentBreakdown.negative} Neg
Generated on ${new Date().toLocaleDateString()}`;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
            NPS & Quantitative Sentiment Telemetry
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Statistical modeling of customer satisfaction, promoter index ratios, and sentiment shifts over time.
          </p>
        </div>

        {/* Export / Filter Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedSurveyId}
            onChange={e => setSelectedSurveyId(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:border-indigo-500 shadow-2xs"
          >
            <option value="all">All Active Surveys ({surveys.length})</option>
            {surveys.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>

          <button
            onClick={copySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            {copiedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main NPS Hero Gauge Card */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#F1F5F9]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Enterprise Net Promoter Index
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Industry Benchmark: Top 5%
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-5xl font-extrabold text-[#0F172A] tnum tracking-tight">
                {currentNpsScore > 0 ? `+${currentNpsScore}` : currentNpsScore}
              </span>
              <div className="text-xs text-slate-500 font-medium">
                <span className="text-emerald-600 font-bold">Excellent</span> rating on (-100 to +100) range
              </div>
            </div>
          </div>

          {/* Quick Metrics right */}
          <div className="grid grid-cols-3 gap-4 lg:w-96">
            <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-center">
              <p className="text-[11px] font-semibold text-emerald-800">Promoters (9-10)</p>
              <p className="text-2xl font-bold text-emerald-700 mt-0.5 tnum">{promoterPct}%</p>
              <p className="text-[10px] text-emerald-600 mt-0.5 tnum">{promoters} responses</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <p className="text-[11px] font-semibold text-slate-700">Passives (7-8)</p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5 tnum">{passivePct}%</p>
              <p className="text-[10px] text-slate-500 mt-0.5 tnum">{passives} responses</p>
            </div>
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-center">
              <p className="text-[11px] font-semibold text-rose-800">Detractors (0-6)</p>
              <p className="text-2xl font-bold text-rose-700 mt-0.5 tnum">{detractorPct}%</p>
              <p className="text-[10px] text-rose-600 mt-0.5 tnum">{detractors} responses</p>
            </div>
          </div>
        </div>

        {/* Visual Stack bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Likelihood Distribution</span>
            <span className="tnum">Total Verified Responses: {activeResponses.length}</span>
          </div>

          <div className="h-5 w-full rounded-full overflow-hidden bg-slate-100 flex p-0.5">
            <div
              style={{ width: `${promoterPct}%` }}
              className="bg-[#10B981] h-full rounded-l-full transition-all duration-700"
              title={`Promoters: ${promoterPct}%`}
            />
            <div
              style={{ width: `${passivePct}%` }}
              className="bg-[#94A3B8] h-full transition-all duration-700"
              title={`Passives: ${passivePct}%`}
            />
            <div
              style={{ width: `${detractorPct}%` }}
              className="bg-[#EF4444] h-full rounded-r-full transition-all duration-700"
              title={`Detractors: ${detractorPct}%`}
            />
          </div>

          {/* Scale Markers 0 to 10 */}
          <div className="grid grid-cols-11 text-center text-[10px] text-slate-400 font-mono pt-1">
            {Array.from({ length: 11 }).map((_, i) => (
              <span key={i} className={i >= 9 ? 'text-emerald-700 font-bold' : i <= 6 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: CSAT Star Distribution & Question breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSAT Star Distribution */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">
                CSAT Rating Breakdown
              </h3>
              <p className="text-xs text-[#475569]">Satisfaction ratings aggregated across all star items.</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#0F172A] tnum">{metrics.avgCsat}</span>
              <span className="text-xs text-slate-400"> / 5.0</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {csatDistribution.map(item => (
              <div key={item.stars} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-16 text-slate-700 font-medium">
                  <span>{item.stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#4F46E5] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>

                <span className="w-12 text-right font-bold text-slate-800 tnum">{item.pct}%</span>
                <span className="w-16 text-right text-slate-400 text-[11px] tnum">({item.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Qualitative Sentiment Diagnostics */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">
                Customer Sentiment Sentiment Telemetry
              </h3>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Real-time
              </span>
            </div>
            <p className="text-xs text-[#475569] mb-4">
              Categorization based on respondent sentiment and likelihood to promote.
            </p>

            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-900">Positive Promoters Sentiment</span>
                  <span className="font-extrabold text-emerald-700 tnum">{metrics.sentimentBreakdown.positive} responses</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">
                  High appreciation for platform speed, intuitive UI, and fast customer support turnaround.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Neutral / Ambivalent Sentiment</span>
                  <span className="font-extrabold text-slate-700 tnum">{metrics.sentimentBreakdown.neutral} responses</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Users satisfied with baseline features, requesting custom CRM integrations and Slack alerts.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-rose-900">Detractors / Escalations</span>
                  <span className="font-extrabold text-rose-700 tnum">{metrics.sentimentBreakdown.negative} responses</span>
                </div>
                <p className="text-[11px] text-rose-700 mt-1">
                  Export timeouts on ultra-large datasets; support follow-up assigned to customer success.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Need granular raw data dump?</span>
            <button
              onClick={exportToJSON}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Export JSON payload &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
