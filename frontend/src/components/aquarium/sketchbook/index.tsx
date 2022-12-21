import classNames from 'classnames/bind';
import styles from './sketchbook.module.scss';
const cx = classNames.bind(styles);
//
import { useEffect, useRef } from 'react';
import FishLine01 from '../fishLine/fishLine01';
//TODO: path로 clip따서 dataUrl로 변환, dataUrl png fish 애니메이션 제작
function Sketchbook() {
  const fishRef = useRef<React.ElementRef<typeof FishLine01>>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const chalkboard = () => {
        const canvas = canvasRef.current;

        const ctx = canvas.getContext('2d');

        const width = canvas.width;
        const height = canvas.height;
        let mouseD = false;
        let xLast = 0;
        let yLast = 0;
        let brushDiameter = 7;

        document.onselectstart = function () {
          return false;
        };

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = brushDiameter;
        ctx.lineCap = 'round';

        const getPointerPos = (evt) => {
          const rect = evt.target.getBoundingClientRect();

          let x, y;

          if (evt.touches) {
            const touch = evt.touches[0];
            x = touch.pageX - rect.left;
            y = touch.pageY - rect.top;
          } else {
            x = evt.clientX - rect.left;
            y = evt.clientY - rect.top;
          }

          return [x, y];
        };

        const handleMouseMove = (evt) => {
          evt.preventDefault();

          const [_x, _y] = getPointerPos(evt);

          if (mouseD && _y < height && _x < width) {
            draw(_x, _y);
          }
        };
        document.addEventListener('touchmove', handleMouseMove, false);
        document.addEventListener('mousemove', handleMouseMove, false);

        const handleMouseDown = (evt) => {
          evt.preventDefault();

          mouseD = true;

          const [_x, _y] = getPointerPos(evt);

          xLast = _x;
          yLast = _y;

          draw(_x + 1, _y + 1);
        };
        canvasRef.current.addEventListener('touchstart', handleMouseDown, false);
        canvasRef.current.addEventListener('mousedown', handleMouseDown, false);

        const handleMouseUp = () => (mouseD = false);
        document.addEventListener('touchend', handleMouseUp, false);
        document.addEventListener('mouseup', handleMouseUp, false);

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = brushDiameter;
        ctx.lineCap = 'round';

        const draw = (x, y) => {
          ctx.strokeStyle = 'rgba(0,0,0,' + (0.4 + Math.random() * 0.2) + ')';
          ctx.beginPath();
          ctx.moveTo(xLast, yLast);
          ctx.lineTo(x, y);
          ctx.stroke();

          // Chalk Effect
          const length = Math.round(Math.sqrt(Math.pow(x - xLast, 2) + Math.pow(y - yLast, 2)) / (5 / brushDiameter));
          const xUnit = (x - xLast) / length;
          const yUnit = (y - yLast) / length;

          for (var i = 0; i < length; i++) {
            const xCurrent = xLast + i * xUnit;
            const yCurrent = yLast + i * yUnit;
            const xRandom = xCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
            const yRandom = yCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
            ctx.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
          }

          xLast = x;
          yLast = y;
        };
      };

      chalkboard();
    }
  }, [canvasRef.current]);

  useEffect(() => {
    console.log(pathCanvasRef.current);
    console.log(fishRef.current);
    if (pathCanvasRef.current && fishRef.current) {
      const _path = fishRef.current.getPath();

      const ctx = pathCanvasRef.current.getContext('2d');

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#000';

      const _p = new Path2D(_path);
      ctx.stroke(_p);
    }
  }, [pathCanvasRef.current, fishRef.current]);

  return (
    <div>
      <div className={cx('canvas-wrap')}>
        <canvas ref={canvasRef} width="500" height="500" />
        <canvas ref={pathCanvasRef} width="500" height="500" />
      </div>
      <FishLine01 ref={fishRef} />
    </div>
  );
}

export default Sketchbook;
