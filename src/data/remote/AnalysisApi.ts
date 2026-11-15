import { AnalysisRequest, AnalysisResponse } from './dto/AnalysisDto';

export interface AnalysisApi {
  analyze(request: AnalysisRequest): Promise<AnalysisResponse>;
}

export class RealAnalysisApi implements AnalysisApi {
  constructor(private readonly baseUrl: string) {}

  async analyze(request: AnalysisRequest): Promise<AnalysisResponse> {
    const response = await fetch(`${this.baseUrl.replace(/\/$/, '')}/v1/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = new Error(response.statusText || 'HTTP Error') as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    return (await response.json()) as AnalysisResponse;
  }
}
