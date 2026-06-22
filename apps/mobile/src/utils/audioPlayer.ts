import { createAudioPlayer, type AudioStatus } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';

type PlayBase64AudioInput = {
  audioBase64: string;
  mimeType: string;
};

function getAudioExtension(mimeType: string) {
  const normalizedMimeType = mimeType.split(';')[0]?.trim().toLowerCase();

  switch (normalizedMimeType) {
    case 'audio/wav':
      return 'wav';
    case 'audio/mpeg':
    case 'audio/mp3':
      return 'mp3';
    case 'audio/ogg':
      return 'ogg';
    default:
      return 'wav';
  }
}

function createCacheFileUri(mimeType: string) {
  if (!FileSystem.cacheDirectory) {
    throw new Error('Audio cache directory is not available.');
  }

  const extension = getAudioExtension(mimeType);
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${FileSystem.cacheDirectory}tts-${uniqueId}.${extension}`;
}

type AudioPlayer = ReturnType<typeof createAudioPlayer>;

async function unloadPlayer(player: AudioPlayer | null) {
  if (!player) {
    return;
  }

  player.remove();
}

async function deleteCacheFile(fileUri: string) {
  try {
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
  } catch {
    // Cache cleanup should not hide the playback result from the caller.
  }
}

function waitForPlaybackToFinish(player: AudioPlayer) {
  return new Promise<void>((resolve, reject) => {
    let isSettled = false;
    let subscription: { remove: () => void } | null = null;

    const settle = (error?: Error) => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      subscription?.remove();

      if (error) {
        reject(error);
        return;
      }

      resolve();
    };

    subscription = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      if (!status.isLoaded) {
        if (status.error) {
          settle(new Error(status.error));
        }

        return;
      }

      if (status.didJustFinish) {
        settle();
      }
    });

    try {
      player.play();
    } catch (error) {
      settle(error instanceof Error ? error : new Error('Failed to play audio.'));
    }
  });
}

export async function playBase64Audio(input: PlayBase64AudioInput): Promise<void> {
  const audioBase64 = input.audioBase64.trim();

  if (!audioBase64) {
    throw new Error('audioBase64 is required.');
  }

  const fileUri = createCacheFileUri(input.mimeType);
  let player: AudioPlayer | null = null;

  try {
    await FileSystem.writeAsStringAsync(fileUri, audioBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    player = createAudioPlayer(fileUri);
    await waitForPlaybackToFinish(player);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to play audio.');
  } finally {
    await unloadPlayer(player);
    await deleteCacheFile(fileUri);
  }
}
