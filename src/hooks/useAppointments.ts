import { useCallback, useMemo, useState } from 'react';
import type { Appointment, BookingState } from '../types';
import { loadAppointments, saveAppointments } from '../lib/storage';
import type { AppointmentsApi } from './appointmentsContext';

/** 挂号单的增删改查，替代原版全局 appointments 变量 */
export function useAppointments(): AppointmentsApi {
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadAppointments());

  const add = useCallback((appt: Appointment) => {
    setAppointments((prev) => {
      const next = [...prev, appt];
      saveAppointments(next);
      return next;
    });
  }, []);

  const cancel = useCallback((id: string) => {
    setAppointments((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, status: '已退号' as const } : a));
      saveAppointments(next);
      return next;
    });
  }, []);

  const find = useCallback(
    (id: string) => appointments.find((a) => a.id === id) ?? null,
    [appointments]
  );

  const query = useCallback(
    (q: string) => {
      const key = q.trim().toUpperCase();
      if (!key) return [];
      return appointments
        .filter(
          (a) =>
            a.patient.phone === key ||
            a.patient.idCard.toUpperCase() === key ||
            a.id.toUpperCase() === key
        )
        .sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot));
    },
    [appointments]
  );

  return useMemo(
    () => ({ appointments, add, cancel, find, query }),
    [appointments, add, cancel, find, query]
  );
}

/** 挂号流程状态（科室→医生→日期→时段） */
export function useBookingState() {
  const [state, setState] = useState<BookingState>({
    dept: null,
    doctor: null,
    date: null,
    slot: null,
    booked: null,
  });

  const patch = useCallback((next: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...next }));
  }, []);

  const reset = useCallback(() => {
    setState({ dept: null, doctor: null, date: null, slot: null, booked: null });
  }, []);

  return { state, patch, reset };
}
