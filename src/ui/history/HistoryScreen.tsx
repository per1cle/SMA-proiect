import React, { useLayoutEffect } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../context/AppContext';
import { Status } from '../../domain/model/Models';
import { RootStackParamList } from '../navigation/AppNavigation';
import { Colors, statusColor, statusLabel } from '../theme/Theme';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const FILTER_STATUSES: Status[] = ['SAFE', 'SUSPICIOUS', 'DANGER'];

export const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { entries, statusFilter, setStatusFilter, query, setQuery, clearHistory } = useApp();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={clearHistory}
          disabled={entries.length === 0}
          style={styles.clearBtn}
        >
          <Text
            style={[
              styles.clearBtnText,
              entries.length === 0 && styles.clearBtnTextDisabled,
            ]}
          >
            Sterge tot
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, clearHistory, entries.length]);

  return (
    <View style={styles.container}>
      {/* Bara de cautare */}
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
        placeholder="Cauta"
        placeholderTextColor={Colors.textSecondary}
      />

      {/* Filtre dupa status */}
      <View style={styles.chipRow}>
        <Pressable
          onPress={() => setStatusFilter(null)}
          style={[styles.chip, statusFilter === null && styles.chipSelected]}
        >
          <Text style={[styles.chipText, statusFilter === null && styles.chipTextSelected]}>
            Toate
          </Text>
        </Pressable>

        {FILTER_STATUSES.map((st) => {
          const selected = statusFilter === st;
          return (
            <Pressable
              key={st}
              onPress={() => setStatusFilter(st)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {statusLabel(st)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {entries.length === 0 ? (
        <Text style={styles.emptyText}>Nu exista analize.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const snippet = item.text ? item.text.slice(0, 80) : '(text nepastrat)';
            const dateStr = new Date(item.createdAt).toLocaleString('ro-RO');
            const meta = item.sender ? `${dateStr} - ${item.sender}` : dateStr;

            return (
              <Pressable
                style={styles.card}
                onPress={() => navigation.navigate('Detail', { id: item.id })}
              >
                <Text
                  style={[styles.cardStatus, { color: statusColor(item.result.status) }]}
                >
                  {statusLabel(item.result.status)}
                </Text>
                <Text style={styles.cardBody}>{snippet}</Text>
                {item.note.trim().length > 0 && (
                  <Text style={styles.cardNote}>Notita: {item.note}</Text>
                )}
                <Text style={styles.cardDate}>{meta}</Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
    backgroundColor: Colors.background,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 18,
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chipTextSelected: {
    color: Colors.chipSelectedText,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  listContent: {
    gap: 10,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  cardStatus: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBody: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  cardNote: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  clearBtnTextDisabled: {
    color: '#BDBDBD',
  },
});
