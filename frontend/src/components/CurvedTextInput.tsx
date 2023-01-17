import { useRef, useEffect, useState } from 'react';

//TODO: placeholder의 글자색 조정, 글자 가운데 정렬, 맨 앞으로 갔을 때의 커서 위치
interface Props {
  width: number;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  placeholder?: string;
  defaultText?: string;
}
function CurvedTextInput({
  width,
  fontSize = 24,
  fontColor = 'black',
  fontFamily = 'sans serif',
  placeholder = 'insert text',
  defaultText = '',
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(defaultText);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fpsInterval = 1000 / 30;
    let now, elapsed;
    let then = Date.now();

    let aniId = 0;
    if (canvas.current && input.current) {
      canvas.current.width = 430;
      canvas.current.height = 110;

      let context = canvas.current.getContext('2d');

      const main = (_time) => {
        aniId = window.requestAnimationFrame(main);

        now = Date.now();
        elapsed = now - then;

        if (elapsed > fpsInterval) {
          then = now - (elapsed % fpsInterval);

          const activeCursor = Math.floor(_time / 500) % 2 === 0;
          const cursorPos = Math.max(0, (input.current?.selectionStart || 0) - 1);

          context.clearRect(0, 0, 500, 500);

          context.font = `${fontSize}px ${fontFamily}`;
          context.fillStyle = fontColor;
          context.textAlign = 'center';

          let string = isActive || text ? text || ' ' : placeholder;

          let angle = Math.PI * 0.3; // in radians
          let radius = 300;

          context.save();
          context.translate(200, 500);
          context.rotate((-1 * angle) / 2);

          for (let i = 0; i < string.length; i++) {
            context.rotate(angle / string.length);
            context.save();
            context.translate(0, -1.5 * radius);
            context.fillText(string[i], 0, 0);
            if (isActive && activeCursor && i === cursorPos) {
              context.translate(18, 0);
              context.fillText('|', 0, 0);
            }
            context.restore();
          }
          context.restore();
        }
      };

      aniId = window.requestAnimationFrame(main);
    }

    return () => {
      window.cancelAnimationFrame(aniId);
    };
  }, [isActive, text, canvas.current, input.current]);

  return (
    <label onClick={() => setIsActive(true)}>
      <canvas ref={canvas} style={{ width: width }} />
      <input
        ref={input}
        onChange={(_event) => setText(_event.target.value)}
        value={text}
        style={{ opacity: 0 }}
        onBlur={() => setIsActive(false)}
      />
    </label>
  );
}

export default CurvedTextInput;
