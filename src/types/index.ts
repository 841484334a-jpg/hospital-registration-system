/** 科室 */
export interface Dept {
  id: string;
  name: string;
  sub: string;
}

/** 医生 */
export interface Doctor {
  id: string;
  dept: string;
  name: string;
  title: string;
  spec: string;
  room: string;
  fee: number;
  /** 出诊星期（0=周日） */
  work: number[];
  /** 出诊时段：am 上午 / pm 下午 / all 全天 */
  half: 'am' | 'pm' | 'all';
}

/** 就诊人 */
export interface Patient {
  name: string;
  idCard: string;
  phone: string;
  gender: '男' | '女';
  age: number;
}

/** 挂号状态 */
export type ApptStatus = '待就诊' | '已退号';

/** 挂号单 */
export interface Appointment {
  id: string;
  deptId: string;
  deptName: string;
  doctorId: string;
  doctorName: string;
  title: string;
  room: string;
  fee: number;
  date: string;
  slot: string;
  period: '上午' | '下午';
  seq: string;
  patient: Patient;
  createdAt: string;
  status: ApptStatus;
}

/** 号源余量 */
export interface SlotInfo {
  capacity: number;
  booked: number;
  left: number;
}

/** 挂号流程状态 */
export interface BookingState {
  dept: string | null;
  doctor: string | null;
  date: string | null;
  slot: string | null;
  booked: Appointment | null;
}
