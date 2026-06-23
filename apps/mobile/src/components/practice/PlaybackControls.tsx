import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pause, Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';

type PlaybackControlsProps = {
  uri: string;
};

export function PlaybackControls({ uri }: PlaybackControlsProps) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);
  
  const [durationStr, setDurationStr] = useState('00:00');
  const [positionStr, setPositionStr] = useState('00:00');

  useEffect(() => {
    if (status.isLoaded) {
      const dur = Math.floor(status.duration / 1000);
      const pos = Math.floor(status.currentTime / 1000);

      const dMins = Math.floor(dur / 60);
      const dSecs = dur % 60;
      setDurationStr(`${dMins.toString().padStart(2, '0')}:${dSecs.toString().padStart(2, '0')}`);

      const pMins = Math.floor(pos / 60);
      const pSecs = pos % 60;
      setPositionStr(`${pMins.toString().padStart(2, '0')}:${pSecs.toString().padStart(2, '0')}`);
    } else if (status.error) {
      console.warn('[PlaybackControls] Audio loading error:', status.error);
    }
  }, [status]);

  const handleTogglePlay = () => {
    if (!status.isLoaded) return;
    
    try {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    } catch (err) {
      console.warn('[PlaybackControls] Failed to toggle play:', err);
    }
  };

  if (!status.isLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.playButton} onPress={handleTogglePlay} hitSlop={10}>
        {player.playing ? (
          <Pause color={COLORS.white} fill={COLORS.white} size={20} />
        ) : (
          <Play color={COLORS.white} fill={COLORS.white} size={20} style={{ marginLeft: 2 }} />
        )}
      </Pressable>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0}%` }
            ]} 
          />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{positionStr}</Text>
          <Text style={styles.timeText}>{durationStr}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(11, 8, 36, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.3)',
    gap: 14,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.purple,
    borderWidth: 1,
    borderColor: 'rgba(109, 74, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.yellow,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
});
