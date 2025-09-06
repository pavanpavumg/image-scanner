import React, {useState} from 'react';
import { auth, storage, db } from '../firebaseConfig';
import { ref as sRef, uploadBytesResumable, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { detectAndCrop } from '../utils/autoCrop';

export default function UploadPanel(){
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [preview, setPreview] = useState(null);

  function onFile(e){
    const f = e.target.files[0];
    if(!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus('ready');
  }

  async function handleUpload(){
    if(!file) return alert('Select a file first');
    const user = auth.currentUser;
    if(!user) return alert('Not signed in');
    setStatus('processing');
    try{
      // create Image element (PDF support requires pdf.js rendering - placeholder)
      const img = await fileToImage(file);
      const result = await detectAndCrop(img).catch(()=>({ success:false }));
      // upload original
      const origPath = `users/${user.uid}/originals/${Date.now()}_${file.name}`;
      const origRef = sRef(storage, origPath);
      // upload using resumable to show progress
      const uploadTask = uploadBytesResumable(origRef, file);
      uploadTask.on('state_changed', snapshot=>{
        // progress available if needed
      });
      await uploadTask;
      const originalURL = await getDownloadURL(origRef);

      // upload processed (if success) as base64 string
      let processedURL = null;
      if(result && result.dataUrl){
        const procPath = `users/${user.uid}/processed/${Date.now()}_${file.name}.jpg`;
        const procRef = sRef(storage, procPath);
        const base64 = result.dataUrl.split(',')[1];
        await uploadString(procRef, base64, 'base64', { contentType: 'image/jpeg' });
        processedURL = await getDownloadURL(procRef);
      }

      // write metadata
      await addDoc(collection(db, 'uploads'), {
        userId: user.uid,
        filename: file.name,
        createdAt: serverTimestamp(),
        status: 'done',
        originalURL,
        processedURL
      });

      setStatus('done');
      alert('Upload complete');
    }catch(err){
      console.error(err);
      setStatus('failed');
      alert('Upload failed: '+err.message);
    }
  }

  return (
    <div className="upload-panel">
      <h3>Upload</h3>
      <input type="file" accept="image/*,application/pdf" onChange={onFile} />
      {preview && <div style={{marginTop:8}}><img src={preview} alt="preview" style={{maxWidth:240}} /></div>}
      <div style={{marginTop:12}}>
        <button onClick={handleUpload}>Upload & Auto-Crop</button>
      </div>
      <div style={{marginTop:8}}>Status: {status}</div>
    </div>
  )
}

// helper: convert image file to HTMLImageElement; PDF requires pdf.js rendering (not implemented here)
function fileToImage(file){
  return new Promise((resolve,reject)=>{
    if(file.type === 'application/pdf'){
      reject(new Error('PDF -> image conversion requires pdf.js; implement rendering to canvas then Image.')); 
      return;
    }
    const img = new Image();
    img.onload = ()=>resolve(img);
    img.onerror = (e)=>reject(e);
    img.src = URL.createObjectURL(file);
  });
}
