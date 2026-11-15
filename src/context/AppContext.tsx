import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  analyzeAndSaveUseCase,
  hapticsService,
  historyRepository,
  settingsRepository,
} from '../di/AppContainer';
import { AnalysisInput, ScanEntry, Status } from '../domain/model/Models';

export type AnalysisUiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; entry: ScanEntry }
  | { status: 'error'; message: string };

interface AppContextValue {
  // Analysis state (echivalent AnalysisViewModel)
  analysisState: AnalysisUiState;
  vibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => Promise<void>;
  analyze: (input: AnalysisInput, saveText?: boolean) => Promise<void>;
  resetAnalysis: () => void;

  // History state (echivalent HistoryViewModel)
  entries: ScanEntry[];
  statusFilter: Status | null;
  setStatusFilter: (status: Status | null) => void;
  query: string;
  setQuery: (q: string) => void;
  refreshHistory: () => Promise<void>;
  getEntryById: (id: number) => Promise<ScanEntry | null>;
  setNote: (entry: ScanEntry, note: string) => Promise<ScanEntry>;
  toggleReported: (entry: ScanEntry) => Promise<ScanEntry>;
  toggleFalsePositive: (entry: ScanEntry) => Promise<ScanEntry>;
  deleteEntry: (id: number) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analysisState, setAnalysisState] = useState<AnalysisUiState>({ status: 'idle' });
  const [vibrationEnabled, setVibrationState] = useState<boolean>(true);

  const [entries, setEntries] = useState<ScanEntry[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    settingsRepository.getVibrationEnabled().then(setVibrationState);
  }, []);

  const refreshHistory = useCallback(async () => {
    try {
      const list = await historyRepository.search(statusFilter, query);
      setEntries(list);
    } catch {
      setEntries([]);
    }
  }, [statusFilter, query]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const setVibrationEnabled = useCallback(async (enabled: boolean) => {
    setVibrationState(enabled);
    await settingsRepository.setVibrationEnabled(enabled);
  }, []);

  const analyze = useCallback(
    async (input: AnalysisInput, saveText = true) => {
      setAnalysisState({ status: 'loading' });
      try {
        const savedEntry = await analyzeAndSaveUseCase.execute(input, saveText);
        setAnalysisState({ status: 'success', entry: savedEntry });
        if (vibrationEnabled) {
          hapticsService.signal(savedEntry.result.status);
        }
        await refreshHistory();
      } catch (e: unknown) {
        const err = e as { message?: string };
        setAnalysisState({
          status: 'error',
          message: err.message || 'Eroare necunoscuta',
        });
      }
    },
    [vibrationEnabled, refreshHistory]
  );

  const resetAnalysis = useCallback(() => {
    setAnalysisState({ status: 'idle' });
  }, []);

  const getEntryById = useCallback(async (id: number) => {
    return historyRepository.getById(id);
  }, []);

  const updateEntry = useCallback(
    async (updated: ScanEntry) => {
      await historyRepository.update(updated);
      await refreshHistory();
      return updated;
    },
    [refreshHistory]
  );

  const setNote = useCallback(
    async (entry: ScanEntry, note: string) => updateEntry({ ...entry, note }),
    [updateEntry]
  );

  const toggleReported = useCallback(
    async (entry: ScanEntry) => updateEntry({ ...entry, reported: !entry.reported }),
    [updateEntry]
  );

  const toggleFalsePositive = useCallback(
    async (entry: ScanEntry) => updateEntry({ ...entry, falsePositive: !entry.falsePositive }),
    [updateEntry]
  );

  const deleteEntry = useCallback(
    async (id: number) => {
      await historyRepository.delete(id);
      await refreshHistory();
    },
    [refreshHistory]
  );

  const clearHistory = useCallback(async () => {
    await historyRepository.clear();
    await refreshHistory();
  }, [refreshHistory]);

  return (
    <AppContext.Provider
      value={{
        analysisState,
        vibrationEnabled,
        setVibrationEnabled,
        analyze,
        resetAnalysis,
        entries,
        statusFilter,
        setStatusFilter,
        query,
        setQuery,
        refreshHistory,
        getEntryById,
        setNote,
        toggleReported,
        toggleFalsePositive,
        deleteEntry,
        clearHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp trebuie folosit in interiorul AppProvider');
  }
  return ctx;
}
