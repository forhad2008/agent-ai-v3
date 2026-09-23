import React, { useState } from 'react';
import {
  Clock,
  Search,
  Download,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export const ActivityView: React.FC = () => {
  const { activities, currentLanguage, t } = useAgent();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'success' | 'failed' | 'pending'>('All');

  const filtered = activities.filter((act) => {
    const matchesSearch =
      act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.result.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || act.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(activities, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-activity-audit-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="activity_view" className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full text-[#F8FAFC] bg-[#080204]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FF204E]/20 pb-4 sm:pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl neumorph-circle flex items-center justify-center text-[#FF204E]">
              <Clock className="h-5 w-5 text-[#FF204E]" />
            </div>
            <span>{currentLanguage.labels.activityTitle}</span>
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            {t.activitySubtitle}
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="flex items-center gap-1.5 rounded-xl neumorph-btn-secondary px-3.5 py-2.5 text-xs font-semibold text-[#F8FAFC] hover:text-white cursor-pointer"
        >
          <Download className="h-4 w-4 text-[#FF204E]" />
          <span>{t.exportAuditJsonBtn}</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action or tool..."
            className="w-full rounded-xl neumorph-inset pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
          {(['All', 'success', 'failed', 'pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 font-medium transition-all cursor-pointer ${
                statusFilter === st
                  ? 'neumorph-btn-primary text-white font-bold'
                  : 'neumorph-btn-secondary text-[#94A3B8] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Table */}
      <div className="overflow-hidden rounded-2xl neumorph-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#94A3B8]">
            <thead className="bg-[#070103]/60 text-[10px] uppercase font-semibold text-[#94A3B8] tracking-wider border-b border-[#FF204E]/20">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Action Taken</th>
                <th className="px-4 py-3.5">Tool Used</th>
                <th className="px-4 py-3.5">Approval Gate</th>
                <th className="px-4 py-3.5">Execution Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FF204E]/10">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#FF204E]/10 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-[#94A3B8] whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#F8FAFC]">
                    {item.action}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg neumorph-badge px-2 py-0.5 font-mono text-[10px] text-[#FF204E]">
                      {item.tool}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-mono border ${
                        item.approvalStatus === 'approved'
                          ? 'bg-[#E50914]/20 text-[#FF204E] border-[#FF204E]/40'
                          : item.approvalStatus === 'not_required'
                          ? 'bg-[#070103] text-[#94A3B8] border-[#FF204E]/20'
                          : 'bg-[#990000]/25 text-white border-[#FF204E]/40'
                      }`}
                    >
                      {item.approvalStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#F8FAFC] max-w-xs truncate">
                    {item.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
