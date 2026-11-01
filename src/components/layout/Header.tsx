import React, { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { UserRole } from '../../types';
import { RoleBadge } from '../common/RoleBadge';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Building2,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const { currentRole, setCurrentRole, teamMembers, surveys, openShareModal } = useSurvey();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentUser = teamMembers[0]; // Sarah Chen

  const roles: { role: UserRole; desc: string }[] = [
    { role: 'admin', desc: 'Full access to surveys, questions, team roles, and settings' },
    { role: 'contributor', desc: 'Can edit surveys, build questions, and view responses' },
    { role: 'analyst', desc: 'Read-only access to surveys, insights, and report exports' }
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0] px-6 flex items-center justify-between">
      {/* Left: Organization context & Search */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Nexus Enterprise CX</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Production Workspace</p>
          </div>
        </div>

        {/* Search trigger with keyboard shortcut */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-1.5 transition-all w-64 text-left"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="flex-1 truncate">Search surveys, responses, or tags...</span>
          <kbd className="text-[10px] bg-white text-slate-500 font-mono px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick share button for active survey */}
        {surveys.length > 0 && (
          <button
            onClick={() => openShareModal(surveys[0])}
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share Survey</span>
          </button>
        )}

        {/* Role Switcher simulating real enterprise RBAC */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs transition-colors"
            title="Switch Simulated User Role"
          >
            <span className="text-[11px] text-slate-500 font-medium">Viewing as:</span>
            <RoleBadge role={currentRole} size="sm" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900">Switch Permission Role</p>
                <p className="text-[11px] text-slate-500">Test how Nexus behaves across permission tiers</p>
              </div>
              {roles.map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    setCurrentRole(r.role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                    currentRole === r.role ? 'bg-indigo-50/70 border border-indigo-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5">
                    <RoleBadge role={r.role} size="sm" showIcon={false} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-500 leading-snug">{r.desc}</p>
                  </div>
                  {currentRole === r.role && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-semibold text-slate-900">Activity & Feedback Alerts</span>
                <span className="text-[10px] text-indigo-600 font-medium">3 unread</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100">
                  <p className="font-medium text-indigo-950">New 10/10 NPS Response</p>
                  <p className="text-[11px] text-indigo-700">Jonathan Hayes (Vertex Global) submitted feedback</p>
                  <span className="text-[10px] text-slate-400">14 mins ago</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <p className="font-medium text-emerald-950">Survey Target Milestone</p>
                  <p className="text-[11px] text-emerald-700">Q4 Enterprise Satisfaction reached 84% completion</p>
                  <span className="text-[10px] text-slate-400">1 hour ago</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="font-medium text-slate-800">Support CSAT Update</p>
                  <p className="text-[11px] text-slate-600">Average resolution rating increased to 4.8 / 5.0</p>
                  <span className="text-[10px] text-slate-400">3 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100"
          />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-none">{currentUser.name}</span>
            <span className="text-[10px] text-slate-500 mt-1 leading-none">{currentUser.title}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
