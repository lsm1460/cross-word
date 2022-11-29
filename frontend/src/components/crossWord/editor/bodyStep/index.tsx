import classNames from 'classnames/bind';
import styles from './bodyStep.module.scss';
const cx = classNames.bind(styles);
//
import { useAsyncEffect } from '@/src/utils/use-async';
import { CROSS_WORD_EDITOR_STEP } from '@/types';
import React, { Dispatch, SetStateAction, useState, useEffect, useMemo } from 'react';
import { getWordDefinition, GetWordDefinitionReturn } from '@/src/utils/api';

const initState: [string, string][] = [
  ['', ''],
  ['', ''],
  ['', ''],
  // ['트라우마', '1트라우마'],
  // ['라텍스', '2라텍스'],
  // ['에스키모', '3에스키모'],
  // ['에로스', '4에로스'],
  // ['스님', '5스님'],
  // ['님비현상', '6님비현상'],
  // ['비듬', '7비듬'],
  // ['실현', '8실현'],
  // ['상대성이론', '9상대성'],
  // ['대들보', '10대들보'],
  // ['금성', '11금성'],
  // ['이사', '12이사'],
  // ['생명보험', '13생명보험'],
  // ['환생', '14환생'],
  // ['모내기', '15모내기'],
  // ['기름종이', '16기름종이'],
  // ['이름표', '17이름표'],
  // ['표백제', '18표백제'],
  // ['항생제', '19항생제'],
  // ['항문', '20항문'],
  // ['천자문', '21천자문'],
];
interface Props {
  setEditorStep: Dispatch<SetStateAction<CROSS_WORD_EDITOR_STEP>>;
  setWordList: Dispatch<SetStateAction<string[]>>;
  setHintList: Dispatch<SetStateAction<string[]>>;
}
function BodyStep({ setEditorStep, setWordList, setHintList }: Props) {
  const [list, setList] = useState<[string, string][]>(initState);
  const [searchWord, setSearchWord] = useState('');
  const [userDefinition, setUserDefinition] = useState('');

  const [wordDefinitionState] = useAsyncEffect<GetWordDefinitionReturn, Error, typeof getWordDefinition>(
    getWordDefinition,
    [searchWord],
    [searchWord]
  );

  useEffect(() => {
    wordDefinitionState.error && console.log(wordDefinitionState.error);
  }, [wordDefinitionState]);

  const canSubmit = useMemo(() => {
    if (list.length < 1) {
      return false;
    }

    let can = true;

    for (let i = 0; i < list.length; i++) {
      if (list[i][0] && list[i][1]) {
        continue;
      } else {
        can = false;
        break;
      }
    }

    return can;
  }, [list]);

  const setListValue = (_i: number, _t: number, _value: string) => {
    setList((_prev) => {
      return _prev.map((_v, _j) => {
        if (_j === _i) {
          const _cloned: [string, string] = [..._v];
          _cloned[_t] = _value;

          return _cloned;
        }

        return _v;
      });
    });
  };

  const handleAddRow = () => {
    setList((_prev) => [..._prev, [...initState[0]]]);
  };

  const removeRow = (_i) => {
    setList((_prev) => _prev.filter((_v, _j) => _i !== _j));
  };

  const handleEndDefine = () => {
    let i = 0;

    for (i; i < list.length; i++) {
      if (list[i][0] === searchWord) {
        break;
      }
    }

    setListValue(i, 1, userDefinition);

    //reset
    setSearchWord('');
    setUserDefinition('');
  };

  const openModal = (_event: React.MouseEvent, _word: string, _i) => {
    let hasWord = false;

    for (let i = 0; !hasWord && i < list.length; i++) {
      if (_i !== i && list[i][0] === _word) {
        hasWord = true;
      }
    }

    if (hasWord) {
      alert('already has this word');
      return;
    }

    setSearchWord(_word);
    setUserDefinition((_event.target as HTMLInputElement).value);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      alert('has empty value yet');
      return;
    }

    setWordList(list.map((_v) => _v[0]));
    setHintList(list.map((_v) => _v[1]));

    setEditorStep('result');
  };

  return (
    <>
      <div
        className={cx('modal-wrap', { active: !!searchWord })}
        onClick={(_event) => {
          _event.preventDefault();
          if (_event.target === _event.currentTarget) {
            setSearchWord('');
          }
        }}
      >
        <div className={cx('modal')}>
          {wordDefinitionState.loading && 'loading..'}
          {wordDefinitionState.error && 'occur error..'}
          {wordDefinitionState.success && (
            <div>
              <p>추천 리스트</p>
              {wordDefinitionState.data.length < 1 && 'no recommend'}
              {wordDefinitionState.data.length > 0 && (
                <ol>
                  {wordDefinitionState.data.map((_def, _i) => (
                    <li key={_i}>
                      <span>{_def.pos}</span>
                      {_def.definition}
                      <button onClick={() => setUserDefinition(_def.definition)}>use</button>
                    </li>
                  ))}
                </ol>
              )}
              <p>사용자 정의</p>
              <input type="text" value={userDefinition} onChange={(_event) => setUserDefinition(_event.target.value)} />
              <div>
                <button onClick={handleEndDefine}>end</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={cx('body-wrap')}>
        <table>
          <thead>
            <tr>
              <th>단어</th>
              <th>힌트</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {list.map(([word, hint], i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={word}
                    onChange={(_event) => setListValue(i, 0, _event.target.value.trim())}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    disabled={word.length < 2}
                    readOnly
                    value={hint}
                    onClick={(_event) => openModal(_event, word, i)}
                  />
                </td>
                <td>
                  <button onClick={() => removeRow(i)}>x</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <button onClick={handleAddRow}>add</button>
        </p>
        <p>
          <button disabled={!canSubmit} onClick={handleSubmit}>
            submit
          </button>
        </p>
      </div>
    </>
  );
}

export default BodyStep;
