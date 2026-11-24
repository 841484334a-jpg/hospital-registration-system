import type { Doctor } from '../types';

interface Props {
  doctors: Doctor[];
  value: string | null;
  onSelect: (id: string) => void;
}

/** 第二步：选择医生 */
export function DoctorList({ doctors, value, onSelect }: Props) {
  return (
    <div className="doc-list">
      {doctors.map((d) => (
        <button
          key={d.id}
          type="button"
          className="doc"
          aria-pressed={value === d.id}
          onClick={() => onSelect(d.id)}
        >
          <span className="ava">{d.name.charAt(0)}</span>
          <span>
            <span className="nm">
              {d.name}
              <span className="tt">{d.title}</span>
            </span>
            <span className="spec">{d.spec}</span>
          </span>
          <span className="fee">
            ¥{d.fee}
            <small>{d.room}</small>
          </span>
        </button>
      ))}
    </div>
  );
}
