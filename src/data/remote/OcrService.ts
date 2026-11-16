import { BASE_URL, USE_MOCK } from './NetworkModule';

export interface OcrResult {
  text: string;
}

export interface OcrService {
  extractText(base64Image: string, mimeType?: string): Promise<string>;
}

/**
 * Serviciu OCR care functioneaza in doua moduri:
 * - Cand USE_MOCK = false: trimite imaginea/screenshot-ul direct la backend-ul propriu (POST /v1/ocr)
 * - Cand USE_MOCK = true: extrage textul real din fotografie folosind OCR API (pentru testare fara backend pornit)
 */
class AppOcrService implements OcrService {
  async extractText(base64Image: string, mimeType = 'image/jpeg'): Promise<string> {
    if (!USE_MOCK) {
      return this.extractViaBackend(base64Image, mimeType);
    }
    return this.extractViaCloudOcr(base64Image, mimeType);
  }

  private async extractViaBackend(base64Image: string, mimeType: string): Promise<string> {
    const response = await fetch(`${BASE_URL.replace(/\/$/, '')}/v1/ocr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_base64: base64Image,
        mime_type: mimeType,
      }),
    });

    if (!response.ok) {
      throw new Error('Backend-ul nu a putut extrage textul din imagine.');
    }

    const data = (await response.json()) as OcrResult;
    return (data.text || '').trim();
  }

  private async extractViaCloudOcr(base64Image: string, mimeType: string): Promise<string> {
    const dataUri = `data:${mimeType};base64,${base64Image}`;
    const body = new URLSearchParams();
    body.append('apikey', 'helloworld');
    body.append('base64Image', dataUri);
    body.append('language', 'eng');
    body.append('isOverlayRequired', 'false');
    body.append('scale', 'true');
    body.append('OCREngine', '2');

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error('Serviciul OCR nu este disponibil momentan.');
    }

    const json = (await response.json()) as {
      IsErroredOnProcessing?: boolean;
      ErrorMessage?: string[] | string;
      ParsedResults?: Array<{ ParsedText?: string }>;
    };

    if (json.IsErroredOnProcessing) {
      const msg = Array.isArray(json.ErrorMessage)
        ? json.ErrorMessage.join(' ')
        : json.ErrorMessage || 'Eroare la procesarea imaginii.';
      throw new Error(msg);
    }

    const extracted = json.ParsedResults?.[0]?.ParsedText?.trim() ?? '';
    return extracted.replace(/\r\n/g, '\n').trim();
  }
}

export const ocrService: OcrService = new AppOcrService();
