import { WordItem } from '@/src/utils/CrossWord';

const CROSS_WORD_STEP = ['intro', 'body', 'result'] as const;
export type CrossWordEditorStep = typeof CROSS_WORD_STEP[number];
export type CrossWordViewerStep = 'intro' | 'body' | 'result';

export type HintItem = { question: string; num: number; key?: string };
export type HintList = { vertical: HintItem[]; horizon: HintItem[] };
export type Board = string[][];
export type QNBoard = number[][];
export type MakerData = {
  board: Board;
  qNBoard: QNBoard;
  hintList: HintList;
  wordPos: WordItem[];
};
