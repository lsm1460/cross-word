import { CrossWordEditorStep } from '@/consts/types';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  setEditorStep: Dispatch<SetStateAction<CrossWordEditorStep>>;
  setNickname: Dispatch<SetStateAction<string>>;
}
function IntroStep({ setEditorStep, setNickname }: Props) {
  const [name, setName] = useState('');

  const handleStartEdit = () => {
    if (!name) {
      alert('Insert name.');
      return;
    }
    setEditorStep('body');
  };

  return (
    <div>
      <p>Intro</p>

      <p>nickname</p>
      <input
        type="text"
        onChange={(_event) => setName(_event.target.value)}
        value={name}
        onBlur={() => setNickname(name.trim())}
      />
      <br />
      <br />
      <div>
        <button disabled={!name} onClick={handleStartEdit}>
          start
        </button>
      </div>
    </div>
  );
}

export default IntroStep;
