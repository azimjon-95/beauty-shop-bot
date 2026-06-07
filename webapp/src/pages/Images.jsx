import { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { Card, Btn, Icon, icons, Toast, useToast } from '../components';
import { T } from '../theme';

export default function Images() {
  const [images,setImages]=useState([]);
  const [uploading,setUploading]=useState(false);
  const fileRef=useRef();
  const {toast,show}=useToast();

  const load=async()=>{ const d=await api.getImages(); setImages(d||[]); };
  useEffect(()=>{load();},[]);

  const upload=async e=>{
    const files=e.target.files;
    if(!files.length) return;
    setUploading(true);
    const fd=new FormData();
    for(const f of files) fd.append('files',f);
    const r=await api.uploadImages(fd);
    setUploading(false);
    if(r.ok){show(r.message);load();}
    else show('Xatolik yuz berdi','error');
    fileRef.current.value='';
  };

  const remove=async name=>{
    if(!confirm('Rasmni o\'chirasizmi?')) return;
    const r=await api.deleteImage(name);
    if(r.ok){show("✅ O'chirildi");load();}
  };

  return (
    <div style={{padding:'20px 16px'}}>
      <Toast toast={toast}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <div style={{fontFamily:'Playfair Display',fontSize:22,fontWeight:700,color:T.text}}>Rasmlar</div>
        <span style={{fontSize:12,fontWeight:700,background:'rgba(232,82,122,.1)',padding:'4px 10px',borderRadius:8,color:T.pink}}>{images.length} ta</span>
      </div>

      <div style={{background:'rgba(232,82,122,.04)',border:'2px dashed rgba(232,82,122,.22)',borderRadius:20,padding:'28px 20px',textAlign:'center',marginBottom:16}}>
        <div style={{width:52,height:52,borderRadius:16,background:'rgba(232,82,122,.1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
          <Icon d={icons.upload} size={22} color={T.pink}/>
        </div>
        <div style={{fontWeight:700,color:T.text,fontSize:15}}>Rasm yuklash</div>
        <div style={{fontSize:12,color:T.muted,marginTop:4,marginBottom:16}}>JPG, PNG, WebP — bir nechta tanlash mumkin</div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={upload} style={{display:'none'}}/>
        <Btn onClick={()=>fileRef.current.click()}><Icon d={icons.upload} size={14} color="#fff"/>{uploading?'Yuklanmoqda...':'Tanlash'}</Btn>
      </div>

      {images.length>0&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
          {images.map(img=>(
            <div key={img.name} style={{position:'relative',aspectRatio:'1',borderRadius:14,overflow:'hidden',border:`1px solid ${T.border}`}}>
              <img src={img.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
              <button onClick={()=>remove(img.name)} style={{position:'absolute',top:5,right:5,background:'rgba(255,40,50,.85)',border:'none',borderRadius:7,padding:'4px 7px',cursor:'pointer',display:'flex',alignItems:'center'}}>
                <Icon d={icons.x} size={11} color="#fff" strokeWidth={2.5}/>
              </button>
              <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(0,0,0,.6))',padding:'16px 6px 6px',fontSize:9,color:'rgba(255,255,255,.7)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{img.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
