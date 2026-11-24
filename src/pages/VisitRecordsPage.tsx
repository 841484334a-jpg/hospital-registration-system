import { useState } from 'react';
import type { Appointment } from '../types';
import { useAppointmentsContext } from '../hooks/appointmentsContext';
import { dateCn } from '../lib/date';
import { isPast } from '../lib/slots';

interface Props {
  onPrint: (a: Appointment) => void;
}

/** 就诊记录：已完成就诊的历史记录（只读） */
export function VisitRecordsPage({ onPrint }: Props) {
  const { appointments } = useAppointmentsContext();
  const [keyword, setKeyword] = useState('');

  // 只统计「已就诊」（时段已过且未退号）
  const visited = appointments
    .filter((a) => a.status === '待就诊' && isPast(a.date, a.slot))
    .filter((a) => {
      const k = keyword.trim().toUpperCase();
      if (!k) return true;
      return (
        a.patient.name.toUpperCase().includes(k) ||
        a.patient.phone === k ||
        a.patient.idCard.toUpperCase() === k ||
        a.id.toUpperCase() === k
      );
    })
    .sort((a, b) => (b.date + b.slot).localeCompare(a.date + a.slot));

  const totalFee = visited.reduce((sum, a) => sum + a.fee, 0);

  return (
    <>
      <div className="records-head">
        <h1 className="page-title">就诊记录</h1>
        <p className="page-sub">
          已完成的就诊记录汇总，可查询历史就诊科室、医生与费用，用于复诊参考。
        </p>
        <form className="lookup" onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="姓名 / 手机号 / 身份证号 / 挂号单号"
            autoComplete="off"
            aria-label="查询就诊记录"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            查询
          </button>
        </form>
      </div>

      {visited.length > 0 && (
        <div className="visit-summary">
          <span>
            共 <b>{visited.length}</b> 次就诊
          </span>
          <span>
            累计挂号费 <b>¥{totalFee}</b>
          </span>
          <span>
            最近一次 <b>{dateCn(visited[0].date)}</b>
          </span>
        </div>
      )}

      <div className="record-list">
        {!visited.length ? (
          <div className="empty-state">
            <div className="big">暂无就诊记录</div>
            挂号且就诊时间已过后，记录会出现在这里。
          </div>
        ) : (
          visited.map((a) => (
            <div className="rec" key={a.id}>
              <div>
                <div className="rec-when">
                  <span className="rec-date">{dateCn(a.date)}</span>
                  <span className="rec-time">{a.slot}</span>
                  <span className="tag done">已就诊</span>
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
                    挂号费 <span className="mono">¥{a.fee}</span>
                  </span>
                </div>
              </div>
              <div className="rec-actions">
                <button className="btn btn-ghost btn-sm" type="button" onClick={() => onPrint(a)}>
                  打印凭证
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
