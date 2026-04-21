from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, audit, report

app = FastAPI(title="FairSight AI Backend", version="1.0.0")

# Enable CORS for your React + Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(audit.router, prefix="/api/audit", tags=["Auditing"])
app.include_router(report.router, prefix="/api/report", tags=["Compliance"])

@app.get("/")
async def root():
    return {"message": "FairSight AI Backend is Running", "sector": "Banking"}