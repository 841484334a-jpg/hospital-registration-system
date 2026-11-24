import type { Dept } from '../types';

interface Props {
  depts: Dept[];
  value: string | null;
  onSelect: (id: string) => void;
}

/** 第一步：选择科室 */
export function DeptGrid({ depts, value, onSelect }: Props) {
  return (
    <div className="dept-grid">
      {depts.map((d) => (
        <button
          key={d.id}
          type="button"
          className="dept"
          aria-pressed={value === d.id}
          onClick={() => onSelect(d.id)}
        >
          <span className="name">{d.name}</span>
          <span className="sub">{d.sub}</span>
        </button>
      ))}
    </div>
  );
}
