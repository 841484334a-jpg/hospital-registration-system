/** 身份证校验与信息解析 */

const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

/** 校验 18 位身份证号（含 GB 11643 校验位） */
export function checkIdCard(id: string): { ok: boolean; msg?: string; id?: string } {
  const v = String(id || '').trim().toUpperCase();
  if (!/^\d{17}[\dX]$/.test(v)) return { ok: false, msg: '身份证号应为 18 位' };
  let sum = 0;
  for (let i = 0; i < 17; i++) sum += Number(v[i]) * WEIGHTS[i];
  if (CODES[sum % 11] !== v[17]) return { ok: false, msg: '身份证号校验不通过，请核对' };
  return { ok: true, id: v };
}

/** 从身份证号解析性别与年龄 */
export function idInfo(id: string): { gender: '男' | '女'; age: number } {
  const y = Number(id.slice(6, 10));
  const m = Number(id.slice(10, 12));
  const d = Number(id.slice(12, 14));
  const birth = new Date(y, m - 1, d);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
    age--;
  }
  const gender = Number(id[16]) % 2 === 1 ? '男' : '女';
  return { gender, age };
}
