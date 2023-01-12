import classNames from 'classnames/bind';
import styles from './sketchbook.module.scss';
const cx = classNames.bind(styles);
//
import { FISH_LINE } from '@/consts/aquarium';
import { MutableRefObject, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import tinycolor from 'tinycolor2';

interface Props {
  line: typeof FISH_LINE[number];
}
function Sketchbook({ line }: Props, ref: MutableRefObject<any>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathCanvasRef = useRef<HTMLCanvasElement>(null);

  const brushDiameter = 30;
  const colorSet = ['red', 'yellow', 'blue', 'green', 'black', 'white'] as const;

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(null);
  const [mouseD, setMouseD] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isColorSetOpen, setIsColorSetOpen] = useState(true);
  const [selectedColor, setSelectedColor] = useState<typeof colorSet[number]>(colorSet[0]);

  const getPointerPos = (evt) => {
    if (evt.target === canvasRef.current) {
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
    } else {
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = brushDiameter;
      ctx.lineCap = 'round';

      setCtx(ctx);
    }
  }, [canvasRef.current]);

  const draw = (x, y, _startPos) => {
    const color = tinycolor(selectedColor);
    color.setAlpha(0.4 + Math.random() * 0.2);

    ctx.strokeStyle = color.toRgbString() || 'black';

    ctx.beginPath();
    ctx.moveTo(_startPos.x, _startPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Chalk Effect
    const length = Math.round(
      Math.sqrt(Math.pow(x - _startPos.x, 2) + Math.pow(y - _startPos.y, 2)) / (5 / brushDiameter)
    );
    const xUnit = (x - _startPos.x) / length;
    const yUnit = (y - _startPos.y) / length;

    for (var i = 0; i < length; i++) {
      const xCurrent = _startPos.x + i * xUnit;
      const yCurrent = _startPos.y + i * yUnit;
      const xRandom = xCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
      const yRandom = yCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
      ctx.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
    }

    setStartPos({ x, y });
  };

  useEffect(() => {
    if (ctx) {
      ctx.clearRect(0, 0, 500, 500);
    }
  }, [ctx, line]);

  useEffect(() => {
    if (pathCanvasRef.current) {
      const ctx = pathCanvasRef.current.getContext('2d');

      ctx.clearRect(0, 0, 500, 500);

      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 3;

      const _p = new Path2D(line);
      ctx.stroke(_p);
    }
  }, [pathCanvasRef.current, line]);

  useImperativeHandle(ref, () => ({
    getImage: () => {
      return new Promise((resolve) => {
        const png = canvasRef.current.toDataURL('image/png');

        ctx.save();

        ctx.clearRect(0, 0, 500, 500);

        const img = new Image();
        img.src = png;
        img.onload = () => {
          const _p = new Path2D(line);
          ctx.clip(_p);

          ctx.strokeStyle = '#ddd';
          ctx.lineWidth = 3;
          ctx.stroke(_p);

          ctx.drawImage(img, 0, 0);

          resolve(canvasRef.current.toDataURL('image/png'));

          ctx.restore();
        };
      });
    },
  }));

  const handleMouseDown = (evt) => {
    setMouseD(true);

    const pos = getPointerPos(evt);
    if (pos) {
      setStartPos({ x: pos[0], y: pos[1] });

      draw(pos[0] + 1, pos[1] + 1, { x: pos[0], y: pos[1] });
    }
  };

  const handleMouseMove = (evt) => {
    const canvas = canvasRef.current;

    if (mouseD) {
      const pos = getPointerPos(evt);

      if (pos) {
        draw(pos[0], pos[1], startPos);
      }
    }
  };

  const handleMouseLeave = () => {
    setMouseD(false);
  };

  return (
    <div className={cx('canvas-wrap')}>
      <div className={cx('color-set', { active: isColorSetOpen })}>
        <button className={cx('color-set-toggle')} onClick={() => setIsColorSetOpen((prev) => !prev)}></button>
        <ul>
          {colorSet.map((_color) => (
            <li key={_color}>
              <button
                className={cx({ active: _color === selectedColor })}
                style={{ backgroundColor: _color }}
                onClick={() => setSelectedColor(_color)}
              ></button>
            </li>
          ))}
        </ul>
      </div>
      <canvas
        ref={canvasRef}
        width="500"
        height="500"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseLeave}
      />
      <canvas ref={pathCanvasRef} width="500" height="500" />
    </div>
  );
}

type Ref = {
  getImage: () => string;
} | null;

export default forwardRef<Ref, Props>(Sketchbook);
