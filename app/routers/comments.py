from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import get_current_user_id
from app.database import get_db
from app.models import User, Video, Comment
from app.schemas import CommentCreate, CommentResponse


router = APIRouter()


@router.post(
    "/videos/{video_id}/comments",
    response_model=CommentResponse,
    status_code=201
)
def create_comment(
    video_id: int,
    comment: CommentCreate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):

    video = db.query(Video).filter(
        Video.id == video_id
    ).first()

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video no encontrado"
        )

    user = db.query(User).filter(
        User.id == current_user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    new_comment = Comment(
        content=comment.content,
        user_id=current_user_id,
        video_id=video_id
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment

@router.get(
    "/videos/{video_id}/comments",
    response_model=list[CommentResponse]
)
def get_comments(
    video_id: int,
    db: Session = Depends(get_db)
):

    video = db.query(Video).filter(Video.id == video_id).first()

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video no encontrado"
        )

    comments = (
        db.query(Comment)
        .filter(Comment.video_id == video_id)
        .all()
    )

    return comments

@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):

    comment = db.query(Comment).filter(
        Comment.id == comment_id
    ).first()

    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comentario no encontrado"
        )

    if comment.user_id != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para eliminar este comentario"
        )

    db.delete(comment)
    db.commit()

    return {
        "message": "Comentario eliminado correctamente"
    }
