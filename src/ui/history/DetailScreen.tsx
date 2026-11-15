import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../context/AppContext';
import { ScanEntry } from '../../domain/model/Models';
import { ResultCard } from '../common/ResultCard';
import { RootStackParamList } from '../navigation/AppNavigation';
import { Colors } from '../theme/Theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const {
    getEntryById,
    setNote: saveEntryNote,
    toggleReported,
    toggleFalsePositive,
    deleteEntry,
  } = useApp();

  const [entry, setEntry] = useState<ScanEntry | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    getEntryById(id).then((found) => {
      setEntry(found);
      if (found) {
        setNoteInput(found.note);
      }
    });
  }, [id, getEntryById]);

  if (!entry) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nu exista intrarea.</Text>
      </View>
    );
  }

  const handleSaveNote = async () => {
    const updated = await saveEntryNote(entry, noteInput.trim());
    setEntry(updated);
    setNoteInput('');
    setSavedBanner(true);
  };

  const handleToggleReported = async () => {
    const updated = await toggleReported(entry);
    setEntry(updated);
  };

  const handleToggleFalsePositive = async () => {
    const updated = await toggleFalsePositive(entry);
    setEntry(updated);
  };

  const handleDelete = async () => {
    await deleteEntry(entry.id);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ResultCard result={entry.result} />

        <Text style={styles.sectionLabel}>
          Mesaj ({entry.type}, {entry.source}):
        </Text>
        <Text style={styles.messageText}>{entry.text ?? '(text nepastrat)'}</Text>

        {entry.sender && <Text style={styles.senderText}>Expeditor: {entry.sender}</Text>}

        {entry.note.trim().length > 0 && (
          <Text style={styles.savedNoteTitle}>Notita ta: {entry.note}</Text>
        )}

        <TextInput
          style={styles.input}
          value={noteInput}
          onChangeText={(val) => {
            setNoteInput(val);
            setSavedBanner(false);
          }}
          placeholder="Notita"
          placeholderTextColor={Colors.textSecondary}
        />

        <Pressable style={styles.primaryButton} onPress={handleSaveNote}>
          <Text style={styles.primaryButtonText}>Salveaza notita</Text>
        </Pressable>

        {savedBanner && <Text style={styles.savedConfirmation}>Notita salvata</Text>}

        <View style={styles.chipRow}>
          <Pressable
            onPress={handleToggleReported}
            style={[styles.chip, entry.reported && styles.chipSelected]}
          >
            <Text style={[styles.chipText, entry.reported && styles.chipTextSelected]}>
              {entry.reported ? '✓ ' : ''}Raportat
            </Text>
          </Pressable>

          <Pressable
            onPress={handleToggleFalsePositive}
            style={[styles.chip, entry.falsePositive && styles.chipSelected]}
          >
            <Text style={[styles.chipText, entry.falsePositive && styles.chipTextSelected]}>
              {entry.falsePositive ? '✓ ' : ''}Fals pozitiv
            </Text>
          </Pressable>
        </View>

        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Sterge</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: Colors.background,
    flexGrow: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  messageText: {
    fontSize: 18,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  senderText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  savedNoteTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  savedConfirmation: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
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
  deleteButton: {
    borderWidth: 1.5,
    borderColor: Colors.error,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginTop: 8,
  },
  deleteButtonText: {
    color: Colors.error,
    fontSize: 18,
    fontWeight: '600',
  },
});
