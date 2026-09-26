import React, { useState, useEffect } from 'react';
import type { Collection, Folder } from '../../types';
import { collectionApi } from '../../api/collection.api';
import { requestApi } from '../../api/request.api';
import { useQueryClient } from '@tanstack/react-query';
import { X, BookmarkPlus, Folder as FolderIcon, Layers, Loader2 } from 'lucide-react';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  requestData: {
    id?: string;
    name: string;
    method: string;
    url: string;
    queryParams?: Record<string, string>;
    headers?: Record<string, string>;
    authorization?: any;
    body?: any;
    collectionId?: string;
    folderId?: string | null;
  };
  onSaved: (savedRequest: any) => void;
}

export const SaveModal: React.FC<SaveModalProps> = ({
  isOpen,
  onClose,
  collections,
  requestData,
  onSaved,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(requestData.name || 'Untitled Request');
  const [collectionId, setCollectionId] = useState(requestData.collectionId || '');
  const [folderId, setFolderId] = useState<string>(requestData.folderId || '');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(requestData.name || 'Untitled Request');
    if (collections.length > 0 && !collectionId) {
      setCollectionId(collections[0].id);
    }
  }, [isOpen, requestData, collections]);

  useEffect(() => {
    if (collectionId) {
      setLoadingFolders(true);
      collectionApi
        .getFolders(collectionId)
        .then((res) => {
          setFolders(res.data || []);
        })
        .catch(() => {
          setFolders([]);
        })
        .finally(() => {
          setLoadingFolders(false);
        });
    } else {
      setFolders([]);
    }
  }, [collectionId]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a request name');
      return;
    }
    if (!collectionId) {
      setError('Please select a collection to save to');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        method: requestData.method,
        url: requestData.url,
        collectionId,
        folderId: folderId || undefined,
        queryParams: requestData.queryParams,
        headers: requestData.headers,
        authorization: requestData.authorization,
        body: requestData.body,
      };

      let result;
      if (requestData.id) {
        result = await requestApi.update(requestData.id, payload);
      } else {
        result = await requestApi.create(payload);
      }

      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      onSaved(result.data);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save request');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel rounded-2xl p-6 shadow-2xl border border-white/10 text-white">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Save Request</h2>
              <p className="text-xs text-slate-400">Save to a collection for future testing</p>
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

        <form onSubmit={handleSave} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Request Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Get User Profile"
              className="w-full px-3 py-2 text-sm rounded-xl glass-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Collection</span>
            </label>
            <select
              value={collectionId}
              onChange={(e) => {
                setCollectionId(e.target.value);
                setFolderId('');
              }}
              className="w-full px-3 py-2 text-sm rounded-xl glass-input bg-[#0c1220] cursor-pointer"
            >
              {collections.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0c1220]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center space-x-1.5">
              <FolderIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Folder (Optional)</span>
            </label>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              disabled={loadingFolders || folders.length === 0}
              className="w-full px-3 py-2 text-sm rounded-xl glass-input bg-[#0c1220] cursor-pointer disabled:opacity-50"
            >
              <option value="" className="bg-[#0c1220]">
                Root of Collection
              </option>
              {folders.map((f) => (
                <option key={f.id} value={f.id} className="bg-[#0c1220]">
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Save Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
