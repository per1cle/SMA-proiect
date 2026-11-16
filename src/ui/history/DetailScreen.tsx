import React, { useEffect, useState } from 'react';
import {
  Keyboard,
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

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const {
    palette,
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
      <View style={[styles.emptyContainer, { backgroundColor: palette.background }]}>
        <Text style={[styles.emptyText, { color: palette.textSecondary }]}>
          Nu exista intrarea.
        </Text>
      </View>
    );
  }

  const handleSaveNote = async () => {
    Keyboard.dismiss();
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
      style={{ flex: 1, backgroundColor: palette.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: palette.background }}
        contentContainerStyle={[styles.container, { backgroundColor: palette.background }]}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <ResultCard result={entry.result} />

        <View
          style={[
            styles.card,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: palette.textSecondary }]}>
            Mesaj ({entry.type}, {entry.source})
          </Text>
          <Text
            style={[
              styles.messageText,
              {
                backgroundColor: palette.surfaceSubtle,
                borderColor: palette.border,
                color: palette.textPrimary,
              },
            ]}
          >
            {entry.text ?? '(text nepastrat)'}
          </Text>

          {entry.sender && (
            <Text style={[styles.senderText, { color: palette.textSecondary }]}>
              Expeditor: <Text style={{ color: palette.textPrimary }}>{entry.sender}</Text>
            </Text>
          )}
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: palette.textSecondary }]}>
            Notita si actiuni
          </Text>

          {entry.note.trim().length > 0 && (
            <View
              style={[
                styles.savedNoteBox,
                { backgroundColor: palette.primarySoft },
              ]}
            >
              <Text style={[styles.savedNoteTitle, { color: palette.chipSelectedText }]}>
                Notita ta: {entry.note}
              </Text>
            </View>
          )}

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: palette.surfaceSubtle,
                borderColor: palette.border,
                color: palette.textPrimary,
              },
            ]}
            value={noteInput}
            onChangeText={(val) => {
              setNoteInput(val);
              setSavedBanner(false);
            }}
            placeholder="Adauga sau modifica notita..."
            placeholderTextColor={palette.textSecondary}
            returnKeyType="done"
            onSubmitEditing={handleSaveNote}
          />

          <Pressable
            style={[styles.primaryButton, { backgroundColor: palette.primary }]}
            onPress={handleSaveNote}
          >
            <Text style={styles.primaryButtonText}>Salveaza notita</Text>
          </Pressable>

          {savedBanner && (
            <Text
              style={[
                styles.savedConfirmation,
                { color: palette.isDark ? '#4ADE80' : '#15803D' },
              ]}
            >
              Notita a fost salvata
            </Text>
          )}

          <View style={styles.chipRow}>
            <Pressable
              onPress={handleToggleReported}
              style={[
                styles.chip,
                {
                  backgroundColor: entry.reported
                    ? palette.chipSelectedBg
                    : palette.surfaceSubtle,
                  borderColor: entry.reported ? palette.primary : palette.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: entry.reported
                      ? palette.chipSelectedText
                      : palette.textPrimary,
                  },
                ]}
              >
                {entry.reported ? 'Raportat (activ)' : 'Marcheaza ca Raportat'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleToggleFalsePositive}
              style={[
                styles.chip,
                {
                  backgroundColor: entry.falsePositive
                    ? palette.chipSelectedBg
                    : palette.surfaceSubtle,
                  borderColor: entry.falsePositive ? palette.primary : palette.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: entry.falsePositive
                      ? palette.chipSelectedText
                      : palette.textPrimary,
                  },
                ]}
              >
                {entry.falsePositive ? 'Fals pozitiv (activ)' : 'Marcheaza Fals pozitiv'}
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[
            styles.deleteButton,
            {
              backgroundColor: palette.surface,
              borderColor: palette.error,
            },
          ]}
          onPress={handleDelete}
        >
          <Text style={[styles.deleteButtonText, { color: palette.error }]}>
            Sterge din istoric
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    padding: 18,
  },
  emptyText: {
    fontSize: 17,
  },
  container: {
    padding: 18,
    paddingBottom: 40,
    gap: 14,
    flexGrow: 1,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 17,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    lineHeight: 24,
  },
  senderText: {
    fontSize: 15,
    fontWeight: '600',
  },
  savedNoteBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  savedNoteTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
  },
  primaryButton: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  savedConfirmation: {
    fontSize: 15,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '700',
  },
  deleteButton: {
    borderWidth: 1.5,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  deleteButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
});
