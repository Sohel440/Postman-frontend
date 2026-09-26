import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEnv } from '../../context/EnvContext';
import { Globe, LogIn, LogOut, ChevronDown, Radio, Home, Terminal } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'workspace';
  onViewChange: (view: 'home' | 'workspace') => void;
  onOpenAuth: () => void;
  onOpenEnvModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenAuth,
  onOpenEnvModal,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { environments, activeEnvironment, setActiveEnvironmentId } = useEnv();
  const [showEnvDropdown, setShowEnvDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="h-14 border-b border-white/10 glass-panel sticky top-0 z-40 px-4 flex items-center justify-between">
      {/* Brand & Nav items */}
      <div className="flex items-center space-x-6">
        <div
          onClick={() => onViewChange('home')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <Radio className="w-4 h-4 text-white animate-pulse" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#070a13]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                POSTFLOW
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/5 border border-white/10 text-[9px] text-slate-400 font-mono">
                API CLIENT
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center space-x-1 p-1 rounded-xl glass-panel-subtle border border-white/10 text-xs">
          <button
            onClick={() => onViewChange('home')}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 font-medium transition-all ${
              currentView === 'home'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Home - Work Overview (/)"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onViewChange('workspace')}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 font-medium transition-all ${
              currentView === 'workspace'
                ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="API Client Workspace (/workspace)"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>
        </div>
      </div>

      {/* Middle & Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Environment Selector Dropdown */}
        <div className="relative">
          <div className="flex items-center rounded-xl glass-panel-subtle border border-white/10 p-1 text-xs">
            <button
              onClick={() => setShowEnvDropdown(!showEnvDropdown)}
              className="flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors text-slate-300 hover:text-white"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium">
                {activeEnvironment ? activeEnvironment.name : 'No Environment'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={onOpenEnvModal}
              className="px-2 py-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-md transition-colors"
              title="Manage Environments"
            >
              Manage
            </button>
          </div>

          {showEnvDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowEnvDropdown(false)}
              />
              <div
                className="absolute right-0 mt-2 w-56 bg-[#0b101d] rounded-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-1.5 text-xs text-white z-50 animate-in fade-in duration-150"
              >
                <div className="px-2.5 py-1.5 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Select Active Environment
                </div>

                <div
                  onClick={() => {
                    setActiveEnvironmentId(null);
                    setShowEnvDropdown(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    !activeEnvironment
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>No Environment</span>
                  {!activeEnvironment && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </div>

                {environments.map((env) => {
                  const isCurrent = activeEnvironment?.id === env.id;
                  return (
                    <div
                      key={env.id}
                      onClick={() => {
                        setActiveEnvironmentId(env.id);
                        setShowEnvDropdown(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">{env.name}</span>
                      {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </div>
                  );
                })}

                <div className="mt-1 pt-1 border-t border-white/10">
                  <button
                    onClick={() => {
                      setShowEnvDropdown(false);
                      onOpenEnvModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors flex items-center space-x-1.5"
                  >
                    <span>+ Manage Environments</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User profile / Auth button */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 p-1.5 rounded-xl glass-panel-subtle hover:bg-white/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block pr-1">
                <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[100px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[100px]">
                  {user.email}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserDropdown(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-52 bg-[#0b101d] rounded-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-1.5 text-xs text-white z-50 animate-in fade-in duration-150"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="font-semibold text-slate-200 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
