# Sisteme mobile si aplicatii (React Native / Expo)

Aplicatie mobila cross-platform (React Native + Expo + TypeScript) pentru detectarea tentativelor de phishing prin SMS/Email in limba romana (smishing), cu interfata accesibila ("Grandma Friendly Mode").

## Functionalitati & Arhitectura
- **3 Ecrane principale** (`@react-navigation/native-stack`):
  - `HomeScreen`: Scanare mesaj (lipire text sau captura foto/OCR prin `expo-image-picker`), selectie tip (`SMS` / `EMAIL`), comutator vibratii si card de verdict.
  - `HistoryScreen`: Istoric local cu filtrare dupa status (`SIGUR`, `SUSPECT`, `PERICOL`) si cautare dupa text/expeditor.
  - `DetailScreen`: Vizualizare detalii scanare, adaugare/editare notita, marcare `Raportat` / `Fals pozitiv` si stergere.
- **CRUD Local SQLite** (`expo-sqlite`): Tabel `scan_entries` gestionat prin `ScanDao` si `ScanHistoryRepository`.
- **Hardware**:
  - **Senzor**: Camera telefonului (`expo-image-picker`) pentru capturarea mesajelor suspecte.
  - **Actuator**: Motorul de vibratii (`Vibration` + `expo-haptics`) cu pattern-uri diferentiate pentru `SAFE`, `SUSPICIOUS` si `DANGER`.
- **Backend API**: Comunicare REST (`fetch`) cu backend Python FastAPI (`POST /v1/analyze`) + `MockAnalysisApi` preconfigurat pentru dezvoltare si testare.

## Rulare proiect
1. Instaleaza [Node.js LTS](https://nodejs.org/).
2. Instaleaza dependentele:
   ```bash
   npm install
   ```
3. Porneste serverul Expo:
   ```bash
   npx expo start
   ```
4. Scaneaza codul QR cu aplicatia **Expo Go** pe telefon sau apasa `a` pentru emulatorul Android.
