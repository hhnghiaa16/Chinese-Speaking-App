import { Sparkles } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

export function FooterTrustNote() {
  return (
    <View style={styles.container}>
      <Sparkles color={COLORS.yellow} size={12} strokeWidth={1.9} />
      <Text style={styles.text}>AI chấm điểm theo khung HSK · phản hồi tức thì bằng tiếng Việt</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    color: '#B9AEDC',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
