import { CSSProperties } from 'react';

const CSS_PROPERTIES = [];

interface Props {
  id: string;
  styles: CSSProperties;
}
function StyleEditBlock({ id, styles }: Props) {
  return <div>style..</div>;
}

export default StyleEditBlock;
