import type { Doctor } from '../types';

/** 医生列表 */
export const DOCTORS: Doctor[] = [
    { id:'nk1', dept:'nk', name:'陈立文', title:'主任医师',   spec:'高血压、糖尿病、血脂异常等慢病随访', room:'内科 3 诊室', fee:50, work:[1,3,5],     half:'am' },
    { id:'nk2', dept:'nk', name:'周敏',   title:'副主任医师', spec:'呼吸道感染、慢性咳嗽、慢阻肺',       room:'内科 2 诊室', fee:30, work:[2,4,6],     half:'all' },
    { id:'nk3', dept:'nk', name:'林慧',   title:'主治医师',   spec:'发热、乏力、胃肠不适初诊',           room:'内科 1 诊室', fee:20, work:[1,2,3,4,5], half:'pm' },

    { id:'wk1', dept:'wk', name:'赵剑峰', title:'主任医师',   spec:'甲状腺、乳腺结节评估与手术咨询',     room:'外科 2 诊室', fee:50, work:[2,5],       half:'am' },
    { id:'wk2', dept:'wk', name:'吴海涛', title:'副主任医师', spec:'疝气、阑尾、胆囊等腹部外科',         room:'外科 1 诊室', fee:30, work:[1,3,6],     half:'all' },
    { id:'wk3', dept:'wk', name:'郑康',   title:'主治医师',   spec:'清创缝合、换药、体表肿物',           room:'外科处置室',  fee:20, work:[2,3,4,5],   half:'pm' },

    { id:'ek1', dept:'ek', name:'李晓晴', title:'主任医师',   spec:'儿童哮喘、过敏性鼻炎',               room:'儿科 2 诊室', fee:50, work:[1,4,6],     half:'am' },
    { id:'ek2', dept:'ek', name:'孙宇',   title:'副主任医师', spec:'小儿发热、腹泻、手足口病',           room:'儿科 1 诊室', fee:30, work:[1,2,3,4,5], half:'all' },
    { id:'ek3', dept:'ek', name:'何佳',   title:'主治医师',   spec:'儿童保健、喂养与生长发育咨询',       room:'儿科 3 诊室', fee:20, work:[3,5,6],     half:'pm' },

    { id:'fk1', dept:'fk', name:'王雅琴', title:'主任医师',   spec:'妇科肿瘤、月经失调、更年期',         room:'妇产科 2 诊室', fee:50, work:[2,4],     half:'am' },
    { id:'fk2', dept:'fk', name:'刘思远', title:'副主任医师', spec:'孕期检查、产后复查',                 room:'妇产科 1 诊室', fee:30, work:[1,3,5],   half:'all' },
    { id:'fk3', dept:'fk', name:'张蕾',   title:'主治医师',   spec:'妇科炎症、计划生育咨询',             room:'妇产科 3 诊室', fee:20, work:[2,4,6],   half:'pm' },

    { id:'gk1', dept:'gk', name:'高志强', title:'主任医师',   spec:'关节置换、腰椎间盘突出',             room:'骨科 2 诊室', fee:50, work:[1,3,5],     half:'am' },
    { id:'gk2', dept:'gk', name:'马文博', title:'副主任医师', spec:'骨折复位、运动损伤、石膏固定',       room:'骨科 1 诊室', fee:30, work:[2,4,6],     half:'all' },
    { id:'gk3', dept:'gk', name:'徐斌',   title:'主治医师',   spec:'颈肩腰腿痛、骨质疏松',               room:'骨科 3 诊室', fee:20, work:[1,2,4,5],   half:'pm' },

    { id:'yk1', dept:'yk', name:'黄文静', title:'主任医师',   spec:'白内障、青光眼',                     room:'眼科 2 诊室', fee:50, work:[2,5],       half:'am' },
    { id:'yk2', dept:'yk', name:'沈可',   title:'副主任医师', spec:'近视防控、干眼症',                   room:'眼科 1 诊室', fee:30, work:[1,3,4,6],   half:'all' },
    { id:'yk3', dept:'yk', name:'唐颖',   title:'主治医师',   spec:'结膜炎、验光配镜',                   room:'眼科 3 诊室', fee:20, work:[1,2,3,4],   half:'pm' },

    { id:'ebh1',dept:'ebh',name:'罗永康', title:'主任医师',   spec:'鼻窦炎、鼾症、咽喉肿瘤',             room:'耳鼻喉科 2 诊室', fee:50, work:[1,4],   half:'am' },
    { id:'ebh2',dept:'ebh',name:'蒋雪',   title:'副主任医师', spec:'咽喉炎、中耳炎、听力下降',           room:'耳鼻喉科 1 诊室', fee:30, work:[2,3,5,6], half:'all' },
    { id:'ebh3',dept:'ebh',name:'邓超',   title:'主治医师',   spec:'耳鸣、鼻出血、异物取出',             room:'耳鼻喉科 3 诊室', fee:20, work:[1,2,4],   half:'pm' },

    { id:'pf1', dept:'pf', name:'苏婉',   title:'主任医师',   spec:'银屑病、湿疹、白癜风',               room:'皮肤科 2 诊室', fee:50, work:[3,6],     half:'am' },
    { id:'pf2', dept:'pf', name:'曹志明', title:'副主任医师', spec:'痤疮、脱发、色素性疾病',             room:'皮肤科 1 诊室', fee:30, work:[1,2,4,5],   half:'all' },
    { id:'pf3', dept:'pf', name:'白露',   title:'主治医师',   spec:'荨麻疹、接触性皮炎',                 room:'皮肤科 3 诊室', fee:20, work:[2,3,4,5],   half:'pm' },

    { id:'kq1', dept:'kq', name:'韩磊',   title:'主任医师',   spec:'种植牙、颌面部外科',                 room:'口腔科 2 诊室', fee:50, work:[1,3,6],   half:'am' },
    { id:'kq2', dept:'kq', name:'顾晓东', title:'副主任医师', spec:'根管治疗、牙周病',                   room:'口腔科 1 诊室', fee:30, work:[2,4,5],     half:'all' },
    { id:'kq3', dept:'kq', name:'汪莉',   title:'主治医师',   spec:'洗牙、补牙、口腔常规检查',           room:'口腔科 3 诊室', fee:20, work:[1,2,3,4,5], half:'pm' },

    { id:'zy1', dept:'zy', name:'沈国华', title:'主任医师',   spec:'脾胃病、失眠、慢性疲劳',             room:'中医科 2 诊室', fee:50, work:[2,5],       half:'am' },
    { id:'zy2', dept:'zy', name:'叶青',   title:'副主任医师', spec:'针灸推拿、颈肩腰痛',                 room:'中医科 1 诊室', fee:30, work:[1,3,4,6],   half:'all' },
    { id:'zy3', dept:'zy', name:'何雨桐', title:'主治医师',   spec:'体质调理、亚健康、女性调理',         room:'中医科 3 诊室', fee:20, work:[1,2,4],     half:'pm' }
];
