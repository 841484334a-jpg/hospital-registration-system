import type { Appointment } from '../types';
import { dateCn } from '../lib/date';
import { hashStr, makeRnd } from '../lib/slots';

/** 模拟条码 */
function Barcode({ id }: { id: string }) {
  const r = makeRnd(hashStr(id || 'empty'));
  const bars = [];
  for (let i = 0; i < 62; i++) {
    const dark = r() > 0.38;
    const w = 1 + Math.floor(r() * 2);
    bars.push(
      <span
        key={i}
        style={{ width: (dark ? w : 1) + 'px', ...(dark ? {} : { background: 'transparent' }) }}
      />
    );
  }
  return <div className="barcode">{bars}</div>;
}

export interface DraftSlip {
  deptName?: string;
  doctorName?: string;
  title?: string;
  room?: string;
  fee?: number;
  date?: string | null;
  slot?: string | null;
  seq?: string;
}

interface Props {
  appt: Appointment | null;
  draft: DraftSlip | null;
}

function dd(v: string | number | null | undefined, cls = '') {
  return (
    <dd className={cls} style={v ? undefined : { color: '#b3c2c2' }}>
      {v ? v : '—'}
    </dd>
  );
}

/** 挂号单（含模拟条码与印章） */
export function SlipCard({ appt, draft }: Props) {
  const d = appt ?? draft;
  const voided = !!appt && appt.status === '已退号';

  return (
    <div className="slip">
      <div className="slip-head">
        <div className="slip-host">仁和医院</div>
        <div className="slip-title">门诊挂号单</div>
        <div className="slip-en">RENHE HOSPITAL · OUTPATIENT REGISTRATION</div>
      </div>

      <dl>
        <dt>挂号单号</dt>
        {appt ? <dd className="num">{appt.id}</dd> : dd('确认后生成', 'num')}
        <dt>科室</dt>
        {appt ? <dd>{appt.deptName}</dd> : dd(d?.deptName)}
        <dt>医生</dt>
        {appt ? (
          <dd>
            {appt.doctorName}{' '}
            <span style={{ color: '#6f878c', fontSize: 12 }}>{appt.title}</span>
          </dd>
        ) : (
          dd(d && d.doctorName ? d.doctorName + ' ' + (d.title ?? '') : '')
        )}
        <dt>就诊时间</dt>
        {appt ? (
          <dd>
            {dateCn(appt.date)} {appt.slot}
          </dd>
        ) : (
          dd(d && d.date ? dateCn(d.date) + ' ' + d.slot : '')
        )}
        <dt>就诊序号</dt>
        {appt ? <dd className="num">{appt.seq} 号</dd> : dd(d && d.seq ? d.seq + ' 号' : '')}
        <dt>诊室</dt>
        {appt ? <dd>{appt.room}</dd> : dd(d && d.room)}
        <div className="divider" style={{ gridColumn: '1/-1' }} />
        <dt>就诊人</dt>
        {appt ? <dd>{appt.patient.name}</dd> : dd('')}
        <dt>性别年龄</dt>
        {appt ? (
          <dd>
            {appt.patient.gender} · {appt.patient.age} 岁
          </dd>
        ) : (
          dd('')
        )}
        <dt>手机号</dt>
        {appt ? <dd className="num">{appt.patient.phone}</dd> : dd('')}
        <dt>挂号费</dt>
        {appt ? <dd className="num">¥{appt.fee}</dd> : dd(d && d.fee ? '¥' + d.fee : '')}
        <dt>状态</dt>
        {appt ? <dd>{voided ? '已退号' : '待就诊'}</dd> : dd('待确认')}
      </dl>

      <div className="divider" />
      <div className="slip-foot">
        <Barcode id={appt ? appt.id : 'draft'} />
        <div className="bc-num">{appt ? appt.id : 'NO. —'}</div>
        <p className="slip-note">
          {appt
            ? voided
              ? '该号已退，如需就诊请重新挂号。'
              : '请于就诊前 15 分钟到诊室候诊。'
            : '选定科室、医生与时段后，自动生成挂号单。'}
        </p>
      </div>

      {appt && (
        <div className={'seal ' + (voided ? 'void' : 'press')}>
          <div>
            <div className="s1">{voided ? '已退号' : '已挂号'}</div>
            <div className="s2">仁和医院 挂号专用</div>
          </div>
        </div>
      )}
    </div>
  );
}
