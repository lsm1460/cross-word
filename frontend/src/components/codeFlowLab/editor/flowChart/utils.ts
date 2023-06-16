export function isOverlap() {}

interface IPoint {
  x: number;
  y: number;
}

function getAngle(element: HTMLElement): number {
  const style = window.getComputedStyle(element);
  const matrix = new WebKitCSSMatrix(style.webkitTransform);
  return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
}

export function getRectPoints(element: HTMLElement): IPoint[] {
  const rect = element.getBoundingClientRect();
  const x = rect.left;
  const y = rect.top;
  const width = rect.width;
  const height = rect.height;
  const angle = getAngle(element);

  const radian = (angle * Math.PI) / 180;
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);

  const x1 = x + width * cos;
  const y1 = y + width * sin;

  const x2 = x1 + height * -sin;
  const y2 = y1 + height * cos;

  const x3 = x2 + width * -cos;
  const y3 = y2 + height * -sin;

  return [
    { x, y },
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: x3, y: y3 },
  ];
}
