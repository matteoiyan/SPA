from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session

from app.core.security import get_current_user_id
from app.database import get_db
from app.models import User, Video
from app.schemas import VideoUpdate, VideoResponse
from app.services.s3 import (
    upload_video,
    upload_thumbnail,
    get_video_url,
    get_thumbnail_url,
    delete_video_file,
    delete_thumbnail_file,
)

router = APIRouter()


@router.post(
    "/videos",
    response_model=VideoResponse,
    status_code=201
)
def create_video(
    title: str = Form(...),
    description: str | None = Form(None),
    video_file: UploadFile = File(...),
    thumbnail_file: UploadFile = File(...),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(
        User.id == current_user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado",
        )

    if video_file.content_type != "video/mp4":
        raise HTTPException(
            status_code=400,
            detail="El video debe ser MP4",
        )

    allowed_images = [
        "image/jpeg",
        "image/png",
    ]

    if thumbnail_file.content_type not in allowed_images:
        raise HTTPException(
            status_code=400,
            detail="La miniatura debe ser JPG, JPEG o PNG",
        )

    video_key = upload_video(video_file)
    thumbnail_key = upload_thumbnail(thumbnail_file)

    new_video = Video(
        title=title,
        description=description,
        video_url=video_key,
        thumbnail_url=thumbnail_key,
        user_id=current_user_id,
    )

    db.add(new_video)
    db.commit()
    db.refresh(new_video)

    return new_video


@router.get("/videos")
def get_videos(
    db: Session = Depends(get_db)
):
    videos = db.query(Video).all()

    result = []

    for video in videos:
        result.append({
            "id": video.id,
            "title": video.title,
            "description": video.description,
            "video_url": get_video_url(
                video.video_url
            ),
            "thumbnail_url": get_thumbnail_url(
                video.thumbnail_url
            ),
            "views": video.views,
            "user_id": video.user_id,
            "created_at": video.created_at,
        })

    return result


@router.get("/videos/{video_id}")
def get_video(
    video_id: int,
    db: Session = Depends(get_db),
):
    video = db.query(Video).filter(
        Video.id == video_id
    ).first()

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video no encontrado",
        )

    video.views += 1

    db.commit()
    db.refresh(video)

    return {
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "video_url": get_video_url(
            video.video_url
        ),
        "thumbnail_url": get_thumbnail_url(
            video.thumbnail_url
        ),
        "views": video.views,
        "user_id": video.user_id,
        "created_at": video.created_at,
    }


@router.put(
    "/videos/{video_id}",
    response_model=VideoResponse
)
def update_video(
    video_id: int,
    video_data: VideoUpdate,
    current_user_id: int = Depends(
        get_current_user_id
    ),
    db: Session = Depends(get_db),
):
    video = db.query(Video).filter(
        Video.id == video_id
    ).first()

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video no encontrado",
        )

    if video.user_id != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para modificar este video",
        )

    if video_data.title is not None:
        video.title = video_data.title

    if video_data.description is not None:
        video.description = video_data.description

    db.commit()
    db.refresh(video)

    return video


@router.delete("/videos/{video_id}")
def delete_video(
    video_id: int,
    current_user_id: int = Depends(
        get_current_user_id
    ),
    db: Session = Depends(get_db),
):
    video = db.query(Video).filter(
        Video.id == video_id
    ).first()

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video no encontrado",
        )

    if video.user_id != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para eliminar este video",
        )

    delete_video_file(video.video_url)
    delete_thumbnail_file(video.thumbnail_url)

    db.delete(video)
    db.commit()

    return {
        "message": "Video y archivos eliminados correctamente"
    }
