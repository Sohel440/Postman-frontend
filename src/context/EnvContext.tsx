import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Environment } from '../types';
import { useQuery } from '@tanstack/react-query';
import { environmentApi } from '../api/environment.api';
import { useAuth } from './AuthContext';

interface EnvContextType {
  environments: Environment[];
  activeEnvironmentId: string | null;
  activeEnvironment: Environment | null;
  setActiveEnvironmentId: (id: string | null) => void;
  interpolate: (text: string) => string;
  refetchEnvironments: () => void;
}

const EnvContext = createContext<EnvContextType | undefined>(undefined);

export const EnvProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activeEnvironmentId, setActiveEnvironmentId] = useState<string | null>(() => {
    return localStorage.getItem('postflow_active_env');
  });

  const { data, refetch: refetchEnvironments } = useQuery({
    queryKey: ['environments'],
    queryFn: () => environmentApi.getAll(),
    enabled: isAuthenticated,
  });

  const environments = useMemo(() => data?.data || [], [data]);

  const activeEnvironment = useMemo(() => {
    if (!activeEnvironmentId) return null;
    return environments.find((e) => e.id === activeEnvironmentId) || null;
  }, [activeEnvironmentId, environments]);

  useEffect(() => {
    if (activeEnvironmentId) {
      localStorage.setItem('postflow_active_env', activeEnvironmentId);
    } else {
      localStorage.removeItem('postflow_active_env');
    }
  }, [activeEnvironmentId]);

  // Replace {{varName}} with environment variable value
  const interpolate = (text: string): string => {
    if (!text || !activeEnvironment?.variables) return text;
    return text.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (match, varName) => {
      const vars = activeEnvironment.variables as Record<string, string>;
      if (vars && vars[varName] !== undefined) {
        return vars[varName];
      }
      return match;
    });
  };

  return (
    <EnvContext.Provider
      value={{
        environments,
        activeEnvironmentId,
        activeEnvironment,
        setActiveEnvironmentId,
        interpolate,
        refetchEnvironments,
      }}
    >
      {children}
    </EnvContext.Provider>
  );
};

export const useEnv = () => {
  const context = useContext(EnvContext);
  if (!context) {
    throw new Error('useEnv must be used within an EnvProvider');
  }
  return context;
};
