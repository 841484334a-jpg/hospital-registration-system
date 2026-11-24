import { useEffect, useMemo, useRef, useState } from 'react';
import type { Appointment, Patient } from '../types';
import { DEPTS } from '../data/departments';
import { DOCTORS } from '../data/doctors';
import { DeptGrid } from '../components/DeptGrid';
import { DoctorList } from '../components/DoctorList';
import { DatePicker, SlotGrid } from '../components/SlotGrid';
import { PatientForm } from '../components/PatientForm';
import { SlipCard, type DraftSlip } from '../components/SlipCard';
import { useAppointmentsContext } from '../hooks/appointmentsContext';
import { useBookingState } from '../hooks/useAppointments';
import { daysFor, firstBookableDate, isPast, periodOf, slotInfo, slotsFor } from '../lib/slots';
import { dateCn } from '../lib/date';

interface Props {
  onViewRecords: () => void;
  onToast: (msg: string) => void;
  onPrint: (a: Appointment) => void;
  onCancel: (a: Appointment) => void;
}

/** 自助挂号页：科室 → 医生 → 日期 → 时段 → 就诊人 → 挂号单 */
export function RegisterPage({ onViewRecords, onToast, onPrint, onCancel }: Props) {
  const { appointments, add } = useAppointmentsContext();
  const { state, patch, reset } = useBookingState();
  const [success, setSuccess] = useState<Appointment | null>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  const dept = DEPTS.find((d) => d.id === state.dept) ?? null;
  const doctor = DOCTORS.find((d) => d.id === state.doctor) ?? null;
  const doctors = useMemo(
    () => (state.dept ? DOCTORS.filter((d) => d.dept === state.dept) : []),
    [state.dept]
  );

  const days = useMemo(() => (doctor ? daysFor(doctor) : []), [doctor]);

  // 选医生后自动定位到首个有号日期
  useEffect(() => {
    if (!doctor) return;
    const ds = daysFor(doctor);
    if (!ds.length) {
      patch({ date: null });
      return;
    }
    if (!state.date || ds.indexOf(state.date) < 0) {
      patch({ date: firstBookableDate(doctor, ds, appointments) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor]);

  const slotRows = useMemo(() => {
    if (!doctor || !state.date) return [];
    return slotsFor(doctor).map((slot) => {
      const info = slotInfo(doctor.id, state.date!, slot, appointments);
      return { slot, left: info.left, past: isPast(state.date!, slot) };
    });
  }, [doctor, state.date, appointments]);

  function selectDept(id: string) {
    const next = id === state.dept ? null : id;
    patch({ dept: next, doctor: null, date: null, slot: null, booked: null });
    setSuccess(null);
  }

  function selectDoctor(id: string) {
    const next = id === state.doctor ? null : id;
    patch({ doctor: next, date: null, slot: null, booked: null });
    setSuccess(null);
  }

  function selectDate(d: string) {
    patch({ date: d, slot: null, booked: null });
    setSuccess(null);
  }

  function selectSlot(s: string) {
    patch({ slot: s, booked: null });
    setSuccess(null);
    setTimeout(() => nameRef.current?.querySelector('input')?.focus({ preventScroll: true }), 0);
  }

  function submit(patient: Patient) {
    if (!doctor || !state.date || !state.slot) return;

    // 同一就诊人不能重复挂同一时段
    const dup = appointments.some(
      (a) =>
        a.status === '待就诊' &&
        a.doctorId === doctor.id &&
        a.date === state.date &&
        a.slot === state.slot &&
        a.patient.idCard === patient.idCard
    );
    if (dup) {
      onToast('该就诊人已挂过这个时段的号，请勿重复挂号');
      return;
    }

    const info = slotInfo(doctor.id, state.date, state.slot, appointments);
    if (info.left <= 0) {
      onToast('该时段号源刚被挂完，请换一个时段');
      return;
    }

    const appt: Appointment = {
      id:
        'GH' +
        state.date.replace(/-/g, '') +
        '-' +
        String(appointments.length + 1).padStart(4, '0'),
      deptId: doctor.dept,
      deptName: DEPTS.find((d) => d.id === doctor.dept)?.name ?? '',
      doctorId: doctor.id,
      doctorName: doctor.name,
      title: doctor.title,
      room: doctor.room,
      fee: doctor.fee,
      date: state.date,
      slot: state.slot,
      period: periodOf(state.slot),
      seq: String(info.booked + 1).padStart(2, '0'),
      patient,
      createdAt: new Date().toISOString(),
      status: '待就诊',
    };

    add(appt);
    setSuccess(appt);
    onToast('挂号成功，就诊序号 ' + appt.seq + ' 号');
  }

  function resetFlow() {
    reset();
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const draft: DraftSlip | null = dept
    ? {
        deptName: dept.name,
        doctorName: doctor?.name,
        title: doctor?.title,
        room: doctor?.room,
        fee: doctor?.fee,
        date: state.date,
        slot: state.slot,
        seq: '',
      }
    : null;

  const locked2 = !state.dept;
  const locked3 = !state.doctor;
  const locked4 = !state.slot;

  return (
    <div className="layout">
      <div className="flow">
        {/* 01 选科室 */}
        <section className="step">
          <div className="step-num">01</div>
          <div className="step-body">
            <h2 className="step-title">选择科室</h2>
            <p className="step-hint">按病情选择科室，不确定时可选内科初诊。支持按科室快速筛选。</p>
            <DeptGrid depts={DEPTS} value={state.dept} onSelect={selectDept} />
          </div>
        </section>

        {/* 02 选医生 */}
        <section className={'step' + (locked2 ? ' is-locked' : '')}>
          <div className="step-num">02</div>
          <div className="step-body">
            <h2 className="step-title">选择医生</h2>
            <p className="step-hint">
              {locked2
                ? '先选择科室。'
                : `${dept!.name} 今日出诊医生 ${doctors.length} 位，挂号费按职称收取。`}
            </p>
            <DoctorList doctors={doctors} value={state.doctor} onSelect={selectDoctor} />
          </div>
        </section>

        {/* 03 选时间 */}
        <section className={'step' + (locked3 ? ' is-locked' : '')}>
          <div className="step-num">03</div>
          <div className="step-body">
            <h2 className="step-title">选择就诊时间</h2>
            <p className="step-hint">
              {locked3
                ? '先选择医生。'
                : !days.length
                  ? `${doctor!.name} ${doctor!.title} 未来 7 天已无号源。`
                  : `${doctor!.name} ${doctor!.title} · 未来 7 天内出诊 ${days.length} 天，每人限挂 1 个号。`}
            </p>
            <DatePicker days={days} value={state.date} onSelect={selectDate} />
            {state.date && <SlotGrid slots={slotRows} value={state.slot} onSelect={selectSlot} />}
          </div>
        </section>

        {/* 04 就诊人信息 */}
        <section className={'step' + (locked4 ? ' is-locked' : '')}>
          <div className="step-num">04</div>
          <div className="step-body">
            <h2 className="step-title">就诊人信息</h2>
            <p className="step-hint">
              {locked4 ? '先选择就诊时段。' : '信息仅保存在本机浏览器，用于取号与退号。'}
            </p>
            <div ref={nameRef}>
              {!locked4 && !success && doctor && (
                <PatientForm doctor={doctor} onSubmit={submit} />
              )}
              {success && (
                <div
                  className="reveal"
                  style={{
                    border: '1px solid #cfe0dd',
                    background: '#f4faf8',
                    padding: '18px 20px',
                    marginTop: 14,
                  }}
                >
                  <p style={{ fontFamily: 'var(--serif)', fontSize: 17, letterSpacing: '.1em' }}>
                    挂号成功
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6 }}>
                    {dateCn(success.date)} {success.slot} · {success.deptName} {success.doctorName} ·
                    就诊序号 <b style={{ fontFamily: 'var(--mono)' }}>{success.seq}</b> 号 ·{' '}
                    {success.room}
                  </p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={() => onPrint(success)}
                    >
                      打印挂号单
                    </button>
                    <button className="btn btn-ghost btn-sm" type="button" onClick={resetFlow}>
                      再挂一个号
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={onViewRecords}
                    >
                      查看我的挂号
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <aside className="side">
        <div>
          {dept || success ? (
            <SlipCard appt={success} draft={success ? null : draft} />
          ) : (
            <div className="slip-empty">
              <div className="g">挂号单</div>
              选择科室后，挂号单会在这里同步生成。
            </div>
          )}
        </div>
        <div className="side-actions">
          {success && (
            <>
              <button
                className="btn btn-ghost btn-sm"
                type="button"
                onClick={() => onPrint(success)}
              >
                打印挂号单
              </button>
              {success.status === '待就诊' && (
                <button
                  className="btn btn-ghost btn-sm"
                  type="button"
                  onClick={() => onCancel(success)}
                >
                  退号
                </button>
              )}
            </>
          )}
        </div>
        <p className="notice">
          <b>就诊提示</b>
          <br />
          请于就诊前 15 分钟到达对应诊室，凭挂号单候诊。
          <br />
          当日号源以实际剩余为准，挂号后可在「我的挂号」中退号。
        </p>
      </aside>
    </div>
  );
}
