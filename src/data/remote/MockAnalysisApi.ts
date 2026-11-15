import { Status } from '../../domain/model/Models';
import { AnalysisApi } from './AnalysisApi';
import { AnalysisRequest, AnalysisResponse, ReasonDto } from './dto/AnalysisDto';

const URGENCY_KEYWORDS = ['urgent', 'imediat', 'blocat', 'suspendat'];
const SENSITIVE_KEYWORDS = ['parola', 'card', 'cod', 'iban'];

/** Implementare falsa a contractului; se inlocuieste cu API-ul FastAPI real cand exista backendul. */
export class MockAnalysisApi implements AnalysisApi {
  async analyze(request: AnalysisRequest): Promise<AnalysisResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lower = request.text.toLowerCase();
    const reasons: ReasonDto[] = [];

    const linkMatch = /https?:\/\/\S+/.exec(request.text);
    if (linkMatch && linkMatch.index !== undefined) {
      reasons.push({
        code: 'LINK',
        message: 'Mesajul contine un link',
        highlight: {
          start: linkMatch.index,
          end: linkMatch.index + linkMatch[0].length,
        },
      });
    }

    if (URGENCY_KEYWORDS.some((kw) => lower.includes(kw))) {
      reasons.push({
        code: 'URGENCY',
        message: 'Mesajul te grabeste sa actionezi',
      });
    }

    if (SENSITIVE_KEYWORDS.some((kw) => lower.includes(kw))) {
      reasons.push({
        code: 'SENSITIVE_DATA',
        message: 'Cere date personale sau financiare',
      });
    }

    const score = Math.min(1, reasons.length * 0.35);
    let status: Status = 'SAFE';
    if (score >= 0.7) {
      status = 'DANGER';
    } else if (score > 0) {
      status = 'SUSPICIOUS';
    }

    let advice = 'Mesajul pare in regula.';
    if (status === 'DANGER') {
      advice = 'Nu apasa pe link si nu raspunde. Sterge mesajul.';
    } else if (status === 'SUSPICIOUS') {
      advice = 'Fii atent. Verifica expeditorul inainte sa faci ceva.';
    }

    return {
      status,
      risk_score: score,
      reasons,
      advice,
      model_version: 'mock-1',
    };
  }
}
