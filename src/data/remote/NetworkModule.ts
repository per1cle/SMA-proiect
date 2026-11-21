import { AnalysisApi, RealAnalysisApi } from './AnalysisApi';
import { MockAnalysisApi } from './MockAnalysisApi';

// 10.0.2.2 = calculatorul gazda vazut din emulatorul Android
export const BASE_URL = 'http://10.0.2.2:8000/';

/** true = mock local; false = backend FastAPI real */
export const USE_MOCK = true;

export const analysisApi: AnalysisApi = USE_MOCK
  ? new MockAnalysisApi()
  : new RealAnalysisApi(BASE_URL);
