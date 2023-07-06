import classNames from 'classnames/bind';
import styles from './panel.module.scss';
const cx = classNames.bind(styles);
//
interface Props {
  activePanel: 'element' | 'function' | '';
  handleClosePanel: () => void;
}
function ToolbarPanel({ activePanel, handleClosePanel }: Props) {
  return (
    <>
      <div className={cx('toolbar-panel-wrap', { active: activePanel })}></div>
      <div className={cx('panel-dim', { active: activePanel })} onClick={handleClosePanel}></div>
    </>
  );
}

export default ToolbarPanel;
