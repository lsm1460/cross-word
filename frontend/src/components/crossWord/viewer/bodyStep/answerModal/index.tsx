import classNames from 'classnames/bind';
import styles from './answerModal.module.scss';
const cx = classNames.bind(styles);
//
import { SelectedPos } from '..';
import { HintList } from '@/consts/types';
import { useMemo, useState } from 'react';

interface Props {
  isOpen: boolean;
  selectedPos: SelectedPos;
  hintList: HintList;
  onSubmit: (_answer: string) => void;
  closeModal: () => void;
}
function AnswerModal({ isOpen, selectedPos, hintList, onSubmit, closeModal }: Props) {
  const [answer, setAnswer] = useState('');

  const question = useMemo(() => {
    if (!isOpen) {
      return '';
    }

    for (let i = 0; i < hintList[selectedPos.dir].length; i++) {
      const _item = hintList[selectedPos.dir][i];

      if (_item.num === selectedPos.num) {
        return _item.question;
      }
    }
  }, [isOpen, selectedPos, hintList]);

  const inputMaxLength = useMemo(() => {
    if (!isOpen) {
      return 0;
    }

    return selectedPos.dir === 'horizon' ? selectedPos.x.length : selectedPos.y.length;
  }, [isOpen, selectedPos]);

  const handleCancel = () => {
    setAnswer('');
    closeModal();
  };

  const handleOnSubmit = (_event) => {
    _event.preventDefault();

    if (answer.length !== inputMaxLength) {
      return;
    }

    onSubmit(answer);
    setAnswer('');
  };

  return (
    <div className={cx('answer-modal', { active: isOpen })}>
      <button className={cx('close-button')} onClick={handleCancel}>
        close
      </button>
      {selectedPos && (
        <p>
          {selectedPos.dir} : {selectedPos.num}
        </p>
      )}
      <p>{question}</p>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          maxLength={inputMaxLength}
          onChange={(_event) => setAnswer(_event.target.value.trim())}
          value={answer}
        />
        <button type="submit" onClick={handleOnSubmit}>
          submit
        </button>
      </form>
    </div>
  );
}

export default AnswerModal;
