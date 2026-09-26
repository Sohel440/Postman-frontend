import React, { useState } from 'react';
import { KeyValueEditor } from './KeyValueEditor';
import type { KeyValuePair, RequestAuth } from '../../types';
import { Shield, Code, ListFilter, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface RequestTabsProps {
  queryParams: KeyValuePair[];
  onQueryParamsChange: (params: KeyValuePair[]) => void;
  headers: KeyValuePair[];
  onHeadersChange: (headers: KeyValuePair[]) => void;
  auth: RequestAuth;
  onAuthChange: (auth: RequestAuth) => void;
  body: string;
  onBodyChange: (body: string) => void;
}

type TabType = 'params' | 'headers' | 'auth' | 'body';

export const RequestTabs: React.FC<RequestTabsProps> = ({
  queryParams,
  onQueryParamsChange,
  headers,
  onHeadersChange,
  auth,
  onAuthChange,
  body,
  onBodyChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('params');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const activeParamsCount = queryParams.filter((p) => p.enabled && p.key.trim()).length;
  const activeHeadersCount = headers.filter((h) => h.enabled && h.key.trim()).length;

  const handleFormatJson = () => {
    if (!body.trim()) return;
    try {
      const parsed = JSON.parse(body);
      onBodyChange(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON');
    }
  };

  const handleBodyInput = (val: string) => {
    onBodyChange(val);
    if (!val.trim()) {
      setJsonError(null);
      return;
    }
    try {
      JSON.parse(val);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 border-b border-white/10 px-3 pt-2 bg-white/[0.01]">
        <button
          type="button"
          onClick={() => setActiveTab('params')}
          className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'params'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Params</span>
          {activeParamsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] flex items-center justify-center font-mono">
              {activeParamsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('headers')}
          className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'headers'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Headers</span>
          {activeHeadersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] flex items-center justify-center font-mono">
              {activeHeadersCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('auth')}
          className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'auth'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Authorization</span>
          {auth.type === 'Bearer' && auth.token && (
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('body')}
          className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'body'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Body</span>
          {body.trim() && (
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'params' && (
          <div>
            <div className="text-xs text-slate-400 mb-3">
              Query Parameters appended to URL query string (<code className="text-cyan-400">?key=val</code>)
            </div>
            <KeyValueEditor
              pairs={queryParams}
              onChange={onQueryParamsChange}
              keyPlaceholder="Parameter"
              valuePlaceholder="Value"
            />
          </div>
        )}

        {activeTab === 'headers' && (
          <div>
            <div className="text-xs text-slate-400 mb-3">
              HTTP Headers sent along with the request
            </div>
            <KeyValueEditor
              pairs={headers}
              onChange={onHeadersChange}
              keyPlaceholder="Header"
              valuePlaceholder="Value"
            />
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="max-w-xl space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Type</label>
              <select
                value={auth.type || 'none'}
                onChange={(e) =>
                  onAuthChange({
                    ...auth,
                    type: e.target.value as 'Bearer' | 'none',
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl glass-input bg-[#0c1220]"
              >
                <option value="none" className="bg-[#0c1220]">No Auth</option>
                <option value="Bearer" className="bg-[#0c1220]">Bearer Token</option>
              </select>
            </div>

            {auth.type === 'Bearer' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Token</label>
                <textarea
                  rows={3}
                  placeholder="Enter JWT or bearer token..."
                  value={auth.token || ''}
                  onChange={(e) => onAuthChange({ ...auth, token: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl glass-input placeholder-slate-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Added as header: <code className="text-cyan-400">Authorization: Bearer &lt;token&gt;</code>
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'body' && (
          <div className="flex flex-col h-full space-y-2">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Content Type:</span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-300">
                  application/json
                </span>
                {jsonError ? (
                  <span className="flex items-center space-x-1 text-[11px] text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Invalid JSON</span>
                  </span>
                ) : body.trim() ? (
                  <span className="flex items-center space-x-1 text-[11px] text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid JSON</span>
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={handleFormatJson}
                disabled={!body.trim()}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors disabled:opacity-40"
              >
                Format JSON
              </button>
            </div>

            <div className="relative flex-1 min-h-[220px]">
              <textarea
                value={body}
                onChange={(e) => handleBodyInput(e.target.value)}
                placeholder={'{\n  "key": "value"\n}'}
                className="w-full h-full min-h-[220px] p-3 text-xs font-mono rounded-xl glass-input bg-[#090d18] resize-y leading-relaxed text-cyan-100 placeholder-slate-700"
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
