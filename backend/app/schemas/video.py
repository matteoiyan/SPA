from datetime import datetime
from pydantic import BaseModel


class VideoCreate(BaseModel):
    title: str
    description: str | None = None
    video_url: str
    thumbnail_url: str
    user_id: int


class VideoUpdate(BaseModel):
    title: str | None = None
    description: str | None = None


class VideoResponse(BaseModel):
    id: int
    title: str
    description: str | None
    video_url: str
    thumbnail_url: str
    views: int
    user_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
