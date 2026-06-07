import { useState, useEffect } from 'react';
import { api } from '../api';
import { Card, Btn, Toggle, Icon, icons, Toast, useToast } from '../components';
import { T } from '../theme';

export default function Reply() {
  const [cfg,setCfg]=useState(null);
  const [wait,setWait]=useState(3);
  const [showForm,setShowForm]=useState(false);
  const [kws,setKws]=useState('');
  const [reply,setReply]=useState('');
  const {toast,show}=useToast();

  const load=async()=>{ const d=await api.getReply(); setCfg(d); setWait(d.wait_minutes||3); };
  useEffect(()=>{load();},[]);

  const toggle=async()=>{ const r=await api.toggleReply(); if(r.ok){show(r.message);load();} };

  const saveWait=async()=>{ const r=await api.setWait(wait); if(r.ok) show(r.message); };

  const addRule=async()=>{
    const keywords=kws.split(',').map(s=>s.trim()).filter(Boolean);
    if(!keywords.length||!reply.trim()) return show('Maydonlarni to\'ldiring','error');
    const r=await api.addRule({keywords,reply:reply.trim()});
    if(r.ok){show('✅ Qo\'shildi');setKws('');setReply('');setShowForm(false);load();}
    else show(r.message||'Xatolik','error');
  };

  const del=async id=>{ if(!confirm('O\'chirasizmi?')) return; const r=await api.deleteRule(id); if(r.ok){show('✅ O\'chirildi');load();} };

  return (
    <div style={{padding:'20px 16px'}}>
      <Toast toast={toast}/>
      <div style={{fontFamily:'Playfair Display',fontSize:22,fontWeight:700,color:T.text,marginBottom:18}}>Avtomatik Javob</div>

      <Card glow>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontWeight:700,color:T.text}}>Holati</div>
            <div style={{fontSize:12,marginTop:2,color:cfg?.enabled?'#4cd97a':T.muted}}>{cfg?.enabled?'✓ Faol':'✗ O\'chiq'}</div>
          </div>
          <Toggle on={cfg?.enabled} onClick={toggle}/>
        </div>
      </Card>

      <Card>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
          <Icon d={icons.clock} size={16} color={T.gold}/>
          <span style={{fontWeight:700,color:T.text}}>Kutish vaqti</span>
        </div>
        <div style={{display:'flex',gap:8,marginBottom:10}}>
          {[1,3,5,10].map(m=>(
            <div key={m} onClick={()=>setWait(m)} style={{flex:1,padding:'10px 4px',textAlign:'center',background:wait===m?'rgba(232,82,122,.15)':'rgba(255,255,255,.04)',border:`1.5px solid ${wait===m?T.pink:'transparent'}`,borderRadius:10,fontSize:13,fontWeight:700,color:wait===m?T.pink:T.muted,cursor:'pointer'}}>
              {m}dq
            </div>
          ))}
        </div>
        <Btn full outline onClick={saveWait}><Icon d={icons.check} size={14} color={T.pink}/>Saqlash</Btn>
        <p style={{fontSize:11,color:T.muted,marginTop:8,textAlign:'center'}}>Sen {wait} daqiqa javob bermasan — bot o'zi javob beradi</p>
      </Card>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <div style={{fontSize:13,fontWeight:700,color:T.muted,textTransform:'uppercase',letterSpacing:'.5px'}}>Qoidalar ({cfg?.rules?.length||0})</div>
        <Btn small onClick={()=>setShowForm(!showForm)}><Icon d={showForm?icons.x:icons.plus} size={13} color="#fff"/>{showForm?'Yopish':"Qo'shish"}</Btn>
      </div>

      {showForm&&<Card style={{border:`1.5px solid rgba(232,82,122,.3)`,background:T.card2,animation:'fadeUp .3s ease'}}>
        <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',marginBottom:5}}>Kalit so'zlar (vergul bilan)</div>
        <input placeholder="salom, ssalom, hi" value={kws} onChange={e=>setKws(e.target.value)}/>
        <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',marginBottom:5,marginTop:10}}>Javob matni</div>
        <textarea placeholder="Vaalaykum assalom! 💕" value={reply} onChange={e=>setReply(e.target.value)} style={{marginBottom:4}}/>
        <div style={{marginTop:12}}><Btn full onClick={addRule}><Icon d={icons.check} size={16} color="#fff"/>Saqlash</Btn></div>
      </Card>}

      {cfg?.rules?.map((r,i)=>(
        <div key={r.id} style={{animation:`fadeUp .3s ease ${i*.04}s both`}}>
          <Card>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div style={{flex:1,marginRight:10}}>
                <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:8}}>
                  {r.keywords.map(k=><span key={k} style={{background:'rgba(232,82,122,.1)',color:T.pinkL,borderRadius:7,padding:'3px 9px',fontSize:11,fontWeight:700}}>{k}</span>)}
                </div>
                <div style={{fontSize:12,color:T.muted,lineHeight:1.5}}>{r.reply.length>90?r.reply.slice(0,90)+'...':r.reply}</div>
              </div>
              <Btn small red onClick={()=>del(r.id)}><Icon d={icons.trash} size={13} color="#ff4d5a"/></Btn>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
