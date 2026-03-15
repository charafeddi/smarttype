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

interface SingleSelectProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (language: Language) => void;
  selectedCode: string;
  title: string;
  multiSelect?: false;
  selectedCodes?: never;
  onMultiSelect?: never;
}

interface MultiSelectProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  multiSelect: true;
  selectedCodes: string[];
  onMultiSelect: (codes: string[]) => void;
  onSelect?: never;
  selectedCode?: never;
}

type Props = SingleSelectProps | MultiSelectProps;

export const LanguageModal: React.FC<Props> = (props) => {
  const { visible, onClose, title } = props;
  const [search, setSearch] = useState('');

  const filtered = LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      lang.code.toLowerCase().includes(search.toLowerCase())
  );

  const isSelected = (code: string) => {
    if (props.multiSelect) return props.selectedCodes.includes(code);
    return code === props.selectedCode;
  };

  const handleTap = (lang: Language) => {
    if (props.multiSelect) {
      const current = props.selectedCodes;
      const updated = current.includes(lang.code)
        ? current.filter((c) => c !== lang.code)
        : [...current, lang.code];
      if (updated.length === 0) return;
      props.onMultiSelect(updated);
    } else {
      props.onSelect(lang);
      setSearch('');
      onClose();
    }
  };

  const renderItem = ({ item }: { item: Language }) => {
    const sel = isSelected(item.code);
    return (
      <TouchableOpacity
        style={[styles.item, sel && styles.itemSelected]}
        onPress={() => handleTap(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.itemText}>
          <Text style={[styles.name, sel && styles.nameSelected]}>
            {item.name}
          </Text>
          <Text style={styles.nativeName}>{item.nativeName}</Text>
        </View>
        {sel && <Text style={styles.check}>✓</Text>}
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

          {props.multiSelect && (
            <Text style={styles.multiHint}>
              Tap to select/deselect. At least 1 required.
            </Text>
          )}

          <FlatList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />

          {props.multiSelect && (
            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text style={styles.doneBtnText}>Done ({props.selectedCodes.length} selected)</Text>
            </TouchableOpacity>
          )}
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
  multiHint: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.sm,
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
  doneBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    marginHorizontal: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  doneBtnText: {
    color: '#000000',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
});
