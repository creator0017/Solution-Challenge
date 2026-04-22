import { useContext } from 'react'
import { AuditContext } from '../context/AuditContext'
export default function useAudit() { return useContext(AuditContext) }