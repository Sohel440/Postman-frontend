import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Layers,
  Globe,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Code2,
  Copy,
  Check,
  Cpu,
  Database,
  ChevronRight,
  Activity,
  Server
} from 'lucide-react';

interface HomePageProps {
  onLaunchWorkspace: () => void;
  onOpenAuth: () => void;
}

interface DemoPreset {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  body?: string;
  response: {
    status: number;
    statusText: string;
    time: number;
    size: string;
    data: any;
  };
}

const DEMO_PRESETS: DemoPreset[] = [
  {
    name: 'Fetch User Profile',
    method: 'GET',
    url: 'https://api.postflow.dev/v1/users/me',
    response: {
      status: 200,
      statusText: 'OK',
      time: 34,
      size: '1.24 KB',
      data: {
        id: 'usr_9821a7',
        name: 'Alex Johnson',
        role: 'Senior API Engineer',
        teams: ['Platform', 'Core-API'],
        workspace: {
          id: 'ws_prod_01',
          name: 'PostFlow Production',
          plan: 'Enterprise Cloud'
        },
        verified: true,
        lastActive: '2026-09-20T14:45:00Z'
      }
    }
  },
  {
    name: 'Create Payment Intent',
    method: 'POST',
    url: 'https://api.postflow.dev/v1/payments/charge',
    body: JSON.stringify(
      {
        amount: 4999,
        currency: 'USD',
        customer: 'cus_89412',
        paymentMethod: 'pm_card_visa'
      },
      null,
      2
    ),
    response: {
      status: 201,
      statusText: 'Created',
      time: 68,
      size: '890 B',
      data: {
        chargeId: 'ch_3N87xXkL992',
        status: 'succeeded',
        amount: 4999,
        currency: 'usd',
        receiptUrl: 'https://pay.postflow.dev/receipts/ch_3N87xXkL992'
      }
    }
  },
  {
    name: 'Interpolate Environment',
    method: 'GET',
    url: '{{baseUrl}}/api/collection/{{collectionId}}/folders',
    response: {
      status: 200,
      statusText: 'OK',
      time: 21,
      size: '1.65 KB',
      data: {
        interpolatedUrl: 'http://localhost:5000/api/collection/col_102/folders',
        environment: 'Local Development',
        folders: [
          { id: 'fld_auth', name: 'Authentication Module', requestCount: 4 },
          { id: 'fld_orders', name: 'Orders & Checkout', requestCount: 7 },
          { id: 'fld_webhooks', name: 'Stripe Webhooks', requestCount: 3 }
        ]
      }
    }
  }
];

export const HomePage: React.FC<HomePageProps> = ({ onLaunchWorkspace, onOpenAuth }) => {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoOutput, setDemoOutput] = useState<any>(DEMO_PRESETS[0].response);
  const [copied, setCopied] = useState(false);

  const currentPreset = DEMO_PRESETS[activePresetIndex];

  const handleRunDemo = () => {
    setIsDemoRunning(true);
    setTimeout(() => {
      setDemoOutput(currentPreset.response);
      setIsDemoRunning(false);
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(demoOutput.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#070a13] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-sky-500/15 to-purple-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel-subtle border border-cyan-500/30 text-cyan-300 text-xs font-medium tracking-wide shadow-lg shadow-cyan-500/10 animate-in fade-in slide-in-from-top-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next-Generation API Testing Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Build, Test & Master APIs with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              Glassmorphic Elegance
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            PostFlow combines high-velocity HTTP dispatch, real-time environment variable interpolation, nested collections, and instant JSON inspection into a sleek dark aesthetic.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onLaunchWorkspace}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center space-x-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Launch API Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuth}
              className="px-6 py-3.5 rounded-2xl glass-panel hover:bg-white/10 text-slate-200 hover:text-white font-medium text-sm transition-all border border-white/10 hover:border-white/20"
            >
              Sign In / Register
            </button>
          </div>

          {/* Metrics / Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl glass-card text-center space-y-1">
              <div className="text-2xl font-extrabold text-cyan-400 font-mono">0ms</div>
              <div className="text-xs text-slate-400">Zero-Latency Dispatch</div>
            </div>
            <div className="p-4 rounded-2xl glass-card text-center space-y-1">
              <div className="text-2xl font-extrabold text-indigo-400 font-mono">100%</div>
              <div className="text-xs text-slate-400">Postman API Compatible</div>
            </div>
            <div className="p-4 rounded-2xl glass-card text-center space-y-1">
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">{'{{env}}'}</div>
              <div className="text-xs text-slate-400">Dynamic Variable Engine</div>
            </div>
            <div className="p-4 rounded-2xl glass-card text-center space-y-1">
              <div className="text-2xl font-extrabold text-amber-400 font-mono">JWT</div>
              <div className="text-xs text-slate-400">Bearer Auth & Persistence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Product Demo Section */}
      <section className="px-6 py-16 bg-[#080d1a]/80 border-y border-white/5 relative">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>Interactive Product Demo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Test Drive PostFlow Right Now
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Select a sample endpoint below, run the simulated request, and observe the live status badges, response latency, and formatted JSON output.
            </p>
          </div>

          {/* Interactive Widget Box */}
          <div className="rounded-2xl glass-panel border border-white/10 shadow-2xl overflow-hidden">
            {/* Widget Tab Selector */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 p-3 bg-white/[0.02] gap-2">
              <div className="flex items-center space-x-2">
                {DEMO_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setActivePresetIndex(idx);
                      setDemoOutput(preset.response);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 ${
                      activePresetIndex === idx
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        preset.method === 'GET'
                          ? 'text-emerald-400'
                          : preset.method === 'POST'
                          ? 'text-amber-400'
                          : 'text-sky-400'
                      }`}
                    >
                      {preset.method}
                    </span>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Simulated Engine</span>
              </div>
            </div>

            {/* URL Input Bar in Demo */}
            <div className="p-3 border-b border-white/10 flex items-center space-x-2 bg-slate-950/40">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                  currentPreset.method === 'GET'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                }`}
              >
                {currentPreset.method}
              </span>

              <div className="flex-1 px-3 py-1.5 rounded-xl glass-input font-mono text-xs text-slate-200 truncate">
                {currentPreset.url}
              </div>

              <button
                onClick={handleRunDemo}
                disabled={isDemoRunning}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                {isDemoRunning ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>Send</span>
              </button>
            </div>

            {/* Demo Body & Response Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 min-h-[300px]">
              {/* Left Column: Request Payload */}
              <div className="p-4 flex flex-col space-y-2 bg-black/20">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Request Configuration</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">application/json</span>
                </div>

                <div className="flex-1 p-3 rounded-xl bg-[#090e1b] border border-white/5 font-mono text-xs overflow-auto">
                  {currentPreset.body ? (
                    <pre className="text-cyan-200/90 whitespace-pre-wrap">{currentPreset.body}</pre>
                  ) : (
                    <div className="text-slate-500 italic py-6 text-center">
                      No request body required for this HTTP {currentPreset.method} request.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Live Response */}
              <div className="p-4 flex flex-col space-y-2 bg-[#090d18]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                      {demoOutput.status} {demoOutput.statusText}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{demoOutput.time} ms</span>
                    <span className="text-slate-400 font-mono text-[11px]">{demoOutput.size}</span>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors text-[11px]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs overflow-auto max-h-[260px]">
                  <pre className="text-emerald-300/90 whitespace-pre-wrap">
                    {JSON.stringify(demoOutput.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Overview & Features Grid */}
      <section className="px-6 py-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Product Overview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Engineered for Modern API Engineering
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Every feature is designed with clean architecture, strict TypeScript safety, and a responsive glassmorphic aesthetic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl glass-panel hover:border-cyan-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Nested Collections & Folders</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organize complex microservice APIs into hierarchical Collections and Folders. Create, rename, and reorganize requests with instant backend synchronization.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl glass-panel hover:border-indigo-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Dynamic Environment Variables</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Switch between Local, Staging, and Production in one click. Variables like <code className="text-cyan-300">{'{{baseUrl}}'}</code> and <code className="text-cyan-300">{'{{token}}'}</code> auto-interpolate into URLs, headers, and body.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl glass-panel hover:border-purple-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">JWT Authentication & Profiles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built-in authentication flow with bcrypt password hashing and persistent JWT bearer tokens. Automatic auth header attachments for all protected endpoints.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl glass-panel hover:border-emerald-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Deep Latency & Size Metrics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitor network response times down to the millisecond alongside exact byte counts. Detect slow API bottlenecks and payload regressions immediately.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl glass-panel hover:border-amber-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Interactive Key-Value Editors</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Easily toggle query parameters, custom HTTP headers, and JSON request payloads with live validation badges and a one-click syntax formatting engine.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl glass-panel hover:border-sky-500/30 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Hybrid Execution Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Execute requests via the high-performance Express 5 Axios backend, or test directly in browser guest mode with zero setup or database dependencies required.
            </p>
          </div>
        </div>
      </section>

      {/* Backend & Architecture Overview */}
      <section className="px-6 py-16 bg-[#080d19]/90 border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Full Stack Technical Architecture</h2>
            <p className="text-xs sm:text-sm text-slate-400">Robust foundation designed for speed, security, and scalability</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Frontend Stack</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>React 19 + TypeScript (Strict)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Tailwind CSS + Glassmorphism Tokens</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>TanStack Query v5 for Async Cache</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Vite 6 Fast HMR Bundler</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Server className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Backend Engine</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Express 5 REST API Server</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Axios Live HTTP Execution Service</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>JWT + bcryptjs Password Security</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Strict Ownership Authorization</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center space-x-2 text-purple-400">
                <Database className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Database & ORM</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Prisma 7 ORM Client</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>PostgreSQL Database Architecture</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Cascading Deletes for Folders & Requests</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Audit History Logging Engine</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-6 py-16 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto p-8 rounded-3xl glass-panel border border-white/15 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl pointer-events-none" />
          
          <div className="relative space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Accelerate Your API Development?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Jump straight into the full-featured workspace to compose, test, and save collections.
            </p>
            <div className="pt-2">
              <button
                onClick={onLaunchWorkspace}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center space-x-2 mx-auto transition-transform hover:scale-105"
              >
                <span>Open PostFlow Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-white/5 text-center text-xs text-slate-500">
        <p>© 2026 PostFlow API Client. Built with React 19, TypeScript, Tailwind CSS & TanStack Query.</p>
      </footer>
    </div>
  );
};
