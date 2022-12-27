interface Props {
  line: string;
}
function FishLine({ line }: Props) {
  return (
    <svg viewBox="0 0 500 500">
      <defs>
        <style>{`.cls-1 {fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <path className="cls-1" d={line} />
    </svg>
  );
}

export default FishLine;
