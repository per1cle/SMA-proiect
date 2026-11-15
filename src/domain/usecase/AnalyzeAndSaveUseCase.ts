import { AnalysisInput, ScanEntry } from '../model/Models';
import { AnalysisRepository } from '../../data/repository/AnalysisRepository';
import { ScanHistoryRepository } from '../../data/repository/ScanHistoryRepository';

/** Analizeaza un mesaj si salveaza automat rezultatul in istoric. */
export class AnalyzeAndSaveUseCase {
  constructor(
    private readonly analysisRepo: AnalysisRepository,
    private readonly historyRepo: ScanHistoryRepository
  ) {}

  async execute(input: AnalysisInput, saveText = true): Promise<ScanEntry> {
    const result = await this.analysisRepo.analyze(input);
    const entry: ScanEntry = {
      id: 0,
      text: saveText ? input.text : null,
      type: input.type,
      source: input.source,
      sender: input.sender ?? null,
      subject: input.subject ?? null,
      result,
      note: '',
      reported: false,
      falsePositive: false,
      createdAt: Date.now(),
    };
    const id = await this.historyRepo.add(entry);
    return { ...entry, id };
  }
}
