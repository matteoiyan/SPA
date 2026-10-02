from fastapi import FastAPI
from app.routers.users import router as users_router
from sqlalchemy import text
from app.routers.auth import router as auth_router
from app.database import engine
from app.routers.videos import router as videos_router
from app.routers.comments import router as comments_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Video Platform API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
	"http://mateo-video-platform-frontend-2026.s3-website-us-east-1.amazonaws.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(videos_router)
app.include_router(auth_router)
app.include_router(comments_router)

@app.get("/")
def root():
    return {"message": "Video Platform API funcionando"}


@app.get("/test-db")
def test_db():
    with engine.connect() as connection:
        database = connection.execute(
            text("SELECT current_database();")
        ).scalar()

    return {
        "status": "connected",
        "database": database
    }
