import classNames from 'classnames/bind';
import styles from './panel.module.scss';
import ElementPanel from './elementPanel';
import FunctionPanel from './functionPanel';
const cx = classNames.bind(styles);
//
interface Props {
  activePanel: 'element' | 'function' | '';
  handleClosePanel: () => void;
}
function ToolbarPanel({ activePanel, handleClosePanel }: Props) {
  return (
    <>
      <div className={cx('toolbar-panel-wrap', { active: activePanel })}>
        {{ element: <ElementPanel />, function: <FunctionPanel /> }[activePanel]}
      </div>
      <div className={cx('panel-dim', { active: activePanel })} onClick={handleClosePanel}></div>
    </>
  );
}

export default ToolbarPanel;
