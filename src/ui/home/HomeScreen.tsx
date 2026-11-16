import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../context/AppContext';
import { ocrService } from '../../data/remote/OcrService';
import { MESSAGE_TYPES, MessageType, ScanSource } from '../../domain/model/Models';
import { ResultCard } from '../common/ResultCard';
import { RootStackParamList } from '../navigation/AppNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const {
    palette,
    analysisState,
    analyze,
    resetAnalysis,
    vibrationEnabled,
    setVibrationEnabled,
  } = useApp();

  const [text, setText] = useState('');
  const [sender, setSender] = useState('');
  const [type, setType] = useState<MessageType>('SMS');
  const [source, setSource] = useState<ScanSource>('PASTE');
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const isLoading = analysisState.status === 'loading';
  const canSubmit = text.trim().length > 0 && !isLoading && !ocrLoading;

  useEffect(() => {
    if (analysisState.status === 'success' || analysisState.status === 'error') {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [analysisState.status]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            resetAnalysis();
            navigation.navigate('History');
          }}
          style={[
            styles.headerHistoryBtn,
            {
              backgroundColor: palette.primarySoft,
              borderColor: palette.border,
            },
          ]}
          hitSlop={8}
        >
          <Text style={[styles.headerHistoryBtnText, { color: palette.chipSelectedText }]}>
            Istoric
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, resetAnalysis, palette]);

  const handleAnalyze = async () => {
    if (!canSubmit) return;
    Keyboard.dismiss();
    const trimmedText = text.trim();
    const trimmedSender = sender.trim();
    await analyze(
      {
        text: trimmedText,
        type,
        source,
        sender: trimmedSender.length > 0 ? trimmedSender : null,
      },
      true
    );
    setText('');
    setSender('');
    setSource('PASTE');
    setCapturedPhotoUri(null);
  };

  const handleScanImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permisiune necesara',
        'Permite accesul la camera pentru a fotografia mesajul suspect.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.4,
      base64: true,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];
    setCapturedPhotoUri(asset.uri);
    setSource('SCREENSHOT');

    if (!asset.base64) {
      Alert.alert('Eroare', 'Nu s-a putut citi imaginea capturata.');
      return;
    }

    setOcrLoading(true);
    try {
      const extractedText = await ocrService.extractText(
        asset.base64,
        asset.mimeType || 'image/jpeg'
      );
      if (extractedText.length > 0) {
        setText(extractedText);
      } else {
        Alert.alert(
          'Text neidentificat',
          'Nu am putut detecta text clar in fotografie. Incearca sa faci poza mai aproape de text.'
        );
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      Alert.alert(
        'Eroare OCR',
        e.message || 'Nu s-a putut extrage textul din imagine.'
      );
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.scrollView, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, { backgroundColor: palette.background }]}
        contentContainerStyle={[styles.container, { backgroundColor: palette.background }]}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.innerContent}>
            {/* Header / Subtitlu explicativ */}
            <View style={styles.heroBox}>
              <Text style={[styles.heroTitle, { color: palette.textPrimary }]}>
                Verificare mesaje suspecte
              </Text>
              <Text style={[styles.heroSubtitle, { color: palette.textSecondary }]}>
                Lipeste textul primit sau scaneaza mesajul cu camera pentru a afla daca este sigur.
              </Text>
            </View>

            {/* Segmented Control: SMS / EMAIL */}
            <View
              style={[
                styles.segmentedControl,
                {
                  backgroundColor: palette.isDark ? palette.surface : '#E2E8F0',
                  borderColor: palette.border,
                },
              ]}
            >
              {MESSAGE_TYPES.map((item) => {
                const selected = type === item;
                return (
                  <Pressable
                    key={item}
                    onPress={() => {
                      Keyboard.dismiss();
                      setType(item);
                    }}
                    style={[
                      styles.segmentButton,
                      selected && [
                        styles.segmentButtonSelected,
                        {
                          backgroundColor: palette.isDark ? palette.primarySoft : palette.surface,
                        },
                      ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        { color: selected ? palette.chipSelectedText : palette.textSecondary },
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Card principal pentru input-uri */}
            <View
              style={[
                styles.formCard,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                },
              ]}
            >
              <View style={styles.labelRow}>
                <Text style={[styles.fieldLabel, { color: palette.textSecondary }]}>
                  Continut mesaj
                </Text>
                {(text.length > 0 || capturedPhotoUri) && (
                  <Pressable
                    onPress={() => {
                      setText('');
                      setSource('PASTE');
                      setCapturedPhotoUri(null);
                    }}
                    hitSlop={8}
                  >
                    <Text style={[styles.clearLink, { color: palette.chipSelectedText }]}>
                      Goleste
                    </Text>
                  </Pressable>
                )}
              </View>

              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: palette.surfaceSubtle,
                    borderColor: palette.border,
                    color: palette.textPrimary,
                  },
                ]}
                value={text}
                onChangeText={setText}
                placeholder="Lipeste aici mesajul primit..."
                placeholderTextColor={palette.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {capturedPhotoUri && (
                <View
                  style={[
                    styles.photoPreviewRow,
                    {
                      backgroundColor: palette.surfaceSubtle,
                      borderColor: palette.border,
                    },
                  ]}
                >
                  <Image source={{ uri: capturedPhotoUri }} style={styles.photoThumb} />
                  <View style={styles.photoInfo}>
                    <Text style={[styles.photoInfoTitle, { color: palette.textPrimary }]}>
                      Imagine capturata cu camera
                    </Text>
                    <Text style={[styles.photoInfoSubtitle, { color: palette.textSecondary }]}>
                      {ocrLoading
                        ? 'Se extrage textul din fotografie...'
                        : 'Textul extras a fost completat mai sus'}
                    </Text>
                  </View>
                  {ocrLoading && <ActivityIndicator size="small" color={palette.primary} />}
                </View>
              )}

              <Text style={[styles.fieldLabel, { color: palette.textSecondary }]}>
                Expeditor (optional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: palette.surfaceSubtle,
                    borderColor: palette.border,
                    color: palette.textPrimary,
                  },
                ]}
                value={sender}
                onChangeText={setSender}
                placeholder="Ex: +40722... sau nume companie"
                placeholderTextColor={palette.textSecondary}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              {/* Buton Camera / OCR (Senzor) */}
              <Pressable
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor: palette.primarySoft,
                    borderColor: palette.border,
                    opacity: ocrLoading ? 0.6 : 1,
                  },
                ]}
                disabled={ocrLoading}
                onPress={() => {
                  Keyboard.dismiss();
                  handleScanImage();
                }}
              >
                <Text style={[styles.secondaryButtonText, { color: palette.chipSelectedText }]}>
                  {ocrLoading ? 'Se proceseaza imaginea...' : 'Scaneaza cu camera (OCR)'}
                </Text>
              </Pressable>
            </View>

            {/* Mini-card Toggle vibratie (Actuator) */}
            <View
              style={[
                styles.settingCard,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                },
              ]}
            >
              <View style={styles.settingTextGroup}>
                <Text style={[styles.switchLabel, { color: palette.textPrimary }]}>
                  Vibratie la verdict
                </Text>
                <Text style={[styles.switchSubLabel, { color: palette.textSecondary }]}>
                  Avertizare tactila in functie de nivelul de risc
                </Text>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: palette.switchTrackOff, true: palette.switchTrackOn }}
                thumbColor={vibrationEnabled ? palette.switchThumbOn : palette.switchThumbOff}
              />
            </View>

            {/* Buton principal verificare */}
            <Pressable
              style={[
                styles.primaryButton,
                {
                  backgroundColor: canSubmit ? palette.primary : palette.buttonDisabledBg,
                  shadowOpacity: canSubmit && !palette.isDark ? 0.25 : 0,
                },
              ]}
              onPress={handleAnalyze}
              disabled={!canSubmit}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  {
                    color: canSubmit ? '#FFFFFF' : palette.buttonDisabledText,
                  },
                ]}
              >
                Verifica mesajul
              </Text>
            </Pressable>

            {/* Rezultat / Loading / Eroare */}
            {analysisState.status === 'loading' && (
              <ActivityIndicator size="large" color={palette.primary} style={styles.loader} />
            )}
            {analysisState.status === 'success' && (
              <ResultCard result={analysisState.entry.result} />
            )}
            {analysisState.status === 'error' && (
              <View
                style={[
                  styles.errorCard,
                  {
                    backgroundColor: palette.isDark ? '#3F1114' : '#FEF2F2',
                    borderColor: palette.error,
                  },
                ]}
              >
                <Text style={[styles.errorText, { color: palette.error }]}>
                  {analysisState.message}
                </Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 18,
    paddingBottom: 40,
    flexGrow: 1,
  },
  innerContent: {
    gap: 16,
    flexGrow: 1,
  },
  heroBox: {
    gap: 4,
    paddingHorizontal: 2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 21,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 4,
    borderWidth: 1,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonSelected: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  formCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  textArea: {
    minHeight: 125,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 17,
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
  },
  photoPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  photoThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
  },
  photoInfo: {
    flex: 1,
    gap: 2,
  },
  photoInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  photoInfoSubtitle: {
    fontSize: 13,
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 2,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  settingTextGroup: {
    flex: 1,
    paddingRight: 12,
    gap: 2,
  },
  switchLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
  switchSubLabel: {
    fontSize: 13,
  },
  primaryButton: {
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  loader: {
    marginVertical: 12,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerHistoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  headerHistoryBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
