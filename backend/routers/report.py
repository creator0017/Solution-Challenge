from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from services.pdf_service import ComplianceReportService
import os

router = APIRouter()
pdf_service = ComplianceReportService()

@router.post("/generate")
async def create_report(audit_payload: dict):
    try:
        # audit_payload would come from your AuditContext in React
        file_path = pdf_service.generate_audit_pdf(audit_payload)
        return FileResponse(
            path=file_path, 
            filename="FairSight_Audit_Report.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))