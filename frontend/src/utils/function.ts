function isOverlap(rect1: [number, number], rect2: [number, number]) {
  const x1_1 = rect1[0][0];
  const y1_1 = rect1[0][1];
  const x2_1 = rect1[1][0];
  const y2_1 = rect1[1][1];
  const x1_2 = rect2[0][0];
  const y1_2 = rect2[0][1];
  const x2_2 = rect2[1][0];
  const y2_2 = rect2[1][1];

  if (x2_1 - x1_1 === y2_1 - y1_1 && x2_2 - x1_2 === y2_2 - y1_2) {
    return (
      (x2_2 - x1_2) * (y2_1 - y1_1) - (x2_1 - x1_1) * (y2_2 - y1_2) ===
      (x2_2 - x2_1) * (y2_1 - y1_1) - (y2_2 - y2_1) * (x2_1 - x1_1)
    );
  } else {
    return x1_1 <= x2_2 && x2_1 >= x1_2 && y1_1 <= y2_2 && y2_1 >= y1_2;
  }
}
