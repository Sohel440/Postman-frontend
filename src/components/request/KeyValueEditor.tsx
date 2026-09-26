import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { KeyValuePair } from '../../types';

interface KeyValueEditorProps {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  pairs,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}) => {
  const handleAdd = () => {
    onChange([
      ...pairs,
      {
        id: `kv-${Date.now()}-${Math.random()}`,
        key: '',
        value: '',
        enabled: true,
      },
    ]);
  };

  const handleToggle = (id: string) => {
    onChange(
      pairs.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleUpdate = (id: string, field: 'key' | 'value', val: string) => {
    onChange(
      pairs.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleDelete = (id: string) => {
    onChange(pairs.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
        <span className="col-span-1 text-center">Active</span>
        <span className="col-span-5">{keyPlaceholder}</span>
        <span className="col-span-5">{valuePlaceholder}</span>
        <span className="col-span-1 text-center">Delete</span>
      </div>

      <div className="space-y-1.5">
        {pairs.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-2 items-center bg-white/[0.02] hover:bg-white/[0.04] p-1 rounded-xl transition-colors"
          >
            <div className="col-span-1 flex justify-center">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={() => handleToggle(item.id)}
                className="w-4 h-4 rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-cyan-500/30 cursor-pointer"
              />
            </div>
            <div className="col-span-5">
              <input
                type="text"
                placeholder={keyPlaceholder}
                value={item.key}
                onChange={(e) => handleUpdate(item.id, 'key', e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs rounded-lg glass-input font-mono ${
                  !item.enabled ? 'opacity-50' : ''
                }`}
              />
            </div>
            <div className="col-span-5">
              <input
                type="text"
                placeholder={valuePlaceholder}
                value={item.value}
                onChange={(e) => handleUpdate(item.id, 'value', e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs rounded-lg glass-input font-mono ${
                  !item.enabled ? 'opacity-50' : ''
                }`}
              />
            </div>
            <div className="col-span-1 flex justify-center">
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {pairs.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-500">
            No entries configured. Click below to add one.
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add parameter</span>
      </button>
    </div>
  );
};
