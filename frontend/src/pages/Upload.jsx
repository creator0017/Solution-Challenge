import { useState, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuditContext } from '../context/AuditContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
  const { sector, setAuditData } = useContext(AuditContext)
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  
  const [attrs, setAttrs] = useState({
    'Gender': true, 'Pincode': true, "Father's Occupation": true, 'Employment Gap': true, 'Age': false, 'Marital Status': false, 'Caste Group': false
  })
  const [autoDetected, setAutoDetected] = useState([])
  const [uploadErr, setUploadErr] = useState('')

  const parseCSVColumns = (f) => {
    if (f.name.endsWith('.xlsx')) {
      const defaults = ['Gender', 'Pincode', "Father's Occupation", 'Employment Gap']
      setAttrs({
        'Gender': true, 'Pincode': true, "Father's Occupation": true, 'Employment Gap': true, 'Age': false, 'Marital Status': false, 'Caste Group': false
      })
      setAutoDetected(defaults)
      return
    }

    const reader = new FileReader()
    reader.readAsText(f.slice(0, 2048))
    reader.onload = (e) => {
      const text = e.target.result
      const firstLine = text.split('\n')[0]
      const cols = firstLine.split(',').map(c => c.trim().toLowerCase())
      
      const dictionary = {
        'gender': 'Gender',
        'sex': 'Gender',
        'pincode': 'Pincode',
        'zip': 'Pincode',
        'father_occupation': "Father's Occupation",
        'employment_gap': 'Employment Gap',
        'age': 'Age',
        'caste': 'Caste Group',
        'marital': 'Marital Status'
      }

      const detected = []
      const newAttrs = { 'Gender': false, 'Pincode': false, "Father's Occupation": false, 'Employment Gap': false, 'Age': false, 'Marital Status': false, 'Caste Group': false }
      
      cols.forEach(c => {
        for (const [key, val] of Object.entries(dictionary)) {
          if (c.includes(key)) {
            if (!detected.includes(val)) {
              detected.push(val)
              newAttrs[val] = true
            }
          }
        }
      })

      if (detected.length === 0) {
        newAttrs['Gender'] = true; newAttrs['Pincode'] = true; newAttrs["Father's Occupation"] = true; newAttrs['Employment Gap'] = true;
        detected.push('Gender', 'Pincode', "Father's Occupation", 'Employment Gap')
      }

      setAttrs(newAttrs)
      setAutoDetected(detected)
    }
  }

  const handleFile = (f) => {
    if (f) {
      setFile({ name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + ' MB', rows: 'Pending analysis', obj: f })
      parseCSVColumns(f)
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

  const handleUseDemoData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/audit/demo-file`)
      if (!res.ok) throw new Error('Demo file not available')
      const blob = await res.blob()
      const demoFile = new File([blob], 'banking_demo_india.csv', { type: 'text/csv' })
      handleFile(demoFile)
    } catch (e) {
      setUploadErr('Could not load demo data: ' + e.message)
    }
  }

  const handleRunAudit = async () => {
    if (!file || !file.obj) return
    setUploading(true)
    setUploadErr('')
    try {
      const formData = new FormData()
      formData.append('file', file.obj)

      const res = await fetch(`${API_URL}/api/audit/run-audit`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        let errMsg = `Server error ${res.status}`
        try {
          const err = await res.json()
          errMsg = err.detail || errMsg
        } catch (_) {}
        throw new Error(errMsg)
      }

      const data = await res.json()
      setAuditData(data)
      navigate('/processing')
    } catch (e) {
      console.error(e)
      setUploadErr(
        e.message === 'Failed to fetch'
          ? 'Backend not reachable. Make sure the FastAPI server is running on port 8000.'
          : e.message || 'Failed to connect to the analysis server.'
      )
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
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-grey)' }}>No file? </span>
              <button
                className="btn btn-ghost"
                style={{ height: 32, fontSize: 13, padding: '0 14px' }}
                onClick={e => { e.stopPropagation(); handleUseDemoData() }}
              >
                Use Demo Dataset
              </button>
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
              {Object.keys(attrs).map(k => {
                const isAuto = autoDetected.includes(k)
                return (
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
                    {isAuto && <span style={{ fontSize: 9, background: 'var(--teal)', color: '#fff', padding: '2px 6px', borderRadius: 4, marginLeft: 2, fontWeight: 700, letterSpacing: 0.5 }}>AUTO</span>}
                  </label>
                )
              })}
            </div>

            <div style={{ background: 'var(--teal-bg)', border: '1px solid var(--teal-border)', borderRadius: 12, padding: 14, marginBottom: 24, fontSize: 13, color: 'var(--text-dark)', display: 'flex', gap: 10 }}>
              <div style={{ color: 'var(--teal)', marginTop: 1 }}>🛡</div>
              <div>
                <b>What are protected attributes?</b> These are attributes your model <em>shouldn't</em> use for decisions. FairSight will test parity and detect proxy bias (e.g. pincode as a stand-in for caste).
              </div>
            </div>
          </div>
        )}

        {uploadErr && (
          <div className="shake" style={{ background: 'var(--red-bg)', border: '1px solid #FFCDD2', color: 'var(--red-fail)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            ⚠ {uploadErr}
          </div>
        )}

        <button className="btn btn-primary btn-lg" style={{ width: '100%', opacity: uploading ? 0.7 : 1 }} disabled={!file || uploading} onClick={handleRunAudit}>
          {uploading ? 'Uploading...' : 'Run bias audit →'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href={`${API_URL}/docs`} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'none' }}>
            Check backend status →
          </a>
        </div>
      </div>
    </div>
  )
}