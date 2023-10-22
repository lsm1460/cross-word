import PropertyBlock from '../propertyBlock';

const TRIGGER_LIST = [
  { value: 'click', label: 'click' },
  { value: 'hover', label: 'hover' },
  { value: 'mousein', label: 'mousein' },
  { value: 'mouseleave', label: 'mouseleave' },
  { value: 'touch', label: 'touch' },
  { value: 'touchstart', label: 'touchstart' },
  { value: 'touchend', label: 'touchend' },
];

interface Props {
  id: string;
  triggerType: string;
}
function TriggerEditBlock({ id, triggerType }: Props) {
  const onChangeValue = () => {};

  return (
    <div>
      <PropertyBlock
        id={id}
        propertyKey={'trigger'}
        value={triggerType}
        onChangeValue={onChangeValue}
        valueList={TRIGGER_LIST}
      />
    </div>
  );
}

export default TriggerEditBlock;
