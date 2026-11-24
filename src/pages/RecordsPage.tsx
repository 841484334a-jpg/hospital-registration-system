import { useState } from 'react';
import type { Appointment } from '../types';
import { useAppointmentsContext } from '../hooks/appointmentsContext';
import { dateCn } from '../lib/date';
import { isPast } from '../lib/slots';

interface Props {
  onPrint: (a: Appointment) => void;
  onCancel: (a: Appointment) => void;
}

function statusOf(a: Appointment): '已退号' | '已完成' | '待就诊' {
  if (a.status === '已退号') return '已退号';
  if (isPast(a.date, a.slot)) return '已完成';
  return '待就诊';
}

/** 我的挂号：按手机号 / 身份证号 / 挂号单号查询 */
export function RecordsPage({ onPrint, onCancel }: Props) {
  const { query } = useAppointmentsContext();
  const [input, setInput] = useState('');

  const hits = query(input);

  return (
    <>
      <div className="records-head">
        <h1 className="page-title">我的挂号</h1>
        <p className="page-sub">
          用挂号时填写的手机号、身份证号或挂号单号查询，可退号或补打挂号单。
        </p>
        <form
          className="lookup"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            placeholder="手机号 / 身份证号 / 挂号单号"
            autoComplete="off"
            aria-label="查询条件"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            查询
          </button>
        </form>
      </div>

      <div className="record-list">
        {!input.trim() ? (
          <div className="empty-state">
            <div className="big">还没有查询</div>
            输入手机号、身份证号或挂号单号，查看已挂的号。
          </div>
        ) : !hits.length ? (
          <div className="empty-state">
            <div className="big">没有找到挂号记录</div>
            请确认输入的是挂号时填写的手机号或身份证号。
          </div>
        ) : (
          hits.map((a) => {
            const st = statusOf(a);
            const cls = st === '已退号' ? 'void' : st === '待就诊' ? 'wait' : 'done';
            return (
              <div className="rec" key={a.id}>
                <div>
                  <div className="rec-when">
                    <span className="rec-date">{dateCn(a.date)}</span>
                    <span className="rec-time">{a.slot}</span>
                    <span className={'tag ' + cls}>{st}</span>
                  </div>
                  <div className="rec-main">
                    {a.deptName} <span className="sep">/</span> {a.doctorName} {a.title}{' '}
                    <span className="sep">/</span> {a.room}
                  </div>
                  <div className="rec-meta">
                    <span>
                      就诊序号 <span className="mono">{a.seq}</span> 号
                    </span>
                    <span>就诊人 {a.patient.name}</span>
                    <span>
                      挂号单号 <span className="mono">{a.id}</span>
                    </span>
                  </div>
                </div>
                <div className="rec-actions">
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => onPrint(a)}>
                    打印
                  </button>
                  {st === '待就诊' && (
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => onCancel(a)}
                    >
                      退号
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
