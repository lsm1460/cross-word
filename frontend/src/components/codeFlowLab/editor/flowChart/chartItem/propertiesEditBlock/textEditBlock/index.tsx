import classNames from 'classnames/bind';
import styles from './textEditBlock.module.scss';
const cx = classNames.bind(styles);
//
import { CONNECT_POINT_CLASS } from '@/consts/codeFlowLab/items';
import { setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { useDebounceSubmitText } from '@/src/utils/content';
import { MouseEventHandler, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ChartItemType, ConnectPoint } from '@/consts/types/codeFlowLab';

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
        <span
          className={cx('dot', {
            [CONNECT_POINT_CLASS]: true,
          })}
          id={`${id}-dot-${propertyKey}`}
          data-parent-id={id}
          data-connect-dir={'right'}
          data-connect-type={ChartItemType.variable}
          data-index={pointInfo?.pointIndex || 0}
          data-type-index={0}
          {...(pointInfo.connectPoint && {
            'data-connect-id': pointInfo.connectPoint.connectId,
          })}
          onMouseDown={pointInfo.handlePointConnectStart}
        />
      )}
    </div>
  );
}

export default TextEditBlock;
