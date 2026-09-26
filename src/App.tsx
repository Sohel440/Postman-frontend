import React, { useState, useRef, useCallback, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EnvProvider, useEnv } from './context/EnvContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { RequestBar } from './components/request/RequestBar';
import { RequestTabs } from './components/request/RequestTabs';
import { ResponsePanel } from './components/response/ResponsePanel';
import { SaveModal } from './components/request/SaveModal';
import { AuthModal } from './components/auth/AuthModal';
import { EnvironmentModal } from './components/environment/EnvironmentModal';
import { HomePage } from './components/home/HomePage';
import { collectionApi } from './api/collection.api';
import { requestApi } from './api/request.api';
import type { ApiRequest, ExecutionResponse, KeyValuePair, RequestAuth } from './types';
import { AlertCircle, CheckCircle2, GripHorizontal } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const defaultRequest: Partial<ApiRequest> = {
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  name: 'New Request',
};

// Route parser supporting both pathname (/workspace, /) and hash (#/workspace, #workspace)
const getRouteFromUrl = (): 'home' | 'workspace' => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path.startsWith('/workspace') || hash.startsWith('#/workspace') || hash === '#workspace') {
    return 'workspace';
  }
  return 'home';
};

const Workspace: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { interpolate } = useEnv();

  // Navigation route: 'home' (Overview page at /) or 'workspace' (API Client Workspace at /workspace)
  const [currentView, setCurrentView] = useState<'home' | 'workspace'>(getRouteFromUrl);

  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentView(getRouteFromUrl());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleNavigate = useCallback((view: 'home' | 'workspace') => {
    const targetPath = view === 'workspace' ? '/workspace' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ view }, '', targetPath);
    }
    setCurrentView(view);
  }, []);

  // Update browser document title based on route
  useEffect(() => {
    document.title = currentView === 'workspace' 
      ? 'PostFlow - API Workspace' 
      : 'PostFlow - Home & Product Overview';
  }, [currentView]);

  // Active request state
  const [activeRequest, setActiveRequest] = useState<Partial<ApiRequest>>(defaultRequest);
  const [method, setMethod] = useState<string>(defaultRequest.method || 'GET');
  const [url, setUrl] = useState<string>(defaultRequest.url || '');
  const [queryParams, setQueryParams] = useState<KeyValuePair[]>([
    { id: '1', key: '', value: '', enabled: true },
  ]);
  const [headers, setHeaders] = useState<KeyValuePair[]>([
    { id: '1', key: 'Accept', value: 'application/json', enabled: true },
  ]);
  const [auth, setAuth] = useState<RequestAuth>({ type: 'none', token: '' });
  const [body, setBody] = useState<string>('{\n  \n}');

  // Execution & Response state
  const [executionResponse, setExecutionResponse] = useState<ExecutionResponse | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Modals state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Query Collections
  const { data: collectionsData, isLoading: isCollectionsLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => collectionApi.getAll(),
    enabled: isAuthenticated,
  });

  const collections = collectionsData?.data || [];

  // Stretchable/Resizable Response Section State
  const [responseHeightPercent, setResponseHeightPercent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('postman_response_height_pct');
      if (saved) {
        const num = parseFloat(saved);
        if (!isNaN(num) && num >= 15 && num <= 85) return num;
      }
    } catch {
      // ignore
    }
    return 50;
  });
  const [isDraggingResizer, setIsDraggingResizer] = useState(false);
  const splitPaneRef = useRef<HTMLDivElement>(null);

  const handlePointerDownResizer = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingResizer(true);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!splitPaneRef.current) return;
      const rect = splitPaneRef.current.getBoundingClientRect();
      const pointerY = moveEvent.clientY;
      const newResponsePct = ((rect.bottom - pointerY) / rect.height) * 100;
      const clamped = Math.min(Math.max(newResponsePct, 15), 85);
      setResponseHeightPercent(clamped);
      try {
        localStorage.setItem('postman_response_height_pct', clamped.toFixed(1));
      } catch {
        // ignore
      }
    };

    const onPointerUp = () => {
      setIsDraggingResizer(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }, []);

  const handleResetResizer = useCallback(() => {
    setResponseHeightPercent(50);
    try {
      localStorage.setItem('postman_response_height_pct', '50');
    } catch {
      // ignore
    }
  }, []);

  // Handle switching to a saved request
  const handleSelectRequest = (req: ApiRequest) => {
    setActiveRequest(req);
    setMethod(req.method || 'GET');
    setUrl(req.url || '');

    // Convert queryParams JSON
    if (req.queryParams && typeof req.queryParams === 'object') {
      const qp: KeyValuePair[] = Object.entries(req.queryParams).map(([key, val], idx) => ({
        id: `qp-${idx}`,
        key,
        value: String(val),
        enabled: true,
      }));
      setQueryParams(qp.length > 0 ? qp : [{ id: '1', key: '', value: '', enabled: true }]);
    } else {
      setQueryParams([{ id: '1', key: '', value: '', enabled: true }]);
    }

    // Convert headers JSON
    if (req.headers && typeof req.headers === 'object') {
      const hdrs: KeyValuePair[] = Object.entries(req.headers).map(([key, val], idx) => ({
        id: `h-${idx}`,
        key,
        value: String(val),
        enabled: true,
      }));
      setHeaders(hdrs.length > 0 ? hdrs : [{ id: '1', key: 'Accept', value: 'application/json', enabled: true }]);
    } else {
      setHeaders([{ id: '1', key: 'Accept', value: 'application/json', enabled: true }]);
    }

    // Convert auth JSON
    if (req.authorization && typeof req.authorization === 'object') {
      setAuth(req.authorization);
    } else {
      setAuth({ type: 'none', token: '' });
    }

    // Convert body
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'object') {
        setBody(JSON.stringify(req.body, null, 2));
      } else {
        setBody(String(req.body));
      }
    } else {
      setBody('{\n  \n}');
    }

    setExecutionResponse(null);
  };

  // Start new blank request
  const handleNewRequest = () => {
    setActiveRequest(defaultRequest);
    setMethod('GET');
    setUrl('');
    setQueryParams([{ id: '1', key: '', value: '', enabled: true }]);
    setHeaders([{ id: '1', key: 'Accept', value: 'application/json', enabled: true }]);
    setAuth({ type: 'none', token: '' });
    setBody('{\n  \n}');
    setExecutionResponse(null);
  };

  // Send request execution
  const handleSend = async () => {
    if (!url.trim()) {
      showToast('Please enter a target URL', 'error');
      return;
    }

    setIsExecuting(true);
    try {
      // 1. Interpolate variables from active environment
      let finalUrl = interpolate(url.trim());

      // 2. Prepare query params
      const qpObj: Record<string, string> = {};
      queryParams.forEach((p) => {
        if (p.enabled && p.key.trim()) {
          qpObj[interpolate(p.key.trim())] = interpolate(p.value);
        }
      });

      // 3. Prepare headers
      const hdrsObj: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.enabled && h.key.trim()) {
          hdrsObj[interpolate(h.key.trim())] = interpolate(h.value);
        }
      });

      // 4. Prepare auth
      let authPayload: RequestAuth | undefined = undefined;
      if (auth.type === 'Bearer' && auth.token) {
        authPayload = {
          type: 'Bearer',
          token: interpolate(auth.token),
        };
      }

      // 5. Prepare body
      let parsedBody: any = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body.trim()) {
        try {
          parsedBody = JSON.parse(interpolate(body));
        } catch {
          parsedBody = interpolate(body);
        }
      }

      // Dispatch request execution via backend
      let result;
      if (isAuthenticated) {
        // Execute via backend execute API
        result = await requestApi.executeUnsaved({
          method,
          url: finalUrl,
          queryParams: Object.keys(qpObj).length > 0 ? qpObj : undefined,
          headers: Object.keys(hdrsObj).length > 0 ? hdrsObj : undefined,
          authorization: authPayload,
          body: parsedBody,
        });

        const executionData = result.data?.data || result.data;
        setExecutionResponse(executionData);
        showToast(`Completed with status ${executionData.status}`, executionData.status < 400 ? 'success' : 'error');
      } else {
        // Direct browser fetch if not signed into backend
        const startTime = Date.now();
        const requestHeaders = new Headers(hdrsObj);
        if (authPayload?.token) {
          requestHeaders.set('Authorization', `Bearer ${authPayload.token}`);
        }
        if (parsedBody && !requestHeaders.has('Content-Type')) {
          requestHeaders.set('Content-Type', 'application/json');
        }

        const urlObj = new URL(finalUrl);
        Object.entries(qpObj).forEach(([k, v]) => urlObj.searchParams.append(k, v));

        const res = await fetch(urlObj.toString(), {
          method,
          headers: requestHeaders,
          body: ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())
            ? typeof parsedBody === 'string'
              ? parsedBody
              : JSON.stringify(parsedBody)
            : undefined,
        });

        const responseTime = Date.now() - startTime;
        const resHeaders: Record<string, string> = {};
        res.headers.forEach((val, key) => {
          resHeaders[key] = val;
        });

        let resData: any = null;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          resData = await res.json();
        } else {
          resData = await res.text();
        }

        const size = new Blob([typeof resData === 'object' ? JSON.stringify(resData) : resData]).size;

        const execResult: ExecutionResponse = {
          status: res.status,
          statusText: res.statusText,
          responseTime,
          responseSize: size,
          headers: resHeaders,
          body: resData,
        };

        setExecutionResponse(execResult);
        showToast(`Completed with status ${res.status}`, res.status < 400 ? 'success' : 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Request failed to execute', 'error');
      setExecutionResponse({
        status: 0,
        statusText: 'Failed',
        responseTime: 0,
        responseSize: 0,
        headers: {},
        body: { error: err.message || 'Failed to dispatch request' },
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleOpenSaveModal = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to save requests into collections', 'error');
      setIsAuthModalOpen(true);
      return;
    }
    setIsSaveModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#070a13] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient background glows */}
      <div className="fixed top-0 -left-40 w-96 h-96 glow-blob-1 pointer-events-none rounded-full blur-3xl opacity-60 z-0" />
      <div className="fixed bottom-0 -right-40 w-96 h-96 glow-blob-2 pointer-events-none rounded-full blur-3xl opacity-50 z-0" />

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenEnvModal={() => setIsEnvModalOpen(true)}
      />

      {/* Main Content: HomePage (Home route /) or API Client Workspace (/workspace) */}
      {currentView === 'home' ? (
        <HomePage
          onLaunchWorkspace={() => handleNavigate('workspace')}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      ) : (
        <div className="flex flex-1 overflow-hidden relative z-10">
          {/* Sidebar */}
          <Sidebar
            collections={collections}
            activeRequest={activeRequest}
            isLoading={isCollectionsLoading}
            onSelectRequest={handleSelectRequest}
            onNewRequest={handleNewRequest}
            onOpenEnvModal={() => setIsEnvModalOpen(true)}
          />

          {/* Center Workspace */}
          <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0f1d]/60 backdrop-blur-md">
            {/* Active Request title bar */}
            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-300">
                  {activeRequest.name || 'Untitled Request'}
                </span>
                {activeRequest.id && (
                  <span className="text-[10px] px-2 py-0.2 rounded-md bg-white/5 border border-white/10 text-slate-400 font-mono">
                    Saved
                  </span>
                )}
              </div>
              {!isAuthenticated && (
                <span className="text-[11px] text-amber-400/90 flex items-center space-x-1">
                  <span>Guest Mode (Requests execute directly)</span>
                </span>
              )}
            </div>

            {/* Request Bar */}
            <RequestBar
              method={method}
              onMethodChange={setMethod}
              url={url}
              onUrlChange={setUrl}
              onSend={handleSend}
              onSave={handleOpenSaveModal}
              isExecuting={isExecuting}
            />

            {/* Workspace Split Layout: Stretchable/Resizable Request & Response Panels */}
            <div
              ref={splitPaneRef}
              className={`flex-1 flex flex-col overflow-hidden relative ${
                isDraggingResizer ? 'select-none cursor-row-resize' : ''
              }`}
            >
              {/* Upper: Request Editor */}
              <div
                style={{ height: `${100 - responseHeightPercent}%` }}
                className="overflow-hidden min-h-0 flex flex-col"
              >
                <RequestTabs
                  queryParams={queryParams}
                  onQueryParamsChange={setQueryParams}
                  headers={headers}
                  onHeadersChange={setHeaders}
                  auth={auth}
                  onAuthChange={setAuth}
                  body={body}
                  onBodyChange={setBody}
                />
              </div>

              {/* Draggable Resizer Divider Bar */}
              <div
                onPointerDown={handlePointerDownResizer}
                onDoubleClick={handleResetResizer}
                title="Drag to resize response panel (Double click to reset 50%)"
                className={`h-2.5 w-full flex items-center justify-center cursor-row-resize transition-colors relative z-20 group shrink-0 ${
                  isDraggingResizer
                    ? 'bg-cyan-500/20'
                    : 'hover:bg-cyan-500/15'
                }`}
              >
                {/* Horizontal line divider */}
                <div
                  className={`w-full h-px transition-colors ${
                    isDraggingResizer
                      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                      : 'bg-white/10 group-hover:bg-cyan-400/60'
                  }`}
                />

                {/* Center Grip Handle */}
                <div
                  className={`absolute px-2.5 py-0.5 rounded-full border text-[10px] flex items-center space-x-1 transition-all ${
                    isDraggingResizer
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-lg scale-105'
                      : 'bg-[#0f172a] border-white/15 text-slate-400 group-hover:border-cyan-400/50 group-hover:text-cyan-300'
                  }`}
                >
                  <GripHorizontal className="w-3 h-3" />
                  <span className="hidden group-hover:inline text-[9px] font-mono tracking-tight select-none">
                    {Math.round(responseHeightPercent)}%
                  </span>
                </div>
              </div>

              {/* Lower: Response Viewer */}
              <div
                style={{ height: `${responseHeightPercent}%` }}
                className="overflow-hidden bg-[#070b16]/70 flex flex-col min-h-0 relative"
              >
                <ResponsePanel response={executionResponse} loading={isExecuting} />
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <EnvironmentModal isOpen={isEnvModalOpen} onClose={() => setIsEnvModalOpen(false)} />

      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        collections={collections}
        requestData={{
          id: activeRequest.id,
          name: activeRequest.name || 'New Request',
          method,
          url,
          queryParams: queryParams.reduce((acc, p) => {
            if (p.enabled && p.key.trim()) acc[p.key.trim()] = p.value;
            return acc;
          }, {} as Record<string, string>),
          headers: headers.reduce((acc, h) => {
            if (h.enabled && h.key.trim()) acc[h.key.trim()] = h.value;
            return acc;
          }, {} as Record<string, string>),
          authorization: auth,
          body: body.trim() ? (() => {
            try { return JSON.parse(body); } catch { return body; }
          })() : undefined,
          collectionId: activeRequest.collectionId,
          folderId: activeRequest.folderId,
        }}
        onSaved={(savedReq) => {
          setActiveRequest(savedReq);
          showToast('Request saved successfully');
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl text-xs font-medium border shadow-2xl flex items-center space-x-2 animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EnvProvider>
          <Workspace />
        </EnvProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
