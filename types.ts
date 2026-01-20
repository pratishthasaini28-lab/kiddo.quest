
export type Subject = 'english' | 'hindi' | 'maths' | 'morals';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'story-choice' | 'input' | 'matching';
  text: string;
  options?: string[];
  answer: string;
  explanation?: string;
  imageHint?: string;
  audioKey?: string; // Hint for what sound to play
}

export interface UserStats {
  points: number;
  level: number;
  xp: number;
  completedTasks: number;
  unlockedToys: string[];
}

export interface Toy {
  id: string;
  name: string;
  image: string;
  cost: number;
  description: string;
}
