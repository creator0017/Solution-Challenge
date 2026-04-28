from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# ── Firebase Admin SDK setup (optional — works without it for demo) ────────────
# To enable real Firebase auth:
#   pip install firebase-admin
#   Place your serviceAccountKey.json in backend/
#   Set FIREBASE_SERVICE_ACCOUNT_PATH=serviceAccountKey.json in .env

firebase_admin_available = False
firebase_auth = None

try:
    import firebase_admin
    from firebase_admin import credentials, auth as fb_auth

    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "serviceAccountKey.json")
    if os.path.exists(service_account_path):
        if not firebase_admin._apps:
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
        firebase_auth = fb_auth
        firebase_admin_available = True
        print("[OK] Firebase Admin SDK initialised")
    else:
        print("[WARN] serviceAccountKey.json not found - running in demo mode (no real auth)")
except ImportError:
    print("[WARN] firebase-admin not installed - running in demo mode")


# ── In-memory user store for demo mode ───────────────────────────────────────
# In production this is replaced by Firestore
_demo_users: dict = {}


# ── Helper ────────────────────────────────────────────────────────────────────

def _make_user_response(uid: str, email: str, name: str, organisation: str = "", sector: str = "Banking & Credit") -> dict:
    return {
        "uid":          uid,
        "email":        email,
        "name":         name,
        "organisation": organisation,
        "sector":       sector,
    }


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/register")
async def register(payload: dict):
    """
    Register a new user.
    In production: creates Firebase Auth user + saves profile to Firestore.
    In demo mode: stores in memory, returns a fake token.
    """
    email        = payload.get("email", "").strip().lower()
    password     = payload.get("password", "")
    first_name   = payload.get("first_name", "")
    last_name    = payload.get("last_name", "")
    organisation = payload.get("organisation", "")
    sector       = payload.get("sector", "Banking & Credit")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")
    if email in _demo_users:
        raise HTTPException(status_code=409, detail="This email is already registered. Sign in →")

    uid  = str(uuid.uuid4())
    name = f"{first_name} {last_name}".strip() or email.split("@")[0]

    _demo_users[email] = {
        "uid": uid, "email": email, "name": name,
        "password": password,            # plain text — demo only, never do this in production
        "organisation": organisation,
        "sector": sector,
        "created_at": datetime.now().isoformat(),
    }

    return {
        "message":    "Account created. Check your email for the OTP.",
        "uid":        uid,
        "email":      email,
        "otp_sent_to": email,
    }


@router.post("/verify-otp")
async def verify_otp(payload: dict):
    """
    Verify 6-digit OTP.
    Demo: any code except 000000 is accepted.
    Production: integrate with Firebase phone/email OTP.
    """
    email = payload.get("email", "").strip().lower()
    code  = payload.get("code", "")

    if code == "000000":
        raise HTTPException(status_code=400, detail="Incorrect code. 2 attempts remaining.")

    if email not in _demo_users:
        raise HTTPException(status_code=404, detail="User not found. Please register first.")

    user = _demo_users[email]
    fake_token = f"demo_token_{user['uid']}"

    return {
        "access_token": fake_token,
        "token_type":   "bearer",
        "user": _make_user_response(
            uid=user["uid"], email=user["email"],
            name=user["name"], organisation=user["organisation"],
            sector=user["sector"],
        ),
    }


@router.post("/login")
async def login(payload: dict):
    """
    Sign in with email + password.
    Demo: checks in-memory store OR accepts the hardcoded demo account.
    Production: validate via Firebase Auth REST API.
    """
    email    = payload.get("email", "").strip().lower()
    password = payload.get("password", "")

    # ── Demo account — always works ──
    DEMO_EMAIL    = "meera.sharma@xyzbank.in"
    DEMO_PASSWORD = "password123"

    if email == DEMO_EMAIL:
        fake_token = f"demo_token_meera_{uuid.uuid4().hex[:8]}"
        return {
            "access_token": fake_token,
            "token_type":   "bearer",
            "user": _make_user_response(
                uid="demo-meera-001",
                email=DEMO_EMAIL,
                name="Meera Sharma",
                organisation="XYZ Bank Ltd.",
                sector="Banking & Credit",
            ),
        }

    # ── Registered demo users ──
    user = _demo_users.get(email)
    if not user:
        raise HTTPException(status_code=404, detail="No account found for this email. Register free →")
    if user["password"] != password:
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    fake_token = f"demo_token_{user['uid']}"
    return {
        "access_token": fake_token,
        "token_type":   "bearer",
        "user": _make_user_response(
            uid=user["uid"], email=user["email"],
            name=user["name"], organisation=user["organisation"],
            sector=user["sector"],
        ),
    }


@router.post("/firebase-login")
async def firebase_login(payload: dict):
    """
    Verify a Firebase ID token sent from the React frontend.
    Used when Google OAuth or Firebase email auth is enabled on the frontend.
    """
    id_token = payload.get("id_token", "")
    if not id_token:
        raise HTTPException(status_code=400, detail="id_token is required.")

    if not firebase_admin_available:
        # Demo fallback — accept any non-empty token
        return {
            "access_token": f"firebase_demo_{uuid.uuid4().hex[:12]}",
            "token_type":   "bearer",
            "user": _make_user_response(
                uid="firebase-demo-001",
                email="demo@fairsight.ai",
                name="Demo User",
            ),
        }

    try:
        decoded = firebase_auth.verify_id_token(id_token)
        uid     = decoded["uid"]
        email   = decoded.get("email", "")
        name    = decoded.get("name", email.split("@")[0])

        return {
            "access_token": id_token,   # frontend can reuse the Firebase token
            "token_type":   "bearer",
            "user": _make_user_response(uid=uid, email=email, name=name),
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {str(e)}")


@router.post("/logout")
async def logout(authorization: Optional[str] = Header(None)):
    """
    Logout endpoint.
    Frontend should also call Firebase signOut() and clear local storage.
    """
    return {"message": "Logged out successfully."}


@router.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Returns the current user profile from the token.
    Demo: decodes the fake token to return user info.
    Production: verify Firebase token and query Firestore.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated.")

    token = authorization.replace("Bearer ", "")

    # Hardcoded demo user
    if "meera" in token:
        return _make_user_response(
            uid="demo-meera-001",
            email="meera.sharma@xyzbank.in",
            name="Meera Sharma",
            organisation="XYZ Bank Ltd.",
            sector="Banking & Credit",
        )

    # Look up in demo store
    for user in _demo_users.values():
        if user["uid"] in token:
            return _make_user_response(
                uid=user["uid"], email=user["email"],
                name=user["name"], organisation=user["organisation"],
                sector=user["sector"],
            )

    raise HTTPException(status_code=401, detail="Token invalid or expired.")


@router.post("/resend-otp")
async def resend_otp(payload: dict):
    """Resend OTP — demo always succeeds."""
    email = payload.get("email", "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    return {"message": f"OTP resent to {email}.", "expires_in": 30}