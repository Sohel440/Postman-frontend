import React, { useState } from 'react';
import type { ExecutionResponse } from '../../types';
import { Clock, HardDrive, Copy, Check, Terminal, FileCode, List } from 'lucide-react';

interface ResponsePanelProps {
  response: ExecutionResponse | null;
  loading: boolean;
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({ response, loading }) => {
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
  const [copied, setCopied] = useState(false);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
    if (status >= 300 && status < 400) {
      return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
    }
    if (status >= 400 && status < 500) {
      return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formattedBody = React.useMemo(() => {
    if (!response) return '';
    if (typeof response.body === 'object' && response.body !== null) {
      try {
        return JSON.stringify(response.body, null, 2);
      } catch {
        return String(response.body);
      }
    }
    return String(response.body ?? '');
  }, [response]);

  const handleCopy = () => {
    if (!formattedBody) return;
    navigator.clipboard.writeText(formattedBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in duration-200">
        {/* Response Meta Header Skeleton */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 glass-panel-subtle">
          <div className="flex items-center space-x-3">
            {/* Status Badge Skeleton */}
            <div className="h-6 w-20 rounded-lg skeleton-box animate-shimmer" />
            {/* Latency Skeleton */}
            <div className="h-5 w-16 rounded skeleton-box animate-shimmer" />
            {/* Size Skeleton */}
            <div className="h-5 w-14 rounded skeleton-box animate-shimmer" />
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-[11px] text-slate-400">Awaiting response...</span>
          </div>
        </div>

        {/* Tab Bar Skeleton */}
        <div className="flex items-center space-x-4 border-b border-white/10 px-4 py-2 bg-white/[0.01]">
          <div className="h-4 w-12 rounded skeleton-box animate-shimmer" />
          <div className="h-4 w-14 rounded skeleton-box animate-shimmer" />
        </div>

        {/* Simulated Code Lines Body Skeleton */}
        <div className="flex-1 p-4 font-mono text-xs overflow-hidden space-y-2 bg-[#050811]/60">
          <div className="flex items-center space-x-3">
            <span className="text-slate-600 select-none text-[11px] w-5 text-right font-mono">1</span>
            <div className="h-3 w-6 rounded skeleton-box animate-shimmer" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-600 select-none text-[11px] w-5 text-right font-mono">2</span>
            <div className="h-3 w-32 rounded skeleton-box animate-shimmer ml-4" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-600 select-none text-[11px] w-5 text-right font-mono">3</span>
            <div className="h-3 w-56 rounded skeleton-box animate-shimmer ml-4" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-600 select-none text-[11px] w-5 text-right font-mono">4</span>
            <div className="h-3 w-20 rounded skeleton-box animate-shimmer ml-4" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-600 select-none text-[11px] w-5 text-right font-mono">5</span>
            <div className="h-3 w-64 rounded skeleton-box animate-shimmer ml-8" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-600 select-none text-[11px] w-5 text-right font-mono">6</span>
            <div className="h-3 w-48 rounded skeleton-box animate-shimmer ml-8" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-600 select-none text-[11px] w-5 text-right font-mono">7</span>
            <div className="h-3 w-72 rounded skeleton-box animate-shimmer ml-8" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-600 select-none text-[11px] w-5 text-right font-mono">8</span>
            <div className="h-3 w-8 rounded skeleton-box animate-shimmer ml-4" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-600 select-none text-[11px] w-5 text-right font-mono">9</span>
            <div className="h-3 w-6 rounded skeleton-box animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-4">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-inner">
          <Terminal className="w-8 h-8 text-slate-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-300">Ready to Send</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Hit <strong className="text-cyan-400">Send</strong> or press <code className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">Ctrl + Enter</code> to trigger this endpoint and inspect the live response.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Response Meta Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 glass-panel-subtle">
        <div className="flex items-center space-x-3">
          {/* Status Badge */}
          <div
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center space-x-1.5 shadow-sm ${getStatusColor(
              response.status
            )}`}
          >
            <span>{response.status}</span>
            <span>{response.statusText || (response.status < 400 ? 'OK' : 'Error')}</span>
          </div>

          {/* Latency */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{response.responseTime} ms</span>
          </div>

          {/* Size */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatSize(response.responseSize)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg glass-panel-subtle hover:bg-white/10 text-slate-300 text-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Body</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Response Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-white/10 px-3 bg-white/[0.01]">
        <button
          type="button"
          onClick={() => setActiveTab('body')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'body'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Body</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('headers')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'headers'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>Headers ({response.headers ? Object.keys(response.headers).length : 0})</span>
        </button>
      </div>

      {/* Response Content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs">
        {activeTab === 'body' && (
          <pre className="text-emerald-300/90 whitespace-pre-wrap leading-relaxed select-text font-mono">
            {formattedBody || '(Empty response body)'}
          </pre>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-1.5">
            {response.headers && Object.keys(response.headers).length > 0 ? (
              Object.entries(response.headers).map(([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-12 gap-2 py-1 px-2 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <span className="col-span-4 font-semibold text-cyan-400 truncate">{key}</span>
                  <span className="col-span-8 text-slate-300 break-all select-all">
                    {String(value)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 py-4 text-center">No headers returned</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
