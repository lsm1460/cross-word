import { GET_WORD_DEFINITION } from '@/consts/api';
import _ from 'lodash';

export type GetWordDefinitionReturn = { word: string; definition: string; pos: string }[];
export const getWordDefinition = async (_word: string): Promise<GetWordDefinitionReturn> => {
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
