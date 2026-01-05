/**
 * Audio Settings Component
 * Configuration for ambient sounds
 */

import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { AmbientSound } from '@/types';
import { audioService } from '@/services/AudioService';
import './SettingsForm.css';

export const AudioSettings: React.FC = () => {
  const settings = useSettingsStore();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleAmbientTest = async () => {
    if (isPlaying) {
      audioService.stopAmbientSound();
      setIsPlaying(false);
    } else {
      await audioService.playAmbientSound(settings.ambientSound, settings.ambientVolume);
      setIsPlaying(true);
    }
  };

  React.useEffect(() => {
    return () => {
      audioService.stopAmbientSound();
    };
  }, []);

  return (
    <div className="settings-section">
      <h3 className="section-title">Background Audio</h3>

      <p className="section-description">
        Play ambient sounds in the background during focus sessions to help you concentrate.
      </p>

      {/* Ambient Sound Selection */}
      <div className="form-group">
        <label className="form-label" htmlFor="ambient-sound">
          Ambient Sound
        </label>
        <div className="input-group">
          <select
            id="ambient-sound"
            className="form-select"
            value={settings.ambientSound}
            onChange={(e) => {
              audioService.stopAmbientSound();
              setIsPlaying(false);
              settings.updateSettings({ ambientSound: e.target.value as AmbientSound });
            }}
          >
            {Object.values(AmbientSound).map((sound) => (
              <option key={sound} value={sound}>
                {sound === AmbientSound.NONE
                  ? 'None'
                  : sound.charAt(0) + sound.slice(1).toLowerCase().replace('_', ' ')}
              </option>
            ))}
          </select>
          <button
            className="btn-secondary"
            onClick={handleAmbientTest}
            disabled={settings.ambientSound === AmbientSound.NONE}
          >
            {isPlaying ? 'Stop' : 'Test'}
          </button>
        </div>
      </div>

      {/* Ambient Volume */}
      <div className="form-group">
        <label className="form-label" htmlFor="ambient-volume">
          Ambient Volume
        </label>
        <div className="slider-group">
          <input
            type="range"
            id="ambient-volume"
            className="form-slider"
            value={settings.ambientVolume}
            onChange={(e) => {
              const volume = parseInt(e.target.value);
              settings.updateSettings({ ambientVolume: volume });
              if (isPlaying) {
                audioService.setAmbientVolume(volume);
              }
            }}
            min={0}
            max={100}
            step={5}
          />
          <span className="slider-value">{settings.ambientVolume}%</span>
        </div>
      </div>

      <div className="info-box">
        <strong>💡 Tip:</strong> Ambient sounds play automatically during focus sessions and pause
        during breaks.
      </div>
    </div>
  );
};
