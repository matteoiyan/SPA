from datetime import datetime
from pydantic import BaseModel


class CommentCreate(BaseModel):
    content: str


class CommentResponse(BaseModel):
    id: int
    content: str
    user_id: int
    video_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
