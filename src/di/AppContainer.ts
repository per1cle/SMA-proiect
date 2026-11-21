import { ScanDao } from '../data/local/ScanDao';
import { analysisApi } from '../data/remote/NetworkModule';
import { AnalysisRepositoryImpl } from '../data/repository/AnalysisRepository';
import { ScanHistoryRepositoryImpl } from '../data/repository/ScanHistoryRepository';
import { DeviceHaptics } from '../domain/feedback/Haptics';
import { AsyncStorageSettings } from '../domain/settings/SettingsRepository';
import { AnalyzeAndSaveUseCase } from '../domain/usecase/AnalyzeAndSaveUseCase';

const scanDao = new ScanDao();
export const historyRepository = new ScanHistoryRepositoryImpl(scanDao);
export const analysisRepository = new AnalysisRepositoryImpl(analysisApi);
export const analyzeAndSaveUseCase = new AnalyzeAndSaveUseCase(
  analysisRepository,
  historyRepository
);
export const hapticsService = new DeviceHaptics();
export const settingsRepository = new AsyncStorageSettings();
