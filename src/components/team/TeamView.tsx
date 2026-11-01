import React, { useState } from 'react';
import { useSurvey } from '../../context/SurveyContext';
import { UserRole, TeamMember } from '../../types';
import { RoleBadge } from '../common/RoleBadge';
import {
  UserPlus,
  Shield,
  ShieldCheck,
  Check,
  X,
  Mail,
  Building,
  Clock,
  Trash2,
  Lock,
  CheckCircle2
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const { teamMembers, addTeamMember, removeTeamMember, currentRole, setCurrentRole } = useSurvey();
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Invite Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Product & CX');
  const [role, setRole] = useState<UserRole>('contributor');
  const [title, setTitle] = useState('CX Research Specialist');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addTeamMember({
      name,
      email,
      department,
      role,
      title,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`
    });

    setName('');
    setEmail('');
    setShowInviteModal(false);
  };

  const permissionsMatrix = [
    { capability: 'Create & Publish Live Surveys', admin: true, contributor: true, analyst: false },
    { capability: 'Edit Questionnaire Structure & Logic', admin: true, contributor: true, analyst: false },
    { capability: 'View Real-time Responses & Sentiment', admin: true, contributor: true, analyst: true },
    { capability: 'Add Internal Triage Notes to Responses', admin: true, contributor: true, analyst: false },
    { capability: 'Export Analytical Reports (CSV / JSON)', admin: true, contributor: true, analyst: true },
    { capability: 'Manage Workspace Members & Role Assignment', admin: true, contributor: false, analyst: false },
    { capability: 'Delete Deployed Surveys & Clear Response Data', admin: true, contributor: false, analyst: false }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Team Workspace & Role Governance
          </h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Role-based access control (RBAC) across research leads, contributors, and quantitative analysts.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map(member => (
          <div
            key={member.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-50"
                />
                <RoleBadge role={member.role} size="sm" />
              </div>

              <h3 className="font-bold text-sm text-[#0F172A]">{member.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{member.title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Building className="w-3 h-3 text-slate-400" />
                <span>{member.department}</span>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[150px]">{member.email}</span>
              {teamMembers.length > 1 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Remove ${member.name} from workspace?`)) {
                      removeTeamMember(member.id);
                    }
                  }}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove Member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Role Taxonomy Matrix */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#F1F5F9]">
          <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
            Role Taxonomy & Permissions Matrix
          </h2>
          <p className="text-xs text-[#475569]">
            Enterprise privileges enforced based on the three platform taxonomies.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569]">
              <tr>
                <th className="px-5 py-3 font-semibold">Capability</th>
                <th className="px-5 py-3 font-semibold">
                  <RoleBadge role="admin" size="sm" />
                </th>
                <th className="px-5 py-3 font-semibold">
                  <RoleBadge role="contributor" size="sm" />
                </th>
                <th className="px-5 py-3 font-semibold">
                  <RoleBadge role="analyst" size="sm" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{item.capability}</td>
                  <td className="px-5 py-3">
                    {item.admin ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {item.contributor ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {item.analyst ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-sm text-slate-900">Invite Colleague to Workspace</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Jessica Wu"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. jessica.wu@company.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Permission</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500 bg-white"
                  >
                    <option value="admin">Administrator</option>
                    <option value="contributor">Contributor</option>
                    <option value="analyst">Analyst</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg font-semibold shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
