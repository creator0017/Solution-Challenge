from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from enum import Enum


# ── Enums ─────────────────────────────────────────────────────────────────────

class SectorEnum(str, Enum):
    banking    = "Banking & Credit"
    hiring     = "Hiring & HR"
    healthcare = "Healthcare"
    education  = "Education"
    other      = "Other"

class VerdictEnum(str, Enum):
    compliant     = "COMPLIANT"
    non_compliant = "NON-COMPLIANT"


# ── Auth schemas ───────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    first_name:   str        = Field(..., min_length=1, max_length=50)
    last_name:    str        = Field(..., min_length=1, max_length=50)
    organisation: str        = Field(..., min_length=1, max_length=100)
    email:        EmailStr
    password:     str        = Field(..., min_length=8)
    sector:       SectorEnum = SectorEnum.banking

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str = Field(..., min_length=1)

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user: Dict[str, Any]

class FirebaseTokenRequest(BaseModel):
    """Used when frontend sends Firebase ID token for verification"""
    id_token: str

class UserProfile(BaseModel):
    uid:          str
    email:        EmailStr
    name:         str
    organisation: Optional[str] = None
    sector:       Optional[str] = None


# ── Audit schemas ──────────────────────────────────────────────────────────────

class ProxyFlag(BaseModel):
    proxy:  str
    type:   str
    reason: str
    evidence: Optional[str] = None

class MetricResult(BaseModel):
    name:       str
    score:      float
    threshold:  float
    verdict:    str   # "PASS" or "FAIL"
    description: Optional[str] = None

class AuditRunRequest(BaseModel):
    sector:          SectorEnum = SectorEnum.banking
    protected_attrs: List[str]  = Field(default=["Gender", "Pincode"])

class AuditResult(BaseModel):
    audit_id:       str
    verdict:        VerdictEnum
    sector:         str
    disparate_impact: float
    demographic_parity: Optional[float] = None
    equalized_odds:     Optional[float] = None
    calibration:        Optional[float] = None
    individual_fairness: Optional[float] = None
    metrics:          List[MetricResult] = []
    proxies:          List[ProxyFlag]   = []
    explanation:      str
    rows_scanned:     int
    rows_cleaned:     int
    threshold:        float = 0.80
    is_compliant:     bool
    model_name:       Optional[str] = "Home Loan Approval v3.2"
    organisation:     Optional[str] = "XYZ Bank Ltd."
    created_at:       Optional[str] = None

class RemediationResult(BaseModel):
    status:              str
    message:             str
    original_score:      float
    new_predicted_score: float
    improvement:         str
    download_ready:      bool
    steps_applied:       List[str] = []


# ── Report schemas ─────────────────────────────────────────────────────────────

class ReportRequest(BaseModel):
    audit_id:       str
    sector:         str
    verdict:        str
    score:          float
    explanation:    str
    proxies:        List[ProxyFlag] = []
    metrics:        List[MetricResult] = []
    organisation:   Optional[str] = "XYZ Bank Ltd."
    model_name:     Optional[str] = "Home Loan Approval v3.2"
    dataset_size:   Optional[int] = 47832
    is_fixed:       bool = False

class ReportResponse(BaseModel):
    report_id:    str
    download_url: str
    generated_at: str


# ── History schemas ────────────────────────────────────────────────────────────

class AuditHistoryItem(BaseModel):
    audit_id:   str
    date:       str
    model_name: str
    sector:     str
    verdict:    VerdictEnum
    fail_count: int
    pass_count: int

class AuditHistoryResponse(BaseModel):
    audits: List[AuditHistoryItem]
    total:  int


# ── Health check ───────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status:  str
    version: str
    message: str