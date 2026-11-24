import type { Doctor, SlotInfo } from '../types';
import { parseISO, periodOf } from './date';

export const AM = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
export const PM = ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

/** FNV-1a 字符串哈希 */
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 可复现的伪随机数生成器（同一种子永远同一序列） */
export function makeRnd(seed: number): () => number {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), t | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** 医生出诊的全部时段 */
export function slotsFor(doc: Doctor): string[] {
  let out: string[] = [];
  if (doc.half !== 'pm') out = out.concat(AM);
  if (doc.half !== 'am') out = out.concat(PM);
  return out;
}

/** 该时段是否已过号 */
export function isPast(date: string, slot: string): boolean {
  const d = parseISO(date);
  const p = slot.split(':');
  d.setHours(Number(p[0]), Number(p[1]), 0, 0);
  return d.getTime() < Date.now();
}

/** 号源余量：容量由医生+日期+时段哈希决定，再减去已挂号人数 */
export function slotInfo(
  docId: string,
  date: string,
  slot: string,
  appointments: { doctorId: string; date: string; slot: string; status: string }[]
): SlotInfo {
  const seed = hashStr(docId + '|' + date + '|' + slot);
  const capacity = 4 + (seed % 5);
  const seeded = Math.floor(makeRnd(seed)() * capacity);
  const local = appointments.filter(
    (a) => a.doctorId === docId && a.date === date && a.slot === slot && a.status === '待就诊'
  ).length;
  return { capacity, booked: seeded + local, left: capacity - seeded - local };
}

/** 医生未来 7 天内可挂号的日期 */
export function daysFor(doc: Doctor): string[] {
  const out: string[] = [];
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const d = new Date(t);
    d.setDate(t.getDate() + i);
    const s = isoOf(d);
    if (doc.work.indexOf(d.getDay()) < 0) continue;
    const bookable = slotsFor(doc).some((slot) => !isPast(s, slot));
    if (bookable) out.push(s);
  }
  return out;
}

/** 首个有号的日期 */
export function firstBookableDate(
  doc: Doctor,
  days: string[],
  appointments: { doctorId: string; date: string; slot: string; status: string }[]
): string | null {
  for (const day of days) {
    const ok = slotsFor(doc).some(
      (slot) => !isPast(day, slot) && slotInfo(doc.id, day, slot, appointments).left > 0
    );
    if (ok) return day;
  }
  return days[0] ?? null;
}

function isoOf(d: Date): string {
  return (
    d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export { periodOf };
