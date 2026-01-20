
import { Toy, Subject } from './types';

export const SUBJECTS: { id: Subject; name: string; icon: string; color: string; bgColor: string }[] = [
  { id: 'english', name: 'Magic English', icon: '🔤', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { id: 'hindi', name: 'Hindi Masti', icon: '🕉️', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { id: 'maths', name: 'Number Ninja', icon: '🔢', color: 'text-green-600', bgColor: 'bg-green-100' },
  { id: 'morals', name: 'Moral Heroes', icon: '🌟', color: 'text-purple-600', bgColor: 'bg-purple-100' },
];

export const TOYS_CATALOG: Toy[] = [
  { id: 't1', name: 'Rocket Ship', image: '🚀', cost: 100, description: 'Fly to the stars!' },
  { id: 't2', name: 'Cute Teddy', image: '🧸', cost: 150, description: 'Soft and cuddly.' },
  { id: 't3', name: 'Dino Friend', image: '🦖', cost: 200, description: 'Roar with fun!' },
  { id: 't4', name: 'Magic Wand', image: '🪄', cost: 300, description: 'Make some magic!' },
  { id: 't5', name: 'Racing Car', image: '🏎️', cost: 250, description: 'Zoom zoom zoom!' },
  { id: 't6', name: 'Alien Pal', image: '👾', cost: 400, description: 'A friend from Mars.' },
];
