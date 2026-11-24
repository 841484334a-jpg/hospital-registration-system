/** 日期与时间工具 */

export const WD = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/** Date → YYYY-MM-DD */
export function iso(d: Date): string {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

/** YYYY-MM-DD → Date */
export function parseISO(s: string): Date {
  const p = s.split('-');
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}

/** YYYY-MM-DD → 「3月5日 周二」 */
export function dateCn(s: string): string {
  const d = parseISO(s);
  return d.getMonth() + 1 + '月' + d.getDate() + '日 ' + WD[d.getDay()];
}

/** 今天的 YYYY-MM-DD */
export function todayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return iso(d);
}

/** 时段属于上午还是下午 */
export function periodOf(slot: string): '上午' | '下午' {
  return Number(slot.split(':')[0]) < 12 ? '上午' : '下午';
}
