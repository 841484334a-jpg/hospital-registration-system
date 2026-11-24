import { useCallback, useEffect, useRef, useState } from 'react';
import type { Appointment } from './types';
import { Masthead, type ViewName } from './components/Masthead';
import { CancelDialog } from './components/CancelDialog';
import { SlipCard } from './components/SlipCard';
import { RegisterPage } from './pages/RegisterPage';
import { RecordsPage } from './pages/RecordsPage';
import { VisitRecordsPage } from './pages/VisitRecordsPage';
import { useAppointments } from './hooks/useAppointments';
import { AppointmentsContext } from './hooks/appointmentsContext';
import { dateCn } from './lib/date';

type View = ViewName;

export default function App() {
  const api = useAppointments();
  const { cancel } = api;
  const [view, setView] = useState<View>('register');
  const [toastMsg, setToastMsg] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const [pending, setPending] = useState<Appointment | null>(null);
  const [printing, setPrinting] = useState<Appointment | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastShow(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastShow(false), 2600);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const openCancel = useCallback((a: Appointment) => setPending(a), []);

  const doCancel = useCallback(() => {
    if (!pending) return;
    cancel(pending.id);
    setPending(null);
    toast('已退号，号源已释放');
  }, [pending, cancel, toast]);

  const print = useCallback((a: Appointment) => {
    setPrinting(a);
    // 等渲染完成后再唤起打印
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => setPrinting(null), 300);
    }, 100);
  }, []);

  return (
    <AppointmentsContext.Provider value={api}>
      <Masthead view={view} onChange={setView} />

      <main className="wrap">
        <section className="view" hidden={view !== 'register'}>
          <RegisterPage
            onViewRecords={() => setView('records')}
            onToast={toast}
            onPrint={print}
            onCancel={openCancel}
          />
        </section>
        <section className="view" hidden={view !== 'records'}>
          <RecordsPage onPrint={print} onCancel={openCancel} />
        </section>
        <section className="view" hidden={view !== 'visit'}>
          <VisitRecordsPage onPrint={print} />
        </section>
      </main>

      <div id="toast" className={toastShow ? 'show' : ''} role="status" aria-live="polite">
        {toastMsg}
      </div>

      <CancelDialog
        open={!!pending}
        text={
          pending
            ? `将退掉 ${dateCn(pending.date)} ${pending.slot} · ${pending.deptName} ${pending.doctorName} 的号（就诊序号 ${pending.seq} 号）。退号后号源会释放给其他患者。`
            : ''
        }
        onConfirm={doCancel}
        onCancel={() => setPending(null)}
      />

      <div id="printOnly">{printing && <SlipCard appt={printing} draft={null} />}</div>
    </AppointmentsContext.Provider>
  );
}
