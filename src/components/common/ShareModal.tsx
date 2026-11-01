import React, { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import {
  X,
  Copy,
  CheckCircle2,
  ExternalLink,
  Code2,
  QrCode,
  Share2,
  Play
} from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { sharingSurvey, closeShareModal, openTakerModal } = useSurvey();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeShareTab, setActiveShareTab] = useState<'link' | 'embed' | 'qr'>('link');

  if (!sharingSurvey) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://nexus-cx.io';
  const surveyUrl = `${currentHost}/#survey=${sharingSurvey.id}`;
  const embedCode = `<iframe src="${surveyUrl}" width="100%" height="600" frameborder="0" style="border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-slate-900">Share & Distribute Survey</span>
          </div>
          <button
            onClick={closeShareModal}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-4 space-y-4">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setActiveShareTab('link')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                activeShareTab === 'link' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Direct Link
            </button>
            <button
              onClick={() => setActiveShareTab('embed')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                activeShareTab === 'embed' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Web Embed
            </button>
            <button
              onClick={() => setActiveShareTab('qr')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                activeShareTab === 'qr' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              QR Code
            </button>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800">{sharingSurvey.title}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Target Quota: {sharingSurvey.responseTarget || 100} • Status: {sharingSurvey.status}
            </p>
          </div>

          {activeShareTab === 'link' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Live Survey URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={surveyUrl}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-mono select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    closeShareModal();
                    openTakerModal(sharingSurvey);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-emerald-600" />
                  <span>Launch Live Responder Modal Now</span>
                </button>
              </div>
            </div>
          )}

          {activeShareTab === 'embed' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">HTML IFrame Embed Code</label>
              <textarea
                readOnly
                rows={3}
                value={embedCode}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 font-mono select-all"
              />
              <button
                onClick={handleCopyEmbed}
                className="w-full py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
              >
                {copiedEmbed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Embed Code Copied</span>
                  </>
                ) : (
                  <>
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Copy HTML Embed Code</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeShareTab === 'qr' && (
            <div className="py-4 text-center space-y-3">
              <div className="w-36 h-36 mx-auto bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center">
                <QrCode className="w-24 h-24 text-slate-800" />
                <span className="text-[10px] text-slate-400 mt-1 font-mono">Scan to Take</span>
              </div>
              <p className="text-xs text-slate-500">
                Print or project this QR code during conferences, in-store checkout, or user research sessions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
