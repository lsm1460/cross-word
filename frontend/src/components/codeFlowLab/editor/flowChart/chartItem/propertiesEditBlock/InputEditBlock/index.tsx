import classNames from 'classnames/bind';
import styles from './inputEditBlock.module.scss';
const cx = classNames.bind(styles);
//
import { ChartInputItem, ChartItem } from '@/consts/types/codeFlowLab';
import { MouseEventHandler } from 'react';
import TextEditBlock from '../textEditBlock';

interface Props {
  id: string;
  placeholder: ChartInputItem['placeholder'];
  text: ChartInputItem['text'];
  connectionVariables: ChartItem['connectionVariables'];
  handlePointConnectStart: MouseEventHandler<HTMLElement>;
}
function InputEditBlock({ id, placeholder, text, connectionVariables, handlePointConnectStart }: Props) {
  return (
    <div>
      <div className={cx('property-wrap')}>
        <p>placeholder</p>
        <TextEditBlock id={id} text={placeholder} propertyKey="placeholder" />
      </div>
      <div className={cx('property-wrap')}>
        <p>text</p>
        <TextEditBlock
          id={id}
          text={text}
          propertyKey="text"
          pointInfo={{
            pointIndex: 0,
            connectPoint: connectionVariables[0],
            handlePointConnectStart,
          }}
        />
      </div>
    </div>
  );
}

export default InputEditBlock;
