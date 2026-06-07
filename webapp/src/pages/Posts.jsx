import { useState, useEffect } from 'react';
import { api } from '../api';
import { Card, Btn, Icon, icons, Toast, useToast } from '../components';
import { T } from '../theme';

const TYPES = { text:'✍️ Faqat matn', image:'🖼️ Faqat rasm', 'image+text':'📸 Rasm+Matn', album:'🗂️ Albom' };
const Label = ({ c }) => <div style={{ fontSize:11,color:T.muted,fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',marginBottom:5,marginTop:10 }}>{c}</div>;
const Badge = ({ children, color=T.pink }) => <span style={{ background:color+'22',color,borderRadius:8,padding:'3px 9px',fontSize:11,fontWeight:700 }}>{children}</span>;

export default function Posts() {
  const [posts,setPosts]=useState([]);
  const [groups,setGroups]=useState([]);
  const [images,setImages]=useState([]);
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({id:'',time:'09:00',groups:[],type:'text',images:[],text:''});
  const {toast,show}=useToast();

  const load=async()=>{
    const [s,g,imgs]=await Promise.all([api.getSchedule(),api.getGroups(),api.getImages()]);
    setPosts(s.posts||[]); setGroups(g||[]); setImages(imgs||[]);
  };
  useEffect(()=>{load();},[]);

  const tgGroup=u=>setForm(f=>({...f,groups:f.groups.includes(u)?f.groups.filter(x=>x!==u):[...f.groups,u]}));
  const tgImg=n=>setForm(f=>({...f,images:f.images.includes(n)?f.images.filter(x=>x!==n):[...f.images,n]}));

  const save=async()=>{
    if(!form.id.trim()) return show('Post nomini kiriting','error');
    if(!form.groups.length) return show('Guruh tanlang','error');
    const r=await api.addPost(form);
    if(r.ok){show('✅ Saqlandi');setForm({id:'',time:'09:00',groups:[],type:'text',images:[],text:''});setOpen(false);load();}
    else show(r.message||'Xatolik','error');
  };

  const remove=async id=>{
    if(!confirm('O\'chirasizmi?')) return;
    const r=await api.deletePost(id);
    if(r.ok){show('✅ O\'chirildi');load();}
  };

  const needImg=['image','image+text','album'].includes(form.type);
  const needTxt=['text','image+text','album'].includes(form.type);

  return (
    <div style={{padding:'20px 16px'}}>
      <Toast toast={toast}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <div style={{fontFamily:'Playfair Display',fontSize:22,fontWeight:700,color:T.text}}>Postlar</div>
        <Btn small onClick={()=>setOpen(!open)}><Icon d={open?icons.x:icons.plus} size={14} color="#fff"/>{open?'Yopish':"Qo'shish"}</Btn>
      </div>

      {open&&<Card style={{border:`1.5px solid rgba(232,82,122,.3)`,background:T.card2,animation:'fadeUp .3s ease'}}>
        <Label c="Post nomi"/><input placeholder="ertalab_salom" value={form.id} onChange={e=>setForm(f=>({...f,id:e.target.value}))}/>
        <Label c="Vaqt"/><input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/>
        <Label c="Post turi"/>
        <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value,images:[]}))}>
          {Object.entries(TYPES).map(([v,l])=><option key={v} value={v}>{l}</option>)}
        </select>
        <Label c="Guruhlar"/>
        {groups.map(g=>(
          <div key={g.id} onClick={()=>tgGroup(g.username)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:form.groups.includes(g.username)?'rgba(232,82,122,.1)':'rgba(255,255,255,.03)',borderRadius:10,marginBottom:6,cursor:'pointer',border:`1.5px solid ${form.groups.includes(g.username)?T.pink:'transparent'}`}}>
            <span>{form.groups.includes(g.username)?'✅':'⬜'}</span>
            <div><div style={{fontSize:13,color:T.text,fontWeight:600}}>{g.name}</div><div style={{fontSize:11,color:T.pink}}>{g.username}</div></div>
          </div>
        ))}
        {needImg&&<><Label c="Rasmlar"/><div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:4}}>
          {images.map(img=>(
            <div key={img.name} onClick={()=>tgImg(img.name)} style={{width:64,height:64,borderRadius:10,overflow:'hidden',cursor:'pointer',border:`2.5px solid ${form.images.includes(img.name)?T.pink:'transparent'}`,position:'relative'}}>
              <img src={img.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              {form.images.includes(img.name)&&<div style={{position:'absolute',inset:0,background:'rgba(232,82,122,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>✅</div>}
            </div>
          ))}
        </div></>}
        {needTxt&&<><Label c="Matn"/><textarea placeholder="💕 Post matni..." value={form.text} onChange={e=>setForm(f=>({...f,text:e.target.value}))} style={{marginBottom:4}}/></>}
        <div style={{marginTop:12}}><Btn full onClick={save}><Icon d={icons.check} size={16} color="#fff"/>Saqlash</Btn></div>
      </Card>}

      {posts.map((p,i)=>(
        <div key={p.id} style={{animation:`fadeUp .3s ease ${i*.04}s both`}}>
          <Card>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:6,marginBottom:6,flexWrap:'wrap'}}>
                  <Badge>{p.time}</Badge>
                  <Badge color={T.gold}>{TYPES[p.type]?.split(' ').slice(1).join(' ')||p.type}</Badge>
                </div>
                <div style={{fontWeight:700,color:T.text,fontSize:15}}>{p.id}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:4}}>{p.groups.join(', ')}</div>
              </div>
              <Btn small red onClick={()=>remove(p.id)}><Icon d={icons.trash} size={13} color="#ff4d5a"/></Btn>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
