/**
 * Audio Service
 * Manages notification sounds and ambient background audio
 */

import { AppError, ErrorType, NotificationSound, AmbientSound } from '@/types';
import { SOUND_FILES, AMBIENT_FILES } from '@/utils/constants';

/**
 * Service for managing audio playback
 */
class AudioService {
  private notificationAudio: HTMLAudioElement | null = null;
  private ambientAudio: HTMLAudioElement | null = null;
  private notificationVolume: number = 0.8;
  private ambientVolume: number = 0.5;

  /**
   * Plays a notification sound
   */
  async playNotificationSound(
    sound: NotificationSound,
    volume: number = this.notificationVolume
  ): Promise<void> {
    if (sound === NotificationSound.NONE) {
      return;
    }

    const soundFile = SOUND_FILES[sound];
    if (!soundFile) {
      console.warn(`Sound file not found for: ${sound}`);
      return;
    }

    try {
      // Clean up existing audio
      if (this.notificationAudio) {
        this.notificationAudio.pause();
        this.notificationAudio = null;
      }

      this.notificationAudio = new Audio(soundFile);
      this.notificationAudio.volume = Math.max(0, Math.min(1, volume / 100));

      await this.notificationAudio.play();
    } catch (error) {
      throw new AppError(
        ErrorType.AUDIO_ERROR,
        'Failed to play notification sound',
        error as Error
      );
    }
  }

  /**
   * Starts playing ambient sound in a loop
   */
  async playAmbientSound(
    sound: AmbientSound,
    volume: number = this.ambientVolume
  ): Promise<void> {
    // Stop existing ambient sound
    this.stopAmbientSound();

    if (sound === AmbientSound.NONE) {
      return;
    }

    const soundFile = AMBIENT_FILES[sound];
    if (!soundFile) {
      console.warn(`Ambient sound file not found for: ${sound}`);
      return;
    }

    try {
      this.ambientAudio = new Audio(soundFile);
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = Math.max(0, Math.min(1, volume / 100));

      await this.ambientAudio.play();
    } catch (error) {
      throw new AppError(
        ErrorType.AUDIO_ERROR,
        'Failed to play ambient sound',
        error as Error
      );
    }
  }

  /**
   * Stops the ambient sound
   */
  stopAmbientSound(): void {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
      this.ambientAudio = null;
    }
  }

  /**
   * Sets the notification volume
   */
  setNotificationVolume(volume: number): void {
    this.notificationVolume = Math.max(0, Math.min(100, volume));
    if (this.notificationAudio) {
      this.notificationAudio.volume = this.notificationVolume / 100;
    }
  }

  /**
   * Sets the ambient volume
   */
  setAmbientVolume(volume: number): void {
    this.ambientVolume = Math.max(0, Math.min(100, volume));
    if (this.ambientAudio) {
      this.ambientAudio.volume = this.ambientVolume / 100;
    }
  }

  /**
   * Pauses ambient sound
   */
  pauseAmbientSound(): void {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
    }
  }

  /**
   * Resumes ambient sound
   */
  resumeAmbientSound(): void {
    if (this.ambientAudio) {
      this.ambientAudio.play().catch((error) => {
        console.error('Failed to resume ambient sound:', error);
      });
    }
  }

  /**
   * Cleans up all audio resources
   */
  cleanup(): void {
    if (this.notificationAudio) {
      this.notificationAudio.pause();
      this.notificationAudio = null;
    }

    this.stopAmbientSound();
  }
}

// Export singleton instance
export const audioService = new AudioService();
