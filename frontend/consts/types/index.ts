const CROSS_WORD_STEP = ['intro', 'body', 'result'] as const;
export type CrossWordEditorStep = typeof CROSS_WORD_STEP[number];
export type CrossWordViewerStep = 'intro' | 'body' | 'result';

export type HintItem = { question: string; num: number };
export type HintList = { vertical: HintItem[]; horizon: HintItem[] };
export type Board = string[][];
export type QNBoard = number[][];
export type MakerData = {
  board: Board;
  qNBoard: QNBoard;
  hintList: HintList;
  wordPos: { dir: 'vertical' | 'horizon'; x1: number; x2: number; y1: number; y2: number }[];
};
