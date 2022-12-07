import { GET_GAME_LIST, GET_WORD_DEFINITION, POST_SAVE_GAME, GET_GAME } from '@/consts/api';
import { HintList, QNBoard } from '@/consts/types';
import _ from 'lodash';
import { WordItem } from './CrossWord';
import { MakerData } from '../../consts/types/index';

export type GetWordDefinitionReturn = { word: string; definition: string; pos: string }[];
type GetWordDefinition = (_word: string) => Promise<GetWordDefinitionReturn>;
export const getWordDefinition: GetWordDefinition = async (_word) => {
  try {
    if (!_word) {
      return [];
    }

    const _res = await fetch(`${GET_WORD_DEFINITION}?wordtext=${_word}`);

    if (_res.status === 200) {
      const commits = await _res.json();

      return _.map(commits.channel?.item || [], (_item) => ({
        word: _item.word,
        definition: _item.sense.definition,
        pos: _item.pos,
      }));
    } else {
      throw new Error('fail');
    }
  } catch (e) {
    throw e;
  }
};

type PostGameData = (
  _nickname: string,
  _board: string[][],
  _gameData: { qNBoard: QNBoard; hintList: HintList; wordPos: WordItem[] }
) => Promise<number>;
export const postGameData: PostGameData = async (_nickname, _board, _gameData) => {
  try {
    const _res = await fetch(POST_SAVE_GAME, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nickname: _nickname,
        board: _board,
        gameData: _gameData,
      }),
    });

    if (_res.status === 200) {
      const commits = await _res.json();

      return commits.id;
    } else {
      throw new Error('fail');
    }
  } catch (e) {
    throw e;
  }
};

export type GetGameListReturn = { list: { id: number; nickname: string; createdAt: Date }[]; total: number };
type GetGameList = (_page: number, _per_page: number) => Promise<GetGameListReturn>;
export const getGameList: GetGameList = async (_page, _per_page) => {
  try {
    const _res = await fetch(`${GET_GAME_LIST}?page=${_page}&per_page=${_per_page}`);

    if (_res.status === 200) {
      const commits = await _res.json();

      return commits;
    } else {
      throw new Error('fail');
    }
  } catch (e) {
    throw e;
  }
};

type GetGame = (_id: string) => Promise<{ title: string; makerData: MakerData }>;
export const getGame: GetGame = async (_id) => {
  try {
    const _res = await fetch(`${GET_GAME}?id=${_id}`);

    if (_res.status === 200) {
      const commits = await _res.json();

      const _gameData = JSON.parse(commits.gameData);

      return {
        title: commits.nickname,
        makerData: {
          board: JSON.parse(commits.board),
          qNBoard: _gameData.qNBoard,
          hintList: _gameData.hintList,
          wordPos: _gameData.wordPos,
        },
      };
    } else {
      throw new Error('fail');
    }
  } catch (e) {
    throw e;
  }
};
