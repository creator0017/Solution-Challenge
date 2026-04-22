import { createContext, useState } from 'react'
export const AuditContext = createContext(null)
export function AuditProvider({ children }) {
  const [auditData, setAuditData] = useState(null)
  const [sector, setSector] = useState(null)
  const [fileId, setFileId] = useState(null)
  return <AuditContext.Provider value={{ auditData, setAuditData, sector, setSector, fileId, setFileId }}>{children}</AuditContext.Provider>
}