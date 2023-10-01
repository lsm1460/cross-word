import TextEditBlock from '../textEditBlock';
import ToggleEditBlock from '../toggleEditBlock';

interface Props {
  id: string;
  variable: string;
}
function VariableEditBlock({ id, variable }: Props) {
  const toggleCallback = (_toggle: boolean) => {
    console.log(_toggle);
  };

  return (
    <div>
      <ToggleEditBlock label="global" toggleCallback={toggleCallback} />
      <TextEditBlock id={id} text={variable} propertyKey="var" />
    </div>
  );
}

export default VariableEditBlock;
