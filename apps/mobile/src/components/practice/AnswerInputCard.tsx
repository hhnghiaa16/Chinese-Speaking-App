import { StyleSheet, Text, TextInput, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type AnswerInputCardProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function AnswerInputCard({ value, onChangeText }: AnswerInputCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>CÂU TRẢ LỜI CỦA BẠN</Text>
      <TextInput
        multiline
        placeholder="Nhập câu trả lời tiếng Trung của bạn..."
        placeholderTextColor={COLORS.textMuted}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    marginHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(11, 8, 36, 0.92)',
    padding: 20,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 9,
    letterSpacing: 1.4,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    minHeight: 96,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(5, 3, 22, 0.35)',
    color: COLORS.textPrimary,
    fontSize: 18,
    lineHeight: 26,
    padding: 16,
    textAlignVertical: 'top',
  },
});
