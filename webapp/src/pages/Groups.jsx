import { useState, useEffect } from 'react';
import { api } from '../api';
import { Card, Btn, Icon, icons, Toast, useToast } from '../components';
import { T } from '../theme';

const EMOJIS=['💕','🌸','💄','🌹','✨','🛍️'];

export default function Groups() {
  const [groups,setGroups]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [name,setName]=useState('');
  const [username,setUsername]=useState('');
  const {toast,show}=useToast();

  const load=async()=>{ const d=await api.getGroups(); setGroups(d||[]); };
  useEffect(()=>{load();},[]);

  const add=async()=>{
    if(!name.trim()||!username.trim()) return show('Maydonlarni to\'ldiring','error');
    const r=await api.addGroup({name:name.trim(),username:username.trim()});
    if(r.ok){show("✅ Qo'shildi");setName('');setUsername('');setShowForm(false);load();}
    else show(r.message||'Xatolik','error');
  };

  const remove=async(id,gname)=>{
    if(!confirm(`"${gname}" ni o'chirasizmi?`)) return;
    const r=await api.deleteGroup(id);
    if(r.ok){show("✅ O'chirildi");load();}
  };

  return (
    <div style={{padding:'20px 16px'}}>
      <Toast toast={toast}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <div style={{fontFamily:'Playfair Display',fontSize:22,fontWeight:700,color:T.text}}>Guruhlar</div>
        <Btn small onClick={()=>setShowForm(!showForm)}><Icon d={showForm?icons.x:icons.plus} size={14} color="#fff"/>{showForm?'Yopish':"Qo'shish"}</Btn>
      </div>

      {showForm&&<Card style={{border:`1.5px solid rgba(232,82,122,.3)`,background:T.card2,animation:'fadeUp .3s ease'}}>
        <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',marginBottom:5}}>Guruh nomi</div>
        <input placeholder="💕 Lady Shop" value={name} onChange={e=>setName(e.target.value)}/>
        <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',marginBottom:5,marginTop:10}}>Username</div>
        <input placeholder="@ladyshop_pop" value={username} onChange={e=>setUsername(e.target.value)}/>
        <div style={{marginTop:12}}><Btn full onClick={add}><Icon d={icons.check} size={16} color="#fff"/>Qo'shish</Btn></div>
      </Card>}

      {groups.map((g,i)=>(
        <div key={g.id} style={{animation:`fadeUp .3s ease ${i*.05}s both`}}>
          <Card>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:46,height:46,borderRadius:16,flexShrink:0,background:'linear-gradient(135deg,rgba(232,82,122,.25),rgba(200,50,90,.1))',border:'1.5px solid rgba(232,82,122,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{EMOJIS[i%EMOJIS.length]}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:T.text,fontSize:15}}>{g.name}</div>
                <div style={{fontSize:12,color:T.pink,marginTop:3,fontWeight:600}}>{g.username}</div>
              </div>
              <Btn small red onClick={()=>remove(g.id,g.name)}><Icon d={icons.trash} size={13} color="#ff4d5a"/></Btn>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
