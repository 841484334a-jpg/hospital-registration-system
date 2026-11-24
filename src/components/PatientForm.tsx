import { useState } from 'react';
import type { Doctor, Patient } from '../types';
import { checkIdCard, idInfo } from '../lib/idcard';

interface Props {
  doctor: Doctor;
  onSubmit: (p: Patient) => void;
}

/** 第四步：就诊人信息 */
export function PatientForm({ doctor, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [idCard, setIdCard] = useState('');
  const [phone, setPhone] = useState('');
  const [idHint, setIdHint] = useState('自动识别性别与年龄');
  const [idErr, setIdErr] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleId(v: string) {
    const up = v.trim().toUpperCase();
    setIdCard(up);
    if (up.length === 18) {
      const r = checkIdCard(up);
      if (r.ok) {
        const info = idInfo(up);
        setIdHint(info.gender + ' · ' + info.age + ' 岁');
        setIdErr(false);
      } else {
        setIdHint(r.msg ?? '身份证号有误');
        setIdErr(true);
      }
    } else {
      setIdHint('自动识别性别与年龄');
      setIdErr(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!/^[一-龥A-Za-z·\s]{2,20}$/.test(name.trim())) {
      errs.name = '请填写 2–20 位中文或英文姓名';
    }
    const idr = checkIdCard(idCard);
    if (!idr.ok) errs.idCard = idr.msg ?? '身份证号有误';
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) errs.phone = '请填写 11 位手机号';

    setErrors(errs);
    if (Object.keys(errs).length) return;

    const info = idInfo(idCard);
    onSubmit({
      name: name.trim(),
      idCard: idCard.trim().toUpperCase(),
      phone: phone.trim(),
      gender: info.gender,
      age: info.age,
    });
  }

  return (
    <form className="form-grid reveal" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="pName">就诊人姓名</label>
        <input
          id="pName"
          autoComplete="name"
          placeholder="与身份证一致"
          maxLength={20}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="hint">{errors.name ?? ''}</div>
      </div>

      <div className="field">
        <label htmlFor="pId">身份证号</label>
        <input
          id="pId"
          autoComplete="off"
          placeholder="18 位身份证号"
          maxLength={18}
          value={idCard}
          onChange={(e) => handleId(e.target.value)}
        />
        <div className={'hint' + (idErr || errors.idCard ? ' err' : '')}>
          {errors.idCard ?? idHint}
        </div>
      </div>

      <div className="field full">
        <label htmlFor="pPhone">手机号</label>
        <input
          id="pPhone"
          autoComplete="tel"
          inputMode="numeric"
          placeholder="11 位手机号，用于查询与退号"
          maxLength={11}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="hint">{errors.phone ?? ''}</div>
      </div>

      <div className="submit-bar">
        <div className="total">
          挂号费<b>¥{doctor.fee}</b>
        </div>
        <button className="btn btn-primary" type="submit">
          确认挂号
        </button>
      </div>
      <p className="fineprint">
        挂号成功后生成挂号单，请按就诊序号到 {doctor.room} 候诊。
      </p>
    </form>
  );
}
