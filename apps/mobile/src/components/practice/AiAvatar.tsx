import { StyleSheet, View } from 'react-native';

export type AiAvatarPhase =
  | 'generating'
  | 'speaking'
  | 'listening'
  | 'thinking'
  | 'feedback'
  | 'idle'
  | 'error';

type AiAvatarProps = {
  phase: AiAvatarPhase;
  size?: number;
};

export function AiAvatar({ phase, size = 92 }: AiAvatarProps) {
  const isSpeaking = phase === 'speaking';
  const isThinking = phase === 'thinking' || phase === 'generating';
  const isFeedback = phase === 'feedback';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.shoulders, { width: size * 0.78, height: size * 0.22, bottom: size * 0.02 }]} />
      <View style={[styles.neck, { width: size * 0.18, height: size * 0.14, bottom: size * 0.21 }]} />
      <View style={[styles.head, { width: size * 0.66, height: size * 0.66, borderRadius: size * 0.33 }]}>
        <View style={styles.hairBand} />
        <View style={styles.faceRow}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
        <View
          style={[
            styles.mouth,
            isSpeaking && styles.mouthSpeaking,
            isThinking && styles.mouthThinking,
            isFeedback && styles.mouthFeedback,
          ]}
        />
        <View style={[styles.cheek, styles.leftCheek]} />
        <View style={[styles.cheek, styles.rightCheek]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shoulders: {
    position: 'absolute',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: '#221940',
  },
  neck: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#F4A778',
  },
  head: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDB985',
    overflow: 'hidden',
  },
  hairBand: {
    position: 'absolute',
    top: 10,
    left: 7,
    right: 7,
    height: 12,
    borderTopWidth: 3,
    borderColor: '#1B1433',
    borderRadius: 999,
  },
  faceRow: {
    width: 34,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eye: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#150D22',
  },
  mouth: {
    width: 12,
    height: 7,
    marginTop: 13,
    borderRadius: 7,
    backgroundColor: '#7C1F24',
  },
  mouthSpeaking: {
    width: 14,
    height: 11,
    borderRadius: 8,
  },
  mouthThinking: {
    width: 10,
    height: 4,
    borderRadius: 4,
  },
  mouthFeedback: {
    width: 15,
    height: 7,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  cheek: {
    position: 'absolute',
    top: 39,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(245, 132, 132, 0.28)',
  },
  leftCheek: {
    left: 12,
  },
  rightCheek: {
    right: 12,
  },
});
