import { AnalysisInput, AnalysisResult, Reason } from '../../domain/model/Models';
import { AnalysisRequest, AnalysisResponse, ReasonDto } from '../remote/dto/AnalysisDto';

const URL_REGEX = /https?:\/\/\S+/g;

export function toRequest(input: AnalysisInput): AnalysisRequest {
  const detectedLinks = input.text.match(URL_REGEX) ?? [];
  return {
    text: input.text,
    type: input.type,
    source: input.source,
    sender: input.sender ?? null,
    subject: input.subject ?? null,
    links: input.links && input.links.length > 0 ? input.links : detectedLinks,
    locale: input.locale ?? 'ro',
  };
}

export function toDomainReason(dto: ReasonDto): Reason {
  return {
    code: dto.code,
    message: dto.message,
    highlight: dto.highlight ? { start: dto.highlight.start, end: dto.highlight.end } : null,
  };
}

export function toDomainResult(dto: AnalysisResponse): AnalysisResult {
  return {
    status: dto.status ?? 'UNKNOWN',
    riskScore: Math.max(0, Math.min(1, dto.risk_score ?? 0)),
    reasons: (dto.reasons ?? []).map(toDomainReason),
    advice: dto.advice ?? '',
    modelVersion: dto.model_version ?? '',
  };
}
