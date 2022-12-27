import { FISH_LINE } from '../aquarium';

export type AquariumViewerStep = 'intro' | 'sketch' | 'result';

export type FishInfo = {
  id: number;
  img: string;
  name: string;
  desc: string;
};
