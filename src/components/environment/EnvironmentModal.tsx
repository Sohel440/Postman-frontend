import React, { useState, useEffect } from 'react';
import { useEnv } from '../../context/EnvContext';
import { environmentApi } from '../../api/environment.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Plus, Trash2, Globe, Check, Edit3, Loader2 } from 'lucide-react';
import type { Environment } from '../../types';

interface EnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VarRow {
  id: string;
  key: string;
  value: string;
}

export const EnvironmentModal: React.FC<EnvironmentModalProps> = ({ isOpen, onClose }) => {
  const { environments, activeEnvironmentId, setActiveEnvironmentId } = useEnv();
  const queryClient = useQueryClient();

  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [envName, setEnvName] = useState('');
  const [variables, setVariables] = useState<VarRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedEnv) {
      setEnvName(selectedEnv.name);
      const vars = selectedEnv.variables || {};
      const rows: VarRow[] = Object.entries(vars).map(([key, value], idx) => ({
        id: `${idx}-${Date.now()}`,
        key,
        value: String(value),
      }));
      if (rows.length === 0) {
        rows.push({ id: `row-${Date.now()}`, key: '', value: '' });
      }
      setVariables(rows);
      setIsCreating(false);
    } else if (isCreating) {
      setEnvName('New Environment');
      setVariables([{ id: `row-${Date.now()}`, key: 'baseUrl', value: 'http://localhost:5000' }]);
    }
  }, [selectedEnv, isCreating]);

  useEffect(() => {
    if (isOpen && environments.length > 0 && !selectedEnv && !isCreating) {
      setSelectedEnv(environments[0]);
    }
  }, [isOpen, environments]);

  const createMutation = useMutation({
    mutationFn: (data: { name: string; variables: Record<string, string> }) =>
      environmentApi.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['environments'] });
      setIsCreating(false);
      if (res.data) {
        setSelectedEnv(res.data);
      }
    },
    onError: (err: any) => {
      setError(err?.message || 'Failed to create environment');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; variables?: Record<string, string> } }) =>
      environmentApi.update(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['environments'] });
      if (res.data) {
        setSelectedEnv(res.data);
      }
    },
    onError: (err: any) => {
      setError(err?.message || 'Failed to update environment');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => environmentApi.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['environments'] });
      if (activeEnvironmentId === deletedId) {
        setActiveEnvironmentId(null);
      }
      setSelectedEnv(null);
    },
  });

  if (!isOpen) return null;

  const handleAddRow = () => {
    setVariables([...variables, { id: `row-${Date.now()}`, key: '', value: '' }]);
  };

  const handleUpdateRow = (id: string, field: 'key' | 'value', val: string) => {
    setVariables(variables.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  const handleRemoveRow = (id: string) => {
    setVariables(variables.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    setError(null);
    if (!envName.trim()) {
      setError('Environment name cannot be empty');
      return;
    }

    const varsObj: Record<string, string> = {};
    for (const row of variables) {
      if (row.key.trim()) {
        varsObj[row.key.trim()] = row.value;
      }
    }

    if (isCreating) {
      createMutation.mutate({ name: envName.trim(), variables: varsObj });
    } else if (selectedEnv) {
      updateMutation.mutate({ id: selectedEnv.id, data: { name: envName.trim(), variables: varsObj } });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl p-6 shadow-2xl border border-white/10 text-white flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Manage Environments</h2>
              <p className="text-xs text-slate-400">
                Define key-value pairs to interpolate in URLs & headers using <code className="text-cyan-400">{'{{variable}}'}</code>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex flex-1 overflow-hidden mt-4 gap-4">
          {/* Left: Environment List */}
          <div className="w-1/3 border-r border-white/10 pr-3 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Environments</span>
              <button
                onClick={() => {
                  setSelectedEnv(null);
                  setIsCreating(true);
                  setError(null);
                }}
                className="p-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-xs flex items-center space-x-1"
                title="Add Environment"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {environments.map((env) => {
                const isSelected = selectedEnv?.id === env.id && !isCreating;
                const isActive = activeEnvironmentId === env.id;
                return (
                  <div
                    key={env.id}
                    onClick={() => {
                      setSelectedEnv(env);
                      setIsCreating(false);
                      setError(null);
                    }}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-medium'
                        : 'border-white/5 hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Globe className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{env.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {isActive && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {environments.length === 0 && !isCreating && (
                <div className="text-center py-6 text-xs text-slate-500">
                  No environments yet. Create one!
                </div>
              )}
            </div>
          </div>

          {/* Right: Environment Detail & Variable Editor */}
          <div className="flex-1 flex flex-col overflow-hidden pl-1">
            {selectedEnv || isCreating ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 mr-4">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Environment Name</label>
                    <div className="relative">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={envName}
                        onChange={(e) => setEnvName(e.target.value)}
                        placeholder="e.g. Production or Local Dev"
                        className="w-full pl-8 pr-3 py-1.5 text-sm rounded-xl glass-input"
                      />
                    </div>
                  </div>

                  {selectedEnv && (
                    <div className="flex items-center space-x-2 pt-4">
                      <button
                        onClick={() =>
                          setActiveEnvironmentId(
                            activeEnvironmentId === selectedEnv.id ? null : selectedEnv.id
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center space-x-1.5 transition-colors ${
                          activeEnvironmentId === selectedEnv.id
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{activeEnvironmentId === selectedEnv.id ? 'Active' : 'Set as Active'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete environment "${selectedEnv.name}"?`)) {
                            deleteMutation.mutate(selectedEnv.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Environment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">Variables</span>
                  <button
                    onClick={handleAddRow}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Row</span>
                  </button>
                </div>

                {/* Variable rows */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                    <span className="col-span-5">Variable Key</span>
                    <span className="col-span-6">Value</span>
                    <span className="col-span-1 text-center">Action</span>
                  </div>

                  {variables.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        placeholder="KEY (e.g. baseUrl)"
                        value={row.key}
                        onChange={(e) => handleUpdateRow(row.id, 'key', e.target.value)}
                        className="col-span-5 px-2.5 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                      <input
                        type="text"
                        placeholder="VALUE (e.g. http://localhost:5000)"
                        value={row.value}
                        onChange={(e) => handleUpdateRow(row.id, 'value', e.target.value)}
                        className="col-span-6 px-2.5 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                      <button
                        onClick={() => handleRemoveRow(row.id)}
                        className="col-span-1 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Save button footer */}
                <div className="pt-4 mt-2 border-t border-white/10 flex justify-end space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>{isCreating ? 'Create Environment' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Globe className="w-8 h-8 opacity-40" />
                <p className="text-xs">Select or create an environment to view variables</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
