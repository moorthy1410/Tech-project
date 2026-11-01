import React, { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Layers,
  Inbox,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  PlayCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    surveys,
    responses,
    openTakerModal,
    setEditingSurvey,
    resetAllData
  } = useSurvey();

  const [collapsed, setCollapsed] = useState(false);

  const publishedSurveys = surveys.filter(s => s.status === 'published');
  const unreadResponses = responses.filter(r => !r.reviewed).length;

  interface NavItem {
    id: 'dashboard' | 'surveys' | 'studio' | 'inbox' | 'analytics' | 'team';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number | null;
    badgeColor?: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'surveys',
      label: 'Surveys Directory',
      icon: FileSpreadsheet,
      badge: surveys.length
    },
    {
      id: 'studio',
      label: 'Survey Studio',
      icon: Layers,
      badge: 'Editor'
    },
    {
      id: 'inbox',
      label: 'Feedback Inbox',
      icon: Inbox,
      badge: unreadResponses > 0 ? `${unreadResponses} new` : null,
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: 'analytics',
      label: 'NPS & Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'team',
      label: 'Team & Roles',
      icon: Users,
      badge: null
    }
  ];

  const handleCreateNew = () => {
    const newSurvey = {
      id: `srv-${Date.now().toString(36)}`,
      title: 'New Customer Feedback Survey',
      description: 'Collect actionable user sentiment and satisfaction insights.',
      category: 'Customer Experience',
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Sarah Chen',
      tags: ['New', 'Draft'],
      responseTarget: 100,
      allowAnonymous: false,
      questions: [
        {
          id: `q-${Date.now().toString(36)}-1`,
          type: 'rating_stars' as const,
          title: 'How satisfied are you with your overall experience?',
          description: '1 to 5 stars',
          required: true,
          scale: 5
        },
        {
          id: `q-${Date.now().toString(36)}-2`,
          type: 'text' as const,
          title: 'What could we improve to serve you better?',
          required: false
        }
      ]
    };
    setEditingSurvey(newSurvey);
    setActiveTab('studio');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 bg-white border-r border-[#E2E8F0] flex flex-col justify-between transition-all duration-200 select-none ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Branding Section */}
      <div className="flex flex-col">
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-[#0F172A] tracking-tight truncate leading-none">
                  Nexus
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider mt-1">
                  Feedback CX
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Action Button: Create Survey */}
        <div className="p-3">
          <button
            onClick={handleCreateNew}
            className={`w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] text-white rounded-lg font-medium text-xs py-2 px-3 shadow-sm transition-all duration-150 ${
              collapsed ? 'px-0' : ''
            }`}
            title="Create new survey"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            {!collapsed && <span>New Survey</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 space-y-1 mt-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#4F46E5]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          item.badgeColor || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[#F1F5F9] space-y-2">
        {/* Quick Test Survey Responder Mode */}
        {publishedSurveys.length > 0 && (
          <button
            onClick={() => openTakerModal(publishedSurveys[0])}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-[#047857] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title="Experience Live Survey Responder"
          >
            <PlayCircle className="w-4 h-4 shrink-0 text-[#059669]" />
            {!collapsed && (
              <div className="text-left truncate">
                <p className="font-semibold text-[11px] leading-tight">Live Test Taker</p>
                <p className="text-[10px] text-emerald-700 truncate">Test end-user flow</p>
              </div>
            )}
          </button>
        )}

        {/* Reset Local Data option */}
        <button
          onClick={() => {
            if (window.confirm('Reset local storage to fresh seed demo data?')) {
              resetAllData();
            }
          }}
          className={`w-full flex items-center gap-2 px-2 py-1.5 text-[11px] text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Reset LocalStorage demo data"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span>Reset Local Demo Data</span>}
        </button>

        {/* Live System Indicator */}
        {!collapsed && (
          <div className="pt-2 px-1 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-medium text-slate-500">Live Ready</span>
            </span>
            <span className="text-[10px] text-slate-400">LocalStore sync</span>
          </div>
        )}
      </div>
    </aside>
  );
};
