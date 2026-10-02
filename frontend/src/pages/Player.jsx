import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getVideo,
  getVideos,
  getUser,
  getComments,
  createComment,
} from "../services/api";

function Player() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setVideo(null);
      setError("");

      try {
        const videoData = await getVideo(id);
        setVideo(videoData);

        try {
          const userData = await getUser(videoData.user_id);
          setAuthor(userData);
        } catch (error) {
          console.error("Error cargando autor:", error);
          setAuthor(null);
        }

        try {
          const commentsData = await getComments(id);
          setComments(commentsData);
        } catch (error) {
          console.error("Error cargando comentarios:", error);
          setComments([]);
        }

        try {
          const allVideos = await getVideos();

          const recommendedVideos = allVideos
            .filter(
              (item) =>
                Number(item.id) !== Number(videoData.id)
            )
            .slice(0, 4);

          setRecommended(recommendedVideos);
        } catch (error) {
          console.error(
            "Error cargando recomendados:",
            error
          );

          setRecommended([]);
        }
      } catch (error) {
        console.error("Error cargando video:", error);
        setError("No se pudo cargar el video");
      }
    };

    loadData();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      const newComment = await createComment(
        id,
        content
      );

      setComments((currentComments) => [
        ...currentComments,
        newComment,
      ]);

      setContent("");
      setError("");
    } catch (error) {
      setError(
        "Debes iniciar sesión para comentar"
      );
    }
  };

  if (error && !video) {
    return (
      <div className="player-page">
        <Link to="/">← Volver al inicio</Link>
        <p>{error}</p>
      </div>
    );
  }

  if (!video) {
    return <p>Cargando video...</p>;
  }

  return (
    <div className="player-page">
      <Link to="/">
        ← Volver al inicio
      </Link>

      <video
        className="video-player"
        src={video.video_url}
        controls
      />

      <h1>{video.title}</h1>

      <p>{video.description}</p>

      <p>
        Publicado por:{" "}
        <strong>
          {author ? author.name : "Usuario"}
        </strong>
      </p>

      <small>
        {new Intl.NumberFormat("es").format(
          video.views || 0
        )}{" "}
        visualizaciones
      </small>

      <hr />

      <h2>Comentarios</h2>

      <form onSubmit={handleComment}>
        <input
          type="text"
          aria-label="Tu comentario"
          placeholder="Escribe un comentario..."
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />

        <button type="submit">
          Comentar
        </button>
      </form>

      {error && (
        <p
          className="form-message"
          role="alert"
        >
          {error}
        </p>
      )}

      {comments.length === 0 ? (
        <p>Todavía no hay comentarios.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="comment"
          >
            <p>{comment.content}</p>

            <small>
              Usuario {comment.user_id}
            </small>
          </div>
        ))
      )}

      <hr />

      <h2>Videos recomendados</h2>

      {recommended.length === 0 ? (
        <p>No hay otros videos disponibles.</p>
      ) : (
        <div className="video-grid">
          {recommended.map((item) => (
            <Link
              to={`/video/${item.id}`}
              key={item.id}
              className="video-card"
            >
              <div className="thumbnail">
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  loading="lazy"
                />
              </div>

              <div className="card-body">
                <h3>{item.title}</h3>

                <p>
                  {item.description || ""}
                </p>

                <small>
                  {new Intl.NumberFormat("es").format(
                    item.views || 0
                  )}{" "}
                  visualizaciones
                </small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Player;