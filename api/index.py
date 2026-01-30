from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.main import app as fastapi_app

app = FastAPI()

# CORS: allow all for Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount your backend FastAPI app
app.mount("/", fastapi_app)
