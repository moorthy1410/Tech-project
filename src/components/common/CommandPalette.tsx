import React, { useState, useEffect } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import {
  Search,
  FileSpreadsheet,
  Layers,
  Inbox,
  BarChart3,
  Users,
  Play,
  Plus,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { surveys, setActiveTab, setEditingSurvey, openTakerModal } = useSurvey();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by caller or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSurveys = surveys.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command, survey name, or jump to a section..."
            className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
          />
          <kbd className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
          {/* Quick Section Jumps */}
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </div>

          <button
            onClick={() => {
              setActiveTab('dashboard');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
          >
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <span>Executive Overview & Metrics</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('surveys');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            <span>Surveys Directory</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('inbox');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
          >
            <Inbox className="w-4 h-4 text-slate-400" />
            <span>Feedback Inbox & Sentiment Stream</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('analytics');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
          >
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <span>NPS & Quantitative Analytics</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('team');
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>Team & Permissions Governance</span>
          </button>

          {/* Surveys matching search */}
          {filteredSurveys.length > 0 && (
            <>
              <div className="px-2 pt-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Surveys
              </div>
              {filteredSurveys.map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        s.status === 'published' ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                    <span className="font-medium truncate">{s.title}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onClose();
                        openTakerModal(s);
                      }}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    >
                      Take Live
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        setEditingSurvey(s);
                        setActiveTab('studio');
                      }}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
