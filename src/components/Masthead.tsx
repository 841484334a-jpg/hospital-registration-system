import { WD } from '../lib/date';

interface Props {
  view: 'register' | 'records';
  onChange: (v: 'register' | 'records') => void;
}

/** 顶部院牌 + 标签导航 */
export function Masthead({ view, onChange }: Props) {
  const now = new Date();
  const today =
    now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + WD[now.getDay()];

  return (
    <header className="masthead">
      <div className="mast-inner">
        <div className="mast-top">
          <div className="brand">
            <div className="brand-mark">仁和医院</div>
            <div className="brand-sub">门诊自助挂号</div>
          </div>
          <div className="mast-meta">
            <strong>{today}</strong>
            <div>门诊时间 08:00–12:00 · 13:30–17:00</div>
          </div>
        </div>
        <div className="tabs" role="tablist" aria-label="页面">
          <button
            className={'tab' + (view === 'register' ? ' is-active' : '')}
            role="tab"
            aria-selected={view === 'register'}
            onClick={() => onChange('register')}
          >
            自助挂号
          </button>
          <button
            className={'tab' + (view === 'records' ? ' is-active' : '')}
            role="tab"
            aria-selected={view === 'records'}
            onClick={() => onChange('records')}
          >
            我的挂号
          </button>
        </div>
      </div>
    </header>
  );
}
