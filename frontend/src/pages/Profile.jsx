import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getMe,
  getVideos,
  uploadVideo,
  updateVideo,
  deleteVideo,
} from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadProfile = async () => {
    try {
      const userData = await getMe();
      const videosData = await getVideos();

      setUser(userData);

      const myVideos = videosData.filter(
        (video) => video.user_id === userData.id
      );

      setVideos(myVideos);
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!videoFile || !thumbnailFile) {
      setMessage("Selecciona el video y la miniatura");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      await uploadVideo(
        title,
        description,
        videoFile,
        thumbnailFile
      );

      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnailFile(null);

      setMessage("Video subido correctamente");

      await loadProfile();
    } catch (error) {
      setMessage("No se pudo subir el video");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (video) => {
    const newTitle = window.prompt(
      "Nuevo título:",
      video.title
    );

    if (newTitle === null) {
      return;
    }

    const newDescription = window.prompt(
      "Nueva descripción:",
      video.description || ""
    );

    if (newDescription === null) {
      return;
    }

    try {
      await updateVideo(
        video.id,
        newTitle,
        newDescription
      );

      setMessage("Video actualizado correctamente");

      await loadProfile();
    } catch (error) {
      setMessage("No se pudo actualizar el video");
    }
  };

  const handleDelete = async (videoId) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este video?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVideo(videoId);

      setMessage("Video eliminado correctamente");

      await loadProfile();
    } catch (error) {
      setMessage("No se pudo eliminar el video");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div className="profile-page">
      <Link to="/">
        ← Volver al inicio
      </Link>

      <div className="profile-header">
        <div>
          <h1>{user.name}</h1>

          <p>{user.email}</p>

          <p>
            Videos publicados:{" "}
            <strong>{videos.length}</strong>
          </p>
        </div>

        <button onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <hr />

      <h2>Subir video</h2>

      <form
        className="upload-form"
        onSubmit={handleUpload}
      >
        <input
          type="text"
          aria-label="Título del video"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          aria-label="Descripción del video"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>
          Video MP4

          <input
            type="file"
            accept="video/mp4"
            onChange={(e) =>
              setVideoFile(e.target.files[0])
            }
            required
          />
        </label>

        <label>
          Miniatura JPG, JPEG o PNG

          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) =>
              setThumbnailFile(e.target.files[0])
            }
            required
          />
        </label>

        <button
          type="submit"
          disabled={uploading}
        >
          {uploading
            ? "Subiendo..."
            : "Subir video"}
        </button>
      </form>

      {message && (
        <p
          className="form-message"
          role="status"
        >
          {message}
        </p>
      )}

      <hr />

      <h2>Mis videos</h2>

      {videos.length === 0 ? (
        <p>No has subido videos todavía.</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <div
              key={video.id}
              className="video-card"
            >
              <Link to={`/video/${video.id}`}>
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                />

                <h3>{video.title}</h3>

                <p>
                  {video.description || ""}
                </p>

                <small>
                  {new Intl.NumberFormat("es").format(
                    video.views || 0
                  )}{" "}
                  visualizaciones
                </small>
              </Link>

              <div className="video-actions">
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(video)
                  }
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(video.id)
                  }
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;