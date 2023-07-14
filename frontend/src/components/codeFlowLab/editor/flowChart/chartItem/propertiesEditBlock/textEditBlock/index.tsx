import classNames from 'classnames/bind';
import styles from './textEditBlock.module.scss';
const cx = classNames.bind(styles);
//
import { setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { useDebounceSubmitText } from '@/src/utils/content';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

interface Props {
  id: string;
  text: string;
}
function TextEditBlock({ id, text }: Props) {
  const dispatch = useDispatch();

  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState(text);

  const [debounceSubmitText] = useDebounceSubmitText(`items.${id}.text`);

  const selectText = (_isTyping, _originText, _insertedText) => {
    if (_isTyping) {
      return _insertedText;
    }

    return _originText;
  };

  const selectedText = useMemo(() => selectText(isTyping, text, typingText), [isTyping, text, typingText]);

  const handleTitleInput = (_event) => {
    setIsTyping(true);

    setTypingText(_event.target.value);

    debounceSubmitText(_event.target.value);
  };

  const emitText = (_text) => {
    debounceSubmitText.cancel();

    if (_text !== text) {
      dispatch(
        setDocumentValueAction({
          key: `items.${id}.text`,
          value: _text,
        })
      );
    }
  };

  return (
    <input
      className={cx('text-input')}
      value={selectedText}
      onChange={handleTitleInput}
      placeholder="insert something.."
      onBlur={(_event) => {
        setIsTyping(false);

        emitText(_event.target.value);
      }}
    />
  );
}

export default TextEditBlock;
