import type { Dept } from '../types';

/** 科室列表 */
export const DEPTS: Dept[] = [
    { id:'nk', name:'内科',   sub:'慢病 · 呼吸 · 消化' },
    { id:'wk', name:'外科',   sub:'普外 · 换药 · 小手术' },
    { id:'ek', name:'儿科',   sub:'14 岁以下患儿' },
    { id:'fk', name:'妇产科', sub:'妇科 · 产科' },
    { id:'gk', name:'骨科',   sub:'创伤 · 关节 · 脊柱' },
    { id:'yk', name:'眼科',   sub:'视力 · 眼底 · 干眼' },
    { id:'ebh',name:'耳鼻喉科',sub:'鼻 · 咽 · 耳' },
    { id:'pf', name:'皮肤科', sub:'皮炎 · 痤疮 · 脱发' },
    { id:'kq', name:'口腔科', sub:'牙体 · 牙周 · 修复' },
    { id:'zy', name:'中医科', sub:'调理 · 针灸 · 推拿' }
];
