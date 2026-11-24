import type { Doctor } from '../types';
import { WD, parseISO } from '../lib/date';

interface Props {
  days: string[];
  value: string | null;
  onSelect: (date: string) => void;
}

/** 第三步上：选择日期 */
export function DatePicker({ days, value, onSelect }: Props) {
  const t0 = new Date();
  t0.setHours(0, 0, 0, 0);

  return (
    <div className="dates">
      {days.map((s) => {
        const d = parseISO(s);
        const diff = Math.round((d.getTime() - t0.getTime()) / 86400000);
        const label = diff === 0 ? '今天' : diff === 1 ? '明天' : WD[d.getDay()];
        return (
          <button
            key={s}
            type="button"
            className="date"
            aria-pressed={value === s}
            onClick={() => onSelect(s)}
          >
            <span className="d1">{label}</span>
            <span className="d2">
              {d.getMonth() + 1}/{d.getDate()}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** 第三步下：选择时段（按上午/下午分组） */
interface SlotProps {
  slots: { slot: string; left: number; past: boolean }[];
  value: string | null;
  onSelect: (slot: string) => void;
}

export function SlotGrid({ slots, value, onSelect }: SlotProps) {
  const groups: Record<string, typeof slots> = { 上午: [], 下午: [] };
  for (const s of slots) {
    const period = Number(s.slot.split(':')[0]) < 12 ? '上午' : '下午';
    groups[period].push(s);
  }

  return (
    <div>
      {(['上午', '下午'] as const).map((p) => {
        if (!groups[p].length) return null;
        const title = p === '下午' && groups['上午'].length ? '下午门诊' : `${p}门诊`;
        return (
          <div key={p}>
            <p className="period">{title}</p>
            <div className="slots">
              {groups[p].map(({ slot, left, past }) => {
                const disabled = left <= 0 || past;
                const right = past ? '已过号' : left <= 0 ? '已满' : `余 ${left}`;
                return (
                  <button
                    key={slot}
                    type="button"
                    className="slot"
                    aria-pressed={value === slot}
                    disabled={disabled}
                    onClick={() => onSelect(slot)}
                  >
                    <span className="t">{slot}</span>
                    <span className="r">{right}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type { Doctor };
