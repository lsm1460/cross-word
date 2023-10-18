import classNames from 'classnames/bind';
import styles from './textEditBlock.module.scss';
const cx = classNames.bind(styles);
//
import { ChartItemType, ConnectPoint } from '@/consts/types/codeFlowLab';
import { setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { useDebounceSubmitText } from '@/src/utils/content';
import { MouseEventHandler, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import ConnectDot from '../../connectDot';

interface Props {
  id: string;
  text: string | number;
  propertyKey: string;
  pointInfo?: {
    pointIndex: number;
    connectPoint: ConnectPoint | undefined;
    handlePointConnectStart?: MouseEventHandler<HTMLElement>;
  };
  label?: string;
  inputType?: 'text' | 'number';
}
function TextEditBlock({ id, text, propertyKey, pointInfo, label, inputType = 'text' }: Props) {
  const dispatch = useDispatch();

  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState(text);

  const [debounceSubmitText] = useDebounceSubmitText(`items.${id}.${propertyKey}`);

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
          key: `items.${id}.${propertyKey}`,
          value: _text,
        })
      );
    }
  };

  return (
    <div className={cx('text-input-wrap')}>
      {label && <label htmlFor={`${id}-input-${propertyKey}`}>{label}</label>}
      <input
        id={`${id}-input-${propertyKey}`}
        className={cx('text-input')}
        value={selectedText}
        onChange={handleTitleInput}
        placeholder="insert something.."
        onBlur={(_event) => {
          setIsTyping(false);

          emitText(_event.target.value);
        }}
        readOnly={!!pointInfo?.connectPoint}
        type={inputType}
      />

      {pointInfo && (
        <ConnectDot
          parentId={id}
          connectDir={'right'}
          connectType={ChartItemType.variable}
          index={0}
          typeIndex={pointInfo?.pointIndex || 0}
          connectParentId={pointInfo.connectPoint?.connectParentId}
          handlePointConnectStart={pointInfo.handlePointConnectStart}
          isSlave
        />
      )}
    </div>
  );
}

export default TextEditBlock;
