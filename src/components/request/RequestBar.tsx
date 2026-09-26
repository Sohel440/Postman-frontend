import React from 'react';
import { Play, Save, Loader2, ChevronDown, Check } from 'lucide-react';
import { useEnv } from '../../context/EnvContext';

interface RequestBarProps {
  method: string;
  onMethodChange: (method: string) => void;
  url: string;
  onUrlChange: (url: string) => void;
  onSend: () => void;
  onSave: () => void;
  isExecuting: boolean;
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

export const RequestBar: React.FC<RequestBarProps> = ({
  method,
  onMethodChange,
  url,
  onUrlChange,
  onSend,
  onSave,
  isExecuting,
}) => {
  const { interpolate, activeEnvironment } = useEnv();
  const [showMethodMenu, setShowMethodMenu] = React.useState(false);

  const getMethodStyle = (m: string) => {
    switch (m.toUpperCase()) {
      case 'GET':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'POST':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'PUT':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'PATCH':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'DELETE':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const resolvedUrl = interpolate(url);
  const hasVariables = url.includes('{{') && url.includes('}}');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSend();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <div className="p-3 border-b border-white/10 glass-panel-subtle flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        {/* Method Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMethodMenu(!showMethodMenu)}
            className={`px-3 py-2 rounded-xl border font-mono font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm ${getMethodStyle(
              method
            )}`}
          >
            <span>{method}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {showMethodMenu && (
            <div
              className="absolute left-0 mt-2 w-32 glass-panel rounded-xl border border-white/10 shadow-2xl p-1 z-50 animate-in fade-in duration-100"
              onClick={() => setShowMethodMenu(false)}
            >
              {HTTP_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onMethodChange(m)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center justify-between ${
                    m === method ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span className={getMethodStyle(m).split(' ')[0]}>{m}</span>
                  {m === method && <Check className="w-3 h-3 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* URL Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter request URL (e.g. {{baseUrl}}/api/collection or https://jsonplaceholder.typicode.com/posts)"
            className="w-full pl-3.5 pr-20 py-2 text-xs sm:text-sm font-mono rounded-xl glass-input"
          />

          {hasVariables && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                title={`Resolves to: ${resolvedUrl}`}
              >
                {activeEnvironment ? `env: ${activeEnvironment.name}` : 'unresolved'}
              </span>
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={isExecuting}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          {isExecuting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>Send</span>
        </button>

        {/* Save Button */}
        <button
          type="button"
          onClick={onSave}
          className="px-3.5 py-2 rounded-xl border border-white/10 glass-panel-subtle hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center space-x-1.5 transition-colors"
          title="Save Request (Ctrl+S)"
        >
          <Save className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>

      {/* URL Interpolation preview if active */}
      {hasVariables && activeEnvironment && resolvedUrl !== url && (
        <div className="text-[11px] text-slate-400 font-mono px-1 truncate flex items-center space-x-1">
          <span className="text-cyan-400">Preview:</span>
          <span className="truncate text-slate-300">{resolvedUrl}</span>
        </div>
      )}
    </div>
  );
};
