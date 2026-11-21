export type MessageType = 'SMS' | 'EMAIL';

export const MESSAGE_TYPES: MessageType[] = ['SMS', 'EMAIL'];

export type Status = 'SAFE' | 'SUSPICIOUS' | 'DANGER' | 'UNKNOWN';

export type ScanSource = 'PASTE' | 'SCREENSHOT' | 'OVERLAY' | 'SMS_AUTO' | 'SHARE';

export interface TextRange {
  start: number;
  end: number;
}

export interface Reason {
  code: string;
  message: string;
  highlight?: TextRange | null;
}

export interface AnalysisResult {
  status: Status;
  riskScore: number;
  reasons: Reason[];
  advice: string;
  modelVersion: string;
}

export interface AnalysisInput {
  text: string;
  type: MessageType;
  source: ScanSource;
  sender?: string | null;
  subject?: string | null;
  links?: string[];
  locale?: string;
}

export interface ScanEntry {
  id: number;
  text: string | null;
  type: MessageType;
  source: ScanSource;
  sender?: string | null;
  subject?: string | null;
  result: AnalysisResult;
  note: string;
  reported: boolean;
  falsePositive: boolean;
  createdAt: number;
}

export class AnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalysisError';
  }

  static network() {
    return new AnalysisError('Fara conexiune la internet');
  }
  static badRequest(msg: string) {
    return new AnalysisError(msg);
  }
  static tooLarge() {
    return new AnalysisError('Mesajul este prea lung');
  }
  static rateLimited() {
    return new AnalysisError('Prea multe cereri, incearca mai tarziu');
  }
  static server() {
    return new AnalysisError('Eroare de server');
  }
  static unknown(msg = 'Eroare necunoscuta') {
    return new AnalysisError(msg);
  }
}
