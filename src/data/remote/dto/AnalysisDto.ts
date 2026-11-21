import { MessageType, ScanSource, Status } from '../../../domain/model/Models';

export interface AnalysisRequest {
  text: string;
  type: MessageType;
  source?: ScanSource | null;
  sender?: string | null;
  subject?: string | null;
  links?: string[];
  locale?: string;
}

export interface HighlightDto {
  start: number;
  end: number;
}

export interface ReasonDto {
  code: string;
  message: string;
  highlight?: HighlightDto | null;
}

export interface AnalysisResponse {
  status: Status;
  risk_score: number;
  reasons: ReasonDto[];
  advice: string;
  model_version: string;
}
