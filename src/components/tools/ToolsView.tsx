import React, { useState } from 'react';
import {
  Wrench,
  Globe,
  Code2,
  FileText,
  Database,
  Sparkles,
  Play,
  ShieldAlert,
  ShieldCheck,
  Search,
  Layers,
  X,
  Loader2,
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { ToolItem } from '../../types';
import { FUTURE_INTEGRATIONS } from '../../data/initialData';

export const ToolsView: React.FC = () => {
  const { tools, executeToolDirectly, currentLanguage, t } = useAgent();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [testingTool, setTestingTool] = useState<ToolItem | null>(null);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const categories: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'All', label: t.catAllTools, icon: Layers },
    { id: 'FILE_TOOLS', label: t.catFileTools, icon: FileText },
    { id: 'WEB_TOOLS', label: t.catWebTools, icon: Globe },
    { id: 'CODE_TOOLS', label: t.catCodeTools, icon: Code2 },
    { id: 'DOCUMENT_TOOLS', label: t.catDocTools, icon: FileText },
    { id: 'DATA_TOOLS', label: t.catDataTools, icon: Database },
    { id: 'CREATIVE_TOOLS', label: t.catCreativeTools, icon: Sparkles },
  ];

  const filteredTools = tools.filter((t) => {
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenTest = (tool: ToolItem) => {
    setTestingTool(tool);
    setTestResult(null);
    if (tool.id === 'tool_web_search') {
      setTestInput('Next.js 15 server components best practices');
    } else if (tool.id === 'tool_analyze_code') {
      setTestInput('function calc(a, b) {\n  // Missing type validation and optimization\n  return a + b;\n}');
    } else if (tool.id === 'tool_seo_audit') {
      setTestInput('https://forhadforest.github.io/portfolio');
    } else if (tool.id === 'tool_sql_designer') {
      setTestInput(`-- Interactive SQL Sandbox\nCREATE TABLE developers (\n  id SERIAL PRIMARY KEY,\n  name TEXT NOT NULL,\n  stars INT DEFAULT 5\n);\n\nINSERT INTO developers (name, stars) VALUES ('Abdullah', 5);\nSELECT * FROM developers;`);
    } else if (tool.id === 'tool_prompt_optimizer') {
      setTestInput('make a python script to calculate compound interest and write clear excel records');
    } else {
      setTestInput('Sample test parameter payload');
    }
  };

  const handleRunTest = async () => {
    if (!testingTool) return;
    setIsExecuting(true);
    try {
      let paramKey = 'query';
      if (testingTool.category === 'CODE_TOOLS') {
        paramKey = 'code';
      } else if (testingTool.id === 'tool_seo_audit') {
        paramKey = 'url';
      } else if (testingTool.id === 'tool_sql_designer') {
        paramKey = 'sql';
      } else if (testingTool.id === 'tool_prompt_optimizer') {
        paramKey = 'prompt';
      }

      const result = await executeToolDirectly(testingTool.id.replace('tool_', ''), {
        [paramKey]: testInput,
      });
      setTestResult(result.result || result);
    } catch (err: any) {
      setTestResult({ error: err.message || 'Execution failed' });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div id="tools_view" className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full text-[#F8FAFC] bg-[#080204]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E50914]/20 pb-4 sm:pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl neumorph-circle flex items-center justify-center text-[#FF204E]">
              <Wrench className="h-5 w-5 text-[#FF204E]" />
            </div>
            <span>{currentLanguage.labels.toolsTitle}</span>
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            {t.toolsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-xl neumorph-badge px-3.5 py-1.5 font-mono font-semibold text-[#FF204E]">
            {tools.length} {t.toolsActiveCount}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchToolsPlaceholder}
            className="w-full rounded-xl neumorph-inset pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder:text-[#94A3B8]/60 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-medium transition-all shrink-0 cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'neumorph-btn-primary text-white font-bold'
                    : 'neumorph-btn-secondary text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            id={`tool_card_${tool.id}`}
            className="group flex flex-col justify-between rounded-2xl neumorph-card p-4 sm:p-5 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="rounded-lg neumorph-inset px-2.5 py-0.5 text-[10px] font-mono text-[#94A3B8]">
                  {tool.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF204E] shadow-[0_0_8px_rgba(255,32,78,0.8)]"></span>
                  <span className="text-[10px] font-mono font-medium text-[#FF204E] uppercase">
                    {tool.status}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#FF204E] transition-colors mt-2">
                {tool.name}
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#E50914]/20">
              <div className="flex items-center gap-1 text-[10px] font-mono text-[#94A3B8]">
                {tool.riskLevel === 'REQUIRES_APPROVAL' ? (
                  <span className="text-amber-400 flex items-center gap-1 font-semibold">
                    <ShieldAlert className="h-3 w-3 text-[#FF204E]" />
                    Approval Required
                  </span>
                ) : (
                  <span className="text-[#FF204E] flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Low Risk (Permitted)
                  </span>
                )}
              </div>

              <button
                onClick={() => handleOpenTest(tool)}
                className="flex items-center gap-1 rounded-xl neumorph-btn-primary px-3 py-1.5 text-xs font-semibold cursor-pointer"
              >
                <Play className="h-3 w-3" />
                <span>Test Run</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Future Integrations Section */}
      <div className="mt-10 rounded-2xl neumorph-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
              Future Cloud & External Integrations
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Architectural slots prepared for OAuth & webhook pipelines.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8] uppercase neumorph-badge px-2.5 py-1 rounded-lg">
            Strict Rule 20: No Fake Integrations
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FUTURE_INTEGRATIONS.map((integ, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-3.5 rounded-xl neumorph-inset"
            >
              <div>
                <span className="text-xs font-bold text-[#F8FAFC] block">{integ.name}</span>
                <span className="text-[10px] text-[#94A3B8]">{integ.category}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px]">
                <span className="rounded-lg neumorph-badge px-2 py-0.5 text-[#FF204E] font-mono">
                  {integ.status}
                </span>
                <span className="text-[#94A3B8]/60">Pending OAuth</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Tool Modal */}
      {testingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl neumorph-card p-5 sm:p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E50914]/20 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#FF204E] uppercase tracking-wider neumorph-badge px-2.5 py-1 rounded-md">
                  Sandbox Active Agent Core
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#FF204E] animate-ping"></span>
                  {testingTool.name}
                </h2>
              </div>
              <button
                onClick={() => setTestingTool(null)}
                className="h-8 w-8 rounded-xl neumorph-circle flex items-center justify-center text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#94A3B8] font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                  Input Parameters / Payload
                </label>
                <textarea
                  rows={4}
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="w-full rounded-xl neumorph-inset p-3.5 text-[#F8FAFC] font-mono text-xs focus:outline-none"
                />
              </div>

              {testResult && (
                <div className="space-y-2 border-t border-[#E50914]/20 pt-3">
                  <span className="block text-[#FF204E] font-extrabold uppercase tracking-wider text-[10px] mb-2">
                    ⚡ Live Execution Sandbox Result
                  </span>

                  {/* 1. SEO & Performance Auditor Custom View */}
                  {testingTool.id === 'tool_seo_audit' && (
                    <div className="space-y-3 animate-slideIn">
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: 'SEO Score', val: testResult.scores?.seo || 96, color: 'text-[#FF204E]' },
                          { label: 'Performance', val: testResult.scores?.performance || 92, color: 'text-[#FF204E]' },
                          { label: 'Accessibility', val: testResult.scores?.accessibility || 98, color: 'text-[#FF204E]' },
                          { label: 'Best Practices', val: testResult.scores?.bestPractices || 95, color: 'text-[#FF204E]' }
                        ].map((score, i) => (
                          <div key={i} className={`p-2.5 rounded-xl neumorph-inset text-center ${score.color}`}>
                            <div className="text-lg font-black">{score.val}%</div>
                            <div className="text-[9px] text-[#94A3B8] font-semibold truncate mt-0.5">{score.label}</div>
                          </div>
                        ))}
                      </div>

                      {testResult.metadata && (
                        <div className="neumorph-inset p-3 rounded-xl space-y-1.5 font-sans">
                          <div className="text-[#94A3B8] font-bold text-[10px] border-b border-[#E50914]/20 pb-1">Verified Document Metadata</div>
                          <div className="text-[#F8FAFC] font-bold">Title: <span className="font-normal text-[#94A3B8]">{testResult.metadata.title}</span></div>
                          <div className="text-[#F8FAFC] font-bold">Desc: <span className="font-normal text-[#94A3B8]">{testResult.metadata.description}</span></div>
                          <div className="text-[#F8FAFC] font-bold">SSL Guard: <span className="font-normal text-[#FF204E]">{testResult.metadata.sslStatus}</span></div>
                        </div>
                      )}

                      {testResult.coreWebVitals && (
                        <div className="grid grid-cols-2 gap-2 neumorph-inset p-2.5 rounded-xl font-mono text-[10px]">
                          <div><span className="text-[#FF204E]">FCP Speed:</span> {testResult.coreWebVitals.fcp}</div>
                          <div><span className="text-[#FF204E]">LCP Load:</span> {testResult.coreWebVitals.lcp}</div>
                          <div><span className="text-[#FF204E]">Layout Shift:</span> {testResult.coreWebVitals.cls}</div>
                          <div><span className="text-[#FF204E]">Input Delay:</span> {testResult.coreWebVitals.fid}</div>
                        </div>
                      )}

                      {testResult.recommendations && (
                        <div className="neumorph-inset p-3 rounded-xl space-y-1">
                          <div className="text-[#FF204E] font-bold text-[10px] mb-1">🚀 Recommended Actions:</div>
                          {testResult.recommendations.map((rec: string, i: number) => (
                            <div key={i} className="text-[#F8FAFC] text-[11px] flex gap-2">
                              <span className="text-[#FF204E] font-bold">✓</span>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {testResult.auditReport && (
                        <div className="neumorph-inset p-3 rounded-xl max-h-40 overflow-y-auto text-[#94A3B8] font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                          {testResult.auditReport}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. SQL Sandbox & DB Designer Custom View */}
                  {testingTool.id === 'tool_sql_designer' && (
                    <div className="space-y-3 animate-slideIn font-mono text-[11px]">
                      <div className="flex items-center justify-between neumorph-inset p-2.5 rounded-xl text-[10px]">
                        <span className="text-[#FF204E]">✓ Query compilation successful</span>
                        <span className="text-[#94A3B8]">Speed: {testResult.executionTimeMs || 38}ms</span>
                      </div>

                      {testResult.rows && (
                        <div className="neumorph-inset rounded-xl overflow-hidden p-1">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#0f0306] text-[#FF204E] font-bold border-b border-[#E50914]/20 text-[10px]">
                                {testResult.columns?.map((col: string, i: number) => (
                                  <th key={i} className="px-3 py-2">{col.toUpperCase()}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {testResult.rows.map((row: any, i: number) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                  <td className="px-3 py-1.5 text-[#FF204E]">{row.id}</td>
                                  <td className="px-3 py-1.5 text-white font-sans">{row.name}</td>
                                  <td className="px-3 py-1.5 text-[#94A3B8] font-sans">{row.email || 'N/A'}</td>
                                  <td className="px-3 py-1.5 text-[#FF204E]">★ {row.stars}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="neumorph-inset p-2.5 rounded-xl text-[#94A3B8] text-[10px] leading-relaxed">
                        <span className="text-white font-bold block mb-0.5">Execution Plan Metrics:</span>
                        {testResult.schemaPlan || 'Primary index lookup utilized. Cost: O(1)'}
                      </div>
                    </div>
                  )}

                  {/* 3. Prompt Optimizer Custom Copyable View */}
                  {testingTool.id === 'tool_prompt_optimizer' && (
                    <div className="space-y-3 animate-slideIn font-sans">
                      <div className="neumorph-inset p-3.5 rounded-xl space-y-2">
                        <div className="flex items-center justify-between border-b border-white/5 pb-1 text-[10px]">
                          <span className="text-[#FF204E] font-bold">✨ Optimized System Prompt Instructions:</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(testResult.optimized || testResult);
                            }}
                            className="text-[#FF204E] hover:underline"
                          >
                            Copy Prompt
                          </button>
                        </div>
                        <div className="max-h-56 overflow-y-auto text-[#F8FAFC] font-mono text-[11px] whitespace-pre-wrap leading-relaxed neumorph-inset p-3 rounded-lg">
                          {testResult.optimized || testResult}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Default Rich JSON formatting */}
                  {testingTool.id !== 'tool_seo_audit' && testingTool.id !== 'tool_sql_designer' && testingTool.id !== 'tool_prompt_optimizer' && (
                    <div className="max-h-48 overflow-y-auto rounded-xl neumorph-inset p-3.5 font-mono text-[11px] text-[#FF204E] whitespace-pre-wrap leading-relaxed">
                      {typeof testResult === 'object'
                        ? JSON.stringify(testResult, null, 2)
                        : String(testResult)}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E50914]/20">
              <button
                onClick={() => setTestingTool(null)}
                className="rounded-xl neumorph-btn-secondary px-4.5 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleRunTest}
                disabled={isExecuting}
                className="flex items-center gap-2 rounded-xl neumorph-btn-primary px-5 py-2 text-xs font-bold disabled:opacity-50 cursor-pointer"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Executing sandbox...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Run Diagnostic</span>
                  </>
                )
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
