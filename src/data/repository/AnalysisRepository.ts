import { AnalysisError, AnalysisInput, AnalysisResult } from '../../domain/model/Models';
import { toDomainResult, toRequest } from '../mapper/AnalysisMapper';
import { AnalysisApi } from '../remote/AnalysisApi';

export interface AnalysisRepository {
  analyze(input: AnalysisInput): Promise<AnalysisResult>;
}

export class AnalysisRepositoryImpl implements AnalysisRepository {
  constructor(private readonly api: AnalysisApi) { }

  async analyze(input: AnalysisInput): Promise<AnalysisResult> {
    try {
      const response = await this.api.analyze(toRequest(input));
      return toDomainResult(response);
    } catch (e: unknown) {
      const err = e as { status?: number; message?: string };
      if (err.status === 400) throw AnalysisError.badRequest(err.message || 'Cerere invalida');
      if (err.status === 413) throw AnalysisError.tooLarge();
      if (err.status === 429) throw AnalysisError.rateLimited();
      if (err.status && err.status >= 500) throw AnalysisError.server();
      if (err.message?.includes('Network request failed')) throw AnalysisError.network();
      throw AnalysisError.unknown(err.message);
    }
  }
}
