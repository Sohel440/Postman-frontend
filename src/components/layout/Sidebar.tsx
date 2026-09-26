import React, { useState } from 'react';
import type { Collection, ApiRequest } from '../../types';
import { collectionApi } from '../../api/collection.api';
import { requestApi } from '../../api/request.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Layers,
  Folder as FolderIcon,
  FolderPlus,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  Search,
  FileCode2,
  Check,
  X,
  Globe
} from 'lucide-react';

interface SidebarProps {
  collections: Collection[];
  activeRequest: Partial<ApiRequest> | null;
  isLoading?: boolean;
  onSelectRequest: (req: ApiRequest) => void;
  onNewRequest: () => void;
  onOpenEnvModal: () => void;
}

const SidebarSkeleton: React.FC = () => (
  <div className="p-2 space-y-3 animate-in fade-in duration-300">
    {/* Collection Item 1 (Expanded view simulation) */}
    <div className="space-y-2 p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      {/* Collection Header Skeleton */}
      <div className="flex items-center space-x-2 px-1">
        <div className="w-3.5 h-3.5 rounded skeleton-box animate-shimmer shrink-0" />
        <div className="w-3.5 h-3.5 rounded bg-cyan-500/20 animate-pulse shrink-0" />
        <div className="h-3.5 w-28 rounded-md skeleton-box animate-shimmer" />
      </div>

      {/* Nested Folder */}
      <div className="ml-4 pl-2 border-l border-white/5 space-y-2">
        <div className="flex items-center space-x-2 px-1">
          <div className="w-3 h-3 rounded skeleton-box animate-shimmer shrink-0" />
          <div className="w-3 h-3 rounded bg-amber-500/20 animate-pulse shrink-0" />
          <div className="h-3 w-20 rounded-md skeleton-box animate-shimmer" />
        </div>

        {/* Requests inside folder */}
        <div className="ml-4 pl-2 border-l border-white/5 space-y-1.5">
          <div className="flex items-center space-x-2 px-1 py-0.5">
            <div className="w-7 h-3 rounded bg-emerald-500/20 font-mono text-[9px] animate-pulse shrink-0" />
            <div className="h-2.5 w-24 rounded-md skeleton-box animate-shimmer" />
          </div>
          <div className="flex items-center space-x-2 px-1 py-0.5">
            <div className="w-8 h-3 rounded bg-amber-500/20 font-mono text-[9px] animate-pulse shrink-0" />
            <div className="h-2.5 w-20 rounded-md skeleton-box animate-shimmer" />
          </div>
        </div>

        {/* Direct request */}
        <div className="flex items-center space-x-2 px-1 py-0.5">
          <div className="w-7 h-3 rounded bg-emerald-500/20 font-mono text-[9px] animate-pulse shrink-0" />
          <div className="h-2.5 w-28 rounded-md skeleton-box animate-shimmer" />
        </div>
      </div>
    </div>

    {/* Collection Item 2 */}
    <div className="space-y-2 p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <div className="flex items-center space-x-2 px-1">
        <div className="w-3.5 h-3.5 rounded skeleton-box animate-shimmer shrink-0" />
        <div className="w-3.5 h-3.5 rounded bg-cyan-500/20 animate-pulse shrink-0" />
        <div className="h-3.5 w-32 rounded-md skeleton-box animate-shimmer" />
      </div>
      <div className="ml-4 pl-2 border-l border-white/5 space-y-1.5">
        <div className="flex items-center space-x-2 px-1 py-0.5">
          <div className="w-7 h-3 rounded bg-sky-500/20 font-mono text-[9px] animate-pulse shrink-0" />
          <div className="h-2.5 w-24 rounded-md skeleton-box animate-shimmer" />
        </div>
        <div className="flex items-center space-x-2 px-1 py-0.5">
          <div className="w-8 h-3 rounded bg-rose-500/20 font-mono text-[9px] animate-pulse shrink-0" />
          <div className="h-2.5 w-16 rounded-md skeleton-box animate-shimmer" />
        </div>
      </div>
    </div>

    {/* Collection Item 3 (Collapsed) */}
    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center space-x-2">
      <div className="w-3.5 h-3.5 rounded skeleton-box animate-shimmer shrink-0" />
      <div className="w-3.5 h-3.5 rounded bg-cyan-500/20 animate-pulse shrink-0" />
      <div className="h-3.5 w-24 rounded-md skeleton-box animate-shimmer" />
    </div>

    {/* Collection Item 4 (Collapsed) */}
    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center space-x-2">
      <div className="w-3.5 h-3.5 rounded skeleton-box animate-shimmer shrink-0" />
      <div className="w-3.5 h-3.5 rounded bg-cyan-500/20 animate-pulse shrink-0" />
      <div className="h-3.5 w-36 rounded-md skeleton-box animate-shimmer" />
    </div>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  collections,
  activeRequest,
  isLoading = false,
  onSelectRequest,
  onNewRequest,
  onOpenEnvModal,
}) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({});
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // Creation states
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const [addingFolderToColId, setAddingFolderToColId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  // Editing states
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editColName, setEditColName] = useState('');

  // Toggle helpers
  const toggleCollection = (id: string) => {
    setExpandedCollections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Mutations
  const createCollectionMutation = useMutation({
    mutationFn: (name: string) => collectionApi.create({ name }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setIsAddingCollection(false);
      setNewCollectionName('');
      if (res.data?.id) {
        setExpandedCollections((prev) => ({ ...prev, [res.data.id]: true }));
      }
    },
  });

  const updateCollectionMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      collectionApi.update(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setEditingColId(null);
    },
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: (id: string) => collectionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: ({ colId, name }: { colId: string; name: string }) =>
      collectionApi.createFolder(colId, { name }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setAddingFolderToColId(null);
      setNewFolderName('');
      setExpandedCollections((prev) => ({ ...prev, [variables.colId]: true }));
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: ({ colId, folderId }: { colId: string; folderId: string }) =>
      collectionApi.deleteFolder(colId, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: (id: string) => requestApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const getMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'text-emerald-400 font-bold';
      case 'POST':
        return 'text-amber-400 font-bold';
      case 'PUT':
        return 'text-sky-400 font-bold';
      case 'PATCH':
        return 'text-purple-400 font-bold';
      case 'DELETE':
        return 'text-rose-400 font-bold';
      default:
        return 'text-slate-400 font-bold';
    }
  };

  const filteredCollections = collections.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const inCol = c.name.toLowerCase().includes(q);
    const inFolders = c.folders?.some((f) => f.name.toLowerCase().includes(q) || f.requests?.some(r => r.name.toLowerCase().includes(q)));
    const inReqs = c.requests?.some((r) => r.name.toLowerCase().includes(q) || r.url.toLowerCase().includes(q));
    return inCol || inFolders || inReqs;
  });

  return (
    <aside className="w-72 h-full flex flex-col border-r border-white/10 glass-panel-subtle select-none">
      {/* Sidebar Top Search & Actions */}
      <div className="p-3 border-b border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Collections</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={onNewRequest}
              className="p-1.5 rounded-lg glass-panel-subtle hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="New Blank Request"
            >
              <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
            </button>
            <button
              onClick={() => setIsAddingCollection(true)}
              className="p-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 transition-colors"
              title="Add Collection"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl glass-input placeholder-slate-600"
          />
        </div>
      </div>

      {/* Add Collection Inline Input */}
      {isAddingCollection && (
        <div className="p-2 border-b border-white/10 bg-cyan-500/5 animate-in fade-in duration-100">
          <div className="flex items-center space-x-1.5">
            <input
              type="text"
              autoFocus
              placeholder="Collection name..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCollectionName.trim()) {
                  createCollectionMutation.mutate(newCollectionName.trim());
                } else if (e.key === 'Escape') {
                  setIsAddingCollection(false);
                }
              }}
              className="flex-1 px-2.5 py-1 text-xs rounded-lg glass-input"
            />
            <button
              onClick={() => {
                if (newCollectionName.trim()) {
                  createCollectionMutation.mutate(newCollectionName.trim());
                }
              }}
              className="p-1.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsAddingCollection(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Collections Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <SidebarSkeleton />
        ) : (
          <div className="space-y-1 animate-in fade-in duration-200">
            {filteredCollections.map((col) => {
          const isExpanded = expandedCollections[col.id] || !!search.trim();
          const isEditing = editingColId === col.id;

          // Direct requests belonging to collection without folder
          const rootRequests = (col.requests || []).filter((r) => !r.folderId);
          const colFolders = col.folders || [];

          return (
            <div key={col.id} className="rounded-xl overflow-hidden group/col">
              {/* Collection Header */}
              <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs transition-colors">
                <div
                  className="flex items-center space-x-1.5 flex-1 truncate"
                  onClick={() => toggleCollection(col.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      autoFocus
                      value={editColName}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setEditColName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateCollectionMutation.mutate({ id: col.id, name: editColName });
                        } else if (e.key === 'Escape') {
                          setEditingColId(null);
                        }
                      }}
                      className="px-1.5 py-0.5 text-xs rounded glass-input"
                    />
                  ) : (
                    <span className="font-semibold text-slate-200 truncate">{col.name}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 opacity-0 group-hover/col:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setAddingFolderToColId(col.id);
                      setExpandedCollections((p) => ({ ...p, [col.id]: true }));
                    }}
                    className="p-1 text-slate-400 hover:text-amber-300 hover:bg-white/5 rounded"
                    title="Add Folder"
                  >
                    <FolderPlus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingColId(col.id);
                      setEditColName(col.name);
                    }}
                    className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded"
                    title="Rename Collection"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete collection "${col.name}"?`)) {
                        deleteCollectionMutation.mutate(col.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Add Folder Inline Input */}
              {addingFolderToColId === col.id && (
                <div className="ml-6 mr-2 my-1 flex items-center space-x-1">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Folder name..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newFolderName.trim()) {
                        createFolderMutation.mutate({ colId: col.id, name: newFolderName.trim() });
                      } else if (e.key === 'Escape') {
                        setAddingFolderToColId(null);
                      }
                    }}
                    className="flex-1 px-2 py-0.5 text-xs rounded-lg glass-input"
                  />
                  <button
                    onClick={() => {
                      if (newFolderName.trim()) {
                        createFolderMutation.mutate({ colId: col.id, name: newFolderName.trim() });
                      }
                    }}
                    className="p-1 rounded bg-cyan-500 text-white"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setAddingFolderToColId(null)}
                    className="p-1 text-slate-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Expanded content: Folders & Requests */}
              {isExpanded && (
                <div className="ml-4 pl-2 border-l border-white/5 space-y-0.5 mt-0.5">
                  {/* Folders */}
                  {colFolders.map((folder) => {
                    const isFolderOpen = expandedFolders[folder.id] || !!search.trim();
                    const folderRequests = folder.requests || [];

                    return (
                      <div key={folder.id} className="group/folder">
                        <div
                          className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer text-xs"
                          onClick={() => toggleFolder(folder.id)}
                        >
                          <div className="flex items-center space-x-1.5 truncate">
                            {isFolderOpen ? (
                              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                            )}
                            <FolderIcon className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-slate-300 truncate">{folder.name}</span>
                          </div>
                          <div className="opacity-0 group-hover/folder:opacity-100 flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete folder "${folder.name}"?`)) {
                                  deleteFolderMutation.mutate({ colId: col.id, folderId: folder.id });
                                }
                              }}
                              className="p-0.5 text-slate-400 hover:text-rose-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Requests inside folder */}
                        {isFolderOpen && (
                          <div className="ml-4 pl-2 border-l border-white/5 space-y-0.5">
                            {folderRequests.map((req) => {
                              const isActive = activeRequest?.id === req.id;
                              return (
                                <div
                                  key={req.id}
                                  onClick={() => onSelectRequest(req)}
                                  className={`flex items-center justify-between px-2 py-1 rounded-lg text-xs cursor-pointer group/req transition-all ${
                                    isActive
                                      ? 'bg-cyan-500/15 text-cyan-300 font-medium'
                                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                  }`}
                                >
                                  <div className="flex items-center space-x-1.5 truncate">
                                    <span className={`text-[10px] font-mono shrink-0 ${getMethodBadge(req.method)}`}>
                                      {req.method}
                                    </span>
                                    <span className="truncate">{req.name}</span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm(`Delete request "${req.name}"?`)) {
                                        deleteRequestMutation.mutate(req.id);
                                      }
                                    }}
                                    className="opacity-0 group-hover/req:opacity-100 p-0.5 text-slate-500 hover:text-rose-400"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })}
                            {folderRequests.length === 0 && (
                              <div className="text-[11px] text-slate-600 px-2 py-0.5 italic">
                                Empty folder
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Direct Requests (No folder) */}
                  {rootRequests.map((req) => {
                    const isActive = activeRequest?.id === req.id;
                    return (
                      <div
                        key={req.id}
                        onClick={() => onSelectRequest(req)}
                        className={`flex items-center justify-between px-2 py-1 rounded-lg text-xs cursor-pointer group/req transition-all ${
                          isActive
                            ? 'bg-cyan-500/15 text-cyan-300 font-medium'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className={`text-[10px] font-mono shrink-0 ${getMethodBadge(req.method)}`}>
                            {req.method}
                          </span>
                          <span className="truncate">{req.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete request "${req.name}"?`)) {
                              deleteRequestMutation.mutate(req.id);
                            }
                          }}
                          className="opacity-0 group-hover/req:opacity-100 p-0.5 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}

                  {colFolders.length === 0 && rootRequests.length === 0 && (
                    <div className="text-[11px] text-slate-600 px-2 py-1 italic">
                      No requests yet. Click Save to add requests.
                    </div>
                  )}
                </div>
              )}
            </div>
              );
            })}

            {filteredCollections.length === 0 && (
              <div className="text-center py-10 px-4 text-slate-500 space-y-2">
                <Layers className="w-8 h-8 opacity-30 mx-auto" />
                <p className="text-xs">No collections found</p>
                <button
                  onClick={() => setIsAddingCollection(true)}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  + Create your first collection
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-white/10 glass-panel-subtle flex items-center justify-between text-xs">
        <button
          onClick={onOpenEnvModal}
          className="flex items-center space-x-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Environments</span>
        </button>

        <span className="text-[10px] text-slate-500 font-mono">v1.0.0</span>
      </div>
    </aside>
  );
};
