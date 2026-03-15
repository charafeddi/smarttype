import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Language } from '../types';
import { LANGUAGES } from '../constants/languages';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (language: Language) => void;
  selectedCode: string;
  title: string;
}

export const LanguageModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
  selectedCode,
  title,
}) => {
  const [search, setSearch] = useState('');

  const filtered = LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      lang.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (lang: Language) => {
    onSelect(lang);
    setSearch('');
    onClose();
  };

  const renderItem = ({ item }: { item: Language }) => {
    const isSelected = item.code === selectedCode;
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.itemText}>
          <Text style={[styles.name, isSelected && styles.nameSelected]}>
            {item.name}
          </Text>
          <Text style={styles.nativeName}>{item.nativeName}</Text>
        </View>
        {isSelected && <Text style={styles.check}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search languages..."
              placeholderTextColor={COLORS.textMuted}
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
            />
          </View>

          <FlatList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '75%',
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.keySpecial,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.lg,
  },
  searchContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.keySpecial,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  list: {
    paddingHorizontal: SPACING.xl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  itemSelected: {
    backgroundColor: COLORS.primary + '20',
  },
  flag: {
    fontSize: FONT_SIZE.xxl,
    marginRight: SPACING.lg,
  },
  itemText: {
    flex: 1,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '500',
  },
  nameSelected: {
    color: COLORS.primary,
  },
  nativeName: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  check: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
});
