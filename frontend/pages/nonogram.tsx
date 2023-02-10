import NonogramEditor from '@/src/components/nonogram/editor';
import NonogramViewer from '@/src/components/nonogram/viewer';
import _ from 'lodash';
import { useState } from 'react';

export type Cell = { color: string };

function Nonogram() {
  const [step, setStep] = useState('editor');
  const [board, setBoard] = useState(null);

  return (
    <div>
      {step === 'editor' && <NonogramEditor setStep={setStep} setBoard={setBoard} />}
      {step === 'viewer' && <NonogramViewer setStep={setStep} board={board} />}
    </div>
  );
}

export default Nonogram;
