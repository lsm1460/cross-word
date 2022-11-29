import { HintList as HintListType } from '@/consts/types';

interface Props {
  hintGroup: HintListType;
}
function HintList({ hintGroup }: Props) {
  if (!hintGroup) {
    return <p>loading..</p>;
  }

  return (
    <div>
      {Object.keys(hintGroup).map((_dirKey) => (
        <div key={_dirKey}>
          <p>{_dirKey}</p>
          <ol>
            {hintGroup[_dirKey].map((_hint, _i) => (
              <li key={_i}>
                {_hint.num} {_hint.question}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export default HintList;
