import { createContext, useContext } from 'react';
import type { Appointment } from '../types';

/** 挂号单共享状态：App 统一持有，各页面通过 context 读写 */
export interface AppointmentsApi {
  appointments: Appointment[];
  add: (a: Appointment) => void;
  cancel: (id: string) => void;
  find: (id: string) => Appointment | null;
  query: (q: string) => Appointment[];
}

export const AppointmentsContext = createContext<AppointmentsApi | null>(null);

export function useAppointmentsContext(): AppointmentsApi {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error('useAppointmentsContext 必须在 AppointmentsContext.Provider 内使用');
  return ctx;
}
