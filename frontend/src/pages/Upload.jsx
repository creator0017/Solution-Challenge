import { useState, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuditContext } from '../context/AuditContext'
import { storage, db } from '../services/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'

function Stepper({ active }) {
  const steps = ['Sector', 'Upload', 'Processing', 'Results']
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`step ${i === active ? 'active' : i < active ? 'done' : ''}`}>
            <div className="num">{i < active ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
          {i < steps.length - 1 && <div className="step-sep" />}
        </div>
      ))}
    </div>
  )
}

export default function Upload() {
  const navigate = useNavigate()
  const { sector, setFileId } = useContext(AuditContext)
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [attrs, setAttrs] = useState({
    'Gender': true, 'Age': true, 'Pincode': true, "Father's Occupation": true, 'Marital Status': false,
  })

  const handleFile = (f) => {
    if (f) {
      setFile({ name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + ' MB', rows: 'Pending analysis', obj: f })
    }
  }

  const drop = (e) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    handleFile(f)
  }

  const handleFileInputChange = (e) => {
    const f = e.target.files?.[0]
    handleFile(f)
  }

  const handleRunAudit = async () => {
    if (!file || !file.obj) return
    setUploading(true)
    try {
      const storageRef = ref(storage, `datasets/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file.obj)
      const url = await getDownloadURL(storageRef)
      
      const docRef = await addDoc(collection(db, 'audits'), {
        fileName: file.name,
        fileSize: file.size,
        fileUrl: url,
        createdAt: new Date().toISOString()
      })
      
      setFileId(docRef.id)
      navigate('/processing')
    } catch (e) {
      console.error(e)
      alert("Failed to upload file")
      setUploading(false)
    }
  }

  return (
    <div className="page-enter" style={{ background: 'var(--bg-grey)', minHeight: 'calc(100vh - 64px)', padding: '48px 24px 80px' }}>
      <div className="container-narrow">
        <Stepper active={1} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div className="pill pill-green">✓ {sector?.name || 'Banking & Credit'}</div>
          <span onClick={() => navigate('/sector')} style={{ fontSize: 13, color: 'var(--teal)', cursor: 'pointer' }}>Change</span>
        </div>

        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Upload your dataset</h1>
        <p style={{ color: 'var(--text-grey)', fontSize: 15, marginBottom: 24 }}>CSV, Excel, .pkl, .onnx, PDF, or Images. Max 50 MB.</p>

        {!file ? (
          <>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileInputChange} 
              style={{ display: 'none' }} 
              accept=".pdf, image/*, .csv, .xlsx, .pkl, .onnx"
            />
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={drop}
              onClick={() => fileInputRef.current.click()}
              style={{
                border: `2px dashed ${dragOver ? 'var(--teal)' : 'var(--border)'}`,
                background: dragOver ? 'var(--teal-bg)' : '#fff',
                borderRadius: 16, padding: '56px 32px', textAlign: 'center',
                cursor: 'pointer', transition: 'all 180ms', marginBottom: 24,
              }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--teal-bg)', color: 'var(--teal)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                ↑
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Drop your dataset here</div>
              <div style={{ fontSize: 13, color: 'var(--text-grey)' }}>or click to browse · PDF, Images, CSV, Excel · max 50MB</div>
            </div>
          </>
        ) : (
          <div style={{ background: 'var(--green-bg)', border: '1px solid #A5D6A7', borderRadius: 16, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fff', color: 'var(--green-pass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              📄
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{file.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-grey)' }}>{file.rows} · {file.size}</div>
            </div>
            <button className="btn btn-ghost" style={{ height: 36 }} onClick={() => setFile(null)}>✕ Remove</button>
          </div>
        )}

        {file && (
          <div className="page-enter">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 10 }}>Auto-detected protected attributes</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {Object.keys(attrs).map(k => (
                <label key={k} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 999,
                  background: attrs[k] ? 'var(--teal-bg)' : '#fff',
                  border: `1px solid ${attrs[k] ? 'var(--teal-border)' : 'var(--border)'}`,
                  color: attrs[k] ? 'var(--teal)' : 'var(--text-grey)',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}>
                  <input type="checkbox" checked={attrs[k]} onChange={() => setAttrs(a => ({ ...a, [k]: !a[k] }))} style={{ accentColor: 'var(--teal)' }}/>
                  {k}
                </label>
              ))}
            </div>

            <div style={{ background: 'var(--teal-bg)', border: '1px solid var(--teal-border)', borderRadius: 12, padding: 14, marginBottom: 24, fontSize: 13, color: 'var(--text-dark)', display: 'flex', gap: 10 }}>
              <div style={{ color: 'var(--teal)', marginTop: 1 }}>🛡</div>
              <div>
                <b>What are protected attributes?</b> These are attributes your model <em>shouldn't</em> use for decisions. FairSight will test parity and detect proxy bias (e.g. pincode as a stand-in for caste).
              </div>
            </div>
          </div>
        )}

        <button className="btn btn-primary btn-lg" style={{ width: '100%', opacity: uploading ? 0.7 : 1 }} disabled={!file || uploading} onClick={handleRunAudit}>
          {uploading ? 'Uploading...' : 'Run bias audit →'}
        </button>
      </div>
    </div>
  )
}