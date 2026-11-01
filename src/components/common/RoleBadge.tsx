import React from 'react';
import { UserRole } from '../../types';
import { ShieldCheck, UserCheck, Eye } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, showIcon = true, size = 'md' }) => {
  const getRoleConfig = () => {
    switch (role) {
      case 'admin':
        return {
          label: 'Administrator',
          bg: 'bg-[#F5F3FF]',
          text: 'text-[#6D28D9]',
          border: 'border-[#DDD6FE]',
          icon: ShieldCheck
        };
      case 'contributor':
        return {
          label: 'Contributor',
          bg: 'bg-[#EFF6FF]',
          text: 'text-[#1D4ED8]',
          border: 'border-[#BFDBFE]',
          icon: UserCheck
        };
      case 'analyst':
        return {
          label: 'Analyst',
          bg: 'bg-[#F0FDF4]',
          text: 'text-[#047857]',
          border: 'border-[#BBF7D0]',
          icon: Eye
        };
      default:
        return {
          label: 'Viewer',
          bg: 'bg-slate-50',
          text: 'text-slate-600',
          border: 'border-slate-200',
          icon: Eye
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  const sizeClasses = size === 'sm'
    ? 'text-[11px] px-2 py-0.5 gap-1 font-medium'
    : 'text-xs px-2.5 py-1 gap-1.5 font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} tracking-tight select-none`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
