import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../context/AppContext';
import { MESSAGE_TYPES, MessageType, ScanSource } from '../../domain/model/Models';
import { ResultCard } from '../common/ResultCard';
import { RootStackParamList } from '../navigation/AppNavigation';
import { Colors } from '../theme/Theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { analysisState, analyze, vibrationEnabled, setVibrationEnabled } = useApp();

  const [text, setText] = useState('');
  const [sender, setSender] = useState('');
  const [type, setType] = useState<MessageType>('SMS');
  const [source, setSource] = useState<ScanSource>('PASTE');
  const [saveText, setSaveText] = useState(true);

  const isLoading = analysisState.status === 'loading';
  const canSubmit = text.trim().length > 0 && !isLoading;

  const handleAnalyze = async () => {
    if (!canSubmit) return;
    const trimmedText = text.trim();
    const trimmedSender = sender.trim();
    await analyze(
      {
        text: trimmedText,
        type,
        source,
        sender: trimmedSender.length > 0 ? trimmedSender : null,
      },
      saveText
    );
    setText('');
    setSender('');
    setSource('PASTE');
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
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSource('SCREENSHOT');
      if (!text.trim()) {
        setText(
          'URGENT: Contul dvs. bancar a fost blocat. Accesati imediat https://banca-verifica-cont.ro pentru a introduce codul si parola.'
        );
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Selector tip mesaj: SMS / EMAIL */}
      <View style={styles.chipRow}>
        {MESSAGE_TYPES.map((item) => {
          const selected = type === item;
          return (
            <Pressable
              key={item}
              onPress={() => setType(item)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Input mesaj suspect */}
      <TextInput
        style={styles.textArea}
        value={text}
        onChangeText={setText}
        placeholder="Lipeste mesajul suspect"
        placeholderTextColor={Colors.textSecondary}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Input expeditor (optional) */}
      <TextInput
        style={styles.input}
        value={sender}
        onChangeText={setSender}
        placeholder="Expeditor (optional)"
        placeholderTextColor={Colors.textSecondary}
        singleLine
      />

      {/* Buton Camera / OCR (Senzor) */}
      <Pressable style={styles.outlinedButton} onPress={handleScanImage}>
        <Text style={styles.outlinedButtonText}>Scaneaza cu camera (OCR)</Text>
      </Pressable>

      {/* Chip pastrare text in istoric */}
      <View style={styles.chipRow}>
        <Pressable
          onPress={() => setSaveText((prev) => !prev)}
          style={[styles.chip, saveText && styles.chipSelected]}
        >
          <Text style={[styles.chipText, saveText && styles.chipTextSelected]}>
            {saveText ? '✓ ' : ''}Pastreaza textul in istoric
          </Text>
        </Pressable>
      </View>

      {/* Toggle vibratie (Actuator) */}
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Vibratie la verdict</Text>
        <Switch
          value={vibrationEnabled}
          onValueChange={setVibrationEnabled}
          trackColor={{ false: '#CAC4D0', true: '#90CAF9' }}
          thumbColor={vibrationEnabled ? Colors.primary : '#F4EFF4'}
        />
      </View>

      {/* Buton principal verificare */}
      <Pressable
        style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
        onPress={handleAnalyze}
        disabled={!canSubmit}
      >
        <Text style={styles.primaryButtonText}>Verifica mesajul</Text>
      </Pressable>

      {/* Rezultat / Loading / Eroare */}
      {analysisState.status === 'loading' && (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      )}
      {analysisState.status === 'success' && <ResultCard result={analysisState.entry.result} />}
      {analysisState.status === 'error' && (
        <Text style={styles.errorText}>{analysisState.message}</Text>
      )}

      {/* Navigare spre Istoric */}
      <Pressable
        style={styles.outlinedButton}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.outlinedButtonText}>Istoric</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
    backgroundColor: Colors.background,
    flexGrow: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    backgroundColor: Colors.chipSelectedBg,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chipTextSelected: {
    color: Colors.chipSelectedText,
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 18,
    color: Colors.textPrimary,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  outlinedButton: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  outlinedButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 12,
  },
  errorText: {
    color: Colors.error,
    fontSize: 18,
    fontWeight: '600',
  },
});
