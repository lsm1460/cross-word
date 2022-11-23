import { GET_WORD_DEFINITION } from '@/consts/api';

export type GetWordDefinitionReturn = { word: string; definition: string[] }[];
export const getWordDefinition = async (_word: string): Promise<GetWordDefinitionReturn> => {
  try {
    if (!_word) {
      return [];
    }

    const _res = await fetch(`${GET_WORD_DEFINITION}?word=${_word}`);

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
