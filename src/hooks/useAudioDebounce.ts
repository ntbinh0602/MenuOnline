import { useRef, useEffect } from 'react';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export const useAudioDebounce = (debounceTime: number = 5000) => {
  const hasNewPendingNotificationRef = useRef<boolean>(false);
  const timeoutId = useRef<any | null>(null);
  const soundRef = useRef<Sound | null>(null);

  useEffect(() => {
    // Load sound khi hook được dùng (chỉnh đường dẫn & file tên phù hợp)
    const sound = new Sound('kitchen.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      soundRef.current = sound;
    });

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      soundRef.current?.release();
    };
  }, []);

  const playAudioDebounced = () => {
    const sound = soundRef.current;
    if (!sound) return;

    if (timeoutId.current) return;

    if (!hasNewPendingNotificationRef.current) {
      sound.play();
      hasNewPendingNotificationRef.current = true;
      return;
    }

    timeoutId.current = setTimeout(() => {
      sound.play();
      timeoutId.current = null;
      hasNewPendingNotificationRef.current = false;
    }, debounceTime);
  };

  return { playAudioDebounced };
};

export default useAudioDebounce;
