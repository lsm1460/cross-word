import { WordItem } from '@/src/utils/CrossWord';
import _ from 'lodash';
import { useEffect, useState } from 'react';

const initState = { horizon: [], vertical: [] };

interface Props {
  questionList: WordItem[];
  wordList: string[];
  hintList: string[];
}
function HintList({ questionList, wordList, hintList }: Props) {
  const [list, setList] = useState(initState);

  useEffect(() => {
    const ql = _.reduce(
      questionList,
      (_acc, _q) => {
        const _wi = wordList.indexOf(_q.key);

        return {
          ..._acc,
          [_q.dir]: [..._acc[_q.dir], { question: hintList[_wi], num: _q.num }],
        };
      },
      _.cloneDeep(initState)
    );

    setList(ql);
  }, [questionList]);

  return (
    <div>
      {Object.keys(list).map((_dirKey) => (
        <div key={_dirKey}>
          <p>{_dirKey}</p>
          <ol>
            {list[_dirKey].map((_hint, _i) => (
              <li key={_i}>
                {_hint.num} {_hint.question}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export default HintList;
