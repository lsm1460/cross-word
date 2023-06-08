import React, { useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const Example = () => {
  const canvasRef = useRef(null);
  const [radius, setRadius] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  // canvas 엘리먼트에 원 그리는 함수
  const drawCircle = (x, y, r) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.stroke();
  };

  // canvas 엘리먼트에 원 그리기
  drawCircle(100, 100, radius);

  // 화면 좌표를 canvas 좌표로 변환하는 함수
  const screenToCanvas = (x, y) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((x - rect.left) * canvasRef.current.width) / rect.width,
      y: ((y - rect.top) * canvasRef.current.height) / rect.height,
    };
  };

  // 확대, 축소 이벤트 핸들러
  const handleZoomChange = (scale) => {
    // 화면에서 터치한 위치를 canvas 좌표로 변환
    const { x, y } = screenToCanvas(mouseX, mouseY);
    // 확대 비율에 따라 원의 반지름 조절
    setRadius((prevRadius) => prevRadius * scale);
    // 새로운 위치와 반지름으로 원 다시 그리기
    drawCircle(x * scale + (1 - scale) * 100, y * scale + (1 - scale) * 100, radius * scale);
  };

  // 마우스 누르기 이벤트 핸들러
  const handleMouseDown = (e) => {
    // 화면에서 터치한 위치를 canvas 좌표로 변환
    const { x, y } = screenToCanvas(e.clientX, e.clientY);
    // 터치한 위치와 원의 중심과의 거리가 반지름보다 작으면 원을 클릭한 것으로 판단
    if (Math.sqrt(Math.pow(x - 100, 2) + Math.pow(y - 100, 2)) < radius) {
      // 드래그 상태를 true로 변경하고 마우스 위치 저장
      setDragging(true);
      setMouseX(x);
      setMouseY(y);
      // 마우스 이동 이벤트 리스너 등록
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
    }
  };

  // 마우스 이동 이벤트 핸들러
  const handleMouseMove = (e) => {
    // 드래그 상태가 true라면
    if (dragging) {
      // 화면에서 터치한 위치를 canvas 좌표로 변환
      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      // 마우스의 이동 거리만큼 원의 위치를 변경
      drawCircle(100 + x - mouseX, 100 + y - mouseY, radius);
    }
  };

  // 마우스 떼기 이벤트 핸들러
  const handleMouseUp = (e) => {
    // 드래그 상태를 false로 변경하고 마우스 이벤트 리스너 해제
    setDragging(false);
    canvasRef.current.removeEventListener('mousemove', handleMouseMove);
  };

  return (
    <TransformWrapper onZoomChange={handleZoomChange} centerContent={true} defaultPositionX={0} defaultPositionY={0}>
      <TransformComponent>
        <canvas
          ref={canvasRef}
          width="200"
          height="200"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        ></canvas>
      </TransformComponent>
    </TransformWrapper>
  );
};
