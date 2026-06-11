/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ChallengeMode = 'find' | 'multiple' | 'fix';

export interface BaseChallenge {
  id: string;
  level: number;
  mode: ChallengeMode;
  filename: string;
  description: string;
  explanation: string;
  hint: string;
}

export interface FindChallenge extends BaseChallenge {
  mode: 'find';
  codeLines: string[];
  errorLineIndex: number;
  errorName: string;
}

export interface MultipleChallenge extends BaseChallenge {
  mode: 'multiple';
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

export interface FixChallenge extends BaseChallenge {
  mode: 'fix';
  codePre: string;
  prefixText: string;
  wrongText: string;
  correctText: string;
  codePost: string;
}

export type Challenge = FindChallenge | MultipleChallenge | FixChallenge;

export interface GameState {
  currentLevel: number;
  currentChallengeIndex: number;
  warnings: number;
  maxWarnings: number;
  isPlaying: boolean;
  score: number;
  highestScore: number;
  selectedMode: ChallengeMode | 'mixed';
  selectedDifficulty: number; // 1-5
}
