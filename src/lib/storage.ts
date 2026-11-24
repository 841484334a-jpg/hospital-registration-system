import type { Appointment } from '../types';

const STORE_KEY = 'renhe-gh-v1';

/** 读取本地保存的挂号单 */
export function loadAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? (arr as Appointment[]) : [];
  } catch {
    return [];
  }
}

/** 保存挂号单到本地 */
export function saveAppointments(list: Appointment[]): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch {
    // 隐私模式下写入会失败，静默忽略
  }
}
