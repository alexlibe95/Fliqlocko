/**
 * Plays a notification beep sound
 * Uses Web Audio API to generate a simple beep without requiring audio files
 */
export function playNotificationSound(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure the beep sound
    oscillator.frequency.value = 800; // Frequency in Hz (pleasant beep)
    oscillator.type = 'sine'; // Smooth sine wave

    // Volume envelope (fade in/out for smoother sound)
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);

    // Play the beep
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);

    // Clean up after sound finishes
    oscillator.onended = () => {
      audioContext.close();
    };
  } catch (error) {
    console.warn('Failed to play notification sound:', error);
    // Fallback: try using a simple beep via HTML5 Audio if Web Audio API fails
    try {
      const audio = new Audio('data:audio/wav;base64,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');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silently fail if audio can't play
      });
    } catch (fallbackError) {
      // If all else fails, just log a warning
      console.warn('Could not play notification sound');
    }
  }
}

