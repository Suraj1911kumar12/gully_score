/**
 * GullyScore UI Zustand Store
 * Transient modal states and informational prompts
 */

import { create } from 'zustand';

interface UIState {
  isPhase2ModalOpen: boolean;
  phase2ModalFeature: string;
  openPhase2Modal: (featureName: string) => void;
  closePhase2Modal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPhase2ModalOpen: false,
  phase2ModalFeature: '',

  openPhase2Modal: (featureName: string) =>
    set({ isPhase2ModalOpen: true, phase2ModalFeature: featureName }),

  closePhase2Modal: () =>
    set({ isPhase2ModalOpen: false, phase2ModalFeature: '' }),
}));
