/**
 * GullyScore Domain Contracts - Voice
 * Prepared for Phase 2 voice-controlled scoring integration
 */

export type VoiceRecognitionState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'CONFIRMATION'
  | 'ERROR';

export type VoiceScoringLanguage = 'hindi' | 'english' | 'hinglish';

export interface VoiceIntent {
  rawTranscript: string;
  confidence: number;
  parsedAction?: {
    runs: number;
    isExtra: boolean;
    extraType?: string;
    isWicket: boolean;
    dismissalType?: string;
  };
  timestamp: string;
}

export interface VoiceFeedbackPreference {
  haptics: boolean;
  soundAlerts: boolean;
  showConfirmationDialog: boolean;
}
