import { useRef, useEffect, useCallback } from 'react';
import { StorySubtitle, AudioSegment } from '@/types/story';

export function useAudioController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrl = useRef<string | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = useCallback(async (subtitle: StorySubtitle) => {
    if (!audioRef.current || !subtitle.audioUrl) return;

    try {
      const audioSegment = subtitle.audioSegment;
      
      // If the same audio is already playing and no time segment specified, don't restart it
      if (currentAudioUrl.current === subtitle.audioUrl && !audioSegment && !audioRef.current.paused) {
        return;
      }

      // Stop current audio if different file or if we need to set a specific time
      if (currentAudioUrl.current !== subtitle.audioUrl || audioSegment?.startTime !== undefined) {
        audioRef.current.pause();
        audioRef.current.src = subtitle.audioUrl;
        currentAudioUrl.current = subtitle.audioUrl;
        
        // Set start time if specified in audio segment
        if (audioSegment?.startTime !== undefined) {
          audioRef.current.currentTime = audioSegment.startTime;
        } else {
          audioRef.current.currentTime = 0;
        }
      }

      // Set up event listener for end time if specified
      if (audioSegment?.endTime !== undefined) {
        const handleTimeUpdate = () => {
          if (audioRef.current && audioRef.current.currentTime >= audioSegment.endTime!) {
            audioRef.current.pause();
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          }
        };
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      }

      await audioRef.current.play();
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, []);

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    currentAudioUrl.current = null;
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const isPlaying = useCallback(() => {
    return audioRef.current ? !audioRef.current.paused : false;
  }, []);

  const getCurrentTime = useCallback(() => {
    return audioRef.current ? audioRef.current.currentTime : 0;
  }, []);

  const getDuration = useCallback(() => {
    return audioRef.current ? audioRef.current.duration : 0;
  }, []);

  return {
    playAudio,
    pauseAudio,
    stopAudio,
    setVolume,
    isPlaying,
    getCurrentTime,
    getDuration,
    audioElement: audioRef.current
  };
}