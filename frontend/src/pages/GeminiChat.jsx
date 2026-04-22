import { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuditContext } from '../context/AuditContext'

const QUICK_CHIPS = [
  { id: 1, text: 'How do I fix this?' },
  { id: 2, text: 'Which laws apply?' },
  { id: 3, text: 'Explain to my board' },
  { id: 4, text: 'Show fix code' },
]

const DEMO_ANSWERS = {
  'How do I fix this?': "Remove the Father's Occupation column from your model inputs, then apply AIF360 Reweighing to pincodes 560034–560099. Expected result: Disparate Impact improves from 0.60 → 0.83, clearing the legal threshold.",
  'Which laws apply?': "Two laws are violated: DPDP Act 2023 Section 4(1) — processing personal data in a discriminatory manner. EU AI Act Article 10(3) — training data for high-risk AI must be free from discriminatory patterns.",
  'Explain to my board': "Our loan AI has been systematically rejecting qualified women because of their neighbourhood pincode, not their credit score. We need to retrain the model after removing two data columns. This is both a legal requirement and the right thing to do.",
  'Show fix code': "# Step 1: Remove proxy column\ndf = df.drop(columns=['father_occupation'])\n\n# Step 2: Apply AIF360 Reweighing\nRW = Reweighing(\n  unprivileged_groups=[{'gender': 0}],\n  privileged_groups=[{'gender': 1}]\n)\ndataset_fixed = RW.fit_transform(dataset)",
}

function getTime() {
  const d = new Date()
  const h = d.getHours(), m = d.getMinutes()
  return `${h % 12 || 12}:${m < 10 ? '0' : ''}${m} ${h < 12 ? 'AM' : 'PM'}`
}

export default function GeminiChat() {
  const navigate = useNavigate()
  const { auditData } = useContext(AuditContext)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [chips, setChips] = useState(QUICK_CHIPS)
  const [typing, setTyping] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    // Pre-load first exchange
    setMessages([
      { type: 'user', text: "Why was Priya's loan rejected by the AI?", time: '2:34 PM' },
      { type: 'ai', text: "The audit math proves Priya's rejection was not about her credit score — it was her pincode. The AI learned from 10 years of biased history that women in pincode 560034–560099 get rejected more. Her score was 0.43 vs threshold 0.45. That gap comes entirely from the pincode proxy, not her creditworthiness.", time: '2:34 PM' },
    ])
  }, [])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, typing])

  function sendMessage(text) {
    const txt = text || input.trim()
    if (!txt) return
    setInput('')
    const time = getTime()
    setMessages(prev => [...prev, { type: 'user', text: txt, time }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const answer = DEMO_ANSWERS[txt] || "The audit found your AI model has a Disparate Impact score of 0.60, below the legal threshold of 0.80. Women are being rejected at 3× the rate of men with identical profiles."
      setMessages(prev => [...prev, { type: 'ai', text: answer, time: getTime() }])
    }, 1500)
  }

  function sendChip(chip) {
    setChips(prev => prev.filter(c => c.id !== chip.id))
    sendMessage(chip.text)
  }

  return (
    <div className="page-enter" style={{ background: 'var(--bg-grey)', minHeight: 'calc(100vh - 64px)', paddingBottom: 32 }}>
      <div className="container-chat" style={{ padding: '24px 24px' }}>

        {/* Back link */}
        <span onClick={() => navigate('/results')} style={{ color: 'var(--teal)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 16 }}>
          ← Back to audit results
        </span>

        {/* Chat header */}
        <div style={{ background: '#F5F3FF', border: '0.5px solid #DDD6FE', borderRadius: 12, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.4"/><path d="M5 8h6M8 5v6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--purple)' }}>Gemini 1.5 Pro — Audit Assistant</div>
            <div style={{ fontSize: 11, color: 'var(--text-light)' }}>
              Context: {auditData?.organisation || 'XYZ Bank'} audit · April 2026 · Powered by Google
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ background: '#FFF3E0', border: '0.5px solid #FFB74D', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--orange)', marginBottom: 12 }}>
          AI-generated responses. Verify all findings with a compliance officer before modifying any model.
        </div>

        {/* Messages */}
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div ref={chatRef} style={{ height: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  background: msg.type === 'user' ? 'var(--teal)' : '#fff',
                  color: msg.type === 'user' ? '#fff' : 'var(--text-dark)',
                  border: msg.type === 'ai' ? '0.5px solid var(--border)' : 'none',
                  borderRadius: msg.type === 'user' ? '13px 13px 4px 13px' : '13px 13px 13px 4px',
                  padding: '10px 13px', fontSize: 13, lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 3, textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                  {msg.time}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div style={{ background: '#fff', border: '0.5px solid var(--border)', borderRadius: '13px 13px 13px 4px', padding: '10px 16px', display: 'inline-flex', gap: 4 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-light)', animation: 'bounce 0.8s infinite', animationDelay: `${i * 0.15}s` }}/>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick chips */}
          {chips.length > 0 && (
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 10, paddingBottom: 2 }}>
              {chips.map(chip => (
                <button key={chip.id} onClick={() => sendChip(chip)}
                  style={{ padding: '6px 12px', borderRadius: 999, fontSize: 12, border: '0.5px solid #DDD6FE', background: '#fff', color: 'var(--purple)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {chip.text}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything about your audit..."
              style={{ flex: 1, height: 44, border: '0.5px solid var(--border)', borderRadius: 11, padding: '0 13px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = 'var(--purple)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button onClick={() => sendMessage()}
              style={{ width: 44, height: 44, background: 'var(--purple)', border: 'none', borderRadius: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M9 4l5 4-5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* Bottom actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/report')}>
            Download PDF report →
          </button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate('/results')}>
            Back to results
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}