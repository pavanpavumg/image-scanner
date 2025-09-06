import React, {useEffect, useState} from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import BeforeAfter from './BeforeAfter';

export default function Gallery(){
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(()=>{
    const user = auth.currentUser;
    if(!user) return;
    const q = query(collection(db,'uploads'), where('userId','==',user.uid), orderBy('createdAt','desc'));
    const unsub = onSnapshot(q, snap=>{
      const arr = [];
      snap.forEach(d=> arr.push({ id:d.id, ...d.data() }));
      setItems(arr);
    });
    return ()=>unsub();
  },[]);

  return (
    <div className="gallery">
      <h3>Your uploads</h3>
      <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
        {items.map(it => (
          <div key={it.id} style={{width:180, border:'1px solid #eee', padding:8}}>
            <div style={{height:120, overflow:'hidden'}}>
              {it.processedURL ? <img src={it.processedURL} alt="thumb" style={{width:'100%'}} /> : <img src={it.originalURL} alt="orig" style={{width:'100%'}} />}
            </div>
            <div style={{marginTop:8}}>
              <div style={{fontSize:12}}>{it.filename}</div>
              <div style={{marginTop:6}}><button onClick={()=>setSelected(it)}>View</button></div>
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div style={{marginTop:20}}>
          <button onClick={()=>setSelected(null)}>Close</button>
          <BeforeAfter originalUrl={selected.originalURL} processedUrl={selected.processedURL || selected.originalURL} />
        </div>
      )}
    </div>
  )
}
